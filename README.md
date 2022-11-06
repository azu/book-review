# Book Review

本を読んだ感想を書くブログです。

## 読み方

- 最新の記事: <https://github.com/azu/book-review/releases/latest>
- 記事の一覧: <https://github.com/azu/book-review/releases>
- 書籍ごとの感想は[Issue](https://github.com/azu/book-review/issues?q=is%3Aissue+is%3Aclosed+label%3A%22Status%3A+Released%22)ごとに書かれています

## 更新の購読方法

- リポジトリの Watch →　Custom →　Releases を購読するとリリースだけを購読できます
  - GitHubアカウントが必要です
  - [GitHub Notification](https://github.com/settings/notifications)に基づいた通知方法で更新を通知します
  - デフォルトでは[Notifications](https://github.com/notifications?query=is%3Arelease)とGitHubに登録してるメールに通知が来ます
- RSSで読みたい場合は <https://github.com/azu/book-review/releases.atom> を購読してください
  - こちらはGitHubアカウントは不要です
  - 任意のRSSリーダやSlack(`/feed subscribe https://github.com/azu/book-review/releases.atom`)などで購読できます

## 記事へのリアクション方法

- 各記事の下部にはリアクションボタンがあります
- 各記事に紐づくDiscussionsページがあり、Discussionsページにコメントを書くこともできます

---

# GitHub Releasesブログのセットアップ方法

このブログシステムを使いたい人向けのガイドです。

1. このリポジトリをテンプレートにして新しいリポジトリを作成: <https://github.com/azu/book-review/generate>
2. 作成したリポジトリの `https://github.com/{owner}/{repo}/actions/workflows/setup.yml` にアクセスし"Run Workflow"を実行する
   - 必要なラベルなどがセットアップされます
3. [必要なら] リポジトリのSettingsからDiscussionsを有効にする
   - Discussionsをブログへのコメントする場所として利用できます

## 使い方

1. Issueを作り、タイトルに書籍のタイトルを入れて、本文に感想を入れる
2. Issueに"Status: Draft"のラベルを付ける
3. GitHub Actionsが"Status: Draft"のIssueをまとめた[Draft Release](https://github.com/azu/book-review/releases)を作成する
4. 公開したくなったらDraft Releaseを編集して、Publishすると公開され、DraftのIssueは閉じられる

## 機能

- スクラップ機能
  - Issueごとにスクラップを書いて、Releasesでまとめて1つの記事として公開できます
- ドラフト と 公開済みのライフサイクル
  - Issueが個別のドラフトになります
  - `Status: Draft` ラベルをつけたIssueをドフラトとして扱います
    - ラベルがついてないIssueは対象外となるので、ドラフトではないIssueも混在できます
  - Issueが編集されるたびにGitHub Actionsで、GitHub Releasesにドラフトリリースノートを作成します
    - このドラフトリリースノートには、その時点で`Status: Draft` ラベルがついたIssueが全てまとめられています
  - ドラフトリリースノートをPublishすると、`Status: Draft` ラベルがついたIssueが全て自動でクローズされ、`Status: Released`ラベルを付与します
  - このライフサイクルは[.github/workflows/create-draft.yml](.github/workflows/create-draft.yml)が処理しています
- プロジェクト管理
  - [GitHub Projects](https://docs.github.com/ja/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects)を使うことで、ドラフトや公開済みのIssueを管理できます
  - `Status: Draft`ラベル: ドラフト
  - `Status: Released`ラベル: 公開済み
  - ラベルは setup.yml のworkflowを実行すると追加できます
- テンプレート
  - [actions/create-draft/src/template.ts](actions/create-draft/src/template.ts) を編集する
- タグ = ラベル
  - テンプレートを編集して、ラベルをタグとして扱うこともできます
  - https://github.com/jser/blog-example
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
- 著者表記
  - 記事中で `@azu` のようにMentionを入れると、自動的にContributorsとして記事の下部に表示されます。
- 検索
  - <https://github.com/azu/book-review/releases>には全文検索がついています
- Markdown
  - GitHub Issuesに書けるMarkdownは全て対応しています
  - [Basic writing and formatting syntax - GitHub Docs](https://docs.github.com/ja/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
  - [Working with advanced formatting - GitHub Docs](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting)
- アクセス解析
  - Insight > TrafficからPV数を確認できます
- OGPイメージ
  - GitHubが自動的に生成してくれます
- ワークフロー
  - GitHub Actionsで `on: release` のWorkflowで公開時にWorkflowを実行できます
  - リポジトリのWebhook設定で Releases のWebhookを設定できます
  - e.g. 記事を公開するときにSNSにポストするなど

## Tips

### TwitterのTweet URLを埋め込みたい

- [Poet.so | Create Beautiful Images of Twitter Posts](https://poet.so/) を使うとTweetのURLを画像に変換できる

### Amazonの書影を埋め込みたい

- [Amazon Cover Code](https://amazon-cover-code.deno.dev/) でMarkdownの画像付きリンクを作成で切る

## LICENSE

- ブログシステムのコードはMITライセンス (c) azu
  - <https://github.com/azu/book-review/blob/main/actions/create-draft/LICENSE>
- ブログ記事はリポジトリ所有者が著作権を保持します
