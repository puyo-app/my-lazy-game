# My Lazy Game Project

スマホ特化のWebブラウザゲーム開発プロジェクト。
GitHub Pages + Google Sheets (GAS) を使ったサーバーレス・爆速開発構成。

## 📱 開発方針
- **ターゲット:** Android / iOS (スマホブラウザ)
- **技術:** HTML5, CSS3, Vanilla JavaScript (フレームワークなし)
- **DB:** Google Sheets + Google Apps Script (GAS)
- **エディタ:** GitHub Web Editor (`.`)
- **デプロイ:** GitHub Pages (mainブランチ同期)

## 🚀 現在の状況 (Status)
- [x] リポジトリ作成 & GitHub Pages 公開設定
- [x] スマホ用ビューポート設定 (`user-scalable=no`)
- [x] Google Sheets + GAS の連携環境構築 (POST受信)
- [x] `index.html` からのデータ送信・保存テスト成功 (疎通確認済み)

## 🛠 構成メモ
- **index.html**: 現在はDB接続テスト用のUI。
- **GAS (Backend)**: POSTリクエストを受け取り、JSONデータをパースしてシートに行追加する。
  - **仕様:** `no-cors` モードで `fetch` し、`text/plain` としてJSONを送る。
  - **保存データ:** 日時, 名前, スコア

## ✅ 次のステップ (TODO)
- [ ] ゲームの企画・設計（ジャンル決定）
- [ ] ゲーム画面の実装（Canvas等の描画処理）
- [ ] ゲームループの作成
- [ ] スコアランキング表示機能（GASからのデータ取得処理の追加）