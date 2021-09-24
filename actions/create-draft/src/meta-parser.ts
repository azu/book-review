import { Issue } from "./create-draft";
// <!-- @@github_blog_meta@@: {meta} --> format
export const generateMetaComment = (issues: Issue[]) => {
    const meta = issues.map(issue => {
        return issue.id
    });
    return `<!-- @@github_blog_meta@@: ${JSON.stringify(meta)} -->`;
}
export const parseMetaComment = (body: string): string[] => {
    const pattern = /<!-- @@github_blog_meta@@: (.*?) -->/;
    const match = body.match(pattern);
    if (!match) {
        return [];
    }
    const ids = JSON.parse(match[1]);
    return ids as string[];
}
