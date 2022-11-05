import { graphql } from "@octokit/graphql";
import { parseMetaComment } from "./meta-parser";

export type Issue = {
    title: string;
    body: string;
    url: string;
    number: number;
}
export const closeIssues = async (options: { issueIds: string[]; closedLabelIds: string[]; GITHUB_TOKEN: string }) => {
    const graphqlWithAuth = graphql.defaults({
        headers: {
            authorization: `token ${options.GITHUB_TOKEN}`
        }
    });
    const QUERY = `mutation CloseMutation($labelIds: [ID!]) {
    ${options.issueIds.map((issueId, index) => {
        return `req${index}: updateIssue(input: { id: "${issueId}", labelIds: $labelIds, state: CLOSED }){
    issue {
      id
    }
  }`
    }).join("\n")
    }
}`;
    const res = await graphqlWithAuth<{}>(QUERY, {
        labelIds: options.closedLabelIds
    });
    console.log("close issues", res);
    return;

}

export const fetchReleaseIds = async (options: { owner: string; repo: string; tagName: string; GITHUB_TOKEN: string }) => {
    const graphqlWithAuth = graphql.defaults({
        headers: {
            authorization: `token ${options.GITHUB_TOKEN}`
        }
    });
    const QUERY = `query ($owner: String!, $repo: String!, $tagName: String!) {
  repository(owner: $owner, name: $repo) {
    release(tagName: $tagName){
      description
    }
  }
}
`;
    const res = await graphqlWithAuth<{
        repository: {
            release: {
                description: string
            }
        }
    }>(QUERY, { owner: options.owner, repo: options.repo, tagName: options.tagName });
    return parseMetaComment(res.repository.release.description);

}
export const fetchReleasedLabelId = async (options: { owner: string; repo: string; labelName: string; GITHUB_TOKEN: string }) => {
    const graphqlWithAuth = graphql.defaults({
        headers: {
            authorization: `token ${options.GITHUB_TOKEN}`
        }
    });
    const QUERY = `query ($owner: String!, $repo: String!, $labelName: String!) {
  repository(owner: $owner, name: $repo) {
    label(name: $labelName){
      id
    }
  }
}
`;
    const res = await graphqlWithAuth<{
        repository: {
            label: {
                id: string;
            }
        }
    }>(QUERY, { owner: options.owner, repo: options.repo, labelName: options.labelName });
    return res.repository.label.id;

}

async function main() {
    const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY!
    const RELEASED_LABEL = process.env.RELEASED_LABEL!
    const RELEASED_TAG_NAME = process.env.RELEASED_TAG_NAME!;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
    const [owner, repo] = GITHUB_REPOSITORY.split("/");
    console.log("Release Repository", {
        owner,
        repo
    });
    const releasedIds = await fetchReleaseIds({
        owner,
        repo,
        GITHUB_TOKEN,
        tagName: RELEASED_TAG_NAME,
    });
    console.log("ReleasedIds", releasedIds);
    const releasedLabelId = await fetchReleasedLabelId({
        owner,
        repo,
        GITHUB_TOKEN,
        labelName: RELEASED_LABEL,
    });
    console.log("releasedLabelId", releasedLabelId);
    await closeIssues({
        closedLabelIds: [releasedLabelId],
        issueIds: releasedIds,
        GITHUB_TOKEN
    });
}

if (require.main) {
    main().catch(error => {
        console.error(error);
        process.exit(1);
    });
}
