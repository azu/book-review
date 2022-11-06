import { graphql } from "@octokit/graphql";
import { Octokit } from "@octokit/rest";
import { generateMetaComment } from "./meta-parser";
import { template } from "./template";

export type Issue = {
    id: string;
    title: string;
    body: string;
    url: string;
    number: number;
    author: {
        login: string;
    }
    labels: {
        nodes: {
            name: string;
            color: string;
        }[]
    }
}
export const fetchIssues = async (
    options: { owner: string; repo: string; labels: string[]; GITHUB_TOKEN: string; },
): Promise<Issue[]> => {
    const graphqlWithAuth = graphql.defaults({
        headers: {
            authorization: `token ${options.GITHUB_TOKEN}`
        }
    });
    const QUERY = `query ($owner: String!, $repo: String!, $labels: [String!]) {
  repository(owner: $owner, name: $repo) {
    issues(first: 20, filterBy: {labels: $labels, states: OPEN}) {
      nodes {
        id
        title
        body
        url
        number
        author {
          login
        }
        labels(first:10){
          nodes {
            name
            color
          }
        }
      }
    }
  }
}

`;
    const { repository } = await graphqlWithAuth<{
        repository: {
            issues: {
                nodes: Issue[]
            }
        };
    }>(QUERY, { owner: options.owner, repo: options.repo, labels: options.labels });
    return repository.issues.nodes;
};


export const createNextTagVersion = async (
    options: { owner: string; repo: string; GITHUB_TOKEN: string; },
): Promise<{ tagName: string; type: "new" | "update", releaseId?: number; }> => {
    const graphqlWithAuth = graphql.defaults({
        headers: {
            authorization: `token ${options.GITHUB_TOKEN}`
        }
    });
    const QUERY = `query ($owner: String!, $repo: String!) {
  repository(owner: $owner, name: $repo) {
    releases(first: 20, orderBy: { field: CREATED_AT, direction: DESC }) {
      nodes {
        databaseId,
        tagName
        isDraft
      }
      totalCount
    }
  }
}

`;
    const { repository } = await graphqlWithAuth<{
        repository: {
            releases: {
                nodes: {
                    databaseId: number;
                    tagName: string;
                    isDraft: boolean;
                }[]
                totalCount: number;
            },
        };
    }>(QUERY, { owner: options.owner, repo: options.repo });
    const initialVersion = 0;
    const latestStableRelease = repository.releases.nodes.find(node => {
        return !node.isDraft
    });
    const currentReleasedVersion = latestStableRelease ? parseInt(latestStableRelease.tagName, 10) : initialVersion;
    const latestDraft = repository.releases.nodes.find(node => node.isDraft);
    console.log("current release status", {
        latestDraft,
        latestStableRelease,
        currentReleasedVersion,
        repository: JSON.stringify(repository, null, 4)
    })
    // if draft is found, update it
    if (latestDraft) {
        return {
            type: "update",
            tagName: latestDraft.tagName,
            releaseId: latestDraft.databaseId
        }
    } else {
        // if no draft is found, create a new one with latest + 1
        return {
            tagName: `${currentReleasedVersion + 1}`,
            type: "new"
        }
    }
};


async function createDraftRelease({
                                      type,
                                      releaseId,
                                      owner,
                                      repo,
                                      releaseName,
                                      tagName,
                                      releaseBody,
                                      commitSha,
                                      GITHUB_TOKEN
                                  }:
                                      { type: "new" | "update", releaseId?: number; owner: string; repo: string; releaseName: string; releaseBody: string; tagName: string, commitSha: string; GITHUB_TOKEN: string }) {
    const octokit = new Octokit({
        auth: GITHUB_TOKEN
    });
    // Create a release
    // API Documentation: https://developer.github.com/v3/repos/releases/#create-a-release
    // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-create-release
    if (type === "new") {
        await octokit.repos.createRelease({
            owner,
            repo,
            tag_name: tagName,
            name: releaseName,
            body: releaseBody,
            draft: true,
            prerelease: false,
            target_commitish: commitSha
        });
    } else if (type === "update" && releaseId) {
        await octokit.repos.updateRelease({
            release_id: releaseId,
            owner,
            repo,
            tag_name: tagName,
            name: releaseName,
            body: releaseBody,
            draft: true,
            prerelease: false,
            target_commitish: commitSha
        });
    }
}

async function main() {
    const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY!
    const DRAFT_LABEL = process.env.DRAFT_LABEL!
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
    const GIT_COMMIT_SHA = process.env.GIT_COMMIT_SHA!;
    const [owner, repo] = GITHUB_REPOSITORY.split("/");
    console.log({
        owner,
        repo,
        DRAFT_LABEL
    });
    const issues = await fetchIssues({
        GITHUB_TOKEN,
        labels: [DRAFT_LABEL],
        owner,
        repo
    });
    console.log("issues", issues);
    if (issues.length === 0) {
        console.log("no issues found with label", DRAFT_LABEL);
        return;
    }
    const next = await createNextTagVersion({
        GITHUB_TOKEN,
        owner,
        repo,
    });
    console.log("next version", next);
    const body = template(issues);
    const metaComment = generateMetaComment(issues);
    const title = "Draft";
    await createDraftRelease({
        owner,
        repo,
        GITHUB_TOKEN,
        commitSha: GIT_COMMIT_SHA,
        type: next.type,
        tagName: next.tagName,
        releaseId: next.releaseId,
        releaseName: title,
        releaseBody: body + "\n\n" + metaComment
    })
}

if (require.main) {
    main().catch(error => {
        console.error(error);
        process.exit(1);
    })
}
