import { graphql } from "@octokit/graphql";
import { Octokit } from "@octokit/rest";
import { generateMetaComment } from "./meta-parser";

export type Issue = {
    id: string;
    title: string;
    body: string;
    url: string;
    number: number;
}
export const fetchIssues = async (
    options: { owner: string; repo: string; labels: string[]; GITHUB_TOKEN: string; },
): Promise<Issue[]> => {
    const graphqlWithAuth = graphql.defaults({
        headers: {
            authorization: `token ${options.GITHUB_TOKEN}`
        }
    });
    const QUERY = `query ($owner: String!, $repo: String!, $labels: [String]) {
  repository(owner: $owner, name: $repo) {
    issues(first: 20, filterBy: {labels: $labels}) {
      nodes {
        id
        title
        body
        url
        number
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
    releases(first: 5) {
      nodes {
        databaseId,
        tagName
        isDraft
      }
    }
    latestRelease {
      isDraft
      tagName
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
            latestRelease: {
                databaseId: number,
                isDraft: boolean,
                tagName: string;
            } | null
        };
    }>(QUERY, { owner: options.owner, repo: options.repo });
    const initialVersion = 1;
    const currentVersion = repository.latestRelease ? parseInt(repository.latestRelease.tagName, 10) : initialVersion;
    console.log("repository releases", JSON.stringify(repository, null, 4));
    // first release, but has draft
    const latestDraft = (() => {
        const release = repository.releases.nodes[0];
        if (!release) {
            return;
        }
        if (release.isDraft) {
            return release
        }
        return;
    })();
    if (latestDraft) {
        return {
            type: "update",
            tagName: latestDraft.tagName,
            releaseId: latestDraft.databaseId
        }
    }
    // first release
    if (repository.latestRelease === null) {
        return {
            tagName: `${currentVersion}`,
            type: "new"
        }
    }
    // 1, 2 ...
    if (currentVersion === repository.releases.totalCount) {
        return {
            tagName: `${currentVersion + 1}`,
            type: "new"
        }
    }
    throw new Error("Unknown response:" + repository);
};

const template = (issues: Issue[]) => {
    return issues.map(issue => {
        return `# ${issue.title} #${issue.number}

${issue.body}    
`.trimEnd();
    }).join("\n\n");
}

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
    console.log([owner, repo]);
    fetchIssues({
        GITHUB_TOKEN,
        labels: [DRAFT_LABEL],
        owner,
        repo
    }).then(async issues => {
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
    })
}

if (require.main) {
    main().catch(error => {
        console.error(error);
        process.exit(1);
    })
}