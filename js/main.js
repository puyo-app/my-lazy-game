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

/* --- 2. カードリスト（ここを書き足せばカードが増える！） --- */
const cardDatabase = [
    new Card(1, "ストライク", 1, "art_strike.png", "敵1体に<br>6ダメージを与える"),
    new Card(2, "防御", 1, "art_shield.png", "ブロックを<br>5得る"),
    new Card(3, "ポーション", 0, "art_potion.png", "HPを<br>10回復する"),
    // ★新しいカードはここに書き足すだけ！
    // new Card(4, "強打", 2, "art_strike.png", "10ダメージと<br>弱体を与える"),
];

/* --- 3. 画面に並べる処理 --- */
function initGame() {
    const handContainer = document.getElementById('hand-container');
    
    // データをループしてカードを生成
    cardDatabase.forEach(cardData => {
        const cardElement = cardData.createHTML();
        handContainer.appendChild(cardElement);
    });
}

// 読み込み完了時にスタート
window.onload = initGame;