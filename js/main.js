const CONFIG = {
    framePath: "assets/images/card_frame.png",
    artPath: "assets/images/"
};

// ==========================================
// 1. 基本クラス定義
// ==========================================
class Card {
    constructor(id, name, cost, artImage, description, effect) {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.artImage = artImage;
        this.description = description;
        this.effect = effect;
    }

    // HTML要素を生成して返す
    createHTML() {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        // クリックイベントはBattleManager側で設定するため、ここでは枠組みだけ作る
        
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

// ==========================================
// 2. カードデータベース
// ==========================================
const cardDatabase = [
    new Card(1, "ストライク", 1, "art_strike.png", "敵1体に<br>6ダメージを与える"),
    new Card(2, "防御", 1, "art_shield.png", "ブロックを<br>5得る"),
    new Card(3, "ポーション", 0, "art_potion.png", "HPを<br>10回復する"),
];

// ==========================================
// 3. システムロジック (Battle Manager)
// ==========================================

// 配列シャッフル関数 (Fisher-Yates)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

class BattleManager {
    constructor(startingDeck) {
        this.deck = [...startingDeck]; // デッキ原本
        this.drawPile = [];            // 山札
        this.hand = [];                // 手札
        this.discardPile = [];         // 捨て札
    }

    // 戦闘開始
    initBattle() {
        // 山札を作ってシャッフル
        this.drawPile = [...this.deck];
        shuffle(this.drawPile);
        this.hand = [];
        this.discardPile = [];
        
        console.log("バトル開始！");
        this.startTurn();
    }

    // ターン開始
    startTurn() {
        console.log("--- ターン開始 ---");
        // 5枚引く
        this.drawCard(5);
    }

    // カードドロー処理 (リシャッフル機能付き)
    drawCard(count) {
        for (let i = 0; i < count; i++) {
            if (this.drawPile.length === 0) {
                if (this.discardPile.length === 0) {
                    console.log("山札も捨て札もありません");
                    break;
                }
                // 捨て札を山札に戻してシャッフル
                console.log("♻️ リシャッフル発生");
                this.drawPile = [...this.discardPile];
                shuffle(this.drawPile);
                this.discardPile = [];
            }
            // 山札の一番上を手札へ
            const card = this.drawPile.pop();
            this.hand.push(card);
        }
        this.updateUI();
    }

    // カード使用処理
    playCard(index) {
        const card = this.hand[index];
        console.log(`カード使用: ${card.name}`);
        
        // TODO: ここにダメージ処理やコスト消費を入れる

        // 手札から抜いて捨て札へ
        this.hand.splice(index, 1);
        this.discardPile.push(card);
        
        this.updateUI();
    }

    // 手札をすべて捨てる
    discardHand() {
        console.log("手札をすべて捨て札へ送ります");
        this.discardPile.push(...this.hand);
        this.hand = [];
        this.updateUI();
    }

    // 画面描画
    updateUI() {
        // 1. カウンター更新
        document.getElementById('draw-pile-count').innerText = `山札: ${this.drawPile.length}`;
        document.getElementById('discard-pile-count').innerText = `捨て札: ${this.discardPile.length}`;

        // 2. 手札描画
        const container = document.getElementById('hand-container');
        container.innerHTML = ''; // 一旦クリア

        this.hand.forEach((card, index) => {
            const cardEl = card.createHTML();
            // クリック時に playCard(index) を呼ぶ
            cardEl.onclick = () => {
                this.battleManagerInstance.playCard(index);
            };
            container.appendChild(cardEl);
        });
    }
}

// ==========================================
// 4. ゲーム初期化・グローバル関数
// ==========================================
let battleManager; // グローバル変数

function initGame() {
    // 仮のデッキを作成（ストライクx3, 防御x3, ポーションx1）
    const myDeck = [
        cardDatabase[0], cardDatabase[0], cardDatabase[0],
        cardDatabase[1], cardDatabase[1], cardDatabase[1],
        cardDatabase[2]
    ];

    battleManager = new BattleManager(myDeck);
    
    // イベントハンドラ内でthisがズレないように参照を持たせる（簡易的な解決策）
    battleManager.battleManagerInstance = battleManager;
    
    battleManager.initBattle();
}

// HTMLのボタンから呼ばれる関数
function endTurn() {
    if(!battleManager) return;
    battleManager.discardHand();
    
    // 少し待ってから次のターン開始（演出用ウェイト）
    setTimeout(() => {
        battleManager.startTurn();
    }, 400);
}

window.onload = initGame;