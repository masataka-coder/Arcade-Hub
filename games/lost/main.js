// Initialize Icons
lucide.createIcons();

const ITEMS = [
    { id: 1, name: "潰れた空き缶", desc: "パッケージのロゴは擦り切れている。中身は20年前の限定ソーダだったという噂がある。", rarity: "common", icon: "🥫" },
    { id: 2, name: "片方だけの靴下", desc: "絶妙にダサい柄。もう片方は洗濯機の裏から異世界へ転移したという説が有力。", rarity: "common", icon: "🧦" },
    { id: 3, name: "雨に濡れた新聞", desc: "日付は明日のものになっている。インクが滲んでいて肝心の記事は読めない。", rarity: "common", icon: "📰" },
    { id: 4, name: "折れたビニール傘", desc: "強風と戦った勇者のなれの果て。骨組みが現代アートのような形状に歪んでいる。", rarity: "common", icon: "☂️" },
    { id: 5, name: "誰かの眼鏡", desc: "度が強すぎる。これをかけると、見えないはずのものまで見えてしまいそうだ。", rarity: "common", icon: "👓" },
    { id: 6, name: "謎の歯車", desc: "時計の部品にしては大きく、車の部品にしては繊細。何かの巨大な絡繰りの一部か？", rarity: "rare", icon: "⚙️" },
    { id: 7, name: "古びた鍵", desc: "真鍮製で冷たい。この街のどこかにある、開かずの扉を開けることができるかもしれない。", rarity: "rare", icon: "🗝️" },
    { id: 8, name: "ゲームカセット", desc: "ラベルが剥がされた謎のロムカセット。差し込むと呪いのゲームが始まる定番のやつ。", rarity: "rare", icon: "📼" },
    { id: 9, name: "片目だけのテディベア", desc: "雨の路地裏に座っていた。残された片目で、この街の変遷をずっと見つめていた。", rarity: "rare", icon: "🧸" },
    { id: 10, name: "破られたラブレター", desc: "宛名部分は意図的に燃やされている。微かに残る香水の匂いが、ひどく切ない。", rarity: "epic", icon: "💌" },
    { id: 11, name: "録音機", desc: "再生ボタンを押すと、街の喧騒に混じって「...見つけた」という声だけがループする。", rarity: "epic", icon: "🎙️" },
    { id: 12, name: "黒塗りのフロッピー", desc: "現代のPCでは読み込めない。都市伝説とされるハッカー集団の設計図が入っているらしい。", rarity: "epic", icon: "💾" },
    { id: 13, name: "琥珀色の小瓶", desc: "中で液体が微かに発光している。飲むと一時的に時間を数秒戻せる...気がするだけ。", rarity: "epic", icon: "🧪" },
    { id: 14, name: "星の欠片", desc: "仄かに青白く光る鉱石。耳を近づけると、遠い宇宙のノイズのような音が聞こえる。", rarity: "legendary", icon: "💎" },
    { id: 15, name: "記憶のフィルム", desc: "光に透かすと、自分が生まれる前の、知らない誰かの楽しそうな日常が映っている。", rarity: "legendary", icon: "🎞️" },
    { id: 16, name: "止まった懐中時計", desc: "11時55分で止まっている。裏蓋には「永遠に君と」と刻まれている。", rarity: "rare", icon: "⌚" },
    { id: 17, name: "不思議な地図", desc: "自分の居場所が赤い点で表示される。しかし、地図に描かれている地形はこの街のどこにもない。", rarity: "rare", icon: "🗺️" },
    { id: 18, name: "銀のスプーン", desc: "口に含むと、最後に使った人が食べた料理の味が微かにする。今日はシチューだったようだ。", rarity: "common", icon: "🥄" },
    { id: 19, name: "割れたコンパス", desc: "針は北ではなく、常に自分の一番大切な人がいる方向を指し続けている。", rarity: "epic", icon: "🧭" },
    { id: 20, name: "青い鳥の羽根", desc: "触れると幸福な気分になる。この街には一羽もいないはずの鳥の羽根だ。", rarity: "epic", icon: "🪶" },
    { id: 21, name: "空の財布", desc: "中にはレシートが一枚だけ。「夢の代金：支払済」と書かれている。", rarity: "common", icon: "👛" },
    { id: 22, name: "光るサイコロ", desc: "振るたびに違う色に光る。出た目によって、その日の運勢が物理的に書き換わるらしい。", rarity: "rare", icon: "🎲" },
    { id: 23, name: "色褪せたパスポート", desc: "発行国欄が空白。スタンプはどれも幾何学的な模様で、文字ではない。", rarity: "epic", icon: "📕" },
    { id: 24, name: "金のトランプ", desc: "ジョーカーにだけ、自分の顔が描かれている。不敵な笑みを浮かべている。", rarity: "legendary", icon: "🃏" },
    { id: 25, name: "古いラジオ", desc: "電池が入っていないのに、時々砂嵐に混じって未来のニュースが聞こえてくる。", rarity: "rare", icon: "📻" },
    { id: 26, name: "ガラスの眼球", desc: "机に置くと、部屋の隅をじっと見つめ始める。誰の目だったのだろうか。", rarity: "epic", icon: "👁️" },
    { id: 27, name: "錆びたメダル", desc: "「最優秀喪失者」と刻印されている。名誉なのか、皮肉なのか。", rarity: "common", icon: "🏅" },
    { id: 28, name: "燃え残った日記", desc: "最後のページには「もうすぐ夜が明ける」とだけ書かれている。", rarity: "rare", icon: "📔" },
    { id: 29, name: "時をかける切符", desc: "行き先は「思い出の場所」。改札を通る勇気は、まだない。", rarity: "legendary", icon: "🎫" },
    { id: 30, name: "謎の種", desc: "植えると、翌日には持ち主の欲しかった花の姿で、鉄のように硬く咲くらしい。", rarity: "rare", icon: "🌱" },
    { id: 31, name: "欠けたティーカップ", desc: "かつて優雅な午後を共にした器。かすかに紅茶の香りが残っている。", rarity: "common", icon: "☕" },
    { id: 32, name: "破れたチケット", desc: "遊園地の入場券の半券。日付はかすれて読めない。", rarity: "common", icon: "🎟️" },
    { id: 33, name: "埃だらけの絵本", desc: "「終わらないかくれんぼ」というタイトルの童話。結末のページが破られている。", rarity: "rare", icon: "📖" },
    { id: 34, name: "片方だけのピアス", desc: "青い石がはめ込まれた銀のピアス。もう片方は深い水の中に沈んだままだ。", rarity: "common", icon: "💎" },
    { id: 35, name: "錆びたペン先", desc: "インクの代わりに、誰かの涙で文字を綴った痕跡がある。", rarity: "common", icon: "🖋️" },
    { id: 36, name: "止まったメトロノーム", desc: "針は永遠に真ん中で静止している。耳を澄ますと心臓の鼓動のように聞こえる。", rarity: "epic", icon: "🎵" },
    { id: 37, name: "オルゴールのネジ", desc: "これを回してもオルゴールは鳴らないが、失われた記憶の欠片が脳裏にフラッシュバックする。", rarity: "rare", icon: "⚙️" },
    { id: 38, name: "名前のない犬の首輪", desc: "皮がすり減っている。ずっと飼い主を待ち続けていた証。", rarity: "rare", icon: "🐕" },
    { id: 39, name: "枯れた一輪の花", desc: "ガラスのドームに入れられたバラ。時間は止まっているのに花だけが枯れている。", rarity: "epic", icon: "🥀" },
    { id: 40, name: "真円のガラス玉", desc: "覗き込むと、自分が選ばなかった別の人生の光景が見える。", rarity: "legendary", icon: "🔮" },
    { id: 41, name: "誰かの手袋", desc: "雪の日に落とされた毛糸の手袋。冷たい手を温める主はもういない。", rarity: "common", icon: "🧤" },
    { id: 42, name: "狂った方位磁針", desc: "北を指さず、常に「あなたの一番恐れているもの」の方角を示す。", rarity: "rare", icon: "🧭" },
    { id: 43, name: "白紙のノート", desc: "何かが書かれていたはずだが、月の光の下でだけ文字が浮かび上がる。", rarity: "common", icon: "📓" },
    { id: 44, name: "すり減った硬貨", desc: "この国の通貨ではない。三途の川の渡し賃とも、星を買うお金とも言われる。", rarity: "common", icon: "🪙" },
    { id: 45, name: "割れた鏡の破片", desc: "今の自分ではなく、一番幸せだった頃の自分が映り込む。", rarity: "epic", icon: "🪞" },
    { id: 46, name: "光らない電球", desc: "電気を通しても光らないが、大切な想いを込めると微かに温かくなる。", rarity: "rare", icon: "💡" },
    { id: 47, name: "海鳴りのする貝殻", desc: "耳に当てると、海鳴りではなく誰かの泣き声が波のように引いては寄せる。", rarity: "epic", icon: "🐚" },
    { id: 48, name: "落ちない砂時計", desc: "ひっくり返しても砂が落ちない。ある一瞬の永遠を閉じ込めている。", rarity: "legendary", icon: "⏳" },
    { id: 49, name: "名宛のない手紙", desc: "「ごめんね」とだけ書かれた便箋。誰に向けられたものかは永遠の謎。", rarity: "rare", icon: "✉️" },
    { id: 50, name: "永遠の星屑", desc: "触れると指先が少し透き通る。夜空に還れなかった迷子の星。", rarity: "legendary", icon: "✨" }
];

const STORIES = [
    {
        id: "story1",
        title: "見えない宛先",
        requiredIds: [5, 10, 15],
        text: "度の強い眼鏡越しに、彼はずっと同じ景色を見ていた。\n手渡せなかった手紙は雨に濡れ、フィルムに焼き付けたあの日の笑顔だけが、今も鮮明に街の片隅を漂っている。\n\n失われたものは、いつか誰かが見つけてくれるのを待っているのかもしれない。"
    },
    {
        id: "story2",
        title: "時間の囚人",
        requiredIds: [16, 11, 29],
        text: "11時55分。録音機から流れる声と、止まった時計の針。\n彼は何度も同じ切符を握りしめ、改札の前で立ち止まる。\n\n「次は、うまくいくから」\nその声は、自分自身に向けられたものだったのかもしれない。"
    },
    {
        id: "story3",
        title: "異界からの漂着物",
        requiredIds: [12, 17, 23],
        text: "この街のどこにもないはずの地形を描いた地図。存在しない国のパスポート。\n私たちは、この街そのものが「何か」の巨大な忘れ物であることに気づいていない。\n\n黒いフロッピーに記録されたデータが実行された時、街の裏側が姿を現すだろう。"
    },
    {
        id: "story4",
        title: "幸福の代償",
        requiredIds: [20, 21, 24],
        text: "幸福の対価は、常に平等に支払われなければならない。\n青い羽根を手に入れた者が、空の財布に残されたレシートに気づくことは稀だ。\n\n金のジョーカーが笑っているのは、次に誰が「支払い」をするかを知っているからだ。"
    },
    {
        id: "story5",
        title: "色褪せた調べ",
        requiredIds: [36, 37, 39],
        text: "ネジを巻いても、オルゴールはもう鳴らない。\nかつて誰かのために奏でられたメロディは、庭園の木々の間に溶けて消えた。"
    },
    {
        id: "story6",
        title: "星降る丘の待ち人",
        requiredIds: [45, 48, 50],
        text: "砂の落ちない砂時計は、永遠の時間を約束した。\n割れた鏡に映る星屑が、今でもその丘で彼を待ち続けている。"
    }
];

ITEMS.forEach(item => {
    if (item.id <= 10) item.area = 1;
    else if (item.id <= 20) item.area = 2;
    else if (item.id <= 30) item.area = 3;
    else if (item.id <= 40) item.area = 4;
    else item.area = 5;
});

const AREAS = [
    { id: 1, name: "路地裏", reqUnlockItems: [] },
    { id: 2, name: "廃駅", reqUnlockItems: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { id: 3, name: "旧市街", reqUnlockItems: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
    { id: 4, name: "忘れられた庭園", reqUnlockItems: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
    { id: 5, name: "星降る丘", reqUnlockItems: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] }
];

let state = {
    isRunning: false,
    score: 0,
    maxScore: 100,
    foundItems: [],
    activeTrash: 0,
    memoryUnlocked: false,
    gameIntervals: [],
    unlockedStories: [],
    currentArea: 1,
    unlockedAreas: [1]
};

const gameArea = document.getElementById('game-area');
const scoreBar = document.getElementById('score-bar');
const scoreText = document.getElementById('score-text');
const sysMsg = document.getElementById('system-message');
const flashlight = document.getElementById('flashlight-layer');
const weatherText = document.getElementById('weather-text');

let timeOfDay = 'night';
let currentMouseX = window.innerWidth / 2;
let currentMouseY = window.innerHeight / 2;

// --- 時間帯の判定 ---
function updateTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) timeOfDay = 'morning';
    else if (hour >= 11 && hour < 16) timeOfDay = 'day';
    else if (hour >= 16 && hour < 19) timeOfDay = 'evening';
    else timeOfDay = 'night';

    document.body.dataset.time = timeOfDay;
}

// --- ライトの描画（時間帯連動） ---
function renderFlashlight(x, y) {
    let darkAlpha = 1;
    let midAlpha = 0.5;

    if (timeOfDay === 'morning' || timeOfDay === 'day') {
        darkAlpha = 0.15; // 昼は全体的にかなり明るい
        midAlpha = 0.05;
    } else if (timeOfDay === 'evening') {
        darkAlpha = 0.6; // 夕方は少し薄暗い
        midAlpha = 0.2;
    } else {
        darkAlpha = 1; // 夜は真っ暗
        midAlpha = 0.5;
    }

    const darkAlphaOuter = darkAlpha === 1 ? 1 : darkAlpha + 0.1;
    flashlight.style.background = `radial-gradient(circle 280px at ${x}px ${y}px, transparent 0%, transparent 40%, rgba(0,0,0,${midAlpha}) 70%, rgba(0,0,0,${darkAlpha}) 90%, rgba(0,0,0,${darkAlphaOuter}) 100%)`;
}

function updateTrashVisibility(x, y) {
    const trashNodes = document.querySelectorAll('.trash-node');
    const visibilityRadius = 180;

    trashNodes.forEach(node => {
        const rect = node.getBoundingClientRect();
        const nodeX = rect.left + rect.width / 2;
        const nodeY = rect.top + rect.height / 2;
        const dist = Math.sqrt(Math.pow(x - nodeX, 2) + Math.pow(y - nodeY, 2));

        if (dist < visibilityRadius) node.classList.add('in-light');
        else node.classList.remove('in-light');
    });
}


// --- Save / Load ---
function saveGame() {
    const data = {
        score: state.score,
        foundItems: state.foundItems,
        unlockedStories: state.unlockedStories,
        currentArea: state.currentArea,
        unlockedAreas: state.unlockedAreas
    };
    localStorage.setItem('lost-found-save', JSON.stringify(data));
}

function loadGame() {
    const saved = localStorage.getItem('lost-found-save');
    if (saved) {
        const data = JSON.parse(saved);
        state.score = data.score || 0;
        state.foundItems = data.foundItems || [];
        state.unlockedStories = data.unlockedStories || [];
        state.currentArea = data.currentArea || 1;
        state.unlockedAreas = data.unlockedAreas || [1];
        updateUI();
        if (state.unlockedStories.length > 0) {
            state.memoryUnlocked = true;
            const memBtn = document.getElementById('memory-btn');
            if (memBtn) memBtn.classList.remove('hidden');
        }
        if (state.unlockedAreas.length > 1) {
            const mapBtn = document.getElementById('map-btn');
            if (mapBtn) mapBtn.classList.remove('hidden');
        }

        // Re-check just in case save loaded backwards compatibility
        checkAreaUnlock();
    }
}

let lostBgm = new Audio('../../assets/musics/lost/bgm.mp3');
lostBgm.loop = true;
lostBgm.volume = 0.5;

const sfx = {
    cats: [
        new Audio('../../assets/musics/lost/effects/cat1.mp3'),
        new Audio('../../assets/musics/lost/effects/cat2.mp3'),
        new Audio('../../assets/musics/lost/effects/cat3.mp3')
    ],
    envs: [
        new Audio('../../assets/musics/lost/effects/environment1.mp3'),
        new Audio('../../assets/musics/lost/effects/environment2.mp3'),
        new Audio('../../assets/musics/lost/effects/environment3.mp3'),
        new Audio('../../assets/musics/lost/effects/environment4.mp3')
    ],
    rain: new Audio('../../assets/musics/lost/effects/rain.mp3')
};
sfx.cats.forEach(a => a.volume = 0.6);
sfx.envs.forEach(a => a.volume = 1.0);
sfx.rain.loop = true;
sfx.rain.volume = 0;

function startGame() {
    const titleScreen = document.getElementById('title-screen');
    titleScreen.style.opacity = '0';
    setTimeout(() => { titleScreen.remove(); }, 1000);

    state.isRunning = true;
    flashlight.style.opacity = '1';

    lostBgm.play().catch(e => console.log('BGM play failed:', e));
    sfx.rain.play().catch(e => console.log('Rain play failed:', e));

    state.gameIntervals.push(setInterval(() => { if (Math.random() > 0.5) spawnTrash(); }, 3000));
    state.gameIntervals.push(setInterval(() => { if (Math.random() > 0.6) spawnCat(); }, 15000));
    state.gameIntervals.push(setInterval(() => {
        if (!state.isRunning) return;
        if (Math.random() > 0.6) {
            let snd = sfx.envs[Math.floor(Math.random() * sfx.envs.length)];
            snd.currentTime = 0;
            snd.play().catch(e => { });
        }
    }, 12000));

    for (let i = 0; i < 2; i++) setTimeout(spawnTrash, i * 1000);
    updateWeather();
}

const handlePointerMove = (x, y) => {
    if (!state.isRunning) return;
    currentMouseX = x; currentMouseY = y;
    renderFlashlight(x, y);
    updateTrashVisibility(x, y);
};

document.addEventListener('mousemove', (e) => handlePointerMove(e.clientX, e.clientY));
document.addEventListener('touchmove', (e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY));
document.addEventListener('touchstart', (e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY));

// --- 背景の生成と天候 ---
function generateScenery() {
    const scenery = document.getElementById('scenery');
    const numBuildings = 15;
    for (let i = 0; i < numBuildings; i++) {
        const b = document.createElement('div');
        b.className = 'building';
        const width = Math.floor(Math.random() * 60) + 40;
        const height = Math.floor(Math.random() * 50) + 20;
        b.style.width = `${width}px`;
        b.style.height = `${height}%`;
        b.style.left = `${Math.random() * 100}%`;
        b.style.zIndex = Math.floor(Math.random() * 5) - 10;

        for (let w = 0; w < Math.floor(Math.random() * 10); w++) {
            const win = document.createElement('div');
            win.className = 'window';
            win.style.left = `${Math.random() * 80 + 10}%`;
            win.style.top = `${Math.random() * 80 + 10}%`;
            if (Math.random() > 0.3) b.appendChild(win);
        }
        scenery.appendChild(b);
    }
}

function setRain(count) {
    const container = document.getElementById('rain-container');
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${Math.random() * 0.8 + 0.4}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(drop);
    }
}

function updateWeather() {
    const fog = document.getElementById('fog-layer');
    const bg = document.getElementById('scenery');
    const timePrefix = { morning: "朝", day: "昼", evening: "夕暮れ", night: "深夜" }[timeOfDay];

    if (state.score < 30) {
        setRain(80);
        if (typeof sfx !== 'undefined') sfx.rain.volume = 0.5;
        fog.style.opacity = '0';
        weatherText.innerText = `${timePrefix}の街角清掃記録 (土砂降り)`;
        bg.style.background = ''; // CSSの[data-time]指定に戻す
        document.querySelectorAll('.star-effect').forEach(el => el.remove());
    } else if (state.score < 60) {
        setRain(30);
        if (typeof sfx !== 'undefined') sfx.rain.volume = 0.2;
        fog.style.opacity = '0';
        weatherText.innerText = `${timePrefix}の街角清掃記録 (小雨)`;
        sysMsg.innerText = '雨が弱まってきた。少し探しやすくなったかもしれない。';
    } else if (state.score < 90) {
        setRain(5);
        if (typeof sfx !== 'undefined') sfx.rain.volume = 0.05;
        fog.style.opacity = '1';
        weatherText.innerText = `${timePrefix}の街角清掃記録 (深い霧)`;
        sysMsg.innerText = '濃い霧が立ち込めている。見落とさないように。';
    } else {
        setRain(0);
        if (typeof sfx !== 'undefined') sfx.rain.volume = 0;
        fog.style.opacity = '0';
        weatherText.innerText = `${timePrefix}の街角清掃記録 (晴れ)`;
        sysMsg.innerText = '街に静寂が戻った。空が澄んで見える。';

        // 夜の晴れ限定で星空を表示
        if (timeOfDay === 'night') {
            bg.style.background = 'linear-gradient(to bottom, #0f1020 0%, #151530 60%, #0a0a1a 100%)';
            if (document.querySelectorAll('.star-effect').length < 20) {
                for (let i = 0; i < 20; i++) {
                    let star = document.createElement('div');
                    star.className = 'absolute bg-white rounded-full opacity-50 star-effect';
                    star.style.width = star.style.height = `${Math.random() * 2 + 1}px`;
                    star.style.left = `${Math.random() * 100}%`;
                    star.style.top = `${Math.random() * 40}%`;
                    bg.appendChild(star);
                }
            }
        } else {
            bg.style.background = '';
        }
    }
}

// --- Core Game Logic ---
function getRandomItem(forceRare = false) {
    const rand = Math.random();
    let rarityPool = forceRare ? (rand > 0.8 ? "legendary" : (rand > 0.4 ? "epic" : "rare")) :
        (rand > 0.95 ? "legendary" : (rand > 0.85 ? "epic" : (rand > 0.60 ? "rare" : "common")));

    let pool = ITEMS.filter(item => item.rarity === rarityPool && item.area === state.currentArea);
    if (pool.length === 0) pool = ITEMS.filter(item => item.area === state.currentArea);
    if (pool.length === 0) pool = ITEMS;

    const unfoundPool = pool.filter(item => !state.foundItems.includes(item.id));
    const foundPool = pool.filter(item => state.foundItems.includes(item.id));

    if (unfoundPool.length > 0 && foundPool.length > 0) {
        // 発見済みアイテムの出現確率をEPIC相当(10%)に下げる
        if (Math.random() < 0.1) {
            return foundPool[Math.floor(Math.random() * foundPool.length)];
        } else {
            return unfoundPool[Math.floor(Math.random() * unfoundPool.length)];
        }
    }

    return pool[Math.floor(Math.random() * pool.length)];
}

function spawnTrash(forceX = null, forceY = null, forceRare = false) {
    if (state.activeTrash >= 4 && !forceX) return;

    const item = getRandomItem(forceRare);
    const trashEl = document.createElement('div');
    trashEl.className = `trash-node rarity-${item.rarity}`;

    trashEl.style.left = forceX !== null ? forceX + '%' : (Math.random() * 90 + 5) + '%';
    trashEl.style.bottom = forceY !== null ? forceY + '%' : (Math.random() * 35 + 2) + '%';

    trashEl.innerHTML = `
                <div class="trash-glow" style="animation-delay: ${Math.random() * 4}s"></div>
                <div class="text-xl md:text-2xl relative z-10 transition-transform">${item.icon}</div>
            `;
    trashEl.onclick = () => collectTrash(trashEl, item);
    gameArea.appendChild(trashEl);
    state.activeTrash++;

    updateTrashVisibility(currentMouseX, currentMouseY);
}

function spawnCat() {
    const cat = document.createElement('div');
    cat.className = 'absolute text-3xl filter brightness-0 drop-shadow-md z-10 cursor-pointer transition-transform';
    cat.innerText = '🐈‍⬛';

    const startY = Math.random() * 15 + 2;
    cat.style.bottom = `${startY}%`;

    const isRightToLeft = Math.random() > 0.5;
    let currentX = isRightToLeft ? 110 : -10;
    cat.style.transform = isRightToLeft ? 'scaleX(-1)' : 'scaleX(1)';

    gameArea.appendChild(cat);

    let speed = 0.05, isSurprised = false;
    const moveInterval = setInterval(() => {
        if (!state.isRunning) return;
        currentX += isRightToLeft ? -speed : speed;
        cat.style.left = `${currentX}%`;
        if (currentX < -20 || currentX > 120) { clearInterval(moveInterval); cat.remove(); }
    }, 16);

    cat.onclick = () => {
        if (isSurprised) return;
        isSurprised = true;
        speed = 0.8;

        if (typeof sfx !== 'undefined') {
            let cSnd = sfx.cats[Math.floor(Math.random() * sfx.cats.length)];
            cSnd.currentTime = 0;
            cSnd.play().catch(e => { });
        }

        cat.style.transform = (isRightToLeft ? 'scaleX(-1)' : 'scaleX(1)') + ' scaleY(0.8)';
        if (Math.random() < 0.3) {
            spawnTrash(currentX, startY, true);
            sysMsg.innerText = '猫が何かを落としていった...';
        }
    };
}

function collectTrash(element, item) {
    element.style.transform = 'scale(0)';
    element.style.opacity = '0';
    setTimeout(() => { element.remove(); }, 300);
    state.activeTrash--;

    if (!state.foundItems.includes(item.id)) state.foundItems.push(item.id);
    state.score = Math.min(state.maxScore, state.score + 5);

    updateUI();
    checkMemoryUnlock();
    checkAreaUnlock();
    saveGame();
    showReveal(item);
}

function updateUI() {
    scoreBar.style.width = `${(state.score / state.maxScore) * 100}%`;
    scoreText.innerText = `${state.score} / ${state.maxScore}`;
    if ([30, 60, 90].includes(state.score)) updateWeather();
}

function checkMemoryUnlock() {
    STORIES.forEach(story => {
        if (!state.unlockedStories.includes(story.id)) {
            if (story.requiredIds.every(id => state.foundItems.includes(id))) {
                state.unlockedStories.push(story.id);
                state.memoryUnlocked = true;
                document.getElementById('memory-btn').classList.remove('hidden');
                document.getElementById('memory-btn').classList.add('animate-pulse');
                sysMsg.innerText = `物語「${story.title}」が解放された...`;
                saveGame();
            }
        }
    });
}

function checkAreaUnlock() {
    let newlyUnlocked = false;
    AREAS.forEach(area => {
        if (!state.unlockedAreas.includes(area.id) && area.reqUnlockItems.length > 0) {
            if (area.reqUnlockItems.every(id => state.foundItems.includes(id))) {
                state.unlockedAreas.push(area.id);
                newlyUnlocked = true;
                sysMsg.innerText = `新しいエリア「${area.name}」への道が開かれた...`;
            }
        }
    });
    if (newlyUnlocked) {
        const mapBtn = document.getElementById('map-btn');
        if (mapBtn) {
            mapBtn.classList.remove('hidden');
            mapBtn.classList.add('animate-pulse');
        }
    }
}

// --- Modals Controllers ---
const revealModal = document.getElementById('reveal-modal');
const revealContent = document.getElementById('reveal-content');

function showReveal(item, isFromCollection = false) {
    document.getElementById('reveal-icon').innerText = item.icon;
    document.getElementById('reveal-name').innerText = item.name;
    document.getElementById('reveal-desc').innerText = item.desc;

    const rarityEl = document.getElementById('reveal-rarity');
    rarityEl.innerText = item.rarity;
    rarityEl.className = `text-xs font-bold tracking-widest uppercase mb-6 rarity-text-${item.rarity}`;

    document.getElementById('reveal-title-text').innerText = isFromCollection ? "遺失物詳細" : "アイテムを発見しました";
    document.getElementById('reveal-btn').innerText = isFromCollection ? "閉じる" : "鞄にしまう";

    const glowEl = document.getElementById('reveal-glow');
    glowEl.className = 'absolute inset-0 opacity-20 bg-gradient-to-b from-transparent pointer-events-none ' +
        (item.rarity === 'common' ? 'to-white/10' : item.rarity === 'rare' ? 'to-neon-blue/20' :
            item.rarity === 'epic' ? 'to-neon-purple/20' : 'to-neon-gold/20');

    revealModal.classList.remove('hidden');
    setTimeout(() => {
        revealModal.classList.remove('opacity-0');
        revealContent.classList.add('modal-enter-active');
    }, 10);
}

function closeReveal() {
    revealModal.classList.add('opacity-0');
    revealContent.classList.remove('modal-enter-active');
    setTimeout(() => revealModal.classList.add('hidden'), 300);
}

const colModal = document.getElementById('collection-modal');
const colContent = document.getElementById('collection-content');

function toggleCollection() {
    if (colModal.classList.contains('hidden')) {
        renderCollection();
        colModal.classList.remove('hidden');
        setTimeout(() => { colModal.classList.remove('opacity-0'); colContent.classList.add('modal-enter-active'); }, 10);
    } else {
        colModal.classList.add('opacity-0');
        colContent.classList.remove('modal-enter-active');
        setTimeout(() => colModal.classList.add('hidden'), 300);
    }
}

function renderCollection() {
    const grid = document.getElementById('grid-container');
    document.getElementById('collection-count').innerText = state.foundItems.length;
    grid.innerHTML = '';

    ITEMS.forEach(item => {
        const isFound = state.foundItems.includes(item.id);
        const card = document.createElement('div');

        if (isFound) {
            card.className = `glass p-4 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group border border-white/20 hover:border-white/50 transition-colors cursor-pointer bg-black/40`;
            card.onclick = () => showReveal(item, true);
            card.innerHTML = `
                        <div class="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-t from-white to-transparent transition-opacity"></div>
                        <div class="text-4xl mb-3 filter drop-shadow-md">${item.icon}</div>
                        <h3 class="font-serif text-sm font-bold text-white mb-1">${item.name}</h3>
                        <span class="text-[10px] tracking-wider uppercase rarity-text-${item.rarity}">${item.rarity}</span>
                        <div class="absolute inset-0 bg-black/90 backdrop-blur-sm p-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p class="text-xs font-bold tracking-widest text-white font-serif">詳細を見る</p>
                        </div>
                    `;
        } else {
            card.className = `glass p-4 rounded-2xl flex flex-col items-center justify-center text-center opacity-40 border border-white/5 bg-black/20`;
            card.innerHTML = `
                        <div class="text-4xl mb-3 filter grayscale blur-[2px]">❓</div>
                        <h3 class="font-serif text-sm text-gray-500 mb-1">未発見</h3>
                        <span class="text-[10px] tracking-wider uppercase text-gray-600">Unknown</span>
                    `;
        }
        grid.appendChild(card);
    });
}

const memModal = document.getElementById('memory-modal');
const memContent = document.getElementById('memory-content');
const storyListModal = document.getElementById('story-list-modal');
const storyListContent = document.getElementById('story-list-content');

function toggleStoryList() {
    if (storyListModal.classList.contains('hidden')) {
        renderStoryList();
        storyListModal.classList.remove('hidden');
        setTimeout(() => { storyListModal.classList.remove('opacity-0'); storyListContent.classList.add('modal-enter-active'); }, 10);
    } else {
        storyListModal.classList.add('opacity-0');
        storyListContent.classList.remove('modal-enter-active');
        setTimeout(() => storyListModal.classList.add('hidden'), 300);
    }
}

function renderStoryList() {
    const container = document.getElementById('story-list-container');
    document.getElementById('story-count').innerText = state.unlockedStories.length;
    container.innerHTML = '';

    STORIES.forEach(story => {
        const isUnlocked = state.unlockedStories.includes(story.id);
        const el = document.createElement('div');
        el.className = `glass p-6 rounded-2xl mb-4 transition-all ${isUnlocked ? 'cursor-pointer hover:bg-white/10 border-white/20 border' : 'opacity-40 grayscale border-white/5 border'}`;

        if (isUnlocked) {
            el.onclick = () => {
                toggleStoryList();
                setTimeout(() => openMemory(story), 350);
            };
            el.innerHTML = `
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="font-serif text-lg text-white">${story.title}</h3>
                                <p class="text-xs text-neon-purple mt-1">記憶を読み解く</p>
                            </div>
                            <i data-lucide="chevron-right" class="text-neon-purple"></i>
                        </div>
                    `;
        } else {
            const requiredItems = story.requiredIds.map(id => {
                const it = ITEMS.find(i => i.id === id);
                return state.foundItems.includes(id) ? it.icon : '❓';
            }).join(' ');
            el.innerHTML = `
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="font-serif text-lg text-gray-500">？？？？</h3>
                                <p class="text-xs text-gray-600 mt-2">必要アイテム: ${requiredItems}</p>
                            </div>
                            <i data-lucide="lock" class="text-gray-600 w-5 h-5"></i>
                        </div>
                    `;
        }
        container.appendChild(el);
    });
    lucide.createIcons();
}

const mapModal = document.getElementById('map-modal');
const mapContent = document.getElementById('map-content');

function toggleMap() {
    if (!mapModal) return;
    if (mapModal.classList.contains('hidden')) {
        renderMapList();
        mapModal.classList.remove('hidden');
        setTimeout(() => { mapModal.classList.remove('opacity-0'); mapContent.classList.add('modal-enter-active'); }, 10);
        const mapBtn = document.getElementById('map-btn');
        if (mapBtn) mapBtn.classList.remove('animate-pulse');
    } else {
        mapModal.classList.add('opacity-0');
        mapContent.classList.remove('modal-enter-active');
        setTimeout(() => mapModal.classList.add('hidden'), 300);
    }
}

function renderMapList() {
    const container = document.getElementById('map-list');
    if (!container) return;
    container.innerHTML = '';

    AREAS.forEach(area => {
        const isUnlocked = state.unlockedAreas.includes(area.id);
        const isCurrent = state.currentArea === area.id;
        const el = document.createElement('div');
        el.className = `glass p-6 rounded-2xl transition-all ${isCurrent ? 'border-neon-blue border-2 bg-neon-blue/10' : (isUnlocked ? 'cursor-pointer hover:bg-white/10 border-white/20 border' : 'opacity-40 grayscale border-white/5 border')}`;

        // Add margins
        el.style.marginBottom = "1rem";

        if (isUnlocked) {
            if (!isCurrent) {
                el.onclick = () => {
                    changeArea(area.id);
                };
            }
            el.innerHTML = `
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="font-serif text-lg text-white">${area.name}</h3>
                                ${isCurrent ? '<p class="text-xs text-neon-blue mt-1">現在地</p>' : '<p class="text-xs text-gray-400 mt-1">移動する</p>'}
                            </div>
                            ${isCurrent ? '<i data-lucide="map-pin" class="text-neon-blue"></i>' : '<i data-lucide="chevron-right" class="text-gray-400"></i>'}
                        </div>
                    `;
        } else {
            el.innerHTML = `
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="font-serif text-lg text-gray-500">？？？？</h3>
                                <p class="text-xs text-gray-600 mt-2">前のエリアをコンプリートすると解放</p>
                            </div>
                            <i data-lucide="lock" class="text-gray-600 w-5 h-5"></i>
                        </div>
                    `;
        }
        container.appendChild(el);
    });
    lucide.createIcons();
}

function changeArea(areaId) {
    state.currentArea = areaId;
    saveGame();

    // Re-render UI and clean active trashes
    const elements = document.querySelectorAll('.trash-node');
    elements.forEach(el => el.remove());
    state.activeTrash = 0;

    toggleMap();
    sysMsg.innerText = `「${AREAS.find(a => a.id === areaId).name}」に移動した...`;
}

function toggleMemory() {
    toggleStoryList();
}

function openMemory(story) {
    document.getElementById('memory-title').innerText = story.title;
    document.getElementById('memory-text').innerText = story.text;
    memModal.classList.remove('hidden');
    setTimeout(() => { memModal.classList.remove('opacity-0'); memContent.classList.add('modal-enter-active'); }, 10);
    document.getElementById('memory-btn').classList.remove('animate-pulse');
}

function closeMemory() {
    memModal.classList.add('opacity-0');
    memContent.classList.remove('modal-enter-active');
    setTimeout(() => {
        memModal.classList.add('hidden');
        toggleStoryList();
    }, 500);
}

// 再定義したcloseボタン用にHTMLを一部書き換え、またはJSで制御
document.querySelector('#memory-modal button').onclick = closeMemory;

// --- Init ---
updateTimeOfDay();
generateScenery();
setRain(0);
loadGame();
renderFlashlight(currentMouseX, currentMouseY);
lucide.createIcons();