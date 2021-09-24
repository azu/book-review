# Book Review

本を読んだ感想を書くブログです。

## 読み方

- <https://github.com/azu/book-review/releases> に感想の一覧があります
- 書籍ごとの感想は[Issue](https://github.com/azu/book-review/issues?q=is%3Aissue+is%3Aclosed+label%3A%22Status%3A+Released%22)ごとに書かれています

## 購読の仕方

- リポジトリの Watch →　Custom →　Releases を購読するとリリースだけを購読できます
- RSSで読みたい場合は <https://github.com/azu/book-review/releases.atom> を購読してください

---

## 使い方

1. Issueを作り、タイトルに書籍のタイトルを入れて、本文に感想を入れる
2. Issueに"Status: Draft"のラベルを付ける
3. GitHub Actionsが"Status: Draft"のIssueをまとめた[Draft Release](https://github.com/azu/book-review/releases)を作成する
4. 公開したくなったらDraft Releaseを編集して、Publishすると公開され、DraftのIssueは閉じられる

## 機能

- Zennライクなスクラップ機能
  - Issueにスクラップを書いて、Releasesでまとめて更新
- ドラフト
  - Issueが個別のドラフト
- テンプレート
  - actions/create-draft/src/template.ts を編集する
- タグ = ラベル
- 画像/動画サポート
  - Issueにそれぞれアップロードする
- RSS
  - GitHub ReleasesのリリースノートはRSSで購読できる
- GitHubと連携したWatchの仕組み
  - GitHubアカウントを持っているならWatchで購読できる
- コメントシステム = Discussion
  - リリース時に"Create a discussion for this release"を選択することでコメント欄として使えるDiscussion連携ができる
  - また、リリースごとにリアクションも設定できる

