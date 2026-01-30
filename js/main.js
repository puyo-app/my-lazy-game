/* --- 設定：画像のパスなど --- */
const CONFIG = {
    // 枠画像のパス（全員共通）
    framePath: "assets/images/card_frame.png",
    // イラストがあるフォルダ
    artPath: "assets/images/"
};

/* --- 1. カードの設計図（クラス） --- */
class Card {
    constructor(id, name, cost, artImage, description, effect) {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.artImage = artImage;
        this.description = description;
        this.effect = effect; // クリックした時の効果（後で使います）
    }

    // HTMLを生成する工場メソッド
    createHTML() {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        // クリックしたらログを出す（動作確認用）
        cardDiv.onclick = () => console.log(`カード使用: ${this.name}`);

        // あの「黄金比」のHTML構造をそのまま埋め込む
        cardDiv.innerHTML = `
            <img src="${CONFIG.artPath + this.artImage}" class="card-art">
            <img src="${CONFIG.framePath}" class="card-frame-img">
            <div class="card-ui">
                <div class="card-cost">${this.cost}</div>
                <div class="card-title">${this.name}</div>
                <div class="card-desc">${this.description}</div>
            </div>
        `;
        return cardDiv;
    }
}

/* === js/main.js の Cardクラス定義より下を書き換え === */

// ユーティリティ: 配列をシャッフルする (Fisher-Yates algorithm)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// バトル状態管理クラス
class BattleManager {
    constructor(startingDeck) {
        this.deck = [...startingDeck]; // デッキ原本（コピー）
        this.drawPile = [];            // 山札
        this.hand = [];                // 手札
        this.discardPile = [];         // 捨て札
    }

    // 戦闘開始（初期化）
    initBattle() {
        // 山札を作成してシャッフル
        this.drawPile = [...this.deck];
        shuffle(this.drawPile);
        this.hand = [];
        this.discardPile = [];
        
        console.log("バトル開始: 山札シャッフル完了");
        this.updateUI();
        this.startTurn();
    }

    // ターン開始処理
    startTurn() {
        console.log("--- ターン開始 ---");
        this.drawCard(5); // 定番の5枚ドロー
    }

    // カードを引く処理（リシャッフル機能付き）
    drawCard(count) {
        for (let i = 0; i < count; i++) {
            if (this.drawPile.length === 0) {
                if (this.discardPile.length === 0) {
                    console.log("引くカードがありません！");
                    break;
                }
                // 山札が尽きたら捨て札をリシャッフルして山札にする
                console.log("山札再構築（リシャッフル）");
                this.drawPile = [...this.discardPile];
                shuffle(this.drawPile);
                this.discardPile = [];
            }
            // 山札から手札へ移動
            const card = this.drawPile.pop();
            this.hand.push(card);
        }
        this.updateUI();
    }

    // カードを使用する処理
    playCard(index) {
        const card = this.hand[index];
        
        console.log(`カード使用: ${card.name} (効果: ${card.effect})`);
        
        // TODO: ここに実際のダメージ処理やブロック処理が入ります
        
        // 手札から削除し、捨て札へ
        this.hand.splice(index, 1);
        this.discardPile.push(card);
        
        this.updateUI();
    }

    // 手札を全て捨てる（ターン終了時など）
    discardHand() {
        this.discardPile.push(...this.hand);
        this.hand = [];
        this.updateUI();
    }

    // UI更新（再描画）
    updateUI() {
        // 1. カウンター更新
        document.getElementById('draw-pile-count').innerText = `山札: ${this.drawPile.length}`;
        document.getElementById('discard-pile-count').innerText = `捨て札: ${this.discardPile.length}`;

        // 2. 手札描画
        const container = document.getElementById('hand-container');
        container.innerHTML = ''; // 一旦クリア

        this.hand.forEach((card, index) => {
            const cardEl = card.createHTML();
            
            // クリックイベントを上書きして、indexを渡せるようにする
            cardEl.onclick = () => {
                this.playCard(index);
            };

            // アニメーション用のクラス付与などはここで行う
            container.appendChild(cardEl);
        });
    }
}

// グローバル変数として管理
let battleManager;

// ゲーム初期化
function initGame() {
    // デッキ構築（仮：ストライク3, 防御3, ポーション1）
    // ※cardDatabase[0]などを参照してインスタンスをコピーする必要がありますが
    // 簡易的に参照渡しでリストを作ります
    const myDeck = [
        cardDatabase[0], cardDatabase[0], cardDatabase[0],
        cardDatabase[1], cardDatabase[1], cardDatabase[1],
        cardDatabase[2]
    ];

    battleManager = new BattleManager(myDeck);
    battleManager.initBattle();
}

// HTML側のボタンから呼ぶ用
function endTurn() {
    battleManager.discardHand();
    // 次のターンへ（簡易実装）
    setTimeout(() => {
        battleManager.startTurn();
    }, 500);
}

window.onload = initGame;