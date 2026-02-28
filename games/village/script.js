const DEFAULTS = {
    name: '名もなき村',
    wood: 20, stone: 10, food: 30, iron: 0, crystal: 0, gold: 0,
    level: 1, buildCount: 0, popMax: 0,
    villagers: [],
    buildings: [],
    research: { gather: 0, combat: 0 },
    upgrades: { merchant_discount: 0, yield_boost: 0 },
    happiness: 100,
    time: 0,
    biome: 'forest',
    expeditionEnd: null,
    merchantActive: false,
    merchantCooldown: 30,
    hasStation: false,
    agentRules: {},
    collections: []
};

let state = { ...DEFAULTS };
let savedVillages = JSON.parse(localStorage.getItem('v-evolve-villages') || '[]');
let currentConstruction = null;

const config = {
    weather: [
        { id: 'sunny', name: '晴れ', icon: '☀️', wood: 1, food: 1, move: 1 },
        { id: 'rain', name: '雨', icon: '🌧️', wood: 0.7, food: 1.5, move: 0.8 },
        { id: 'storm', name: '嵐', icon: '⛈️', wood: 0.5, food: 1.0, move: 0.5 },
        { id: 'snow', name: '雪', icon: '❄️', wood: 0.6, food: 0.5, move: 0.4 }
    ],
    buildings: [
        { id: 'tent', name: 'ログテント', wood: 10, stone: 0, pop: 1, icon: '⛺', desc: '人口上限+1' },
        { id: 'farm', name: '農園', wood: 30, stone: 10, icon: '🌾', desc: '農家が働ける' },
        { id: 'mine', name: '深層採掘場', wood: 80, stone: 100, icon: '⛏️', desc: '石工が鉄や宝石を掘る' },
        { id: 'fountain', name: '石の噴水', wood: 0, stone: 150, iron: 10, happy: 20, icon: '⛲', desc: '幸福度の上限UP' },
        { id: 'barracks', name: '兵舎', wood: 150, stone: 150, icon: '💂', desc: '兵士の拠点 (要石材)' },
        { id: 'forge', name: '鍛冶屋', wood: 200, iron: 50, icon: '⚒️', desc: '兵装強化' },
        { id: 'market', name: '市場', wood: 120, stone: 80, icon: '⚖', trade: true, desc: '資源を換金できる' },
        { id: 'station', name: 'トロッコ駅', wood: 500, stone: 500, iron: 200, reqLevel: 10, icon: '🛤️', desc: '新たな村へ移動可能になる' }
    ],
    jobs: [
        { id: 'wood', name: '木こり', emoji: '🪓' },
        { id: 'stone', name: '石工', emoji: '⛏️' },
        { id: 'farmer', name: '農家', emoji: '🧺' },
        { id: 'soldier', name: '兵士', emoji: '⚔️' },
        { id: 'carpenter', name: '大工', emoji: '🔨' }
    ],
    names: {
        male: ["ボブ", "デビッド", "ジャック", "ヘンリー", "マイロ", "ジョン", "ケン"],
        female: ["アリス", "エマ", "リリー", "オリビア", "サーラ", "メアリー", "ジェーン"]
    },
    traits: [
        { name: "勤勉", bonus: "speed", desc: "採取ペース+30%", value: 1.3 },
        { name: "強欲", bonus: "lucky", desc: "たまに獲得量3倍", value: 3.0 },
        { name: "力持ち", bonus: "power", desc: "基礎獲得量+1", value: 1.0 },
        { name: "神速", bonus: "move", desc: "移動が速い", value: 1.0 },
        { name: "守護神", bonus: "defend", desc: "村の防衛力UP", value: 10.0 },
        { name: "リーダーシップ", bonus: "agent", desc: "代理人を設定できる", value: 1.0 }
    ],
    merchantItems: [
        { id: 'merchant_discount', name: '交渉術の指南書', desc: '商人からの購入価格 -10%', cost: 200, icon: '📜' },
        { id: 'yield_boost', name: '祝福の種', desc: '全ての資源産出量 +10%', cost: 350, icon: '🌱' },
    ],
    collections: [
        { id: "c1", name: "古代の石版", icon: "🪨", desc: "かつてこの地に存在した古代文明の記録が刻まれている不気味な石版。" },
        { id: "c2", name: "錆びた剣", icon: "🗡️", desc: "血の匂いが染み付いた、使い古された剣。過去の英雄の遺物かもしれない。" },
        { id: "c3", name: "輝く水晶", icon: "🔮", desc: "暗闇でも淡く光り続ける不思議な水晶。微かな魔力を感じる。" },
        { id: "c4", name: "精霊の涙", icon: "💧", desc: "森に住む精霊が流したとされる美しく透き通った涙の結晶。" },
        { id: "c5", name: "竜の鱗", icon: "🐉", desc: "恐るべき竜の体表を覆っていたとされる硬くて熱を帯びた鱗。" },
        { id: "c6", name: "森の妖精の羽", icon: "🦋", desc: "とても脆くて美しい、森に住まうとされる妖精の羽。" },
        { id: "c7", name: "黄金の林檎", icon: "🍎", desc: "一口かじれば寿命が延びるという伝説がある、純金のような林檎。" },
        { id: "c8", name: "古のコイン", icon: "🪙", desc: "現在の市場では使えない、見知らぬ王の横顔が彫られた硬貨。" },
        { id: "c9", name: "魔法のランプ", icon: "🪔", desc: "こすると魔神が出てきそうな雰囲気を持つ、古めかしいランプ。" },
        { id: "c10", name: "不死鳥の灰", icon: "🔥", desc: "何度でも蘇るとされる不死鳥が燃え尽きた後に残るという神奇な灰。" },
        { id: "c11", name: "月の雫", icon: "🌙", desc: "月明かりをそのまま固めたかのように輝く、神秘的な雫型の石。" },
        { id: "c12", name: "太陽の紋章", icon: "☀️", desc: "大昔に太陽神を崇めた人々が作っていたとされる黄金の紋章。" },
        { id: "c13", name: "星くずの砂", icon: "✨", desc: "空から降ってきたとされる、チカチカと輝く不思議な砂の集まり。" },
        { id: "c14", name: "人魚の真珠", icon: "🦪", desc: "海からやってきた人魚が流す涙は、美しい真珠になると言われている。" },
        { id: "c15", name: "巨人の指輪", icon: "💍", desc: "人間では腕輪にしか見えないほど巨大なサイズの指輪。" },
        { id: "c16", name: "悪魔の角", icon: "👿", desc: "邪悪なオーラを放つ黒い角。持っているだけで不吉な予感がする。" },
        { id: "c17", name: "天使の羽根", icon: "👼", desc: "純白で触れると心が休まる、天空からの使者の羽根。" },
        { id: "c18", name: "エルフの弓", icon: "🏹", desc: "森の民によって作られた、美しい装飾が施されたしなやかな弓。" },
        { id: "c19", name: "ドワーフのハンマー", icon: "🔨", desc: "小人が使っていたとは思えないほど重く、頑丈で実用的なハンマー。" },
        { id: "c20", name: "ゴブリンの牙", icon: "👹", desc: "醜い小鬼の牙。あまり良い匂いはしないが一部の呪術で使われる。" },
        { id: "c21", name: "オークの斧", icon: "🪓", desc: "乱暴な豚の獣人が使っていたとされる武骨で巨大な斧。" },
        { id: "c22", name: "スライムの核", icon: "🦠", desc: "プルプルした生き物の中心にあった、ゼリー状の冷たい核。" },
        { id: "c23", name: "ヴァンパイアの牙", icon: "🦇", desc: "血を吸うために鋭く尖った、吸血鬼の恐ろしい牙。" },
        { id: "c24", name: "狼男の毛皮", icon: "🐺", desc: "満月の夜にのみ姿を現すとされる獣人の、荒々しい毛皮。" },
        { id: "c25", name: "ミノタウロスの蹄", icon: "🐂", desc: "迷宮を彷徨う牛頭の怪物の、大地をえぐる強靭な蹄。" },
        { id: "c26", name: "ペガサスの蹄鉄", icon: "☁️", desc: "空を駆ける天馬の足につけられていたとされる、非常に軽い蹄鉄。" },
        { id: "c27", name: "ユニコーンの角", icon: "🦄", desc: "あらゆる毒を浄化する力があると信じられている、純白の一角獣の角。" },
        { id: "c28", name: "ドラゴンの牙", icon: "🔥", desc: "どんな鎧も貫くという、巨大な飛竜の鋭い牙。" },
        { id: "c29", name: "キメラの尾", icon: "🐍", desc: "複数の生物が混ざり合った怪物の、蛇の形をした不気味な尻尾。" },
        { id: "c30", name: "ケルベロスの骨", icon: "🦴", desc: "地獄の番犬と呼ばれた三つ首の魔犬の、黒く焦げた骨。" },
        { id: "c31", name: "ゴーレムの核", icon: "🪨", desc: "泥や石の巨人を動かしていたとされる、呪文が刻まれた魔石。" },
        { id: "c32", name: "ガーゴイルの欠片", icon: "🗿", desc: "動き出す石像の一部。魔除けの効果があるとかないとか。" },
        { id: "c33", name: "バジリスクの眼", icon: "👁️", desc: "見たものを石に変えるという魔物からえぐり出された、不気味な眼球。" },
        { id: "c34", name: "メデューサの髪", icon: "🐍", desc: "髪の毛の代わりにうごめく蛇。切り落とされても微かに動いている。" },
        { id: "c35", name: "クラーケンの墨", icon: "🦑", desc: "海賊も恐れる巨大イカが吐き出した、絶対に消えない真っ黒な墨。" },
        { id: "c36", name: "リヴァイアサンの鱗", icon: "🌊", desc: "海を支配する巨大な幻獣の、青く輝く大きな鱗。" },
        { id: "c37", name: "ベヒーモスの角", icon: "🦏", desc: "大地を揺るがす巨大な獣の、突き上げるような太い角。" },
        { id: "c38", name: "フェンリルの牙", icon: "❄️", desc: "神々をも喰らうとされる巨大狼の、冷気を纏った鋭い牙。" },
        { id: "c39", name: "ヨルムンガンドの鱗", icon: "🐍", desc: "世界を取り巻くほど巨大な大蛇の、不気味な色をした鱗。" },
        { id: "c40", name: "スレイプニルの蹄", icon: "🐎", desc: "八本足を持つとされる、神の乗用馬の蹄。" },
        { id: "c41", name: "ユグドラシルの枝", icon: "🌳", desc: "世界を支える巨大な世界樹から折れたとされる、生命力に溢れる枝。" },
        { id: "c42", name: "ミョルニルの破片", icon: "⚡", desc: "雷神が振るったとされる無敵の槌の、帯電している破片。" },
        { id: "c43", name: "グングニルの穂先", icon: "🎯", desc: "決して的を外さないと言われる神の槍の、鋭く尖った先端部分。" },
        { id: "c44", name: "エクスカリバーの欠片", icon: "🗡️", desc: "聖剣が砕けた際に飛び散ったとされる、高貴な光を放つ欠片。" },
        { id: "c45", name: "アヴァロンの土", icon: "🌱", desc: "妖精が住むという理想郷の、豊穣な魔力を秘めた土。" },
        { id: "c46", name: "聖杯の欠片", icon: "🍷", desc: "あらゆる願いを叶えるとされる奇跡の杯の、美しい破片。" },
        { id: "c47", name: "賢者の石の欠片", icon: "🔴", desc: "あらゆる金属を金に変え、不老不死をもたらす石の微小な欠片。" },
        { id: "c48", name: "パンドラの箱の欠片", icon: "📦", desc: "あらゆる災厄が飛び出したとされる箱の、呪われた木片。" },
        { id: "c49", name: "イージスの盾の破片", icon: "🛡️", desc: "いかなる攻撃も防ぐとされる神の盾の、非常に硬い破片。" },
        { id: "c50", name: "神の息吹", icon: "🌬️", desc: "世界を創り出した神々の力が微かに残る、不思議な風を封じ込めた瓶。" }
    ]
};

let currentTab = 'build';
let weather = config.weather[0];
let pendingTraveler = null;
let enemy = { active: false, hp: 0, max: 0 };
let merchantEntity = null;

let bgmAudio = null;
let isBgmMuted = false;

function initBGM() {
    if (!bgmAudio) {
        bgmAudio = new Audio('../../assets/musics/village/bgm.mp3');
        bgmAudio.loop = true;
        bgmAudio.volume = 0.4;
    }
}

function playVillageBGM() {
    initBGM();
    if (!isBgmMuted && bgmAudio.paused) {
        bgmAudio.play().catch(e => console.log('BGM play failed:', e));
    }
}

function toggleVillageBGM() {
    initBGM();
    isBgmMuted = !isBgmMuted;
    bgmAudio.muted = isBgmMuted;
    document.getElementById('soundToggleBtn').innerText = isBgmMuted ? '🔇' : '🔊';
    if (!isBgmMuted) {
        playVillageBGM();
    }
}


// --- Core ---
function startGame(biome) {
    state = JSON.parse(JSON.stringify(DEFAULTS));
    state.biome = biome;
    const nameInput = document.getElementById('villageNameInput').value.trim();
    if (nameInput) state.name = nameInput;
    document.getElementById('titleScreen').style.display = 'none';
    document.getElementById('villageMain').className = `w-full h-[55%] md:w-2/3 md:h-full village-area relative overflow-hidden flex-shrink-0 biome-${biome}`;
    init();
    log(`「${state.name}」が始まりました。`, '☀️');
}

function loadGame() {
    const saved = localStorage.getItem('v-evolve-save');
    if (saved) {
        state = JSON.parse(saved);
        // 後から追加されたステータスの補完
        if (!state.upgrades) state.upgrades = { merchant_discount: 0, yield_boost: 0 };
        if (state.merchantCooldown === undefined) state.merchantCooldown = 30;
        if (!state.collections) state.collections = [];

        document.getElementById('titleScreen').style.display = 'none';
        document.getElementById('villageMain').className = `w-full h-[55%] md:w-2/3 md:h-full village-area relative overflow-hidden flex-shrink-0 biome-${state.biome}`;
        init();
        log("データをロードしました。");
    }
}

function init() {
    updateUI();
    renderEverything();
    startLoops();
    playVillageBGM();
}

function saveGame() {
    localStorage.setItem('v-evolve-save', JSON.stringify(state));
    localStorage.setItem('v-evolve-villages', JSON.stringify(savedVillages));
}

// --- UI & Rendering ---
function renderEverything() {
    const bCont = document.getElementById('buildingsContainer');
    bCont.innerHTML = '';
    state.buildings.forEach(b => {
        const el = document.createElement('div');
        el.className = 'absolute text-7xl filter drop-shadow-md ' + (b.id === 'market' ? 'building-market' : '');
        el.style.left = b.x + '%'; el.style.top = b.y + '%';
        el.innerHTML = b.icon;
        bCont.appendChild(el);
    });

    const vCont = document.getElementById('villagersContainer');
    vCont.innerHTML = '';


    // 商人の再描画
    if (state.merchantActive) {
        const el = document.createElement('div');
        el.id = 'merchant';
        el.className = 'merchant-entity';
        el.innerHTML = '👳‍♂️';
        el.style.right = '5%';
        el.style.top = '60%';
        el.onclick = () => { openMerchantModal(); };
        vCont.appendChild(el);
    }

    // 待ち状態の訪問者の再描画
    if (pendingTraveler) {
        const el = document.createElement('div');
        el.id = `traveler-${pendingTraveler.id}`;
        el.className = 'villager-entity';
        el.innerHTML = pendingTraveler.emoji;
        el.style.left = '45%';
        el.style.top = '55%';
        el.onclick = (e) => {
            e.stopPropagation();
            if (state.villagers.length < getPopMax()) acceptTraveler();
            else log("警告: 家に空きがありません。");
        };
        vCont.appendChild(el);
    }
}

const getPopMax = () => state.popMax + (state.upgrades.pop_boost ? state.upgrades.pop_boost * 5 : 0);

function updateUI() {
    const popMax = getPopMax();
    const elements = {
        'resWood': Math.floor(state.wood),
        'resStone': Math.floor(state.stone),
        'resFood': Math.floor(state.food),
        'resIron': Math.floor(state.iron),
        'resCrystal': Math.floor(state.crystal),
        'resGold': Math.floor(state.gold),
        'uiLevel': `${state.level} - ${state.name}`,
        'popNow': state.villagers.length,
        'popMax': popMax,
        'uiHappy': Math.floor(state.happiness) + '%',
        'uiWeatherIcon': weather.icon,
        'uiWeatherText': weather.name
    };

    for (const [id, val] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    checkLevelUp();

    renderBuildList();
    renderVillagerList();
    renderResearchList();
    renderAlchemy();
    renderMarket();
    updateExpeditionUI();
    renderCollections();

    const banner = document.getElementById('travelerBanner');
    if (banner && !banner.classList.contains('hidden')) {
        const acceptBtn = banner.querySelector('button[onclick="acceptTraveler()"]');
        if (acceptBtn) {
            const isFull = state.villagers.length >= popMax;
            acceptBtn.disabled = isFull;
            acceptBtn.style.opacity = isFull ? '0.5' : '1';
            acceptBtn.style.cursor = isFull ? 'not-allowed' : 'pointer';
        }
    }

    const hasFarm = state.buildings.some(b => b.id === 'farm');
    const nodeFood = document.getElementById('nodeFood');
    if (nodeFood) nodeFood.classList.toggle('hidden', !hasFarm);

    const hasMine = state.buildings.some(b => b.id === 'mine');
    const nodeIron = document.getElementById('nodeIron');
    if (nodeIron) nodeIron.classList.toggle('hidden', !hasMine);

    const saved = localStorage.getItem('v-evolve-save');
    const loadBtn = document.getElementById('loadBtn');
    if (saved && loadBtn) loadBtn.classList.remove('hidden');

    const hasAgent = state.villagers.some(v => v.trait && v.trait.bonus === 'agent');
    const tabAgent = document.getElementById('tab-agent');
    if (tabAgent) tabAgent.classList.toggle('hidden', !hasAgent);

    if (state.hasStation) {
        document.getElementById('tab-villages').classList.remove('hidden');
    }

}

function tab(t) {
    currentTab = t;
    ['build', 'villagers', 'extra', 'research', 'market', 'agent', 'villages'].forEach(x => {
        const pane = document.getElementById(`pane${x.charAt(0).toUpperCase() + x.slice(1)}`);
        const tabBtn = document.getElementById(`tab-${x}`);
        if (pane) pane.classList.toggle('hidden', x !== t);
        if (tabBtn) tabBtn.className = `shrink-0 px-4 py-4 ${x === t ? 'tab-active' : 'text-slate-400'} ${x === 'villages' ? 'border-l-2 border-slate-200' : ''}`;
    });
    if (t === 'agent') renderAgent();
    if (t === 'villages') renderVillages();
}

// --- Logic Loops ---
function startLoops() {
    setInterval(() => {
        state.time++;
        const isNight = state.time % 120 >= 60;
        document.getElementById('villageMain').classList.toggle('night-mode', isNight);

        updateWeather();
        if (!enemy.active) processProduction();
        if (state.time % 10 === 0) saveGame();

        // 訪問者の頻度を低下
        if (state.time % 40 === 0 && !pendingTraveler && Math.random() < 0.5) spawnTraveler();

        // 敵の出現（夜は確率UP）
        if (state.time % 60 === 0 && Math.random() < (isNight ? 0.6 : 0.2)) spawnEnemy();

        // 代理人の自動処理
        if (state.time % 5 === 0) applyAgentRules();

        // 商人の出現ロジック
        if (!state.merchantActive) {
            state.merchantCooldown--;
            if (state.merchantCooldown <= 0 && Math.random() < 0.1) {
                spawnMerchant();
            }
        } else {
            // 商人がいるとき、帰還タイマーを自分で管理するか、setTimeoutで管理するか
            // 既にsetTimeoutで管理しているのでここはスルーでも可
        }

        updateUI();
    }, 1000);
}

function processProduction() {
    const foodPenalty = state.food <= 0 ? 0.3 : 1.0;
    const weatherMult = weather;
    const biomeMult = {
        wood: state.biome === 'forest' ? 1.2 : 1.0,
        stone: state.biome === 'mountain' ? 1.2 : 1.0,
        gold: state.biome === 'desert' ? 1.3 : 1.0,
        food: state.biome === 'desert' ? 0.8 : 1.0
    };
    const upgradeMult = 1 + (state.upgrades.yield_boost || 0) * 0.1;

    state.villagers.forEach(v => {
        state.food -= (v.job === 'soldier' ? 1.5 : 1.0);
        let gain = 1.0 * foodPenalty * (1 + state.research.gather * 0.2) * upgradeMult;

        if (v.trait) {
            if (v.trait.bonus === 'speed') gain *= v.trait.value;
            if (v.trait.bonus === 'lucky' && Math.random() < 0.2) gain *= v.trait.value;
        }

        if (v.job === 'wood') {
            let wGain = gain * weatherMult.wood * biomeMult.wood;
            if (v.trait && v.trait.bonus === 'power') wGain += v.trait.value;
            state.wood += wGain;
        }
        if (v.job === 'stone') {
            let sGain = gain * biomeMult.stone;
            if (v.trait && v.trait.bonus === 'power') sGain += v.trait.value;
            state.stone += sGain;
        }
        if (v.job === 'farmer') state.food += gain * weatherMult.food * biomeMult.food * 2.5;

        if (v.job === 'stone' && state.buildings.some(b => b.id === 'mine')) {
            if (Math.random() < (state.biome === 'mountain' ? 0.05 : 0.02)) state.iron += 1;
            if (Math.random() < 0.01) state.crystal += 1;
        }

        if (v.job === 'carpenter' && currentConstruction) {
            currentConstruction.progress += (gain * 0.5);
            if (currentConstruction.progress >= currentConstruction.max) {
                finishConstruction();
            } else {
                renderConstruction();
            }
        }
    });

    let targetHappy = (state.food > 0 ? 100 : 30);
    state.buildings.forEach(b => { if (b.happy) targetHappy += b.happy; });
    state.happiness += (targetHappy - state.happiness) * 0.1;

    if (state.food < 0) state.food = 0;
}

function updateWeather() {
    if (state.time % 45 === 0) {
        weather = config.weather[Math.floor(Math.random() * config.weather.length)];
        updateWeatherVisuals();
        log(`天候が「${weather.name}」に変わりました。`);
    }
}

function updateWeatherVisuals() {
    const container = document.getElementById('weatherOverlay');
    if (!container) return;
    container.innerHTML = '';
    if (weather.id === 'rain' || weather.id === 'storm') {
        for (let i = 0; i < 50; i++) {
            const d = document.createElement('div');
            d.className = 'rain-drop';
            d.style.left = Math.random() * 100 + '%';
            d.style.animationDuration = (0.5 + Math.random()) + 's';
            d.style.animationDelay = Math.random() + 's';
            container.appendChild(d);
        }
    } else if (weather.id === 'snow') {
        for (let i = 0; i < 30; i++) {
            const s = document.createElement('div');
            s.className = 'snow-flake';
            s.style.left = Math.random() * 100 + '%';
            s.style.animationDuration = (3 + Math.random() * 5) + 's';
            s.style.animationDelay = Math.random() + 's';
            container.appendChild(s);
        }
    }
}

// --- Village Actions ---
function collect(type, e) {
    let amt = 1;
    if (type === 'wood' && state.biome === 'forest') amt = 1.2;
    state[type] += amt;
    showFloatingText(e.clientX, e.clientY, `+${amt}`, 'text-slate-800');
    updateUI();
}

function build(id) {
    if (currentConstruction) { log("すでに建築中です", "⚠️"); return; }
    const b = config.buildings.find(x => x.id === id);
    if (b.reqLevel && state.level < b.reqLevel) { log(`レベル${b.reqLevel}が必要です`, "⚠️"); return; }

    if (state.wood >= (b.wood || 0) && state.stone >= (b.stone || 0) && state.iron >= (b.iron || 0)) {
        state.wood -= (b.wood || 0); state.stone -= (b.stone || 0); state.iron -= (b.iron || 0);

        const reqProgress = 10 + Math.floor((b.wood || 0) / 10) + Math.floor((b.stone || 0) / 10) + Math.floor((b.iron || 0) / 5);
        currentConstruction = { b: { ...b }, progress: 0, max: reqProgress };
        log(`${b.name}の建築を開始しました。アイコンを連打するか、大工を配置してください。`, '🏗️');
        renderConstruction();
        updateUI();
    }
}

function clickConstruction() {
    if (!currentConstruction) return;
    currentConstruction.progress += 1;
    if (currentConstruction.progress >= currentConstruction.max) {
        finishConstruction();
    } else {
        renderConstruction();
    }
}

function finishConstruction() {
    if (!currentConstruction) return;
    const b = currentConstruction.b;
    const x = 10 + Math.random() * 80;
    const y = 75 + Math.random() * 15;
    b.x = x; b.y = y;
    state.buildings.push(b);
    if (b.pop) state.popMax += b.pop;
    state.buildCount++;
    log(`${b.name}の建築が完了しました！`, '🔨');
    currentConstruction = null;

    if (b.id === 'station') {
        state.hasStation = true;
        log("トロッコ駅が完成し、新たな村へ移動可能になりました！", '🛤️');
    }

    renderConstruction();
    renderEverything();
    updateUI();
}

function renderConstruction() {
    const cont = document.getElementById('constructionContainer');
    if (!cont) return;
    if (!currentConstruction) {
        cont.classList.add('hidden');
        return;
    }
    cont.classList.remove('hidden');
    cont.innerHTML = `
        <div class="glass p-4 rounded-3xl flex flex-col items-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-2xl" onclick="clickConstruction()">
            <div class="text-6xl mb-2 filter drop-shadow animate-pulse">${currentConstruction.b.icon}</div>
            <div class="w-24 bg-slate-200 h-3 rounded-full overflow-hidden border border-slate-300">
                <div class="bg-emerald-500 h-full transition-all" style="width: ${(currentConstruction.progress / currentConstruction.max * 100)}%"></div>
            </div>
            <div class="text-[10px] font-black mt-2 bg-slate-800 text-white px-3 py-1 rounded-full uppercase">建築中 ${Math.floor(currentConstruction.progress)}/${currentConstruction.max}</div>
        </div>
    `;
}

function checkLevelUp() {
    const cost = state.level * 100;
    const reqBuildCount = state.level * 3;
    const btn = document.getElementById('levelUpBtn');
    if (!btn) return;

    if (state.buildCount >= reqBuildCount) {
        btn.classList.remove('hidden');
        btn.textContent = `⇧ 村をレベル${state.level + 1}にアップ (🌲${cost} 🪨${cost})`;
        if (state.wood >= cost && state.stone >= cost) {
            btn.className = "mt-2 w-full glass p-2 rounded-xl text-xs font-black shadow-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 cursor-pointer transition-colors";
            btn.disabled = false;
        } else {
            btn.className = "mt-2 w-full glass p-2 rounded-xl text-xs font-black shadow-lg text-slate-400 bg-slate-50 opacity-60 cursor-not-allowed";
            btn.disabled = true;
        }
    } else {
        btn.classList.add('hidden');
    }
}

function levelUpVillage() {
    const cost = state.level * 100;
    const reqBuildCount = state.level * 3;
    if (state.buildCount >= reqBuildCount && state.wood >= cost && state.stone >= cost) {
        state.wood -= cost;
        state.stone -= cost;
        state.level++;
        updateUI();
        log(`村がレベル${state.level}になりました！`, '🎉');
    }
}

function spawnTraveler() {
    if (pendingTraveler) return;
    const isMale = Math.random() > 0.5;
    const data = isMale ? config.names.male : config.names.female;

    pendingTraveler = {
        id: Date.now(),
        name: data[Math.floor(Math.random() * data.length)],
        emoji: isMale ? "👦" : "👧",
        trait: config.traits[Math.floor(Math.random() * config.traits.length)],
        job: 'wood'
    };

    const entity = document.createElement('div');
    entity.id = `traveler-${pendingTraveler.id}`;
    entity.className = 'villager-entity';
    entity.innerHTML = pendingTraveler.emoji;
    entity.style.left = '-10%';
    entity.style.top = '50%';

    entity.onclick = (e) => {
        e.stopPropagation();
        if (state.villagers.length < getPopMax()) {
            acceptTraveler();
        } else {
            log("警告: 家に空きがありません。");
        }
    };

    const vCont = document.getElementById('villagersContainer');
    if (vCont) vCont.appendChild(entity);

    setTimeout(() => { if (entity) { entity.style.left = '45%'; entity.style.top = '55%'; } }, 100);

    const banner = document.getElementById('travelerBanner');
    if (banner) banner.classList.remove('hidden');
    document.getElementById('travelerEmoji').textContent = pendingTraveler.emoji;
    document.getElementById('travelerName').textContent = pendingTraveler.name;
    document.getElementById('travelerTrait').textContent = pendingTraveler.trait.name + " (" + pendingTraveler.trait.desc + ")";
    log(`訪問者 ${pendingTraveler.name} が村にやってきました。`);
}

function acceptTraveler() {
    const popMax = getPopMax();
    if (state.villagers.length < popMax && pendingTraveler) {
        state.villagers.push(pendingTraveler);

        const entity = document.getElementById(`traveler-${pendingTraveler.id}`);
        if (entity) {
            entity.style.opacity = '0';
            setTimeout(() => entity.remove(), 500);
        }

        log(`${pendingTraveler.name} が仲間に加わりました！`);
        pendingTraveler = null;
        const banner = document.getElementById('travelerBanner');
        if (banner) banner.classList.add('hidden');
        updateUI();
    } else if (pendingTraveler) {
        log("警告: 家に空きがありません。");
    }
}

function rejectTraveler() {
    if (pendingTraveler) {
        const entity = document.getElementById(`traveler-${pendingTraveler.id}`);
        if (entity) {
            entity.style.left = '-10%';
            setTimeout(() => entity.remove(), 1200);
        }
    }
    pendingTraveler = null;
    const banner = document.getElementById('travelerBanner');
    if (banner) banner.classList.add('hidden');
    updateUI();
}



// --- Expeditions ---
function startExpedition() {
    const soldiers = state.villagers.filter(v => v.job === 'soldier' && !v.onExpedition);
    if (soldiers.length === 0) { log("待機中の兵士がいません。", '⚠️'); return; }

    soldiers.forEach(s => s.onExpedition = true);
    state.expeditionEnd = Date.now() + (3 * 60 * 1000); // 3分
    log("遠征隊が出発しました。", '⚔️');
    renderEverything();
    updateUI();
}

function updateExpeditionUI() {
    const view = document.getElementById('expeditionView');
    if (!view) return;
    if (state.expeditionEnd && Date.now() < state.expeditionEnd) {
        document.getElementById('expeditionStatus').classList.add('hidden');
        document.getElementById('expeditionTimer').classList.remove('hidden');
        const diff = state.expeditionEnd - Date.now();
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        document.getElementById('expCountdown').textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    } else if (state.expeditionEnd) {
        completeExpedition();
    } else {
        document.getElementById('expeditionStatus').classList.remove('hidden');
        document.getElementById('expeditionTimer').classList.add('hidden');
        const hasSoldiers = state.villagers.some(v => v.job === 'soldier' && !v.onExpedition);
        const startBtn = document.getElementById('expStartBtn');
        if (startBtn) startBtn.disabled = !hasSoldiers;
    }
}

function completeExpedition() {
    state.expeditionEnd = null;
    let soldierCount = 0;
    state.villagers.forEach(v => {
        if (v.job === 'soldier' && v.onExpedition) {
            v.onExpedition = false;
            soldierCount++;
        }
    });
    if (soldierCount === 0) soldierCount = 1;

    // Randomness based on soldier count
    const r = () => 0.5 + Math.random();
    const wood = Math.floor(100 * soldierCount * r());
    const stone = Math.floor(100 * soldierCount * r());
    const gold = Math.floor(20 * soldierCount * r());

    state.wood += wood; state.stone += stone; state.gold += gold;

    // Collection logic (50% chance, no duplicates)
    let foundColText = '';
    if (Math.random() < 0.5 && state.collections.length < config.collections.length) {
        // state.collectionsにはID文字列のみ保存する
        const unowned = config.collections.filter(c => !state.collections.includes(c.id));
        if (unowned.length > 0) {
            const found = unowned[Math.floor(Math.random() * unowned.length)];
            state.collections.push(found.id);
            foundColText = `<div class="glass font-black px-4 py-2 rounded-xl text-purple-600 text-sm mt-2 w-full text-center border-purple-200">🏆 新たなコレクション発見!<br><span class="text-2xl">${found.icon}</span> ${found.name}</div>`;
        }
    }

    renderEverything();
    updateUI();

    // 帰還モーダルを表示
    const modal = document.getElementById('expeditionResultModal');
    if (modal) {
        document.getElementById('expeditionResultItems').innerHTML = `
            <div class="flex gap-2 justify-center w-full">
                <div class="glass px-4 py-2 rounded-xl text-slate-700 text-lg">🌲 ${wood}</div>
                <div class="glass px-4 py-2 rounded-xl text-slate-700 text-lg">🪨 ${stone}</div>
                <div class="glass px-4 py-2 rounded-xl text-yellow-600 text-lg">💰 ${gold}</div>
            </div>
            ${foundColText}
        `;
        modal.classList.remove('hidden');
    }
}

function closeExpeditionResultModal() {
    const modal = document.getElementById('expeditionResultModal');
    if (modal) modal.classList.add('hidden');
}

// --- Alchemy ---
function renderAlchemy() {
    const list = document.getElementById('alchemyList');
    if (!list) return;
    list.innerHTML = '';
    const recipes = [
        { name: '黄金の薬', cost: { crystal: 5 }, effect: () => { state.gold += 100; log("錬金術でゴールドを生成しました。"); } }
    ];
    recipes.forEach(r => {
        const can = state.crystal >= r.cost.crystal;
        const btn = document.createElement('button');
        btn.className = `w-full p-3 rounded-xl border text-xs font-bold ${can ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 opacity-50'}`;
        btn.innerHTML = `${r.name} (💎${r.cost.crystal})`;
        btn.onclick = () => { if (can) { state.crystal -= r.cost.crystal; r.effect(); updateUI(); } };
        list.appendChild(btn);
    });
}

function renderCollections() {
    const cont = document.getElementById('collectionList');
    if (!cont) return;
    document.getElementById('collectionCount').textContent = state.collections.length;
    cont.innerHTML = '';
    if (state.collections.length === 0) {
        cont.innerHTML = '<span class="text-[10px] text-slate-500">まだ見つかっていません</span>';
        return;
    }
    state.collections.forEach(itemId => {
        // もっち文字列データ時代のロード対策
        const refItem = config.collections.find(c => c.id === itemId || c.name === itemId);
        if (!refItem) return;

        const btn = document.createElement('button');
        btn.className = 'text-3xl bg-purple-50 hover:bg-purple-100 p-2 rounded-xl border-2 border-purple-200 shadow-sm transition-transform hover:scale-110 active:scale-95';
        btn.innerHTML = refItem.icon;
        btn.onclick = () => showCollectionModal(refItem);
        cont.appendChild(btn);
    });
}

function showCollectionModal(item) {
    const modal = document.getElementById('collectionModal');
    if (!modal) return;

    document.getElementById('modalColIcon').textContent = item.icon;
    document.getElementById('modalColName').textContent = item.name;
    document.getElementById('modalColDesc').textContent = item.desc;

    modal.classList.remove('hidden');
}

function closeCollectionModal() {
    const modal = document.getElementById('collectionModal');
    if (modal) modal.classList.add('hidden');
}

// --- Trade & Merchant ---

function spawnMerchant() {
    state.merchantActive = true;
    const vCont = document.getElementById('villagersContainer');
    const el = document.createElement('div');
    el.id = 'merchant';
    el.className = 'merchant-entity';
    el.innerHTML = '👳‍♂️';
    el.style.right = '-15%';
    el.style.top = '60%';
    vCont.appendChild(el);

    log("👳‍♂️ 商人が村の近くにやってきました。", '👳‍♂️');

    setTimeout(() => {
        el.style.right = '5%';
    }, 100);

    el.onclick = () => {
        openMerchantModal();
    };

    // 60秒後に去る
    setTimeout(() => {
        if (state.merchantActive) {
            el.style.right = '-15%';
            setTimeout(() => {
                const existing = document.getElementById('merchant');
                if (existing) existing.remove();
                state.merchantActive = false;
                state.merchantCooldown = 60 + Math.random() * 60;
                log("👳‍♂️ 商人は去っていきました。");
                closeMerchantModal();
                updateUI();
            }, 1500);
        }
    }, 60000);
}

function renderMarket() {
    const cont = document.getElementById('paneMarket');
    if (!cont) return;
    const hasMarket = state.buildings.some(b => b.id === 'market');

    if (!hasMarket) {
        cont.innerHTML = '<div class="text-center py-10 opacity-50 font-bold">市場を建築すると交易が可能です</div>';
        return;
    }

    cont.innerHTML = `
        <h4 class="text-xs font-black text-slate-400 mb-3 tracking-widest">市場での交易</h4>
        <div class="space-y-4">
            <div class="bg-yellow-50 p-4 rounded-2xl border border-yellow-200">
                <p class="text-[10px] font-bold text-yellow-700 mb-2 uppercase">資源をゴールドに換金（売却）</p>
                <div class="grid grid-cols-2 gap-2 mb-4">
                    <button onclick="tradeResource('wood')" class="bg-white p-2 rounded-xl border text-xs font-bold hover:bg-yellow-100 transition-colors">🌲 100 → 💰 10</button>
                    <button onclick="tradeResource('stone')" class="bg-white p-2 rounded-xl border text-xs font-bold hover:bg-yellow-100 transition-colors">🪨 100 → 💰 10</button>
                    <button onclick="tradeResource('food')" class="bg-white p-2 rounded-xl border text-xs font-bold hover:bg-yellow-100 transition-colors">🍞 100 → 💰 20</button>
                    <button onclick="tradeResource('iron')" class="bg-white p-2 rounded-xl border text-xs font-bold hover:bg-yellow-100 transition-colors">⛓️ 50 → 💰 40</button>
                </div>
                <p class="text-[10px] font-bold text-indigo-700 mb-2 uppercase">ゴールドで資源を購入</p>
                <div class="grid grid-cols-2 gap-2">
                    <button onclick="buyResource('wood')" class="bg-white p-2 rounded-xl border border-indigo-200 text-xs font-bold hover:bg-indigo-50 transition-colors">💰 15 → 🌲 100</button>
                    <button onclick="buyResource('stone')" class="bg-white p-2 rounded-xl border border-indigo-200 text-xs font-bold hover:bg-indigo-50 transition-colors">💰 15 → 🪨 100</button>
                    <button onclick="buyResource('food')" class="bg-white p-2 rounded-xl border border-indigo-200 text-xs font-bold hover:bg-indigo-50 transition-colors">💰 30 → 🍞 100</button>
                    <button onclick="buyResource('iron')" class="bg-white p-2 rounded-xl border border-indigo-200 text-xs font-bold hover:bg-indigo-50 transition-colors">💰 60 → ⛓️ 50</button>
                </div>
            </div>
            <div id="merchantShopPane" class="hidden">
            </div>
        </div>
    `;

    if (state.merchantActive) {
        renderMerchantShop();
    }
}

function tradeResource(type) {
    const costs = { wood: 100, stone: 100, food: 100, iron: 50 };
    const gains = { wood: 10, stone: 10, food: 20, iron: 40 };

    if (state[type] >= costs[type]) {
        state[type] -= costs[type];
        state.gold += gains[type];
        log(`${costs[type]} の資源を 💰${gains[type]} に換金しました。`);
        updateUI();
    } else {
        log("資源が足りません。");
    }
}

function buyResource(type) {
    const costs = { wood: 15, stone: 15, food: 30, iron: 60 };
    const gains = { wood: 100, stone: 100, food: 100, iron: 50 };

    if (state.gold >= costs[type]) {
        state.gold -= costs[type];
        state[type] += gains[type];
        log(`💰${costs[type]} で ${gains[type]} の資源を購入しました。`);
        updateUI();
    } else {
        log("ゴールドが足りません。", "❌");
    }
}

function renderMerchantShop(containerId = 'merchantShopPane') {
    const cont = document.getElementById(containerId);
    if (!cont) return;
    cont.classList.remove('hidden');
    cont.innerHTML = `
        <div class="space-y-3">
            ${config.merchantItems.map(item => {
        const discount = (state.upgrades.merchant_discount || 0) * 0.1;
        const owned = state.upgrades[item.id] || 0;
        const cost = Math.floor(item.cost * (1 - discount));
        const can = state.gold >= cost;
        return `
                    <button onclick="buyMerchantItem('${item.id}', ${cost}, '${containerId}')" 
                        class="w-full p-4 rounded-2xl border-2 text-left transition-all ${can ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg hover:scale-[1.02]' : 'bg-slate-100 border-slate-200 opacity-60'}">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="font-black text-xs">${item.icon} ${item.name}</p>
                                <p class="text-[9px] opacity-80 mt-1">${item.desc}</p>
                            </div>
                            <div class="text-right">
                                <p class="font-black text-sm mb-1">💰${cost}</p>
                                <p class="text-[10px] ${owned > 0 ? 'text-yellow-500 font-bold' : 'opacity-50'}">所持: ${owned}</p>
                            </div>
                        </div>
                    </button>
                `;
    }).join('')}
        </div>
    `;
}

function openMerchantModal() {
    const modal = document.getElementById('merchantModal');
    if (modal) {
        modal.classList.remove('hidden');
        renderMerchantShop('merchantModalContent');
    }
}

function closeMerchantModal() {
    const modal = document.getElementById('merchantModal');
    if (modal) modal.classList.add('hidden');
}

function buyMerchantItem(id, cost, containerId) {
    if (state.gold >= cost) {
        state.gold -= cost;
        state.upgrades[id] = (state.upgrades[id] || 0) + 1;
        log(`👳‍♂️ から「${config.merchantItems.find(i => i.id === id).name}」を購入しました！`, '🛍️');
        updateUI();
        if (state.merchantActive) renderMerchantShop(containerId);
    } else {
        log("ゴールドが足りません。", '❌');
    }
}

// --- Combat ---
function spawnEnemy() {
    enemy.active = true;
    enemy.max = 200 + state.level * 100;
    enemy.hp = enemy.max;
    document.getElementById('enemyView').classList.remove('hidden');
    log("👿 敵が襲撃してきました！");
}

function attackEnemy() {
    let pwr = 10 + state.research.combat * 5;
    state.villagers.forEach(v => {
        if (v.job === 'soldier') pwr += 15;
        if (v.trait && v.trait.bonus === 'defend') pwr += v.trait.value;
    });
    enemy.hp -= pwr;
    updateEnemyHP();
    if (enemy.hp <= 0) {
        enemy.active = false;
        document.getElementById('enemyView').classList.add('hidden');
        state.gold += 20;
        log("敵を撃退しました！ 報酬: 💰20", '🛡️');
        updateUI();
    }
}

function updateEnemyHP() {
    document.getElementById('enemyHP').style.width = (enemy.hp / enemy.max * 100) + '%';
}

// --- Helpers ---
function renderBuildList() {
    const cont = document.getElementById('paneBuild');
    if (!cont) return;
    cont.innerHTML = '';
    config.buildings.forEach(b => {
        const owned = state.buildings.filter(x => x.id === b.id).length;
        const can = state.wood >= (b.wood || 0) && state.stone >= (b.stone || 0) && state.iron >= (b.iron || 0) && (!b.reqLevel || state.level >= b.reqLevel);
        const btn = document.createElement('button');
        btn.className = `w-full p-4 rounded-2xl border-2 text-left ${can ? 'bg-white hover:border-emerald-500' : 'bg-slate-50 opacity-60'}`;
        btn.innerHTML = `
            <div class="flex justify-between items-center font-black text-sm mb-1">
                <span>${b.icon} ${b.name}</span>
                <span class="text-emerald-600 bg-emerald-50 px-2 rounded-lg border border-emerald-100">所持: ${owned}</span>
            </div>
            <p class="text-[10px] text-slate-500 font-bold mb-2">${b.desc || ''}</p>
            <div class="flex gap-2 text-[10px] font-black items-center">
                ${b.reqLevel && state.level < b.reqLevel ? `<span class="text-red-500">Lv.${b.reqLevel}必要</span>` : ''}
                <span class="${state.wood >= (b.wood || 0) ? 'text-slate-700' : 'text-red-500'}">🌲${b.wood || 0}</span>
                <span class="${state.stone >= (b.stone || 0) ? 'text-slate-700' : 'text-red-500'}">🪨${b.stone || 0}</span>
                ${b.iron ? `<span class="${state.iron >= (b.iron || 0) ? 'text-slate-700' : 'text-red-500'}">⛓️${b.iron}</span>` : ''}
            </div>`;
        btn.onclick = () => build(b.id);
        cont.appendChild(btn);
    });
}

function renderVillagerList() {
    const cont = document.getElementById('paneVillagers');
    if (!cont) return;
    cont.innerHTML = '';
    state.villagers.filter(v => !v.onExpedition).forEach(v => {
        const traitSpan = v.trait ? `<span class="text-[9px] text-indigo-500 uppercase ml-2 bg-indigo-50 px-2 rounded-full border border-indigo-100">${v.trait.name}</span>` : '';

        const d = document.createElement('div');
        d.className = 'bg-white p-3 rounded-2xl border shadow-sm';
        d.innerHTML = `<div class="flex items-center gap-2 mb-2 font-bold text-sm">${v.emoji} ${v.name} ${traitSpan}</div>
            <div class="flex gap-1 overflow-x-auto">${config.jobs.map(j => `<button onclick="setJob(${v.id}, '${j.id}')" class="px-2 py-1 rounded-lg text-[10px] border ${v.job === j.id ? 'bg-indigo-600 text-white' : 'bg-slate-50'}">${j.name}</button>`).join('')}</div>`;
        cont.appendChild(d);
    });
}

function setJob(id, job) {
    const v = state.villagers.find(x => x.id === id);
    v.job = job; updateUI();
}

function renderResearchList() {
    const cont = document.getElementById('paneResearch');
    if (!cont) return;
    cont.innerHTML = '';
    const res = [
        { id: 'gather', name: '道具改良', wood: 100, stone: 100 },
        { id: 'combat', name: '戦術訓練', wood: 150, iron: 50 }
    ];
    res.forEach(r => {
        const lv = state.research[r.id];
        const w = Math.floor(r.wood * Math.pow(1.5, lv));
        const s = Math.floor((r.stone || 0) * Math.pow(1.5, lv));
        const i = Math.floor((r.iron || 0) * Math.pow(1.5, lv));
        const can = state.wood >= w && state.stone >= s && state.iron >= i;
        const btn = document.createElement('button');
        btn.className = `w-full p-4 rounded-2xl border-2 text-left ${can ? 'bg-white' : 'bg-slate-50 opacity-60'}`;
        btn.innerHTML = `<div class="flex justify-between font-bold"><span>🔬 ${r.name}</span><span>Lv.${lv}</span></div>
            <div class="text-[10px] mt-1">🌲${w} / 🪨${s} ${i ? `/ ⛓️${i}` : ''}</div>`;
        btn.onclick = () => { if (can) { state.wood -= w; state.stone -= s; state.iron -= i; state.research[r.id]++; updateUI(); } };
        cont.appendChild(btn);
    });
}

function log(m, icon = 'ℹ️') {
    const cont = document.getElementById('notificationContainer');
    if (!cont) return;
    cont.classList.remove('hidden');

    const notif = document.createElement('div');
    notif.className = 'bg-white p-3 rounded-2xl border-2 border-indigo-100 shadow-xl flex items-center gap-3 transform transition-all duration-300 translate-y-4 opacity-0 text-sm font-bold w-full max-w-sm';
    notif.innerHTML = `
        <div class="text-xl bg-indigo-50 p-2 rounded-xl flex-shrink-0">${icon}</div>
        <div class="text-slate-800 leading-tight">${m}</div>
    `;
    cont.appendChild(notif);

    // Animate in
    setTimeout(() => {
        notif.classList.remove('translate-y-4', 'opacity-0');
    }, 10);

    // Remove element after 5 seconds
    setTimeout(() => {
        notif.classList.add('opacity-0', '-translate-x-10');
        setTimeout(() => notif.remove(), 300);
    }, 5000);
}

function showBiomeSelect() {
    document.getElementById('saveOptions').classList.add('hidden');
    document.getElementById('biomeSelect').classList.remove('hidden');
}

function cancelBiomeSelect() {
    document.getElementById('saveOptions').classList.remove('hidden');
    document.getElementById('biomeSelect').classList.add('hidden');
}

function showFloatingText(x, y, t, c) {
    const el = document.createElement('div'); el.className = `floating-text ${c}`; el.style.left = x + 'px'; el.style.top = y + 'px'; el.textContent = t;
    document.body.appendChild(el); setTimeout(() => el.remove(), 1200);
}

// --- Modals ---
function showVillagerModal(v) {
    const modal = document.getElementById('villagerModal');
    if (!modal) return;

    const job = config.jobs.find(j => j.id === v.job);

    document.getElementById('modalVillagerEmoji').textContent = v.emoji;
    document.getElementById('modalVillagerName').textContent = v.name;
    document.getElementById('modalVillagerJob').textContent = job ? job.name : 'なし';
    document.getElementById('modalVillagerTraitName').textContent = v.trait ? v.trait.name : 'なし';
    document.getElementById('modalVillagerTraitDesc').textContent = v.trait ? v.trait.desc : '';

    modal.classList.remove('hidden');
}

function closeVillagerModal() {
    const modal = document.getElementById('villagerModal');
    if (modal) modal.classList.add('hidden');
}

window.onload = () => {
    const saved = localStorage.getItem('v-evolve-save');
    const loadBtn = document.getElementById('loadBtn');
    if (saved && loadBtn) loadBtn.classList.remove('hidden');
};

// --- Agent System ---
function renderAgent() {
    const cont = document.getElementById('agentList');
    if (!cont) return;
    cont.innerHTML = '';

    // リーダーシップ特性を持つ人のみ
    const leaders = state.villagers.filter(v => v.trait && v.trait.bonus === 'agent');
    if (leaders.length === 0) {
        cont.innerHTML = '<p class="text-[10px] text-slate-500 font-bold p-4 text-center">リーダーシップを持つ村人がいません</p>';
        return;
    }

    leaders.forEach(v => {
        const el = document.createElement('div');
        el.className = "bg-white p-3 flex flex-col gap-2 rounded-xl border border-slate-200 shadow-sm text-xs font-bold";

        const ar = v.agentRule || {};

        const resSelect = `<select id="ar_res_${v.id}" class="border bg-slate-50 p-2 rounded w-full" onchange="updateAgent(${v.id})">
            <option value="">(条件なし)</option>
            <option value="hasTraveler" ${ar.res === 'hasTraveler' ? 'selected' : ''}>訪問者が来たら</option>
            <option value="canExpedition" ${ar.res === 'canExpedition' ? 'selected' : ''}>兵士が待機しているなら</option>
            <option value="popFull" ${ar.res === 'popFull' ? 'selected' : ''}>家が足りない(人口上限)なら</option>
            <option value="foodLow" ${ar.res === 'foodLow' ? 'selected' : ''}>食料が50未満なら</option>
            <option value="woodFull" ${ar.res === 'woodFull' ? 'selected' : ''}>木材が200以上余っているなら</option>
            <option value="stoneFull" ${ar.res === 'stoneFull' ? 'selected' : ''}>石材が200以上余っているなら</option>
        </select>`;

        const actionSelect = `<select id="ar_act_${v.id}" class="border bg-slate-50 p-2 rounded w-full mt-1" onchange="updateAgent(${v.id})">
            <option value="">(行動を選択)</option>
            <optgroup label="訪問者">
                <option value="acceptTraveler" ${ar.action === 'acceptTraveler' ? 'selected' : ''}>村人として歓迎する</option>
                <option value="rejectTraveler" ${ar.action === 'rejectTraveler' ? 'selected' : ''}>村から追い出す</option>
            </optgroup>
            <optgroup label="部隊指示">
                <option value="startExpedition" ${ar.action === 'startExpedition' ? 'selected' : ''}>遠征に出発させる</option>
            </optgroup>
            <optgroup label="交易 (市場要)">
                <option value="trade_wood" ${ar.action === 'trade_wood' ? 'selected' : ''}>木材を換金する</option>
                <option value="trade_stone" ${ar.action === 'trade_stone' ? 'selected' : ''}>石材を換金する</option>
            </optgroup>
            <optgroup label="自動建築">
                ${config.buildings.map(b => `<option value="build_${b.id}" ${ar.action === 'build_' + b.id ? 'selected' : ''}>${b.name}を建築する</option>`).join('')}
            </optgroup>
        </select>`;

        el.innerHTML = `
            <div class="flex justify-between items-center px-1 pb-1 border-b mb-1">
                <span>${v.emoji} ${v.name}</span>
                <span class="text-[10px] text-indigo-500 bg-indigo-50 px-2 rounded-full border border-indigo-100">リーダー</span>
            </div>
            <div class="text-[11px] space-y-1 w-full bg-slate-100/50 p-2 rounded">
                <div class="flex flex-col gap-1">
                    <span class="text-slate-500 font-black">【もし】</span>
                    ${resSelect}
                </div>
                <div class="flex flex-col gap-1">
                    <span class="text-slate-500 font-black">【自動で】</span>
                    ${actionSelect}
                </div>
            </div>
        `;
        cont.appendChild(el);
    });
}

function updateAgent(id) {
    const v = state.villagers.find(x => x.id === id);
    if (!v) return;
    const res = document.getElementById(`ar_res_${id}`).value;
    const action = document.getElementById(`ar_act_${id}`).value;

    if (res && action) {
        v.agentRule = { res, action };
    } else {
        delete v.agentRule;
    }
}

function applyAgentRules() {
    const leaders = state.villagers.filter(v => v.trait && v.trait.bonus === 'agent');
    if (leaders.length === 0) return;

    leaders.forEach(v => {
        if (v.agentRule && v.agentRule.res && v.agentRule.action) {
            let triggered = false;

            // 条件判定
            if (v.agentRule.res === 'popFull' && state.villagers.length >= getPopMax()) {
                triggered = true;
            } else if (v.agentRule.res === 'foodLow' && state.food < 50) {
                triggered = true;
            } else if (v.agentRule.res === 'woodFull' && state.wood >= 200) {
                triggered = true;
            } else if (v.agentRule.res === 'stoneFull' && state.stone >= 200) {
                triggered = true;
            } else if (v.agentRule.res === 'hasTraveler' && pendingTraveler) {
                triggered = true;
            } else if (v.agentRule.res === 'canExpedition' && state.villagers.some(sv => sv.job === 'soldier' && !sv.onExpedition)) {
                triggered = true;
            }

            // アクション実行
            if (triggered) {
                const act = v.agentRule.action;
                if (act.startsWith('build_')) {
                    const bId = act.split('_')[1];
                    build(bId);
                } else if (act === 'acceptTraveler' && pendingTraveler && state.villagers.length < getPopMax()) {
                    acceptTraveler();
                } else if (act === 'rejectTraveler' && pendingTraveler) {
                    rejectTraveler();
                } else if (act === 'startExpedition' && state.villagers.some(sv => sv.job === 'soldier' && !sv.onExpedition)) {
                    startExpedition();
                } else if (act.startsWith('trade_')) {
                    if (state.buildings.some(b => b.id === 'market')) {
                        const rId = act.split('_')[1];
                        tradeResource(rId);
                    }
                }
            }
        }
    });
}

// --- Village System ---
function renderVillages() {
    const cont = document.getElementById('villagesList');
    if (!cont) return;
    cont.innerHTML = '';

    cont.innerHTML = `
        <div class="bg-indigo-50 p-4 rounded-xl border-2 border-indigo-200 mb-4 shadow-sm">
            <h5 class="text-xs font-black text-indigo-700 mb-2">新しい村を開拓する</h5>
            <input type="text" id="newVillageName" placeholder="新しい村の名前" class="w-full p-2 rounded mb-2 border text-sm font-bold shadow-sm">
            <select id="newVillageBiome" class="w-full p-2 rounded mb-3 border text-sm font-bold shadow-sm">
                <option value="forest">森 (木材が採れやすい)</option>
                <option value="mountain">山 (石材・鉄・ダイヤが採れやすい)</option>
                <option value="desert">砂漠 (金・宝・食料難)</option>
            </select>
            <button onclick="createNewVillage()" class="w-full bg-indigo-600 text-white font-black py-2 rounded-xl hover:bg-indigo-500 active:scale-95 transition-all shadow-lg">開拓に出発する</button>
        </div>
    `;

    if (savedVillages.length === 0) {
        cont.innerHTML += `<p class="text-[10px] text-slate-500 font-bold text-center mt-4">他の村はまだありません</p>`;
    } else {
        savedVillages.forEach((sv, i) => {
            const canTravel = sv.hasStation;
            cont.innerHTML += `
                <div class="bg-white p-4 rounded-xl shadow-sm border mb-2 flex justify-between items-center">
                    <div>
                        <h5 class="font-black">${sv.name} <span class="text-[10px] text-slate-400">Lv.${sv.level}</span></h5>
                        <p class="text-[10px] text-slate-500">バイオーム: ${sv.biome === 'forest' ? '森' : sv.biome === 'mountain' ? '山' : '砂漠'}</p>
                    </div>
                    <button onclick="travelToVillage(${i})" class="${canTravel ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'} px-3 py-2 rounded-xl text-xs font-black transition-colors" ${canTravel ? '' : 'disabled'}>
                        ${canTravel ? '移動' : '駅が未開通'}
                    </button>
                </div>
            `;
        });
    }
}

function createNewVillage() {
    let name = document.getElementById('newVillageName').value.trim();
    if (!name) name = '新開地';
    const biome = document.getElementById('newVillageBiome').value;

    savedVillages.push(JSON.parse(JSON.stringify(state)));

    state = JSON.parse(JSON.stringify(DEFAULTS));
    state.name = name;
    state.biome = biome;

    saveGame();
    document.getElementById('villageMain').className = `w-full h-[55%] md:w-2/3 md:h-full village-area relative overflow-hidden flex-shrink-0 biome-${biome}`;
    init();

    log(`新しい村「${state.name}」への移住が完了しました。トロッコ駅を建設するまで他の村へは戻れません。`, '🚞');
    tab('build');
}

function travelToVillage(index) {
    if (!state.hasStation) { log('この村にトロッコ駅がないため移動できません', '⚠️'); return; }
    const target = savedVillages[index];
    if (!target.hasStation) { log('移動先の村にはまだトロッコ駅がありません', '⚠️'); return; }

    const current = JSON.parse(JSON.stringify(state));
    state = JSON.parse(JSON.stringify(target));
    savedVillages[index] = current;

    saveGame();
    document.getElementById('villageMain').className = `w-full h-[55%] md:w-2/3 md:h-full village-area relative overflow-hidden flex-shrink-0 biome-${state.biome}`;
    init();

    log(`トロッコに乗って「${state.name}」へ移動しました。`, '🚇');
    tab('build');
}

