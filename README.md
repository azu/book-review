# Book Review

本を読んだ感想を書くブログです。

## 読み方

- <https://github.com/azu/book-review/releases> に記事の一覧があります
- 書籍ごとの感想は[Issue](https://github.com/azu/book-review/issues?q=is%3Aissue+is%3Aclosed+label%3A%22Status%3A+Released%22)ごとに書かれています

## 更新の購読方法

- リポジトリの Watch →　Custom →　Releases を購読するとリリースだけを購読できます
- RSSで読みたい場合は <https://github.com/azu/book-review/releases.atom> を購読してください

## リアクションの方法

- 各記事の下部にはリアクションボタンがあります
- 各記事に紐づくDiscussionsページがあり、Discussionsページにコメントを書くこともできます

---

# GitHub Releasesブログのセットアップ方法

このブログシステムを使いたい人向けのガイドです。

1. このリポジトリをForkする: <https://github.com/azu/book-review/fork>
2. Forkしたら、リポジトリの `https://github.com/{owner}/{repo}/actions/workflows/setup.yml` にアクセスし"Run Workflow"を実行する
   - 必要なラベルなどがセットアップされます

## 使い方

1. Issueを作り、タイトルに書籍のタイトルを入れて、本文に感想を入れる
2. Issueに"Status: Draft"のラベルを付ける
3. GitHub Actionsが"Status: Draft"のIssueをまとめた[Draft Release](https://github.com/azu/book-review/releases)を作成する
4. 公開したくなったらDraft Releaseを編集して、Publishすると公開され、DraftのIssueは閉じられる

## 機能

- Zennライクなスクラップ機能
  - Issueにスクラップを書いて、Releasesでまとめて1つの記事として公開
- ドラフト
  - Issueが個別のドラフトになります
  - `Status: Draft` ラベルをつけたIssueをドフラトとして扱います
  - ラベルがついてないIssueは対象外となるので、ドラフトではないIssueも混在できます
- プロジェクト管理
  - [GitHub Projects](https://docs.github.com/ja/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects)を使うことで、ドラフトや公開済みのIssueを管理できます
  - `Status: Draft`ラベル: ドラフト
  - `Status: Released`ラベル: 公開済み
- テンプレート
  - actions/create-draft/src/template.ts を編集する
- タグ = ラベル
- 画像/動画サポート
  - Issueにそれぞれアップロードできます
- RSS
  - GitHub ReleasesのリリースノートはRSSで購読できる
- GitHubと連携したWatchの仕組み
  - GitHubアカウントを持っているならWatchで購読できる
- コメントシステム = Discussion
  - リリース時に"Create a discussion for this release"を選択することでコメント欄として使えるDiscussion連携ができる
  - また、リリースごとにリアクションも設定できる
- 共同編集
  - リポジトリに書き込めるユーザーを制限することで、執筆者を管理できます
  - Issueを編集すれば、共同編集ができます
  - Issueを立てた人が、そのIssueの執筆者となります
- 検索
  - <https://github.com/azu/book-review/releases>には全文検索がついています
- Markdown
  - GitHub Issuesに書けるMarkdownは全て対応しています
- アクセス解析
  - Insight > TrafficからPV数を確認できます

## Tips

### TwitterのTweet URLを埋め込みたい

- [Poet.so | Create Beautiful Images of Twitter Posts](https://poet.so/) を使うとTweetのURLを画像に変換できる
