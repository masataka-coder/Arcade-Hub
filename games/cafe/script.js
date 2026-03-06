// --- マスターデータ ---
const INGREDIENTS = {
    beans: { id: 'beans', name: 'コーヒー豆', icon: '🫘', basePrice: 50 },
    bread: { id: 'bread', name: 'パン', icon: '🥖', basePrice: 100 },
    meat: { id: 'meat', name: '肉', icon: '🥩', basePrice: 300 },
    fruits: { id: 'fruits', name: 'フルーツ', icon: '🍎', basePrice: 150 },
    sweets: { id: 'sweets', name: 'スイーツ素材', icon: '🍫', basePrice: 200 },
    space_dust: { id: 'space_dust', name: '星の粉', icon: '✨', basePrice: 800 },
    mammoth: { id: 'mammoth', name: 'マンモス肉', icon: '🦣', basePrice: 2000 },
    egg_dino: { id: 'egg_dino', name: '巨大な卵', icon: '🥚', basePrice: 1000 },
    oil_cyber: { id: 'oil_cyber', name: '超純度オイル', icon: '🛢️', basePrice: 3000 },
    chip: { id: 'chip', name: '電脳チップ', icon: '🔌', basePrice: 5000 }
};

const FARM_ITEMS = {
    beans: { id: 'beans', name: 'コーヒーの木', desc: '営業終了時に豆を自動収穫', cost: 10000, yield: 5, icon: '🌲' },
    bread: { id: 'bread', name: '小麦畑', desc: '営業終了時にパンを自動収穫', cost: 12000, yield: 5, icon: '🌾' },
    meat: { id: 'meat', name: '牧場', desc: '営業終了時に肉を自動収穫', cost: 30000, yield: 3, icon: '🐄' },
    fruits: { id: 'fruits', name: 'フルーツ農園', desc: '営業終了時にフルーツを自動収穫', cost: 20000, yield: 5, icon: '🍎' },
    sweets: { id: 'sweets', name: 'カカオ農園', desc: '営業終了時にスイーツを自動収穫', cost: 25000, yield: 5, icon: '🍫' }
};

const RECIPES = {
    coffee: { id: 'coffee', name: 'コーヒー', icon: '☕', baseTime: 2500, basePrice: 300, unlockCost: 0, level: 1, type: 'drink', steps: 1, reqFranchise: 1, reqs: { beans: 1 } },
    sandwich: { id: 'sandwich', name: 'サンドイッチ', icon: '🥪', baseTime: 4000, basePrice: 700, unlockCost: 1500, level: 0, type: 'food', steps: 1, reqFranchise: 1, reqs: { bread: 1, meat: 1 } },
    smoothie: { id: 'smoothie', name: 'スムージー', icon: '🥤', baseTime: 3500, basePrice: 500, unlockCost: 2000, level: 0, type: 'drink', steps: 1, reqFranchise: 1, reqs: { fruits: 2 } },
    cake: { id: 'cake', name: 'ケーキ', icon: '🍰', baseTime: 5000, basePrice: 1000, unlockCost: 4000, level: 0, type: 'food', steps: 1, reqFranchise: 1, reqs: { sweets: 2, fruits: 1 } },
    burger: { id: 'burger', name: '手作りバーガー', icon: '🍔', baseTime: 2500, basePrice: 2000, unlockCost: 8000, level: 0, type: 'food', steps: 3, stepIcons: ['🥩', '🍳', '🍔'], reqFranchise: 1, reqs: { bread: 1, meat: 2 } },
    // 2号店
    shaved_ice: { id: 'shaved_ice', name: 'レインボーかき氷', icon: '🍧', baseTime: 3000, basePrice: 1500, unlockCost: 15000, level: 0, type: 'food', steps: 1, reqFranchise: 2, reqs: { fruits: 1, sweets: 1 } },
    tropical: { id: 'tropical', name: 'トロピカルジュース', icon: '🍹', baseTime: 3500, basePrice: 1800, unlockCost: 20000, level: 0, type: 'drink', steps: 1, reqFranchise: 2, reqs: { fruits: 3 } },
    // 宇宙店
    tube_meal: { id: 'tube_meal', name: 'チューブ飯', icon: '🧪', baseTime: 2000, basePrice: 4000, unlockCost: 50000, level: 0, type: 'food', steps: 1, reqFranchise: 3, reqs: { space_dust: 1, meat: 1 } },
    galaxy_drink: { id: 'galaxy_drink', name: 'ギャラクシードリンク', icon: '🌌', baseTime: 4000, basePrice: 5000, unlockCost: 80000, level: 0, type: 'drink', steps: 1, reqFranchise: 3, reqs: { space_dust: 2, fruits: 1 } },
    // 恐竜店
    mammoth_steak: { id: 'mammoth_steak', name: 'マンモス肉ステーキ', icon: '🍖', baseTime: 4000, basePrice: 15000, unlockCost: 200000, level: 0, type: 'food', steps: 2, stepIcons: ['🦣', '🍖'], reqFranchise: 4, reqs: { mammoth: 2 } },
    dino_egg: { id: 'dino_egg', name: '始祖鳥の卵焼き', icon: '🍳', baseTime: 3000, basePrice: 8000, unlockCost: 100000, level: 0, type: 'food', steps: 1, reqFranchise: 4, reqs: { egg_dino: 1, fruits: 1 } },
    // サイバー店
    cyber_oil: { id: 'cyber_oil', name: 'ギャラクシーオイル', icon: '🛢️', baseTime: 3000, basePrice: 25000, unlockCost: 500000, level: 0, type: 'drink', steps: 1, reqFranchise: 5, reqs: { oil_cyber: 1, space_dust: 1 } },
    cyber_chip: { id: 'cyber_chip', name: '高出力電脳チップ', icon: '💾', baseTime: 5000, basePrice: 40000, unlockCost: 1000000, level: 0, type: 'food', steps: 2, stepIcons: ['🔌', '💾'], reqFranchise: 5, reqs: { chip: 1, sweets: 1 } },
    // 伝説の巨大レシピ
    giant_parfait: { id: 'giant_parfait', name: '夢の100段パフェ(3日仕込)', icon: '🍨', baseTime: 30000, basePrice: 500000, unlockCost: 5000000, level: 0, type: 'food', steps: 1, reqFranchise: 1, reqs: { sweets: 10, fruits: 10 }, isGiant: true, requiredDays: 3 }
};

const VIP_CHARS = {
    mika: { id: 'mika', name: 'インフルエンサー ミカ', face: '<img src="../../assets/images/cafe/vips/mika.png" class="w-full h-full object-cover p-0.5 drop-shadow-md max-w-[90%] max-h-[90%] pointer-events-none" alt="ミカ">', desc: '満足させると翌日客足1.5倍', reqLevel: 2, reqFranchise: 1 },
    gordon: { id: 'gordon', name: '市長 ゴードン', face: '<img src="../../assets/images/cafe/vips/godon.png" class="w-full h-full object-cover p-0.5 drop-shadow-md max-w-[90%] max-h-[90%] pointer-events-none" alt="ゴードン">', desc: '大食いだがチップが桁違い', reqLevel: 3, reqFranchise: 1 },
    aloha: { id: 'aloha', name: 'アロハおじさん', face: '<img src="../../assets/images/cafe/vips/aroha.png" class="w-full h-full object-cover p-0.5 drop-shadow-md max-w-[90%] max-h-[90%] pointer-events-none" alt="アロハおじさん">', desc: 'ハワイ店限定。怒らない超優良客', reqLevel: 1, reqFranchise: 2 },
    alien: { id: 'alien', name: '銀河連邦使者', face: '<img src="../../assets/images/cafe/messenger.png" class="w-full h-full object-cover p-0.5 drop-shadow-md max-w-[90%] max-h-[90%] pointer-events-none" alt="銀河連邦使者">', desc: '宇宙店限定。超高額チップ＆要求大', reqLevel: 1, reqFranchise: 3 },
    t_rex: { id: 't_rex', name: 'ティラノサウルス', face: '<img src="../../assets/images/cafe/t-rex.png" class="w-full h-full object-cover p-0.5 drop-shadow-md max-w-[90%] max-h-[90%] pointer-events-none" alt="ティラノサウルス">', desc: '恐竜時代限定。大食いで気性が荒い', reqLevel: 2, reqFranchise: 4 },
    tricera: { id: 'tricera', name: 'トリケラトプス', face: '<img src="../../assets/images/cafe/triceratops.png" class="w-full h-full object-cover p-0.5 drop-shadow-md max-w-[90%] max-h-[90%] pointer-events-none" alt="トリケラトプス">', desc: '恐竜時代限定。草食系でまったり待つ', reqLevel: 1, reqFranchise: 4 },
    cyborg: { id: 'cyborg', name: '試作サイボーグ', face: '🤖', desc: '未来支店限定。効率重視で待てない', reqLevel: 1, reqFranchise: 5 },
    android: { id: 'android', name: '高級アンドロイド', face: '<img src="../../assets/images/cafe/android.png" class="w-full h-full object-cover p-0.5 drop-shadow-md max-w-[90%] max-h-[90%] pointer-events-none" alt="高級アンドロイド">', desc: '未来支店限定。超高額チップを払う', reqLevel: 2, reqFranchise: 5 }
};

const MASTER_CHARS = {
    master_coffee: { id: 'master_coffee', name: '珈琲の仙人', face: '<img src="../../assets/images/cafe/masters/coffee.png" class="w-full h-full object-cover p-0.5 drop-shadow-md max-w-[90%] max-h-[90%] pointer-events-none" alt="珈琲の仙人">', target: 'coffee' },
    master_sandwich: { id: 'master_sandwich', name: 'パン職人', face: '<img src="../../assets/images/cafe/masters/sandwhich.png" class="w-full h-full object-cover p-0.5 drop-shadow-md max-w-[90%] max-h-[90%] pointer-events-none" alt="パン職人">', target: 'sandwich' },
    master_smoothie: { id: 'master_smoothie', name: '果実の魔女', face: '<img src="../../assets/images/cafe/masters/smuji.png" class="w-full h-full object-cover p-0.5 drop-shadow-md max-w-[90%] max-h-[90%] pointer-events-none" alt="果実の魔女">', target: 'smoothie' },
    master_cake: { id: 'master_cake', name: '伝説のパティシエ', face: '🤴', target: 'cake' },
    master_burger: { id: 'master_burger', name: 'バーガー職人', face: '<img src="../../assets/images/cafe/masters/humberger.png" class="w-full h-full object-cover p-0.5 drop-shadow-md max-w-[90%] max-h-[90%] pointer-events-none" alt="バーガー職人">', target: 'burger' }
};

const TRENDS = [
    { type: 'target', target: 'coffee', text: '朝活ブーム！コーヒーの売上1.5倍', mult: 1.5 },
    { type: 'target', target: 'cake', text: 'スイーツ特集！ケーキの売上1.5倍', mult: 1.5 },
    { type: 'all', text: '給料日！全ての商品売上1.2倍', mult: 1.2 },
    { type: 'speed', text: 'せっかちDAY！客の待ち時間が短いがチップ1.5倍', mult: 1.5 },
    { type: 'market', text: '食材大暴落！今日の仕入れは全て半額！', mult: 1.0 }
];

const THEMES = [
    { id: 'default', name: '標準の壁紙', class: 'theme-default', cost: 0 },
    { id: 'wood', name: 'ウッディな内装', class: 'theme-wood', cost: 3000 },
    { id: 'pop', name: 'ポップな内装', class: 'theme-pop', cost: 3000 },
    { id: 'luxury', name: '高級レストラン風', class: 'theme-luxury', cost: 10000 },
    { id: 'hawaii', name: 'ハワイアンビーチ', class: 'theme-hawaii', cost: 0, reqFranchise: 2 },
    { id: 'space', name: '宇宙ステーション', class: 'theme-space', cost: 0, reqFranchise: 3 },
    { id: 'dino', name: 'ジュラシック・カフェ', class: 'theme-dino', cost: 0, reqFranchise: 4 },
    { id: 'cyber', name: 'ネオン・シティ', class: 'theme-cyber', cost: 0, reqFranchise: 5 }
];

const ACHIEVEMENTS = [
    { id: 'earn_10k', title: '初級経営者', desc: '累計売上10,000円達成', target: 10000, type: 'totalEarned', rewardSP: 1 },
    { id: 'earn_100k', title: '敏腕オーナー', desc: '累計売上100,000円達成', target: 100000, type: 'totalEarned', rewardSP: 3 },
    { id: 'earn_1m', title: '伝説の経営者', desc: '累計売上1,000,000円達成', target: 1000000, type: 'totalEarned', rewardSP: 5 },
    { id: 'catch_thief_5', title: '自警団', desc: '泥棒を累計5回逮捕', target: 5, type: 'thiefCaught', rewardSP: 2 },
    { id: 'chain_20', title: '連鎖の神', desc: '最大チェイン20回達成', target: 20, type: 'maxChain', rewardSP: 4 }
];

const SKILLS = {
    feverTime: { id: 'feverTime', name: 'フィーバー延長', desc: 'フィーバーの持続時間を20%延長する(Lvにつき+20%)', maxLv: 3, costs: [1, 2, 3] },
    charisma: { id: 'charisma', name: 'カリスマ', desc: 'VIP・固有キャラの来店確率UP', maxLv: 3, costs: [1, 2, 3] },
    security: { id: 'security', name: '防犯対策', desc: '泥棒の移動速度ダウン', maxLv: 3, costs: [1, 2, 3] },
    petPower: { id: 'petPower', name: 'ペットの癒やし', desc: 'ペットのスキル発動頻度UP', maxLv: 3, costs: [2, 3, 5] },
    luckyChance: { id: 'luckyChance', name: 'ラッキーチャンス', desc: '10%の確率で売上が2倍になる(Lvにつき確率+5%)', maxLv: 3, costs: [3, 5, 8] },
    patienceBreath: { id: 'patienceBreath', name: '忍耐の呼吸', desc: '客の忍耐力の減少速度を15%緩和する(Lvにつき+15%)', maxLv: 3, costs: [3, 5, 8] }
};

const PETS = {
    cat: { id: 'cat', name: '看板ネコ', icon: '<img src="../../assets/images/cafe/cat.png" class="w-full h-full object-cover p-1" alt="ネコ">', cost: 30000, desc: '時々全員の忍耐力を回復させる' },
    owl: { id: 'owl', name: '看板フクロウ', icon: '<img src="../../assets/images/cafe/owl.png" class="w-full h-full object-cover p-1" alt="フクロウ">', cost: 50000, desc: '時々チップを拾ってくる(少額)' }
};

const GAME_CONFIG = { dayDuration: 60, fps: 10, maxSlots: 5, maxMenuSelection: 4 };
const SAVE_KEY = 'happy_cafe_save_god';

// --- ゲーム状態定義 ---
const getInitialState = () => ({
    screen: 'title', shopTab: 'menu', prepTab: 'menu',
    money: 500, day: 1, timeRemaining: 0,
    earnedToday: 0, satisfiedToday: 0, lostToday: 0,
    reputation: 3.0, candies: 3,
    upgrades: { interior: 1, equipment: 1, traySize: 3, dualMachine: false },
    recipes: JSON.parse(JSON.stringify(RECIPES)),
    staff: { barista: 0, server: 0, cook: 0, cleaner: 0 },
    unlockedThemes: ['default'], currentTheme: 'default',
    activeRecipes: ['coffee'], trend: null, mikaBoost: false,
    affinities: { mika: 0, gordon: 0, aloha: 0, alien: 0 },
    franchise: 1,
    managers: { 1: false, 2: false, 3: false, 4: false }, // 過去店舗の店長

    // 新要素
    inventory: { beans: 5, bread: 5, meat: 0, fruits: 0, sweets: 0, space_dust: 0, mammoth: 0, egg_dino: 0, oil_cyber: 0, chip: 0 },
    farm: { beans: 0, bread: 0, meat: 0, fruits: 0, sweets: 0 },
    fertilizer: 0,
    acquiredRivals: 0,
    marketPrices: {},
    chain: 0,
    pets: { cat: false, owl: false },
    activePet: null, hasAceManager: false, aceManagerUsed: false,

    stats: { totalEarned: 0, thiefCaught: 0, perfectServes: 0, partyCleared: 0, maxChain: 0 },
    achievements: [], skills: { feverTime: 0, charisma: 0, security: 0, petPower: 0 }, skillPoints: 0,

    slots: [null, null, null, null, null],
    tray: [], trayTimers: [], preparing: {}, isFever: false, isPartyDay: false,
    troubles: { broken: null, thief: { active: false, x: -20, direction: 1 }, inspector: { active: false, time: 0 } },
    delivery: { active: false, orders: [], fulfilled: [], time: 0, maxTime: 0, reward: 0 },
    party: { active: false, reqs: [] },
    petActionTimer: 0,
    lastTick: 0, gameLoopId: null, staffTimer: 0
});

// BGM
let bgmAudio = null;
let isBgmMuted = false;
let isBgmInitialized = false;

function initBGM() {
    if (!bgmAudio) {
        bgmAudio = new Audio('../../assets/musics/cafe/bgm.mp3');
        bgmAudio.loop = true;
        bgmAudio.volume = 0.5;
    }
}

function playBGM() {
    initBGM();
    if (!isBgmMuted && bgmAudio.paused) {
        bgmAudio.play().then(() => {
            isBgmInitialized = true;
        }).catch(e => console.log('BGM play failed. Need interaction.'));
    }
}

function toggleBGM() {
    initBGM();
    isBgmMuted = !isBgmMuted;
    bgmAudio.muted = isBgmMuted;
    if (!isBgmMuted) {
        playBGM();
        isBgmInitialized = true;
    }
    renderApp();
}

let state = getInitialState();

// --- セーブ＆ロード ---
const saveGame = () => {
    const saveData = { ...state };
    delete saveData.lastTick; delete saveData.gameLoopId;
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
};

const loadGame = () => {
    const data = localStorage.getItem(SAVE_KEY);
    if (data) {
        const parsed = JSON.parse(data);
        state = { ...getInitialState(), ...parsed };
        // マスターデータ統合
        for (let key in RECIPES) { if (!state.recipes[key]) state.recipes[key] = JSON.parse(JSON.stringify(RECIPES[key])); }
        for (let key in INGREDIENTS) { if (state.inventory[key] === undefined) state.inventory[key] = 0; }
        if (state.farm === undefined) {
            state.farm = { beans: 0, bread: 0, meat: 0, fruits: 0, sweets: 0 };
        } else {
            for (let key in FARM_ITEMS) { if (state.farm[key] === undefined) state.farm[key] = 0; }
        }
        if (state.fertilizer === undefined) state.fertilizer = 0;
        if (state.acquiredRivals === undefined) state.acquiredRivals = 0;
        if (state.chain === undefined) state.chain = 0;
        if (!state.pets) state.pets = { cat: false, owl: false };
        if (state.hasAceManager === undefined) Object.assign(state, { hasAceManager: false, aceManagerUsed: false });
        if (!state.managers) state.managers = { 1: false, 2: false, 3: false, 4: false };
        if (state.managers[3] === undefined) { state.managers[3] = false; state.managers[4] = false; }
        if (state.inventory.mammoth === undefined) {
            state.inventory.mammoth = 0; state.inventory.egg_dino = 0;
            state.inventory.oil_cyber = 0; state.inventory.chip = 0;
        }
        if (!state.trayTimers) state.trayTimers = [];
        return true;
    }
    return false;
};
const hasSaveData = () => !!localStorage.getItem(SAVE_KEY);

// --- ユーティリティ ---
const $ = id => document.getElementById(id);
const formatMoney = (amount) => `¥${(amount || 0).toLocaleString()}`;
const randomChoice = arr => arr[Math.floor(Math.random() * arr.length)];
const shuffleArray = (arr) => {
    const res = [...arr];
    for (let i = res.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
};
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

const showFloatingText = (text, x, y, colorClass) => {
    const el = document.createElement('div');
    el.className = `floating-text text-2xl ${colorClass}`;
    el.innerHTML = text;
    el.style.left = `${x}px`; el.style.top = `${y}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
};

const checkAchievements = () => {
    ACHIEVEMENTS.forEach(a => {
        if (!state.achievements.includes(a.id)) {
            let currentVal = state.stats[a.type] || 0;
            if (currentVal >= a.target) {
                state.achievements.push(a.id);
                state.skillPoints += a.rewardSP;
                saveGame();
                showSystemNotification(`🏆 実績解除: ${a.title}`, `報酬: +${a.rewardSP} SP<br><small>${a.desc}</small>`, 'bg-yellow-500');
            }
        }
    });
};

const showSystemNotification = (title, message, bgColor = 'bg-blue-600') => {
    const container = $('ui-notification-container');
    if (!container) return;

    const el = document.createElement('div');
    el.className = `${bgColor} text-white p-4 rounded-2xl shadow-2xl mb-4 border-4 border-white/30 animate-bounce-in min-w-[280px] text-center transform hover:scale-105 transition-transform cursor-pointer pointer-events-auto`;
    el.innerHTML = `
        <div class="text-xl font-black mb-1">${title}</div>
        <div class="font-bold text-sm">${message}</div>
    `;
    el.onclick = () => el.remove();
    container.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.remove(); }, 4000);
};

const updateMarket = () => {
    state.marketPrices = {};
    for (let key in INGREDIENTS) {
        let mult = 0.5 + Math.random(); // 0.5 ~ 1.5倍
        if (state.trend && state.trend.type === 'market') mult = 0.5; // 大暴落
        state.marketPrices[key] = Math.floor(INGREDIENTS[key].basePrice * mult);
    }
};

// --- ロジック ---
const getUnlockedRecipes = () => Object.values(state.recipes).filter(r => r.level > 0 && r.reqFranchise <= state.franchise);

const spawnCustomer = (slotIndex) => {
    if (state.activeRecipes.length === 0 || state.isPartyDay) return;

    let type = 'normal'; let isSpecial = false; let charId = null;
    let specialChance = 0.1 + (state.skills.charisma * 0.05);

    if (Math.random() < specialChance) {
        const availableVips = Object.keys(VIP_CHARS).filter(k => state.day >= VIP_CHARS[k].reqLevel && VIP_CHARS[k].reqFranchise <= state.franchise);
        if (availableVips.length > 0) { charId = randomChoice(availableVips); type = charId; isSpecial = true; }
    } else if (state.day >= 5 && Math.random() < 0.05) {
        const availableMasters = Object.values(MASTER_CHARS).filter(m => state.activeRecipes.includes(m.target) && !state.recipes[m.target].isMastered);
        if (availableMasters.length > 0) {
            const m = randomChoice(availableMasters);
            charId = m.id;
            type = 'master';
            isSpecial = true;
        }
    }

    if (!isSpecial) {
        const rand = Math.random();
        if (state.day > 2 && rand < 0.1) type = 'vip';
        else if (state.day > 1 && rand < 0.3) type = 'fast';
    }

    let orders = []; let orderCount = 1;
    if (type === 'master') {
        orders = [MASTER_CHARS[charId].target];
    } else {
        if (type === 'gordon' || type === 'alien') orderCount = 3;
        else if (type === 'mika' || type === 'aloha') orderCount = 2;
        else if (state.day > 3) orderCount = Math.floor(Math.random() * 2) + 1;

        for (let i = 0; i < orderCount; i++) orders.push(randomChoice(state.activeRecipes));
    }

    let basePatience = (type === 'fast' ? 12000 : type === 'vip' ? 16000 : 20000) + (orders.length - 1) * 3000;
    if (type === 'aloha') basePatience = 99999;
    basePatience += (state.upgrades.interior - 1) * 2000;
    if (state.trend && state.trend.type === 'speed') basePatience *= 0.7;

    let faceList = ['👨', '👩', '👦', '👧', '👵', '👴', '<img src="../../assets/images/cafe/normals/nomal1.png" class="w-full h-full object-cover p-0.5 drop-shadow-md max-w-[90%] max-h-[90%] pointer-events-none" alt="客1">', '<img src="../../assets/images/cafe/normals/nomal2.png" class="w-full h-full object-cover p-0.5 drop-shadow-md max-w-[90%] max-h-[90%] pointer-events-none" alt="客2">'];
    if (state.franchise === 4) faceList = ['🦖', '🦕', '🐊', '🦎'];
    if (state.franchise === 5) faceList = ['🤖', '🦾', '👾', '👽'];

    const face = type === 'master' ? MASTER_CHARS[charId].face :
        isSpecial ? VIP_CHARS[charId].face :
            type === 'fast' && state.franchise < 4 ? randomChoice(['🏃‍♂️', '🏃‍♀️']) : type === 'vip' && state.franchise < 4 ? randomChoice(['🕴️', '👑']) :
                randomChoice(faceList);

    state.slots[slotIndex] = {
        id: Date.now() + Math.random().toString(36).substr(2, 5),
        type: 'customer', custType: type, charId: charId, face: face, orders: orders,
        maxPatience: basePatience, patience: basePatience, state: 'thinking', thinkTime: 1500
    };
    renderGameUI();
};

const resetChain = () => {
    if (state.chain > 0) {
        const w = $('game-wrapper');
        showFloatingText('💔 CHAIN BREAK...', window.innerWidth / 2 - 50, window.innerHeight / 2, 'text-gray-500 font-black text-3xl');
    }
    state.chain = 0;
};

const gameTick = () => {
    if (state.screen !== 'game') return;
    const now = Date.now(); const delta = now - state.lastTick; state.lastTick = now;

    state.timeRemaining -= (delta / 1000);
    if (state.timeRemaining <= 0) { endDay(); return; }

    let needsRender = false;

    // フィーバー判定
    const feverStart = 15 + (state.skills.feverTime === 1 ? 3 : state.skills.feverTime === 2 ? 6 : state.skills.feverTime === 3 ? 10 : 0);
    const wasFever = state.isFever;
    state.isFever = (!state.isPartyDay && state.timeRemaining <= feverStart && state.timeRemaining >= 5);
    if (wasFever !== state.isFever) {
        const w = $('game-wrapper');
        if (w) state.isFever ? w.classList.add('fever-mode') : w.classList.remove('fever-mode');
        needsRender = true;
    }

    // 宇宙店の無重力トレイ
    if (state.franchise === 3) {
        for (let i = state.trayTimers.length - 1; i >= 0; i--) {
            state.trayTimers[i] -= delta;
            if (state.trayTimers[i] <= 0) {
                state.tray.splice(i, 1); state.trayTimers.splice(i, 1);
                resetChain(); needsRender = true;
            }
        }
    }

    // 調理プロセス
    for (const [prepId, prepData] of Object.entries(state.preparing)) {
        const recipeId = prepData.recipeId;
        if (state.troubles.broken && state.troubles.broken.recipeId === recipeId) continue;
        if (!prepData.waitingNextTap) {
            const recipe = state.recipes[recipeId];
            if (recipe && recipe.isGiant) {
                const currentDayProg = (prepData.daysSpent || 0) + 1;
                const target = prepData.duration * Math.min(1, currentDayProg / recipe.requiredDays);
                if (prepData.elapsed < target) {
                    prepData.elapsed += delta;
                    if (prepData.elapsed >= target) {
                        prepData.elapsed = target;
                        if (currentDayProg >= recipe.requiredDays) {
                            state.tray.push(recipeId);
                            if (state.franchise === 3) state.trayTimers.push(10000);
                            delete state.preparing[prepId]; needsRender = true;
                        }
                    }
                }
            } else {
                prepData.elapsed += delta;
                if (prepData.elapsed >= prepData.duration) {
                    if (prepData.step < prepData.maxSteps) {
                        prepData.waitingNextTap = true; needsRender = true;
                    } else {
                        state.tray.push(recipeId);
                        if (state.franchise === 3) state.trayTimers.push(10000); // 10秒で消える
                        delete state.preparing[prepId]; needsRender = true;
                    }
                }
            }
        }
    }

    // ペットアクション
    if (state.activePet) {
        state.petActionTimer += delta;
        const petInterval = 10000 - (state.skills.petPower * 1500); // スキルで短縮
        if (state.petActionTimer >= petInterval) {
            state.petActionTimer = 0;
            const petEl = $('pet-element');
            if (petEl) {
                petEl.classList.remove('pet-active');
                void petEl.offsetWidth; // trigger reflow
                petEl.classList.add('pet-active');
            }

            if (state.activePet === 'cat') {
                // 全員の忍耐力を少し回復
                state.slots.forEach(s => {
                    if (s && s.type === 'customer' && s.state === 'waiting') s.patience = Math.min(s.maxPatience, s.patience + 3000);
                });
                showFloatingText('🐱 にゃーん (癒やし)', 100, window.innerHeight - 150, 'text-pink-400 font-bold');
            } else if (state.activePet === 'owl') {
                // 小銭を拾う
                const coin = Math.floor(Math.random() * 300) + 100;
                state.money += coin; state.stats.totalEarned += coin;
                showFloatingText(`🦉 ホー (+¥${coin})`, 100, window.innerHeight - 150, 'text-yellow-400 font-bold');
            }
            needsRender = true;
        }
    }

    // 衛生検査員
    if (!state.troubles.inspector.active && Math.random() < 0.0002 * (delta / 100) && !state.isPartyDay) {
        state.troubles.inspector = { active: true, time: 5000 };
        showSystemNotification('🕵️‍♂️ 衛生検査！', '5秒間、お店が清潔かチェックされます…', 'bg-indigo-600');
        needsRender = true;
    }
    if (state.troubles.inspector.active) {
        state.troubles.inspector.time -= delta;
        if (state.troubles.inspector.time <= 0) {
            state.troubles.inspector.active = false;
            let dirtCount = state.slots.filter(s => s && s.type === 'dirt').length;
            if (dirtCount === 0) {
                state.money += 1000; state.stats.totalEarned += 1000; state.skillPoints += 1;
                showSystemNotification('✨ 検査合格！', '評価満点！報酬 +¥1000 & +1 SP', 'bg-green-600');
            } else {
                let penalty = dirtCount * 500; state.money = Math.max(0, state.money - penalty); resetChain();
                showSystemNotification('💦 衛生改善命令', `ゴミを放置しすぎです！罰金 -¥${penalty}`, 'bg-red-600');
            }
            needsRender = true;
        }
    }

    // ハプニング：機材故障
    if (!state.troubles.broken && Math.random() < 0.001 * (delta / 100) && Object.keys(state.preparing).length > 0) {
        const brokenPrepId = randomChoice(Object.keys(state.preparing));
        state.troubles.broken = { recipeId: state.preparing[brokenPrepId].recipeId, tapsRemaining: 5 };
        needsRender = true;
    }

    // ハプニング：泥棒
    const thiefSpeedMult = state.skills.security === 1 ? 0.8 : state.skills.security === 2 ? 0.6 : state.skills.security === 3 ? 0.4 : 1.0;
    if (state.troubles.thief.active) {
        state.troubles.thief.x += state.troubles.thief.direction * (delta * 0.05 * thiefSpeedMult);
        const el = $('thief-el');
        if (state.troubles.thief.x > 110 || state.troubles.thief.x < -20) {
            state.troubles.thief.active = false;
            const penalty = Math.min(state.money, 1000); state.money -= penalty; resetChain();
            showSystemNotification('😱 強盗成功逃亡', `お金を ¥${penalty} 盗まれました！`, 'bg-red-800');
            needsRender = true;
        } else if (el) el.style.left = `${state.troubles.thief.x}vw`;
    } else if (Math.random() < 0.0005 * (delta / 100) && state.money > 0 && !state.isPartyDay) {
        state.troubles.thief = { active: true, x: -10, direction: 1 };
        needsRender = true;
    }

    // デリバリー
    if (state.delivery.active) {
        state.delivery.time -= delta / 1000;
        if (state.delivery.time <= 0) { state.delivery.active = false; resetChain(); needsRender = true; }
        else { const bar = $('delivery-bar'); if (bar) bar.style.width = `${(state.delivery.time / state.delivery.maxTime) * 100}%`; }
    } else if (Math.random() < 0.001 * (delta / 100) && !state.isPartyDay) {
        generateDelivery(); needsRender = true;
    }

    // 顧客処理
    if (!state.isPartyDay) {
        for (let i = 0; i < state.slots.length; i++) {
            const slot = state.slots[i];
            if (slot && slot.type === 'customer') {
                if (slot.state === 'thinking') {
                    slot.thinkTime -= delta;
                    if (slot.thinkTime <= 0) { slot.state = 'waiting'; needsRender = true; }
                } else if (slot.state === 'waiting') {
                    const patienceDecayMult = 1 - (state.skills.patienceBreath || 0) * 0.15;
                    slot.patience -= delta * (state.isFever ? 0.3 : 1) * patienceDecayMult;
                    if (slot.patience <= 0) {
                        state.lostToday++; state.reputation = clamp(state.reputation - 0.2, 1.0, 5.0);
                        const rect = document.getElementById(`slot-${i}`)?.getBoundingClientRect();
                        if (rect) showFloatingText('💢', rect.left + 30, rect.top, 'text-red-600 text-3xl');
                        state.slots[i] = Math.random() < 0.3 ? { type: 'dirt' } : null;
                        resetChain(); needsRender = true;
                    }
                }
            }
        }

        let spawnChance = (delta / 1000) * (0.2 + (state.day * 0.05));
        if (state.mikaBoost) spawnChance *= 1.5;
        if (state.isFever) spawnChance *= 2.5;

        const emptyIndices = state.slots.map((s, idx) => s === null ? idx : -1).filter(idx => idx !== -1);
        if (emptyIndices.length > 0 && Math.random() < spawnChance) spawnCustomer(emptyIndices[0]);
    }

    // 自動化スタッフ
    state.staffTimer += delta;
    if (state.staffTimer >= 1000) {
        state.staffTimer = 0;
        if (state.staff.barista > 0 || state.staff.cook > 0) {
            const getReqs = (type) => {
                const reqs = state.isPartyDay
                    ? state.party.reqs.filter(r => state.recipes[r.id].type === type && r.curr < r.max).flatMap(r => Array(r.max - r.curr).fill(r.id))
                    : state.slots.filter(s => s && s.type === 'customer' && s.state === 'waiting').flatMap(s => s.orders).filter(id => state.recipes[id].type === type);
                
                // 必要数から、すでにトレイにある分と調理中の分を差し引く
                const counts = {};
                reqs.forEach(id => counts[id] = (counts[id] || 0) + 1);
                
                const finalReqs = [];
                for (const [id, needed] of Object.entries(counts)) {
                    const onTray = state.tray.filter(tid => tid === id).length;
                    const inPrep = [id, id + '_0', id + '_1'].filter(pid => state.preparing[pid]).length;
                    const toMake = needed - (onTray + inPrep);
                    for (let i = 0; i < toMake; i++) finalReqs.push(id);
                }
                return shuffleArray(finalReqs); // ランダム化
            };

            const processStaff = (type, power) => {
                const reqs = getReqs(type);
                let pCount = power;
                for (let rId of reqs) {
                    if (pCount <= 0) break;
                    
                    const pIds = state.upgrades.dualMachine ? [rId + '_0', rId + '_1'] : [rId];
                    let acted = false;

                    // 1. 完了タップや修理を優先
                    for (const pid of pIds) {
                        const pData = state.preparing[pid];
                        if (pData && pData.waitingNextTap) {
                            pData.step++; pData.elapsed = 0; pData.waitingNextTap = false; pCount--; acted = true; break;
                        }
                    }
                    if (acted) continue;

                    // 2. 修理が必要な場合はスタッフは手を出せない（プレイヤーがやるべき）
                    if (state.troubles.broken && state.troubles.broken.recipeId === rId) continue;

                    // 3. 新規開始
                    for (const pid of pIds) {
                        if (!state.preparing[pid] && state.tray.length + Object.keys(state.preparing).length < state.upgrades.traySize) {
                            if (startPrep(rId, pid, true)) { pCount--; acted = true; break; }
                        }
                    }
                }
            };

            if (state.staff.barista > 0) processStaff('drink', state.staff.barista);
            if (state.staff.cook > 0) processStaff('food', state.staff.cook);
            needsRender = true;
        }

        if (state.staff.cleaner > 0 && !state.isPartyDay) {
            let pCount = state.staff.cleaner;
            for (let i = 0; i < state.slots.length; i++) {
                if (pCount <= 0) break;
                if (state.slots[i] && state.slots[i].type === 'dirt') {
                    state.slots[i] = null; pCount--; needsRender = true;
                }
            }
        }

        if (state.staff.server > 0 && !state.isPartyDay) {
            const serveSlotIdx = state.slots.findIndex(s => s && s.type === 'customer' && s.state === 'waiting' && canServe(s));
            if (serveSlotIdx !== -1) serveCustomer(serveSlotIdx, null);
        }
    }

    if (needsRender || Math.floor(state.timeRemaining) !== Math.floor(state.timeRemaining + (delta / 1000))) renderGameUI();
    else updateDynamicUI();
};

const generateDelivery = () => {
    const available = state.activeRecipes.filter(r => !state.recipes[r].isGiant);
    if (available.length === 0) return;
    const numOrders = Math.floor(Math.random() * 3) + 2;
    const orders = [];
    let reward = 0;
    for (let i = 0; i < numOrders; i++) {
        const oId = randomChoice(available);
        orders.push(oId);
        reward += state.recipes[oId].basePrice * 1.5;
    }
    state.delivery = { active: true, orders: orders, fulfilled: [], time: 40, maxTime: 40, reward: Math.floor(reward) };
};

const setupParty = () => {
    state.isPartyDay = true;
    const available = state.activeRecipes.filter(r => !state.recipes[r].isGiant);
    const reqs = [];
    const count = Math.min(3, available.length);
    for (let i = 0; i < count; i++) {
        reqs.push({
            id: available[i],
            curr: 0,
            max: Math.floor(Math.random() * 3) + 3
        });
    }
    state.party = {
        active: true,
        reqs: reqs
    };
    state.trend = { type: 'party', text: '今日は貸切パーティ！食材消費なしで料理が作れます！' };
};

const startDay = () => {
    state.screen = 'game';
    state.timeRemaining = GAME_CONFIG.dayDuration;
    state.earnedToday = 0; state.satisfiedToday = 0; state.lostToday = 0;
    state.slots = [null, null, null, null, null];
    const preserved = {};
    for (const [id, pData] of Object.entries(state.preparing)) {
        if (state.recipes[pData.recipeId] && state.recipes[pData.recipeId].isGiant) preserved[id] = pData;
    }
    state.tray = []; state.trayTimers = []; state.preparing = preserved;
    state.troubles = { broken: null, thief: { active: false, x: 0, direction: 1 }, inspector: { active: false, time: 0 } };
    state.delivery = { active: false, orders: [], fulfilled: [], time: 0, maxTime: 0, reward: 0 };
    state.petActionTimer = 0; state.aceManagerUsed = false;
    state.chain = 0;
    state.lastTick = Date.now();

    if (state.day > 0 && state.day % 7 === 0) setupParty();
    else state.isPartyDay = false;

    if (state.gameLoopId) clearInterval(state.gameLoopId);
    state.gameLoopId = setInterval(gameTick, 1000 / GAME_CONFIG.fps);
    renderApp();
};

const endDay = () => {
    clearInterval(state.gameLoopId);

    // 巨大レシピの日数経過
    for (const id in state.preparing) {
        const pData = state.preparing[id];
        if (state.recipes[pData.recipeId] && state.recipes[pData.recipeId].isGiant) {
            pData.daysSpent = (pData.daysSpent || 0) + 1;
        }
    }

    // 店長による自動売上
    let passiveIncome = 0;
    if (state.managers[1]) passiveIncome += 10000 + Math.floor(Math.random() * 5000);
    if (state.managers[2]) passiveIncome += 20000 + Math.floor(Math.random() * 10000);
    if (state.managers[3]) passiveIncome += 50000 + Math.floor(Math.random() * 20000);
    if (state.managers[4]) passiveIncome += 100000 + Math.floor(Math.random() * 50000);

    // M&A（チェーン買収）による自動売上
    if (state.acquiredRivals > 0) {
        let maIncome = 100000 * Math.pow(2.5, state.acquiredRivals - 1) + Math.floor(Math.random() * 50000 * state.acquiredRivals);
        passiveIncome += maIncome;
    }

    if (passiveIncome > 0) {
        state.money += passiveIncome; state.stats.totalEarned += passiveIncome;
        showFloatingText(`🏢 過去店舗の売上 +¥${passiveIncome}`, window.innerWidth / 2 - 100, window.innerHeight / 2, 'text-blue-500 font-black text-3xl');
    }

    // 農園による収穫
    let harvestLog = [];
    let isFertilized = state.fertilizer > 0;
    let yieldMult = isFertilized ? 2 : 1;
    let farmUsed = false;
    for (let key in state.farm) {
        if (state.farm[key] > 0) {
            let amount = FARM_ITEMS[key].yield * state.farm[key] * yieldMult;
            state.inventory[key] += amount;
            harvestLog.push(`${FARM_ITEMS[key].icon}${amount}`);
            farmUsed = true;
        }
    }
    if (farmUsed && isFertilized) state.fertilizer--;
    if (harvestLog.length > 0) {
        setTimeout(() => showFloatingText(`🌾 収穫: ${harvestLog.join(' ')}`, window.innerWidth / 2 - 120, window.innerHeight / 2 - 60, 'text-green-500 font-black text-2xl'), 1500);
    }

    const earnedSP = Math.floor(state.earnedToday / 5000);
    state.skillPoints += earnedSP;

    checkAchievements();

    if (state.day % 10 === 0 && !state.isPartyDay) state.screen = 'rival';
    else state.screen = 'day_end';

    state.day++; state.mikaBoost = false;
    saveGame(); renderApp();
};

// --- インタラクション ---
const startPrep = (recipeId, prepId, isAuto = false) => {
    if (state.preparing[prepId]) return false;
    if (state.troubles.broken && state.troubles.broken.recipeId === recipeId) return false;
    if (state.tray.length + Object.keys(state.preparing).length >= state.upgrades.traySize) return false;

    const recipe = state.recipes[recipeId];

    // 食材消費チェック
    let canCook = true;
    if (!state.isPartyDay) {
        for (let key in recipe.reqs) { if (state.inventory[key] < recipe.reqs[key]) canCook = false; }
    }
    if (!canCook) return false;

    // 食材消費
    if (!state.isPartyDay) {
        for (let key in recipe.reqs) { state.inventory[key] -= recipe.reqs[key]; }
    }

    let duration = recipe.baseTime * Math.pow(0.85, state.upgrades.equipment - 1);
    state.preparing[prepId] = { recipeId: recipeId, elapsed: 0, duration: duration, step: 1, maxSteps: recipe.steps, waitingNextTap: false, daysSpent: 0 };
    return true;
};

const canServe = (customer) => {
    let tempTray = [...state.tray];
    for (let oid of customer.orders) {
        const idx = tempTray.indexOf(oid);
        if (idx === -1) return false;
        tempTray.splice(idx, 1);
    }
    return true;
};

const serveCustomer = (slotIndex, btnEl) => {
    const slot = state.slots[slotIndex];
    if (!slot || slot.type !== 'customer' || slot.state !== 'waiting') return;

    if (canServe(slot)) {
        // トレイから削除 (宇宙店対応)
        slot.orders.forEach(oid => {
            const idx = state.tray.indexOf(oid);
            state.tray.splice(idx, 1);
            if (state.franchise === 3) state.trayTimers.splice(idx, 1);
        });

        let price = 0;
        slot.orders.forEach(oid => {
            let p = state.recipes[oid].basePrice * (1 + (state.recipes[oid].level - 1) * 0.2);
            if (state.trend && (state.trend.type === 'all' || state.trend.target === oid)) p *= state.trend.mult;
            price += p;
        });

        let comboMult = slot.orders.length === 2 ? 1.2 : slot.orders.length >= 3 ? 1.5 : 1.0;
        price *= comboMult;

        const patienceRatio = slot.patience / slot.maxPatience;
        let tipMult = 1.0;
        const isPerfect = patienceRatio > 0.6;

        if (isPerfect) {
            tipMult = 1.5; state.chain++;
            if (state.chain > state.stats.maxChain) state.stats.maxChain = state.chain;
        } else {
            if (patienceRatio > 0.3) tipMult = 1.2;
            resetChain();
        }

        // チェインボーナス
        const chainBonus = Math.floor(state.chain / 5) * 0.5;
        tipMult += chainBonus;

        tipMult += (state.upgrades.interior - 1) * 0.1;
        tipMult *= (state.reputation / 3.0);

        if (state.staff.server === 2) tipMult += 0.2;

        if (slot.custType === 'vip') tipMult *= 3;
        if (slot.custType === 'gordon') { tipMult *= 5; if (isPerfect && state.affinities.gordon < 5) state.affinities.gordon++; }
        if (slot.custType === 'mika') { if (isPerfect) { if (state.affinities.mika < 5) state.affinities.mika++; state.mikaBoost = true; } }
        if (slot.custType === 'aloha') { tipMult *= 1.5; if (isPerfect && state.affinities.aloha < 5) state.affinities.aloha++; }
        if (slot.custType === 'alien') { tipMult *= 8; if (isPerfect && state.affinities.alien < 5) state.affinities.alien++; }

        let isGiantCombo = false;
        slot.orders.forEach(oid => { if (state.recipes[oid].isGiant) isGiantCombo = true; });
        if (isGiantCombo) {
            tipMult *= 50; state.reputation = 5.0;
            showFloatingText('👑 伝説のレシピ完成!!', window.innerWidth / 2 - 100, window.innerHeight / 2, 'text-yellow-300 font-black text-4xl');
        }

        if (state.affinities.gordon >= 5 && slot.custType === 'gordon') tipMult *= 1.5;

        if (slot.custType === 'master') {
            if (isPerfect) {
                const trId = MASTER_CHARS[slot.charId].target;
                state.recipes[trId].isMastered = true;
                state.recipes[trId].basePrice *= 5; // 大幅強化
                state.recipes[trId].name = `【究極】${state.recipes[trId].name}`;
                showFloatingText(`✨ ${MASTER_CHARS[slot.charId].name}から免許皆伝!!`, window.innerWidth / 2 - 100, window.innerHeight / 2, 'text-yellow-400 font-black text-3xl');
            } else {
                showFloatingText(`「修行の道は険しいぞ…」`, window.innerWidth / 2 - 100, window.innerHeight / 2, 'text-gray-400 font-bold text-xl');
            }
        }

        // 売上加算
        const luckyChanceProb = 0.1 + (state.skills.luckyChance || 0) * 0.05;
        let finalPrice = price * tipMult;
        if (Math.random() < luckyChanceProb) {
            finalPrice *= 2;
            showFloatingText('✨ LUCKY! x2 ✨', window.innerWidth / 2 - 50, 150, 'text-yellow-400 font-black text-3xl');
        }

        const earned = Math.floor(finalPrice);
        state.money += earned; state.earnedToday += earned; state.satisfiedToday++;
        state.stats.totalEarned += earned;
        state.stats.maxChain = Math.max(state.stats.maxChain || 0, state.chain);
        if (isPerfect) state.stats.perfectServes++;
        checkAchievements();

        state.reputation = clamp(state.reputation + (isPerfect ? 0.05 : 0.01), 1.0, 5.0);

        if (btnEl) {
            const rect = btnEl.getBoundingClientRect();
            showFloatingText(`+${formatMoney(earned)}${chainBonus > 0 ? `<br><span class="text-sm text-yellow-300">${state.chain} CHAIN!</span>` : ''}`, rect.left + 20, rect.top, 'text-green-600 font-black');
        }

        state.slots[slotIndex] = Math.random() < 0.2 ? { type: 'dirt' } : null;
        renderGameUI();
    } else {
        if (btnEl) { btnEl.classList.add('bg-red-200'); setTimeout(() => btnEl.classList.remove('bg-red-200'), 200); }
    }
};

const handleAction = (e) => {
    if (!isBgmInitialized && !isBgmMuted) {
        playBGM();
    }

    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const { action, id, index } = btn.dataset;

    if (action === 'toggle-bgm') {
        toggleBGM();
        return;
    }

    if (action === 'new-game') {
        localStorage.removeItem(SAVE_KEY); state = getInitialState();
        state.trend = randomChoice(TRENDS); updateMarket();
        state.activeRecipes = getUnlockedRecipes().map(r => r.id).slice(0, GAME_CONFIG.maxMenuSelection);
        state.screen = 'prep'; saveGame(); renderApp();
    }
    else if (action === 'load-game') {
        if (loadGame()) {
            state.trend = randomChoice(TRENDS); updateMarket();
            const unlocked = getUnlockedRecipes().map(r => r.id);
            if (state.activeRecipes.length === 0) state.activeRecipes = unlocked.slice(0, GAME_CONFIG.maxMenuSelection);
            state.screen = 'prep'; renderApp();
        }
    }
    else if (action === 'goto-collection') { state.screen = 'collection'; renderApp(); }
    else if (action === 'goto-title') { state.screen = 'title'; renderApp(); }
    else if (action === 'change-shop-tab') { state.shopTab = id; renderApp(); }
    else if (action === 'change-prep-tab') { state.prepTab = id; renderApp(); }
    else if (action === 'goto-prep') {
        state.trend = randomChoice(TRENDS); updateMarket();
        const unlocked = getUnlockedRecipes().map(r => r.id);
        if (unlocked.length <= GAME_CONFIG.maxMenuSelection) state.activeRecipes = [...unlocked];
        else state.activeRecipes = unlocked.slice(0, GAME_CONFIG.maxMenuSelection);
        state.screen = 'prep'; renderApp();
    }
    else if (action === 'toggle-menu') {
        const idx = state.activeRecipes.indexOf(id);
        if (idx !== -1) { if (state.activeRecipes.length > 1) state.activeRecipes.splice(idx, 1); }
        else { if (state.activeRecipes.length < GAME_CONFIG.maxMenuSelection) state.activeRecipes.push(id); }
        renderApp();
    }
    else if (action === 'buy-ing') {
        const price = state.marketPrices[id];
        if (state.money >= price) { state.money -= price; state.inventory[id] += 5; renderApp(); }
    }
    else if (action === 'start-game') startDay();
    else if (action === 'go-shop') { state.screen = 'shop'; renderApp(); }
    else if (action === 'finish-rival') { state.screen = 'day_end'; renderApp(); }
    else if (action === 'buyout-rival') {
        const cost = parseInt(btn.dataset.cost);
        if (state.money >= cost) {
            state.money -= cost;
            state.acquiredRivals++;
            saveGame(); renderApp();
            const r = btn.getBoundingClientRect();
            showFloatingText('🏢 M&A 成立!!', r.left + 50, r.top - 20, 'text-purple-400 font-black text-3xl');
        }
    }

    else if (action === 'prep-item') {
        const recipeId = id;
        const pIds = state.upgrades.dualMachine ? [recipeId + '_0', recipeId + '_1'] : [recipeId];
        
        // 修理優先
        if (state.troubles.broken && state.troubles.broken.recipeId === recipeId) {
            state.troubles.broken.tapsRemaining--;
            if (state.troubles.broken.tapsRemaining <= 0) {
                state.troubles.broken = null;
                const r = btn.getBoundingClientRect(); showFloatingText('🛠 修理完了!', r.left, r.top, 'text-blue-600');
            }
            renderGameUI(); return;
        }

        // 完了タップ優先
        let targetId = null;
        for(const pid of pIds) {
            if (state.preparing[pid] && state.preparing[pid].waitingNextTap) {
                targetId = pid; break;
            }
        }

        if (targetId) {
            const pData = state.preparing[targetId];
            pData.step++; pData.elapsed = 0; pData.waitingNextTap = false; renderGameUI();
        } else {
            // 新規開始（空いているスロットを探す）
            let emptyId = pIds.find(pid => !state.preparing[pid]);
            if (emptyId) {
                if (!startPrep(recipeId, emptyId)) { btn.classList.add('bg-red-300'); setTimeout(() => btn.classList.remove('bg-red-300'), 200); }
                else renderGameUI();
            } else {
                // 両方埋まっている場合
                btn.classList.add('bg-red-300'); setTimeout(() => btn.classList.remove('bg-red-300'), 200);
            }
        }
    }
    else if (action === 'serve-customer') serveCustomer(parseInt(index), btn);
    else if (action === 'clean-dirt') {
        state.slots[parseInt(index)] = null;
        const r = btn.getBoundingClientRect(); showFloatingText('✨ ピカピカ!', r.left, r.top, 'text-blue-500');
        renderGameUI();
    }
    else if (action === 'use-candy') {
        e.stopPropagation();
        if (state.candies > 0) {
            const slot = state.slots[parseInt(index)];
            if (slot && slot.type === 'customer' && slot.state === 'waiting') {
                state.candies--; slot.patience = slot.maxPatience;
                const r = btn.getBoundingClientRect(); showFloatingText('🍬 ご機嫌!', r.left, r.top - 20, 'text-pink-500 font-bold');
                renderGameUI();
            }
        }
    }
    else if (action === 'tray-click') {
        const itemIdx = parseInt(index); const itemId = state.tray[itemIdx];
        if (state.isPartyDay) {
            let req = state.party.reqs.find(r => r.id === itemId);
            if (req && req.curr < req.max) {
                req.curr++; state.tray.splice(itemIdx, 1);
                if (state.franchise === 3) state.trayTimers.splice(itemIdx, 1);
                const r = btn.getBoundingClientRect(); showFloatingText('🎉 納品!', r.left, r.top, 'text-pink-500 font-black');

                if (state.party.reqs.every(r => r.curr >= r.max)) {
                    state.money += 20000; state.stats.totalEarned += 20000; state.stats.partyCleared++;
                    showFloatingText('🎊 パーティ成功!! +¥20,000', window.innerWidth / 2 - 100, window.innerHeight / 2, 'text-yellow-400 font-black text-4xl');
                    state.timeRemaining = 0;
                }
                renderGameUI(); return;
            }
        }
        else if (state.delivery.active) {
            let needed = state.delivery.orders.filter(o => o === itemId).length;
            let done = state.delivery.fulfilled.filter(o => o === itemId).length;
            if (done < needed) {
                state.tray.splice(itemIdx, 1); state.delivery.fulfilled.push(itemId);
                if (state.franchise === 3) state.trayTimers.splice(itemIdx, 1);
                const r = btn.getBoundingClientRect(); showFloatingText('🛵 梱包!', r.left, r.top, 'text-green-500');
                renderGameUI(); return;
            }
        }
        state.tray.splice(itemIdx, 1);
        if (state.franchise === 3) state.trayTimers.splice(itemIdx, 1);
        state.money = Math.max(0, state.money - 50); resetChain();
        const r = btn.getBoundingClientRect(); showFloatingText('-¥50', r.left, r.top, 'text-red-500');
        renderGameUI();
    }
    else if (action === 'send-delivery') {
        if (state.delivery.active && state.delivery.fulfilled.length === state.delivery.orders.length) {
            state.money += state.delivery.reward; state.stats.totalEarned += state.delivery.reward;
            state.earnedToday += state.delivery.reward; state.delivery.active = false;
            const r = btn.getBoundingClientRect(); showFloatingText(`+${formatMoney(state.delivery.reward)}!`, r.left, r.top, 'text-yellow-500 font-black text-2xl');
            renderGameUI();
        }
    }
    else if (action === 'use-ace') {
        if (!state.hasAceManager || state.aceManagerUsed) return;
        state.aceManagerUsed = true;
        if (state.troubles.broken) state.troubles.broken = null;
        if (state.troubles.thief.active) {
            state.troubles.thief.active = false; state.money += 500; state.stats.thiefCaught++;
        }
        state.slots.forEach(s => {
            if (s && s.type === 'customer' && s.state === 'waiting') s.patience = s.maxPatience;
        });
        showFloatingText('🦸‍♀️ スーパー・レスキュー!!', window.innerWidth / 2 - 150, window.innerHeight / 2, 'text-purple-400 font-black text-4xl');
        renderGameUI();
    }
    else if (action === 'catch-thief') {
        if (state.troubles.thief.active) {
            state.troubles.thief.active = false; state.money += 500; state.stats.thiefCaught++;
            const r = btn.getBoundingClientRect(); showFloatingText('👮 逮捕! +¥500', r.left, r.top - 30, 'text-blue-600 font-black text-3xl');
            renderGameUI();
        }
    }
    else if (action === 'buy-item') {
        const { itemType, id } = btn.dataset;
        let updated = false;
        if (itemType === 'recipe_unlock' && state.money >= state.recipes[id].unlockCost) {
            state.money -= state.recipes[id].unlockCost; state.recipes[id].level = 1; updated = true;
        } else if (itemType === 'recipe_up' && state.money >= state.recipes[id].basePrice * 2 * state.recipes[id].level) {
            state.money -= state.recipes[id].basePrice * 2 * state.recipes[id].level; state.recipes[id].level++; updated = true;
        } else if (itemType === 'candy' && state.money >= 500) {
            state.money -= 500; state.candies++; updated = true;
        } else if (itemType === 'fertilizer' && state.money >= 2000) {
            state.money -= 2000; state.fertilizer++; updated = true;
        } else if (itemType === 'staff') {
            const currentLv = state.staff[id];
            const cost = currentLv === 0 ? (id === 'cleaner' ? 8000 : id === 'cook' ? 12000 : id === 'server' ? 15000 : 10000) : (id === 'cleaner' ? 15000 : 20000);
            if (state.money >= cost && currentLv < 2) { state.money -= cost; state.staff[id]++; updated = true; }
        } else if (itemType === 'pet') {
            const cost = PETS[id].cost;
            if (state.money >= cost && !state.pets[id]) { state.money -= cost; state.pets[id] = true; state.activePet = id; updated = true; }
        } else if (itemType === 'set-pet') {
            state.activePet = id; updated = true;
        } else if (itemType === 'aceManager') {
            if (state.money >= 1000000 && !state.hasAceManager) { state.money -= 1000000; state.hasAceManager = true; updated = true; }
        } else if (itemType === 'farm') {
            const currentLv = state.farm[id];
            const cost = FARM_ITEMS[id].cost * Math.pow(1.5, currentLv);
            if (state.money >= cost) { state.money -= cost; state.farm[id]++; updated = true; }
        } else if (itemType === 'manager') {
            const cost = parseInt(btn.dataset.cost) || 50000;
            if (state.staff.barista === 2 && state.staff.server === 2 && state.money >= cost && !state.managers[id]) {
                state.money -= cost; state.managers[id] = true; updated = true;
            }
        } else if (itemType === 'system') {
            if (id === 'interior') { const c = 1000 * Math.pow(1.5, state.upgrades.interior - 1); if (state.money >= c && state.upgrades.interior < 5) { state.money -= c; state.upgrades.interior++; updated = true; } }
            if (id === 'equipment') { const c = 1500 * Math.pow(1.5, state.upgrades.equipment - 1); if (state.money >= c && state.upgrades.equipment < 5) { state.money -= c; state.upgrades.equipment++; updated = true; } }
            if (id === 'traySize') { const c = 3000 * (state.upgrades.traySize - 2); if (state.money >= c && state.upgrades.traySize < 6) { state.money -= c; state.upgrades.traySize++; updated = true; } }
            if (id === 'dualMachine') { if (state.money >= 30000 && !state.upgrades.dualMachine) { state.money -= 30000; state.upgrades.dualMachine = true; updated = true; } }
            if (id.startsWith('franchise')) {
                const fId = parseInt(id.replace('franchise', ''));
                let cost = 0; let t = '';
                if (fId === 2) { cost = 100000; t = 'hawaii'; }
                else if (fId === 3) { cost = 300000; t = 'space'; }
                else if (fId === 4) { cost = 500000; t = 'dino'; }
                else if (fId === 5) { cost = 1000000; t = 'cyber'; }

                if (state.franchise === fId - 1 && state.money >= cost) {
                    state.money -= cost; state.franchise = fId;
                    if (!state.unlockedThemes.includes(t)) state.unlockedThemes.push(t);
                    state.currentTheme = t; updated = true;
                }
            }
        } else if (itemType === 'theme') {
            if (state.unlockedThemes.includes(id)) { state.currentTheme = id; updated = true; }
            else if (state.money >= THEMES.find(t => t.id === id).cost) { state.money -= THEMES.find(t => t.id === id).cost; state.unlockedThemes.push(id); state.currentTheme = id; updated = true; }
        } else if (itemType === 'skill') {
            const sData = SKILLS[id]; const currentLv = state.skills[id];
            if (currentLv < sData.maxLv && state.skillPoints >= sData.costs[currentLv]) {
                state.skillPoints -= sData.costs[currentLv]; state.skills[id]++; updated = true;
            }
        }
        if (updated) { saveGame(); renderApp(); }
    }
};

// --- レンダリング ---
const getPatienceColor = (ratio) => ratio > 0.6 ? 'bg-green-500' : ratio > 0.3 ? 'bg-yellow-400' : 'bg-red-500';
const renderStars = (rating) => {
    let h = '';
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) h += '<span class="text-yellow-400">★</span>';
        else if (rating >= i - 0.5) h += '<span class="text-yellow-400">⯨</span>';
        else h += '<span class="text-gray-300">★</span>';
    }
    return `<span class="text-xl">${h}</span> <span class="font-bold text-gray-600">${rating.toFixed(1)}</span>`;
};

const updateDynamicUI = () => {
    if (state.screen !== 'game') return;
    const timeEl = $('ui-time');
    if (timeEl) {
        timeEl.innerHTML = `⏱ 残り ${Math.ceil(state.timeRemaining)}秒`;
        state.isFever ? timeEl.classList.add('text-yellow-300', 'animate-pulse') : timeEl.classList.remove('text-yellow-300', 'animate-pulse');
    }
    for (const [prepId, pData] of Object.entries(state.preparing)) {
        const bar = $(`prep-bar-${prepId}`);
        if (bar && !pData.waitingNextTap) bar.style.width = `${(pData.elapsed / pData.duration) * 100}%`;
    }
    if (!state.isPartyDay) {
        state.slots.forEach((s, i) => {
            if (s && s.type === 'customer' && s.state === 'waiting') {
                const bar = $(`patience-bar-${s.id}`);
                if (bar) {
                    const ratio = s.patience / s.maxPatience;
                    bar.style.width = `${ratio * 100}%`; bar.className = `h-full progress-bar-inner ${getPatienceColor(ratio)}`;
                }
            }
        });
    }
    if (state.franchise === 3) {
        state.trayTimers.forEach((time, i) => {
            const el = $(`tray-time-${i}`);
            if (el) el.style.width = `${(time / 10000) * 100}%`;
        });
    }
};

const renderGameUI = () => {
    if (state.screen !== 'game') return;

    $('ui-money').textContent = formatMoney(state.money);
    $('ui-candies').textContent = state.candies;
    $('ui-chain').innerHTML = `🔥 CHAIN: <span class="text-2xl">${state.chain}</span>`;
    if (state.chain > 0) $('ui-chain').classList.add('animate-pulse', 'text-yellow-300');
    else $('ui-chain').classList.remove('animate-pulse', 'text-yellow-300');

    // 在庫表示
    let invHtml = '';
    const ingKeys = ['beans', 'bread', 'meat', 'fruits', 'sweets', 'space_dust'];
    ingKeys.forEach(key => {
        const ing = INGREDIENTS[key];
        const count = state.inventory[key];
        invHtml += `<div class="flex flex-col items-center px-1" title="${ing.name}"><span class="text-xl md:text-2xl">${ing.icon}</span><span class="text-xs font-black ${count === 0 ? 'text-red-600' : 'text-gray-700'}">${count}</span></div>`;
    });
    if ($('ui-inventory')) $('ui-inventory').innerHTML = invHtml;

    // トレイ
    let trayHtml = '';
    for (let i = 0; i < state.upgrades.traySize; i++) {
        if (i < state.tray.length) {
            const icon = state.recipes[state.tray[i]].icon;
            const timerBar = state.franchise === 3 ? `<div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-800"><div id="tray-time-${i}" class="h-full bg-blue-400" style="width:${(state.trayTimers[i] / 10000) * 100}%"></div></div>` : '';
            trayHtml += `<div class="relative w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl shadow border-2 border-amber-200 flex items-center justify-center text-2xl md:text-3xl tray-item hover:scale-110 cursor-pointer transition-transform ${state.franchise === 3 ? 'space-float' : ''}" data-action="tray-click" data-index="${i}" overflow-hidden>${icon}${timerBar}</div>`;
        } else {
            trayHtml += `<div class="w-12 h-12 md:w-16 md:h-16 bg-black/10 rounded-xl border-2 border-black/20 border-dashed flex items-center justify-center text-black/30 text-[10px] md:text-sm">空き</div>`;
        }
    }
    $('ui-tray').innerHTML = trayHtml;

    // キッチン
    let kitchenHtml = '';
    state.activeRecipes.forEach(rId => {
        const r = state.recipes[rId];
        const pIds = state.upgrades.dualMachine ? [rId + '_0', rId + '_1'] : [rId];
        
        // 表示用の状態（スロットが複数ある場合は優先度の高いものをメインに表示）
        let mainPid = pIds.find(pid => state.preparing[pid]?.waitingNextTap) || pIds.find(pid => state.preparing[pid]) || pIds[0];
        const pData = state.preparing[mainPid];
        const isBroken = state.troubles.broken && state.troubles.broken.recipeId === r.id;
        const isPrep = !!pData;
        const waitingTap = isPrep && pData.waitingNextTap;

        let displayIcon = r.icon;
        let stepText = '';
        if (r.isGiant) {
            stepText = `<div class="text-[8px] md:text-xs text-purple-600 font-bold bg-purple-100 rounded-full px-2 mt-1 line-clamp-1">${(pData ? pData.daysSpent || 0 : 0) + 1}日目 仕込</div>`;
        } else if (r.steps > 1) {
            const step = isPrep ? pData.step : 1;
            displayIcon = r.stepIcons[step - 1];
            stepText = `<div class="text-[8px] md:text-xs text-blue-600 font-bold bg-blue-100 rounded-full px-2 mt-1">工程 ${step}/${r.steps}</div>`;
        }

        // デュアルインジケーター
        let slotDashes = '';
        if (state.upgrades.dualMachine) {
            const s1Busy = !!state.preparing[rId + '_0'];
            const s2Busy = !!state.preparing[rId + '_1'];
            slotDashes = `
                <div class="absolute top-1 right-1 flex gap-0.5">
                    <div class="w-1.5 h-1.5 rounded-full ${s1Busy ? 'bg-orange-500 animate-pulse' : 'bg-gray-200'}"></div>
                    <div class="w-1.5 h-1.5 rounded-full ${s2Busy ? 'bg-orange-500 animate-pulse' : 'bg-gray-200'}"></div>
                </div>
            `;
        }

        // 食材チェック
        let canCook = true;
        for (let key in r.reqs) { if (state.inventory[key] < r.reqs[key]) canCook = false; }
        const outOfStock = !canCook && !pIds.some(pid => state.preparing[pid]);

        kitchenHtml += `
            <div class="relative bg-white/90 backdrop-blur p-2 md:p-3 rounded-xl md:rounded-2xl shadow-md border-b-2 md:border-b-4 border-amber-300 cursor-pointer hover:bg-white active:translate-y-1 transition-all flex flex-col items-center justify-center ${isPrep && !waitingTap && !isBroken ? 'is-preparing' : ''} ${waitingTap ? 'waiting-tap' : ''} ${isBroken ? 'broken-machine' : ''} ${outOfStock ? 'grayscale opacity-50' : ''}"
                 data-action="prep-item" data-id="${r.id}">
                ${slotDashes}
                <div class="text-2xl md:text-3xl mb-1 ${isBroken ? 'opacity-50' : ''}">${displayIcon}</div>
                <div class="font-black text-gray-700 text-[8px] md:text-xs text-center leading-tight whitespace-nowrap overflow-hidden text-ellipsis w-full px-1">${r.name}</div>
                ${stepText}
                ${waitingTap && !isBroken ? `<div class="absolute inset-0 flex items-center justify-center bg-white/40 font-black text-red-500 rounded-xl md:rounded-2xl text-[10px] md:text-sm animate-pulse">TAP!</div>` : ''}
                ${isBroken ? `<div class="absolute inset-0 flex items-center justify-center bg-red-500/80 text-white font-black rounded-xl md:rounded-2xl text-[8px] md:text-xs text-center leading-tight">故障!<br>連打</div>` : ''}
                ${outOfStock ? `<div class="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-black rounded-xl md:rounded-2xl text-[10px] md:text-sm text-center">不足</div>` : ''}
                ${isPrep && !waitingTap && !isBroken ? `<div class="absolute inset-x-1.5 bottom-1 flex flex-col gap-0.5">
                    ${pIds.map(pid => {
                        const pd = state.preparing[pid];
                        if (pd && !pd.waitingNextTap) {
                            return `<div class="h-1 bg-gray-200 rounded-full overflow-hidden w-full"><div id="prep-bar-${pid}" class="h-full bg-amber-500 progress-bar-inner" style="width: ${(pd.elapsed / pd.duration) * 100}%"></div></div>`;
                        }
                        return '';
                    }).join('')}
                </div>` : ''}
            </div>
        `;
    });
    $('ui-kitchen').innerHTML = kitchenHtml;
    $('ui-kitchen').innerHTML = kitchenHtml;

    // 顧客領域
    if (state.isPartyDay) {
        let partyHtml = `<div class="bg-pink-100 p-6 rounded-2xl border-4 border-pink-300 shadow-xl flex-1 flex flex-col items-center justify-center text-center"><div class="text-5xl mb-4 animate-bounce">🎉</div><h2 class="text-3xl font-black text-pink-600 mb-6">貸切パーティ 開催中！</h2><div class="w-full max-w-sm flex flex-col gap-4">`;
        state.party.reqs.forEach(req => {
            const r = state.recipes[req.id]; const ratio = req.curr / req.max;
            partyHtml += `<div class="bg-white p-3 rounded-xl shadow border-2 border-pink-200"><div class="flex justify-between font-bold text-lg mb-1"><span>${r.icon} ${r.name}</span><span class="${req.curr >= req.max ? 'text-green-500' : 'text-pink-600'}">${req.curr} / ${req.max}</span></div><div class="h-4 bg-gray-200 rounded-full overflow-hidden"><div class="h-full bg-pink-500 transition-all" style="width:${ratio * 100}%"></div></div></div>`;
        });
        partyHtml += `</div><p class="mt-6 font-bold text-pink-500">トレイに入れてタップで納品！</p></div>`;
        $('ui-customers').innerHTML = partyHtml;
    } else {
        let customersHtml = '';
        for (let i = 0; i < GAME_CONFIG.maxSlots; i++) {
            const s = state.slots[i];
            if (!s) customersHtml += `<div class="h-full w-24 md:h-24 md:w-full shrink-0 rounded-2xl border-2 border-dashed border-black/20 flex items-center justify-center text-black/30 text-[10px] md:text-base">空席</div>`;
            else if (s.type === 'dirt') customersHtml += `<div class="customer-card relative rounded-2xl p-2 md:p-4 shadow-lg border-2 border-transparent dirt-slot flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 cursor-pointer hover:bg-stone-400 h-full w-24 md:h-24 md:w-full shrink-0" data-action="clean-dirt" data-index="${i}"><div class="text-3xl md:text-5xl">🗑️</div><div class="font-black text-white text-[10px] md:text-xl text-center leading-tight whitespace-nowrap">タップで<br class="md:hidden">清掃！</div></div>`;
            else {
                const isThinking = s.state === 'thinking'; const pRatio = s.patience / s.maxPatience;
                const canComplete = s.state === 'waiting' && canServe(s);
                let orderIcons = isThinking ? '<span class="text-gray-400 text-xs md:text-sm animate-pulse">考え中...</span>' :
                    s.orders.map(oid => `<span class="${state.tray.includes(oid) ? 'opacity-100 scale-110' : 'opacity-50'} transition-all">${state.recipes[oid].icon}</span>`).join('');

                customersHtml += `
                        <div class="customer-card relative bg-white/95 backdrop-blur rounded-xl md:rounded-2xl p-2 md:p-3 shadow-lg border-2 ${s.custType === 'vip' || s.charId ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-white' : 'border-white/50'} flex flex-col md:flex-row items-center gap-1 md:gap-3 cursor-pointer shrink-0 w-24 h-full md:w-full md:h-auto ${canComplete ? 'ring-2 md:ring-4 ring-green-400 animate-pulse' : ''}" data-action="serve-customer" data-index="${i}">
                            <div class="text-3xl md:text-5xl bg-black/5 rounded-full w-12 h-12 md:w-16 md:h-16 flex flex-col items-center justify-center shadow-inner relative shrink-0">
                                ${s.face}
                                ${s.charId ? `<div class="absolute -bottom-2 md:-bottom-3 text-[7px] md:text-xs font-black bg-yellow-400 text-white px-1 md:px-2 rounded-full whitespace-nowrap scale-90 md:scale-100 z-10 border border-white shadow-sm">${s.custType === 'master' ? MASTER_CHARS[s.charId].name : VIP_CHARS[s.charId].name}</div>` : ''}
                            </div>
                            <div class="flex-1 pointer-events-none mt-1 md:mt-2 w-full flex flex-col justify-center">
                                <div class="bg-blue-50/80 border bg-blue-100/50 md:border-2 border-blue-200 rounded-lg md:rounded-xl p-1 mb-1 md:mb-1.5 relative flex-1 flex flex-col justify-center min-h-[30px] md:min-h-[40px]"><div class="text-center font-bold text-xs md:text-lg flex flex-wrap items-center justify-center gap-0.5 md:gap-1 line-clamp-2 leading-tight">${orderIcons}</div></div>
                                ${!isThinking ? `<div class="h-1 md:h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-auto"><div id="patience-bar-${s.id}" class="h-full ${getPatienceColor(pRatio)} progress-bar-inner" style="width: ${pRatio * 100}%"></div></div>` : '<div class="h-1 md:h-2 w-full mt-auto"></div>'}
                            </div>
                            ${!isThinking && s.patience < s.maxPatience && state.candies > 0 ? `<button data-action="use-candy" data-index="${i}" class="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-pink-100 border-2 border-pink-400 rounded-full w-6 h-6 md:w-10 md:h-10 flex items-center justify-center text-[10px] md:text-xl shadow hover:scale-110 z-10">🍬</button>` : ''}
                        </div>
                    `;
            }
        }
        $('ui-customers').innerHTML = customersHtml;
    }

    // デリバリー
    const delContainer = $('ui-delivery');
    if (state.delivery.active) {
        delContainer.style.display = 'block';
        let reqHtml = '';
        const unfulfilled = [...state.delivery.orders];
        state.delivery.fulfilled.forEach(id => { const idx = unfulfilled.indexOf(id); if (idx !== -1) unfulfilled.splice(idx, 1); });
        state.delivery.fulfilled.forEach(id => reqHtml += `<span class="opacity-100">${state.recipes[id].icon}</span>`);
        unfulfilled.forEach(id => reqHtml += `<span class="opacity-30 grayscale">${state.recipes[id].icon}</span>`);
        const isReady = unfulfilled.length === 0;

        delContainer.innerHTML = `
                <div class="bg-indigo-900/90 backdrop-blur text-white p-3 rounded-l-2xl shadow-2xl border-l-4 border-indigo-400 w-48 relative">
                    <div class="font-bold text-sm mb-1 flex justify-between">🛵 デリバリー <span class="text-yellow-300">${formatMoney(state.delivery.reward)}</span></div>
                    <div class="flex flex-wrap gap-1 mb-2 text-2xl bg-indigo-950 p-2 rounded-xl">${reqHtml}</div>
                    ${isReady ? `<button data-action="send-delivery" class="w-full bg-green-500 hover:bg-green-400 text-white font-black py-2 rounded-xl animate-pulse shadow-lg">出発！</button>`
                : `<div class="h-2 bg-indigo-950 rounded-full overflow-hidden"><div id="delivery-bar" class="h-full bg-indigo-400" style="width:${(state.delivery.time / state.delivery.maxTime) * 100}%"></div></div>`}
                </div>
            `;
    } else delContainer.style.display = 'none';

    // 泥棒とペットとマネージャー
    const thiefWrapper = $('thief-wrapper');
    let overlayHtml = '';
    if (state.troubles.thief.active) overlayHtml += `<div id="thief-el" class="thief-running pointer-events-auto" data-action="catch-thief" style="left:${state.troubles.thief.x}vw">🦹‍♂️</div>`;
    if (state.activePet) overlayHtml += `<div id="pet-element" class="absolute bottom-10 left-10 w-20 h-20 md:w-32 md:h-32 filter drop-shadow-xl pointer-events-none transition-transform z-[60]">${PETS[state.activePet].icon}</div>`;
    if (state.hasAceManager) {
        overlayHtml += `
            <button data-action="use-ace" class="fixed bottom-5 right-5 w-20 h-20 rounded-full shadow-2xl ${state.aceManagerUsed ? 'bg-gray-700 opacity-60 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 hover:scale-110 active:scale-95 animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.7)]'} text-white font-black text-4xl transition-all z-[9999] border-4 border-purple-300 flex items-center justify-center flex-col leading-none">
                🦸‍♀️<span class="text-[10px] mt-1">HELP</span>
            </button>`;
    }
    thiefWrapper.innerHTML = overlayHtml;
};

const renderApp = () => {
    document.body.className = `h-[100dvh] w-screen overflow-hidden flex flex-col relative ${THEMES.find(t => t.id === state.currentTheme)?.class || 'theme-default'}`;
    const app = $('app');

    if (state.screen === 'title') {
        const canLoad = hasSaveData();
        app.innerHTML = `
                <div class="m-auto text-center bg-white/95 backdrop-blur p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl border-4 border-amber-300 max-w-lg w-[90%] md:w-full relative overflow-hidden">
                    <div class="absolute -top-10 -right-10 text-8xl md:text-9xl opacity-20">☕</div>
                    <h1 class="text-3xl md:text-4xl font-black text-amber-800 mb-2 tracking-tight">ハッピーカフェ<br>神の領域エディション</h1>
                    <p class="text-gray-600 font-bold mb-4 md:mb-6 text-xs md:text-sm">市場仕入れ、チェイン、ペット、宇宙出店！<br>もはやカフェ経営の枠を超えた究極版！</p>
                    <div class="flex flex-col gap-2 md:gap-3">
                        ${canLoad ? `<button data-action="load-game" class="bg-blue-500 hover:bg-blue-400 text-white text-lg md:text-xl font-bold py-3 md:py-4 rounded-full shadow-[0_5px_0_#1e3a8a] active:translate-y-[5px] active:shadow-none transition-all">続きから遊ぶ</button>` : ''}
                        <button data-action="new-game" class="bg-amber-500 hover:bg-amber-400 text-white text-lg md:text-xl font-bold py-3 md:py-4 rounded-full shadow-[0_5px_0_#b45309] active:translate-y-[5px] active:shadow-none transition-all">最初から遊ぶ</button>
                        <button data-action="goto-collection" class="bg-purple-500 hover:bg-purple-400 text-white text-lg md:text-xl font-bold py-2 md:py-3 rounded-full shadow-[0_4px_0_#6b21a8] active:translate-y-[4px] active:shadow-none transition-all mt-1 md:mt-2">📖 図鑑・実績</button>
                    </div>
                </div>
            `;
    }
    else if (state.screen === 'collection') {
        let achHtml = '';
        ACHIEVEMENTS.forEach(a => {
            const isCleared = state.achievements.includes(a.id);
            const progress = clamp(state.stats[a.type], 0, a.target);
            achHtml += `
                    <div class="bg-white p-3 rounded-xl shadow border-2 ${isCleared ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}">
                        <div class="flex justify-between items-center mb-1">
                            <span class="font-bold text-gray-800">${isCleared ? '🏆' : '🔒'} ${a.title}</span>
                            <span class="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 rounded-full">報酬: ${a.rewardSP} SP</span>
                        </div>
                        <div class="text-xs text-gray-500 mb-2">${a.desc}</div>
                        <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden relative"><div class="h-full ${isCleared ? 'bg-yellow-400' : 'bg-blue-400'}" style="width: ${(progress / a.target) * 100}%"></div></div>
                        <div class="text-right text-xs text-gray-400 mt-1">${formatMoney(progress)} / ${formatMoney(a.target)}</div>
                    </div>
                `;
        });

        app.innerHTML = `
                <div class="h-full w-full bg-slate-100 p-3 md:p-6 flex flex-col">
                    <header class="flex justify-between items-center mb-3 md:mb-6 shrink-0">
                        <h2 class="text-xl md:text-3xl font-black text-slate-800">📖 コレクション＆実績</h2>
                        <button data-action="goto-title" class="bg-gray-500 hover:bg-gray-400 text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full font-bold shadow text-sm md:text-base">戻る</button>
                    </header>
                    <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 overflow-hidden">
                        <div class="bg-white rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-md overflow-y-auto no-scrollbar"><h3 class="text-lg md:text-xl font-black mb-3 md:mb-4 border-b-2 pb-2">🏆 実績一覧</h3><div class="flex flex-col gap-2 md:gap-3">${achHtml}</div></div>
                        <div class="bg-white rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-md overflow-y-auto no-scrollbar">
                            <h3 class="text-lg md:text-xl font-black mb-3 md:mb-4 border-b-2 pb-2">📋 統計データ</h3>
                            <ul class="text-base md:text-lg font-bold text-gray-600 flex flex-col gap-3 md:gap-4">
                                <li class="flex justify-between border-b pb-1 md:pb-2"><span>累計売上:</span><span class="text-amber-600">${formatMoney(state.stats.totalEarned)}</span></li>
                                <li class="flex justify-between border-b pb-1 md:pb-2"><span>最高チェイン:</span><span class="text-yellow-500">${state.stats.maxChain} 回</span></li>
                                <li class="flex justify-between border-b pb-1 md:pb-2"><span>最高評価提供:</span><span class="text-green-600">${state.stats.perfectServes} 回</span></li>
                                <li class="flex justify-between border-b pb-1 md:pb-2"><span>泥棒逮捕数:</span><span class="text-blue-600">${state.stats.thiefCaught} 人</span></li>
                                <li class="flex justify-between border-b pb-1 md:pb-2"><span>パーティ成功:</span><span class="text-pink-600">${state.stats.partyCleared} 回</span></li>
                                <li class="flex justify-between border-b pb-1 md:pb-2"><span>到達日数:</span><span class="text-gray-800">${state.day} 日</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
    }
    else if (state.screen === 'prep') {
        let contentHtml = '';

        if (state.prepTab === 'menu') {
            const unlocked = getUnlockedRecipes();
            let menuHtml = '';
            unlocked.forEach(r => {
                const isSelected = state.activeRecipes.includes(r.id);
                const isTrend = state.trend.type === 'target' && state.trend.target === r.id;
                let reqsStr = Object.entries(r.reqs).map(([k, v]) => `${INGREDIENTS[k].icon}${v}`).join(' ');
                menuHtml += `
                        <div data-action="toggle-menu" data-id="${r.id}" class="relative p-2 rounded-2xl border-4 cursor-pointer transition-all ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'} flex flex-col items-center">
                            <div class="text-3xl">${r.icon}</div>
                            <div class="font-bold text-gray-800 text-xs text-center">${r.name}</div>
                            <div class="text-xs text-gray-500 mt-1">${reqsStr}</div>
                            ${isTrend ? '<div class="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow animate-bounce">トレンド!</div>' : ''}
                            ${isSelected ? '<div class="absolute top-1 left-1 text-green-500 text-lg font-black">✓</div>' : ''}
                        </div>
                    `;
            });
            contentHtml = `
                    <h3 class="font-bold text-gray-600 mb-2 flex justify-between">
                        <span>提供メニュー選択 (必要な食材を確認しよう)</span>
                        <span class="${state.activeRecipes.length > GAME_CONFIG.maxMenuSelection ? 'text-red-500' : 'text-blue-500'}">${state.activeRecipes.length} / ${GAME_CONFIG.maxMenuSelection}</span>
                    </h3>
                    <div class="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4 overflow-y-auto max-h-48 p-1">${menuHtml}</div>
                `;
        } else if (state.prepTab === 'market') {
            let marketHtml = '';
            for (let key in INGREDIENTS) {
                const ing = INGREDIENTS[key]; const price = state.marketPrices[key];
                const isCheap = price < ing.basePrice * 0.8; const isExpensive = price > ing.basePrice * 1.2;
                let color = isCheap ? 'text-blue-500' : isExpensive ? 'text-red-500' : 'text-gray-600';
                marketHtml += `
                        <div class="bg-white p-3 rounded-xl shadow border border-gray-200 flex justify-between items-center">
                            <div class="flex items-center gap-2">
                                <span class="text-2xl">${ing.icon}</span>
                                <div><div class="font-bold text-sm">${ing.name}</div><div class="text-xs text-gray-500">在庫: <span class="font-black text-blue-600">${state.inventory[key]}</span></div></div>
                            </div>
                            <div class="flex flex-col items-end">
                                <div class="font-bold text-sm ${color}">${formatMoney(price)} / 5個</div>
                                <button data-action="buy-ing" data-id="${key}" class="text-xs bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-400 mt-1">購入</button>
                            </div>
                        </div>
                    `;
            }
            contentHtml = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto max-h-64 p-1">${marketHtml}</div>`;
        }

        const canStart = state.activeRecipes.length > 0 && state.activeRecipes.length <= GAME_CONFIG.maxMenuSelection;
        const tabBtnCls = "px-4 py-2 font-bold text-sm rounded-t-xl transition-colors w-1/2 text-center";

        app.innerHTML = `
                <div class="m-auto bg-white/95 backdrop-blur p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-2xl max-w-2xl w-[95%] md:w-full border-t-4 md:border-t-8 ${state.day % 7 === 0 ? 'border-pink-400' : 'border-amber-400'} flex flex-col max-h-[85dvh] relative">
                    <button data-action="goto-title" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-sm">◀ タイトルへ</button>
                    <div class="flex flex-col md:flex-row justify-between items-center mb-2 md:mb-4 gap-2 md:gap-0 shrink-0">
                        <h2 class="text-xl md:text-2xl font-black ${state.day % 7 === 0 ? 'text-pink-600' : 'text-amber-800'}">${state.day % 7 === 0 ? '🎉 パーティ準備' : '☀️ 営業準備'} <span class="text-base md:text-sm md:ml-2">(Day ${state.day})</span></h2>
                        <div class="bg-slate-800 text-white font-black px-3 md:px-4 py-1 rounded-full text-sm md:text-base shadow">💰 ${formatMoney(state.money)}</div>
                    </div>
                    
                    <div class="bg-red-50 border-l-4 border-red-500 p-2 rounded-r-xl mb-4">
                        <div class="text-xs font-bold text-red-400">本日のニュース</div>
                        <div class="text-sm font-black text-red-700">${state.day % 7 === 0 ? '今日は貸切パーティ！食材消費なしで料理が作れます！' : state.trend.text}</div>
                    </div>

                    ${state.day % 7 === 0 ? '<p class="font-bold text-gray-600 mb-6 text-center text-sm md:text-base shrink-0">※パーティの日は特別ルールのボーナスステージです</p>' : `
                        <div class="flex border-b-2 border-gray-200 mb-2 md:mb-4 shrink-0">
                            <div data-action="change-prep-tab" data-id="menu" class="${tabBtnCls} ${state.prepTab === 'menu' ? 'bg-amber-100 text-amber-800 border-2 border-b-0 border-amber-200' : 'bg-gray-100 text-gray-500 cursor-pointer hover:bg-gray-200'}">🍔 メニュー選択</div>
                            <div data-action="change-prep-tab" data-id="market" class="${tabBtnCls} ${state.prepTab === 'market' ? 'bg-blue-100 text-blue-800 border-2 border-b-0 border-blue-200' : 'bg-gray-100 text-gray-500 cursor-pointer hover:bg-gray-200'}">🛒 食材市場</div>
                        </div>
                        <div class="flex-1 overflow-y-auto no-scrollbar min-h-[200px]">
                            ${contentHtml}
                        </div>
                    `}
                    
                    <button data-action="start-game" ${!canStart && state.day % 7 !== 0 ? 'disabled' : ''} class="w-full mt-2 md:mt-4 text-lg md:text-xl font-bold py-3 md:py-4 rounded-full shadow-[0_5px_0_rgba(0,0,0,0.2)] active:translate-y-[5px] active:shadow-none transition-all shrink-0 ${canStart || state.day % 7 === 0 ? (state.day % 7 === 0 ? 'bg-pink-500 text-white hover:bg-pink-400' : 'bg-amber-500 text-white hover:bg-amber-400') : 'bg-gray-300 text-gray-500 cursor-not-allowed'}">お店をオープン！</button>
                </div>
            `;
    }
    else if (state.screen === 'game') {
        const locName = state.franchise === 5 ? '未来店' : state.franchise === 4 ? '恐竜店' : state.franchise === 3 ? '宇宙ステーション店' : state.franchise === 2 ? 'ハワイ店' : '本店';
        app.innerHTML = `
                ${state.isFever ? '<div class="fever-bg"></div>' : ''}
                <header class="bg-black/80 backdrop-blur text-white p-1.5 md:p-2 px-2 md:px-4 flex justify-between items-center shadow-md z-20 overflow-x-auto no-scrollbar whitespace-nowrap gap-2">
                    <div class="flex gap-1.5 md:gap-3 items-center shrink-0">
                        <div class="text-sm md:text-xl font-black bg-white/10 px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-inner text-yellow-300">💰 <span id="ui-money">${formatMoney(state.money)}</span></div>
                        <div class="text-xs md:text-sm font-bold bg-pink-500/80 px-2 py-0.5 md:py-1 rounded-full text-white flex items-center gap-1">🍬 <span id="ui-candies">${state.candies}</span></div>
                        <div id="ui-chain" class="font-black text-gray-400 bg-white/10 px-2 py-0.5 md:py-1 rounded-full text-xs md:text-sm">CHAIN: 0</div>
                        ${!state.isPartyDay ? `<div class="text-[10px] md:text-sm font-bold bg-white/10 px-2 py-0.5 md:py-1 rounded-full items-center gap-1 hidden sm:flex">評判: ${renderStars(state.reputation)}</div>` : ''}
                    </div>
                    <div class="flex items-center gap-2 md:gap-3 shrink-0 ml-auto">
                        <div class="text-xs md:text-sm font-bold text-amber-200 hidden sm:block">Day ${state.day}</div>
                        <div id="ui-time" class="text-sm md:text-xl font-bold bg-white/20 px-2 md:px-4 py-0.5 md:py-1 rounded-full">⏱ <span class="hidden md:inline">残り</span> ${GAME_CONFIG.dayDuration}秒</div>
                    </div>
                </header>
                <div id="game-wrapper" class="flex-1 flex flex-col md:flex-row overflow-hidden relative transition-all duration-300">
                    <div class="w-full md:w-[45%] h-[30%] md:h-full p-2 md:p-4 flex flex-col bg-black/5 shadow-inner">
                        <div class="flex-1 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar relative items-center md:items-stretch py-1" id="ui-customers"></div>
                    </div>
                    <div class="w-full md:w-[55%] h-[70%] md:h-full p-2 md:p-6 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] md:shadow-[-10px_0_20px_rgba(0,0,0,0.1)] z-10 flex flex-col bg-white/50 backdrop-blur-sm overflow-y-auto overflow-x-hidden">
                        <div id="ui-inventory" class="flex gap-1 md:gap-2 justify-center mb-2 md:mb-3 bg-white/70 p-1 md:p-2 rounded-xl text-xs md:text-base shadow-sm shrink-0"></div>
                        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 flex-1 content-start pb-4" id="ui-kitchen"></div>
                        <div class="mt-auto md:mt-4 bg-black/70 p-2 md:p-4 rounded-xl md:rounded-2xl shadow-xl backdrop-blur relative shrink-0">
                            <h3 class="text-white/80 font-bold mb-1 md:mb-2 text-[10px] md:text-sm text-center">🍽 提供トレイ ${state.franchise === 3 ? '<span class="text-red-400 font-black animate-pulse">(無重力注意!)</span>' : state.franchise === 4 ? '<span class="text-red-400 font-black animate-pulse">(肉食恐竜注意!)</span>' : ''}</h3>
                            <div class="flex justify-center gap-1.5 md:gap-3 flex-wrap" id="ui-tray"></div>
                        </div>
                    </div>
                    <div id="ui-delivery" class="absolute right-0 top-10 md:top-20 z-30 scale-75 md:scale-100 origin-top-right" style="display:none;"></div>
                    <div id="thief-wrapper" class="absolute inset-0 pointer-events-none overflow-hidden z-40"></div>
                    <div id="ui-notification-container" class="absolute top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center pointer-events-none"></div>
                </div>
            `;
        renderGameUI();
    }
    else if (state.screen === 'day_end') {
        app.innerHTML = `
                <div class="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div class="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl max-w-md w-[90%] md:w-full text-center border-t-8 border-amber-400 my-auto">
                        <h2 class="text-2xl md:text-3xl font-black text-amber-600 mb-2">Day ${state.day - 1} 営業終了</h2>
                        <div class="bg-amber-50 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6 text-base md:text-lg font-bold text-gray-700 flex flex-col gap-2 md:gap-3">
                            <div class="flex justify-between border-b border-amber-200 pb-2"><span>満足客:</span><span class="text-green-600">${state.satisfiedToday} 人</span></div>
                            <div class="flex justify-between border-b border-amber-200 pb-2"><span>怒った客:</span><span class="text-red-500">${state.lostToday} 人</span></div>
                            <div class="flex justify-between text-xl md:text-2xl mt-1 md:mt-2 text-amber-800"><span>売上:</span><span>${formatMoney(state.earnedToday)}</span></div>
                        </div>
                        <div class="text-lg md:text-xl font-black mb-4 md:mb-6">総資金: <span class="text-amber-600">${formatMoney(state.money)}</span></div>
                        <button data-action="go-shop" class="w-full bg-blue-500 hover:bg-blue-400 text-white text-lg md:text-xl font-bold py-3 md:py-4 rounded-full shadow-[0_5px_0_#1e3a8a] active:translate-y-[5px] active:shadow-none transition-all">
                            ショップ・育成へ 🛒
                        </button>
                    </div>
                </div>
            `;
    }
    else if (state.screen === 'rival') {
        const mySales = state.earnedToday;
        const rivalSales = Math.floor((state.day - 1) * 1500 + Math.random() * 3000);
        const isWin = mySales >= rivalSales;
        if (isWin) { state.money += 10000; state.stats.totalEarned += 10000; }

        const buyoutCost = 1000000 * Math.pow(5, state.acquiredRivals || 0);
        const canBuyout = state.money >= buyoutCost;

        app.innerHTML = `
                <div class="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 overflow-y-auto">
                    <div class="bg-slate-900 p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl max-w-lg w-[95%] md:w-full text-center border-2 md:border-4 border-slate-700 relative my-auto max-h-full overflow-y-auto no-scrollbar">
                        <div class="absolute -top-10 -right-10 text-8xl md:text-9xl opacity-10">⚔️</div>
                        <h2 class="text-xl md:text-3xl font-black text-white mb-2 md:mb-6 tracking-widest mt-2 md:mt-0">💥 RIVAL BATTLE 💥</h2>
                        <div class="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-8 gap-2 md:gap-0">
                            <div class="bg-blue-900/50 p-3 md:p-4 rounded-xl border-2 border-blue-500 flex-1 w-full md:w-auto">
                                <div class="text-blue-300 font-bold text-xs md:text-sm mb-1">あなたのお店</div><div class="text-xl md:text-2xl font-black text-white">${formatMoney(mySales)}</div>
                            </div>
                            <div class="text-2xl md:text-4xl mx-2 md:mx-4 font-black text-yellow-500 italic rotate-90 md:rotate-0">VS</div>
                            <div class="bg-red-900/50 p-3 md:p-4 rounded-xl border-2 border-red-500 flex-1 w-full md:w-auto">
                                <div class="text-red-300 font-bold text-xs md:text-sm mb-1">ライバル店</div><div class="text-xl md:text-2xl font-black text-white">${formatMoney(rivalSales)}</div>
                            </div>
                        </div>
                        ${isWin ? '<div class="bg-green-500/20 border-2 border-green-500 p-2 md:p-4 rounded-xl md:rounded-2xl mb-3 md:mb-4 animate-bounce"><h3 class="text-xl md:text-2xl font-black text-green-400">YOU WIN!!</h3><p class="text-white font-bold text-sm md:text-base">賞金 +¥10,000！</p></div>' : '<div class="bg-gray-800 border-2 border-gray-600 p-2 md:p-4 rounded-xl md:rounded-2xl mb-3 md:mb-4"><h3 class="text-xl md:text-2xl font-black text-gray-400">YOU LOSE...</h3></div>'}
                        
                        <div class="bg-purple-900/40 border-2 border-purple-500 p-3 md:p-4 rounded-xl md:rounded-2xl mb-4 md:mb-8 text-sm md:text-base">
                            <h3 class="text-purple-300 font-bold mb-1 md:mb-2">ライバルチェーンの買収 (現在: ${state.acquiredRivals || 0}社傘下)</h3>
                            <button data-action="buyout-rival" data-cost="${buyoutCost}" class="w-full ${canBuyout ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'} font-black py-2 md:py-3 rounded-lg md:rounded-xl shadow-md transition-all text-xs md:text-base">
                                🏢 対象会社を買収する (💰${formatMoney(buyoutCost)})
                            </button>
                        </div>

                        <button data-action="finish-rival" class="w-full bg-yellow-500 hover:bg-yellow-400 text-black text-lg md:text-xl font-black py-3 md:py-4 rounded-full shadow-[0_5px_0_#b45309] active:translate-y-[5px] active:shadow-none transition-all">次へ進む</button>
                    </div>
                </div>
            `;
    }
    else if (state.screen === 'shop') {
        const tabs = [
            { id: 'menu', icon: '🍔', name: 'メニュー' },
            { id: 'staff', icon: '✨', name: 'アイテム・育成' },
            { id: 'system', icon: '🛠', name: '設備・出店' },
            { id: 'farm', icon: '🌾', name: '自社農園' },
            { id: 'theme', icon: '🎨', name: '内装' },
            { id: 'skills', icon: '🌟', name: 'スキル' }
        ];

        let tabHtml = `<div class="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2 shrink-0">`;
        tabs.forEach(t => {
            const isActive = state.shopTab === t.id;
            tabHtml += `<button data-action="change-shop-tab" data-id="${t.id}" class="px-5 py-2.5 rounded-xl font-black text-sm md:text-base whitespace-nowrap transition-all shadow-md ${isActive ? 'bg-slate-800 text-white scale-105 ring-2 ring-slate-400' : 'bg-white text-slate-600 border-2 border-slate-200 hover:bg-slate-50'}">${t.icon} ${t.name}</button>`;
        });
        tabHtml += `</div>`;

        const genItemHtml = (title, desc, cost, isDisabled, actionType, id, icon, btnText, isFree = false, isSP = false) => {
            let buttonClass = 'bg-gray-200 text-gray-400';
            let displayTxt = isSP ? `${cost} SP` : formatMoney(cost);
            if (isDisabled) { buttonClass = 'bg-gray-200 text-gray-500 cursor-not-allowed'; displayTxt = btnText; }
            else if (isFree) { buttonClass = 'bg-green-500 text-white hover:bg-green-400'; displayTxt = btnText; }
            else if ((isSP && state.skillPoints >= cost) || (!isSP && state.money >= cost)) { buttonClass = isSP ? 'bg-yellow-500 text-white hover:bg-yellow-400' : 'bg-blue-500 text-white hover:bg-blue-400'; }

            return `
                    <div class="bg-white p-3 rounded-2xl shadow-md border-2 ${isDisabled ? 'border-gray-100 bg-gray-50 opacity-80' : 'border-gray-200 hover:border-blue-400 hover:shadow-lg'} flex items-center justify-between transition-all cursor-pointer group"
                         data-action="buy-item" data-item-type="${actionType}" data-id="${id}" ${isDisabled ? 'data-disabled="true"' : ''}>
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 md:w-14 md:h-14 bg-gray-100 rounded-xl group-hover:bg-blue-50 transition-colors flex items-center justify-center overflow-hidden shrink-0">
                                <div class="w-full h-full flex items-center justify-center text-3xl p-1">${icon}</div>
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="font-black text-gray-800 text-xs md:text-sm truncate">${title}</div>
                                <div class="text-[9px] md:text-xs text-gray-500 leading-tight line-clamp-2">${desc}</div>
                            </div>
                        </div>
                        <button class="px-4 py-2 rounded-full font-black shadow-sm text-[10px] md:text-sm transition-all whitespace-nowrap pointer-events-none ${buttonClass}">${displayTxt}</button>
                    </div>
                `;
        };

        let shopHtml = `
                <div class="h-full w-full bg-slate-50 flex flex-col p-2 md:p-6 overflow-hidden relative">
                    <button data-action="goto-title" class="absolute top-2 right-2 md:top-6 md:right-6 text-gray-400 hover:text-gray-600 font-bold text-xs md:text-sm z-10">◀ タイトルへ</button>
                    <header class="flex flex-col md:flex-row justify-between items-center mb-2 gap-2 border-b-2 border-slate-200 pb-2">
                        <h2 class="text-xl md:text-2xl font-black text-slate-800 w-full md:w-auto text-center md:text-left">メガ・ショップ</h2>
                        <div class="flex gap-2 text-xs md:text-md">
                            <div class="font-black bg-slate-800 text-white px-2 py-1 md:px-3 md:py-1 rounded-full shadow">💰 ${formatMoney(state.money)}</div>
                            <div class="font-black bg-yellow-500 text-white px-2 py-1 md:px-3 md:py-1 rounded-full shadow" title="スキルポイント">🌟 ${state.skillPoints} SP</div>
                        </div>
                    </header>
                    ${tabHtml}
                    <div class="flex-1 overflow-y-auto pr-1 md:pr-2 no-scrollbar flex flex-col pb-24"><div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 px-1 md:px-0">
            `;

        if (state.shopTab === 'menu') {
            Object.values(state.recipes).filter(r => r.reqFranchise <= state.franchise).forEach(r => {
                if (r.level === 0) shopHtml += genItemHtml(r.name, r.steps > 1 ? '多段調理(高利益)' : '新メニュー', r.unlockCost, false, 'recipe_unlock', r.id, r.icon, '');
                else { const isMax = r.level >= 3; const cost = r.basePrice * 2 * r.level; shopHtml += genItemHtml(`${r.name} Lv.${r.level}`, '販売価格+20%', cost, isMax, 'recipe_up', r.id, r.icon, 'MAX'); }
            });
        } else if (state.shopTab === 'staff') {
            shopHtml += genItemHtml(`キャンディ (所持:${state.candies})`, '客の怒りを鎮める', 500, false, 'candy', 'candy', '🍬', '');

            const bLv = state.staff.barista;
            shopHtml += genItemHtml(`バリスタ Lv.${bLv}`, bLv === 0 ? 'ドリンク自動作成' : '対応速度UP', bLv === 0 ? 10000 : 20000, bLv >= 2, 'staff', 'barista', '🧑‍🍳', bLv >= 2 ? 'MAX' : '育成');

            const sLv = state.staff.server;
            shopHtml += genItemHtml(`ウェイトレス Lv.${sLv}`, sLv === 0 ? '自動提供機能' : '自動提供のチップ+20%', sLv === 0 ? 15000 : 20000, sLv >= 2, 'staff', 'server', '👩‍💼', sLv >= 2 ? 'MAX' : '育成');

            const cLv = state.staff.cook || 0;
            shopHtml += genItemHtml(`コック Lv.${cLv}`, cLv === 0 ? 'フード自動作成' : '対応速度UP', cLv === 0 ? 12000 : 20000, cLv >= 2, 'staff', 'cook', '👨‍🍳', cLv >= 2 ? 'MAX' : '育成');

            const clLv = state.staff.cleaner || 0;
            shopHtml += genItemHtml(`掃除夫 Lv.${clLv}`, clLv === 0 ? '自動清掃機能' : '対応速度UP', clLv === 0 ? 8000 : 15000, clLv >= 2, 'staff', 'cleaner', '🧹', clLv >= 2 ? 'MAX' : '育成');

            Object.values(PETS).forEach(p => {
                const isOwned = state.pets[p.id];
                const isSet = state.activePet === p.id;
                shopHtml += genItemHtml(p.name, p.desc, p.cost, isSet, isOwned ? 'set-pet' : 'pet', p.id, p.icon, isSet ? '設定中' : '選択', isOwned);
            });
            shopHtml += genItemHtml('敏腕マネージャー派遣', '1日1回だけ、すべてのトラブル(忍耐、故障、泥棒)を即座に解決！', 1000000, state.hasAceManager, 'aceManager', 'ace', '🦸‍♀️', state.hasAceManager ? '契約済' : '契約');
        } else if (state.shopTab === 'system') {
            const intCost = 1000 * Math.pow(1.5, state.upgrades.interior - 1);
            shopHtml += genItemHtml(`インテリア Lv.${state.upgrades.interior}`, '客の忍耐力UP＆チップ増額', intCost, state.upgrades.interior >= 5, 'system', 'interior', '🪴', 'MAX');
            const eqCost = 1500 * Math.pow(1.5, state.upgrades.equipment - 1);
            shopHtml += genItemHtml(`最新調理器具 Lv.${state.upgrades.equipment}`, '調理時間を短縮', eqCost, state.upgrades.equipment >= 5, 'system', 'equipment', '⚡', 'MAX');
            const trayCost = 3000 * (state.upgrades.traySize - 2);
            shopHtml += genItemHtml(`トレイ枠 (現在:${state.upgrades.traySize})`, '一度に置ける完成品が増加', trayCost, state.upgrades.traySize >= 6, 'system', 'traySize', '🍽', 'MAX');

            shopHtml += genItemHtml('デュアルマシン', '1つのメニューを同時に2個まで調理可能に', 30000, state.upgrades.dualMachine, 'system', 'dualMachine', '📠', '導入済');

            if (state.franchise === 1) shopHtml += genItemHtml('ハワイアンビーチ出店', '南国の新客と新メニュー！', 100000, false, 'system', 'franchise2', '🌴', '');
            else if (state.franchise === 2) shopHtml += genItemHtml('宇宙ステーション出店', '無重力トレイと宇宙人襲来！', 300000, false, 'system', 'franchise3', '🚀', '');
            else if (state.franchise === 3) shopHtml += genItemHtml('恐竜時代に出店', 'タイムトラベル！マンモス肉を焼く', 500000, false, 'system', 'franchise4', '🦖', '');
            else if (state.franchise === 4) shopHtml += genItemHtml('サイバーパンク未来に出店', 'ロボット客とオイルドリンク', 1000000, false, 'system', 'franchise5', '🤖', '');
            else shopHtml += genItemHtml('サイバーパンク店', '未来の最果てで営業中', 0, true, 'system', 'franchise5', '🤖', '出店済');

            if (state.franchise >= 2) {
                const canAssign1 = state.staff.barista >= 2 && state.staff.server >= 2;
                shopHtml += genItemHtml('本店 店長任命', canAssign1 ? '毎日自動収入(要スタッフLvMAX)' : 'スタッフのLvMAXが必要', 50000, state.managers[1] || !canAssign1, 'manager', '1', '👔', state.managers[1] ? '任命済' : '条件不足');
            }
            if (state.franchise >= 3) {
                const canAssign2 = state.staff.barista >= 2 && state.staff.server >= 2;
                shopHtml += genItemHtml('ハワイ店 店長任命', canAssign2 ? '毎日多額の自動収入' : 'スタッフのLvMAXが必要', 100000, state.managers[2] || !canAssign2, 'manager', '2', '🌺', state.managers[2] ? '任命済' : '条件不足');
            }
            if (state.franchise >= 4) {
                const canAssign3 = state.staff.barista >= 2 && state.staff.server >= 2;
                shopHtml += genItemHtml('宇宙店 店長任命', canAssign3 ? '毎日莫大な自動収入' : 'スタッフのLvMAXが必要', 200000, state.managers[3] || !canAssign3, 'manager', '3', '🚀', state.managers[3] ? '任命済' : '条件不足');
            }
            if (state.franchise >= 5) {
                const canAssign4 = state.staff.barista >= 2 && state.staff.server >= 2;
                shopHtml += genItemHtml('恐竜店 店長任命', canAssign4 ? '毎日超莫大な自動収入' : 'スタッフのLvMAXが必要', 500000, state.managers[4] || !canAssign4, 'manager', '4', '🦖', state.managers[4] ? '任命済' : '条件不足');
            }
        } else if (state.shopTab === 'farm') {
            shopHtml += genItemHtml(`肥料 (所持:${state.fertilizer})`, '次回の収穫量を2倍にする（1回の収穫で1消費）', 2000, false, 'fertilizer', 'fertilizer', '💩', '');
            for (let key in FARM_ITEMS) {
                const item = FARM_ITEMS[key];
                const lv = state.farm[key];
                const cost = item.cost * Math.pow(1.5, lv);
                shopHtml += genItemHtml(`${item.name} Lv.${lv}`, `${item.desc} (現在:${item.yield * lv}個/日)`, cost, false, 'farm', key, item.icon, '拡張');
            }
        } else if (state.shopTab === 'theme') {
            THEMES.filter(t => t.reqFranchise === undefined || t.reqFranchise <= state.franchise).forEach(t => {
                const isOwned = state.unlockedThemes.includes(t.id);
                const isCurrent = state.currentTheme === t.id;
                shopHtml += genItemHtml(t.name, isCurrent ? '現在適用中' : isOwned ? 'タップで着せ替え（無料）' : 'お店の見た目を変更', t.cost, isCurrent, 'theme', t.id, '🎨', isCurrent ? '適用中' : '着替える', isOwned);
            });
        } else if (state.shopTab === 'skills') {
            Object.values(SKILLS).forEach(s => {
                const currentLv = state.skills[s.id]; const isMax = currentLv >= s.maxLv; const cost = isMax ? 0 : s.costs[currentLv];
                shopHtml += genItemHtml(`${s.name} Lv.${currentLv}`, s.desc, cost, isMax, 'skill', s.id, '🌟', 'MASTER', false, true);
            });
        }

        shopHtml += `</div></div><div class="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t-2 border-gray-200 p-4 flex justify-center z-10"><button data-action="goto-prep" class="bg-amber-500 hover:bg-amber-400 text-white text-xl font-bold py-3 px-16 rounded-full shadow-[0_5px_0_#b45309] active:translate-y-[5px] active:shadow-none transition-all">準備画面へ進む 🚀</button></div></div>`;
        app.innerHTML = shopHtml;
    }

    // BGMボタンを追加 (すべての画面で表示)
    app.insertAdjacentHTML('beforeend', `
        <button data-action="toggle-bgm" class="fixed top-4 right-4 z-[9999] w-12 h-12 flex items-center justify-center text-2xl bg-black/50 text-white rounded-full shadow-lg backdrop-blur-sm border-2 border-white/20 cursor-pointer transition-all hover:bg-black/70 hover:scale-105 active:scale-95">
            ${isBgmMuted ? '🔇' : '🔊'}
        </button>
    `);
};

document.addEventListener('DOMContentLoaded', () => { document.body.addEventListener('click', handleAction); renderApp(); });