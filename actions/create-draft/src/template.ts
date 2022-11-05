import type { Issue } from "./create-draft";

/**
 * Create Release Note body from issues
 * @param issues
 */
export const template = (issues: Issue[]): string => {
    return issues.map(issue => {
        return `# ${issue.title} by @${issue.author.login} #${issue.number}

${issue.body}    
`.trimEnd();
    }).join("\n\n");
}
