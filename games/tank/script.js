// --- Game Constants ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.2;
const MAX_WIND = 0.3;
const DAMAGE_RADIUS = 50;
const EXPLOSION_RADIUS = 30;

// Colors
const CPU_COLORS = ['#EF4444', '#A855F7', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#84CC16', '#6366F1', '#F97316', '#14B8A6'];

// Weapon Definitions (30+ Types)
const WEAPONS = {
    STANDARD: { name: 'スタンダード', price: 0, desc: '標準的な弾です。', color: '#6b7280', icon: '🌑', baseType: 'DIRECT', enhanceType: 'EXPLOSIVE' },
    ACCEL: { name: 'アクセル', price: 150, desc: '飛距離に応じて加速し、威力が増します。', color: '#facc15', icon: '⏩', baseType: 'DIRECT', enhanceType: 'TIME' },
    SMOKE: { name: 'スモーク弾', price: 130, desc: '着弾地点に煙幕を張り、敵の精度を下げます。', color: '#6B7280', icon: '💨', baseType: 'GROUND', enhanceType: 'TIME' },
    BOUNCER: { name: 'バウンサー', price: 180, desc: '地面を跳ねる弾です。', color: '#34D399', icon: '🎾', baseType: 'GROUND', enhanceType: 'KINETIC' },
    SNIPER: { name: 'スナイパー', price: 200, desc: '高速で直線的な弾です。', color: '#10b981', icon: '🎯', baseType: 'DIRECT', enhanceType: 'KINETIC' },
    SHOTGUN: { name: 'ショットガン', price: 250, desc: '3方向へ同時に発射します。', color: '#f59e0b', icon: '☄️', baseType: 'SPREAD', enhanceType: 'KINETIC' },
    CLUSTER: { name: 'クラスター', price: 350, desc: '空中で分裂し、広範囲を爆撃。', color: '#ef4444', icon: '💣', baseType: 'SPREAD', enhanceType: 'EXPLOSIVE' },
    NUKE: { name: '核弾頭', price: 1000, desc: '超強力な爆発を起こします。', color: '#10b981', icon: '☢️', baseType: 'HEAVY', enhanceType: 'EXPLOSIVE' },
    DRILL: { name: 'ドリル弾', price: 300, desc: '地形を貫通して進みます。', color: '#8b5cf6', icon: '🔩', baseType: 'GROUND', enhanceType: 'TECH' },
    ROLLER: { name: 'ローラー', price: 200, desc: '地形に沿って転がる爆弾です。', color: '#6366f1', icon: '🚗', baseType: 'GROUND', enhanceType: 'EXPLOSIVE' },
    LASER: { name: 'レーザー', price: 400, desc: '一直線に瞬時に弾丸が飛びます。', color: '#ec4899', icon: '🏮', baseType: 'DIRECT', enhanceType: 'TECH' },
    GATLING: { name: 'ガトリング', price: 350, desc: '小弾を高速で連射します。', color: '#94a3b8', icon: '🔫', baseType: 'SPREAD', enhanceType: 'TECH' },
    POISON: { name: 'ポイズン', price: 300, desc: '毒霧を発生させます。', color: '#a3e635', icon: '☣️', baseType: 'BIO', enhanceType: 'SONIC' },
    FIREWORKS: { name: '花火', price: 150, desc: '空中で華やかに炸裂します。', color: '#fb7185', icon: '🎇', baseType: 'SPREAD', enhanceType: 'MAGIC' },
    ACID: { name: 'アシッド', price: 480, desc: '地形を大きく溶かす酸の弾です。', color: '#84cc16', icon: '🧪', baseType: 'BIO', enhanceType: 'ELEMENTAL' },
    SATELLITE: { name: 'サテライト', price: 500, desc: '上空から極太レーザーを照射。', color: '#ef4444', icon: '🛰️', baseType: 'HEAVY', enhanceType: 'TECH' },
    SENTRY: { name: 'セントリー', price: 550, desc: '付近の敵を自動射撃します。', color: '#475569', icon: '🤖', baseType: 'TRAP', enhanceType: 'TECH' },
    VOLCANO: { name: 'ボルケーノ', price: 600, desc: 'マグマを噴出します。', color: '#b91c1c', icon: '🌋', baseType: 'SPREAD', enhanceType: 'ELEMENTAL' },
    C4: { name: 'C4', price: 650, desc: '3ターン後に大爆発します。', color: '#1f2937', icon: '⏰', baseType: 'TRAP', enhanceType: 'TIME' },
    THUNDER: { name: 'サンダー', price: 700, desc: '真下に雷を落とします。', color: '#fbbf24', icon: '⚡', baseType: 'AIR', enhanceType: 'SONIC' },
    PLASMA: { name: 'プラズマ', price: 700, desc: '触れたものを破壊する高温球。', color: '#C084FC', icon: '🟣', baseType: 'HEAVY', enhanceType: 'SONIC' },
    METEOR: { name: 'メテオ', price: 750, desc: '巨大な隕石を落とします。', color: '#F97316', icon: '☄️', baseType: 'HEAVY', enhanceType: 'ELEMENTAL' },
    HEAL: { name: 'ヒール弾', price: 400, desc: '自分のHPを回復します。', color: '#34D399', icon: '💚', baseType: 'TRAP', enhanceType: 'MAGIC' },
    PRISM: { name: 'プリズム', price: 600, desc: '7方向へ反射レーザーを放つ。', color: '#F0ABFC', icon: '🔮', baseType: 'AIR', enhanceType: 'TIME' },
    GRAVITY: { name: 'グラビティ', price: 550, desc: '強固な重力場を作ります。', color: '#6366F1', icon: '🌀', baseType: 'HEAVY', enhanceType: 'MAGIC' },
    INFERNO: { name: 'インフェルノ', price: 800, desc: '最強級の火炎弾です。', color: '#DC2626', icon: '🔥', baseType: 'AIR', enhanceType: 'KINETIC' },
    WARP_MINE: { name: 'ワープマイン', price: 500, desc: '敵をランダムにワープさせる。', color: '#818CF8', icon: '🌀', baseType: 'TRAP', enhanceType: 'KINETIC' },
    SHIELD: { name: 'シールド弾', price: 350, desc: 'シールドを張ります。', color: '#22D3EE', icon: '🛡️', baseType: 'TRAP', enhanceType: 'ELEMENTAL' },
    BLACKHOLE: { name: 'ブラックホール', price: 900, desc: '全てを呑み込む引力圏。', color: '#000000', icon: '🕳️', baseType: 'HEAVY', enhanceType: 'TIME' },
    ION_BEAM: { name: 'イオンビーム', price: 450, desc: '高速貫通粒子。', color: '#60A5FA', icon: '⚡', baseType: 'ENERGY', enhanceType: 'KINETIC' },
    PULSE_WAVE: { name: 'パルスウェーブ', price: 500, desc: '全方向に衝撃波。', color: '#A78BFA', icon: '💠', baseType: 'ENERGY', enhanceType: 'EXPLOSIVE' },
    TESLA: { name: 'テスラコイル', price: 550, desc: '電気フィールドを展開。', color: '#FCD34D', icon: '🔋', baseType: 'ENERGY', enhanceType: 'ELEMENTAL' },
    SOLAR_FLARE: { name: 'ソーラーフレア', price: 700, desc: '太陽の炎で焼き尽くす。', color: '#FBBF24', icon: '☀️', baseType: 'ENERGY', enhanceType: 'MAGIC' },
    VORTEX: { name: 'ボーテックス', price: 600, desc: '敵を引き込む渦。', color: '#8B5CF6', icon: '🌀', baseType: 'CHAOS', enhanceType: 'KINETIC' },
    RIFT: { name: 'リフト', price: 650, desc: '地形を消滅させる裂け目。', color: '#C084FC', icon: '🕳️', baseType: 'CHAOS', enhanceType: 'EXPLOSIVE' },
    DARK_MATTER: { name: 'ダークマター', price: 850, desc: '未知の力で押し潰す。', color: '#374151', icon: '⬛', baseType: 'ENERGY', enhanceType: 'GRAVITY_E' },
    ANTIMATTER: { name: 'アンチマター', price: 950, desc: '究極の対消滅ダメージ。', color: '#F43F5E', icon: '⭕', baseType: 'ENERGY', enhanceType: 'PLASMA_E' },
    SKYROCKET: { name: '打ち上げ花火', price: 500, desc: '上空で炸裂します。', color: '#FF69B4', icon: '🎆', baseType: 'SPREAD', enhanceType: 'TIME' }
};

// Weapon Upgrade Definitions
// tier1 = first upgrade (1000G), tier2 = second upgrade (5000G)
const WEAPON_UPGRADES = {
    VOLCANO: { tier1: { desc: '拡散した弾が着弾時にもう一度拡散する', effect: '二段拡散' }, tier2: { desc: '拡散回数が3段に。マグマの雨が降り注ぐ', effect: '三段拡散' } },
    SHOTGUN: { tier1: { desc: '弾数が3発→5発に増加', effect: '5発' }, tier2: { desc: '弾数が5発→7発に増加', effect: '7発' } },
    CLUSTER: { tier1: { desc: '子弾が6発→10発に増加', effect: '子弾10発' }, tier2: { desc: '子弾が10発→16発に増加', effect: '子弾16発' } },
    NUKE: { tier1: { desc: '爆発半径が大幅に拡大', effect: '爆発範囲UP' }, tier2: { desc: '爆発半径がさらに拡大＋ダメージ120', effect: '超爆発' } },
    SNIPER: { tier1: { desc: 'ダメージが60→90に強化', effect: '威力UP' }, tier2: { desc: 'ダメージが90→130に強化', effect: '超威力' } },
    DRILL: { tier1: { desc: '貫通力が20→40に倍増', effect: '貫通力UP' }, tier2: { desc: '貫通力が40→80に。地球を掘り抜く', effect: '超貫通' } },
    GATLING: { tier1: { desc: '連射数が5→8に増加', effect: '8連射' }, tier2: { desc: '連射数が8→12に増加', effect: '12連射' } },
    NAPALM: { tier1: { desc: '燃焼エリアの持続ターンが3→6に', effect: '持続UP' }, tier2: { desc: '持続ターンが6→10に＋範囲拡大', effect: '超持続' } },
    SHOWER: { tier1: { desc: '爆弾が8→14発に増加', effect: '14発' }, tier2: { desc: '爆弾が14→22発に増加', effect: '22発' } },
    BOUNCER: { tier1: { desc: 'バウンス回数が2→5回に増加', effect: '5回' }, tier2: { desc: 'バウンス回数が5→9回＋弾が大きく', effect: '9回' } },
    SKYROCKET: { tier1: { desc: '散弾数が8→14に増加', effect: '散弾14発' }, tier2: { desc: '散弾数が14→22に増加', effect: '散弾22発' } },
    LASER: { tier1: { desc: 'レーザーが太くなり威力UP', effect: '太レーザー' }, tier2: { desc: 'レーザーが貫通し複数の敵を貫く', effect: '貫通レーザー' } },
    BLACKHOLE: { tier1: { desc: '引力範囲が拡大', effect: '範囲UP' }, tier2: { desc: '引力が超強化。地形も大きく飲む', effect: '超引力' } },
    HOMING: { tier1: { desc: '追尾性能が強化される', effect: '追尾UP' }, tier2: { desc: '着弾時に再追尾弾を発射', effect: '再追尾' } },
    METEOR: { tier1: { desc: '隕石が3個に増加', effect: '3連隕石' }, tier2: { desc: '隕石が5個に。圧倒的殲滅力', effect: '5連隕石' } },
    ION_BEAM: { tier1: { desc: '威力が45→65に強化', effect: '高出力' }, tier2: { desc: '弾速が上がり、貫通時の減衰がなくなる', effect: '超電磁' } },
    PULSE_WAVE: { tier1: { desc: '衝撃波の弾数が8→16に増加', effect: '高密度' }, tier2: { desc: '衝撃波の範囲と威力が大幅上昇', effect: 'メガパルス' } },
    TESLA: { tier1: { desc: 'フィールドの持続が4→7ターンに', effect: '持続UP' }, tier2: { desc: 'フィールドのダメージが倍増', effect: '高電圧' } },
    SOLAR_FLARE: { tier1: { desc: '燃焼範囲がさらに拡大', effect: '広域焼却' }, tier2: { desc: '着弾時に小型フレアを3つ放出', effect: 'トリプルフレア' } },
    VORTEX: { tier1: { desc: '吸引力が大幅に強化', effect: '超重力吸引' }, tier2: { desc: '吸引範囲が1.5倍に拡大', effect: 'メガボーテックス' } },
    RIFT: { tier1: { desc: '地形消滅範囲が拡大', effect: '広域崩壊' }, tier2: { desc: '消滅時に重力ダメージを追加', effect: '崩壊現象' } },
    DARK_MATTER: { tier1: { desc: '威力が60→90に強化', effect: '高密度化' }, tier2: { desc: '影響範囲が画面の3分の1を覆う', effect: 'ダークネス' } },
    ANTIMATTER: { tier1: { desc: '威力が100→150に強化', effect: '対消滅UP' }, tier2: { desc: '威力が150→250、範囲も最大に', effect: '万物の終焉' } },
};
let weaponUpgrades = {}; // { VOLCANO: 1, SHOTGUN: 2, ... } (0=none, 1=tier1, 2=tier2)

// Research Recipes
const RESEARCH_RECIPES = {
    'DIRECT_KINETIC': 'SNIPER', 'DIRECT_EXPLOSIVE': 'STANDARD', 'DIRECT_TECH': 'LASER', 'DIRECT_SONIC': 'SCREECH', 'DIRECT_TIME': 'ACCEL',
    'DIRECT_ELEMENTAL': 'GLACIER', 'DIRECT_MAGIC': 'HOMING',
    'SPREAD_KINETIC': 'SHOTGUN', 'SPREAD_EXPLOSIVE': 'CLUSTER', 'SPREAD_ELEMENTAL': 'VOLCANO', 'SPREAD_TECH': 'GATLING', 'SPREAD_SONIC': 'ECHO',
    'SPREAD_TIME': 'SKYROCKET',
    'HEAVY_KINETIC': 'IMPACT', 'HEAVY_EXPLOSIVE': 'NUKE', 'HEAVY_TECH': 'SATELLITE', 'HEAVY_TIME': 'BLACKHOLE',
    'HEAVY_ELEMENTAL': 'METEOR', 'HEAVY_MAGIC': 'GRAVITY', 'HEAVY_SONIC': 'PLASMA',
    'GROUND_KINETIC': 'BOUNCER', 'GROUND_EXPLOSIVE': 'ROLLER', 'GROUND_TECH': 'DRILL', 'GROUND_ELEMENTAL': 'EARTH',
    'GROUND_MAGIC': 'BOOMERANG', 'GROUND_SONIC': 'SHRAPNEL', 'GROUND_TIME': 'SMOKE',
    'AIR_EXPLOSIVE': 'SHOWER', 'AIR_ELEMENTAL': 'NAPALM', 'AIR_TECH': 'MAGNET', 'AIR_MAGIC': 'TELEPORT', 'AIR_SONIC': 'THUNDER',
    'AIR_KINETIC': 'INFERNO', 'AIR_TIME': 'PRISM',
    'TRAP_EXPLOSIVE': 'LANDMINE', 'TRAP_TECH': 'SENTRY', 'TRAP_TIME': 'C4',
    'TRAP_KINETIC': 'WARP_MINE', 'TRAP_ELEMENTAL': 'SHIELD', 'TRAP_MAGIC': 'HEAL', 'TRAP_SONIC': 'CHAIN',
    'BIO_KINETIC': 'LEECH', 'BIO_EXPLOSIVE': 'VIRUS', 'BIO_ELEMENTAL': 'ACID',
    'BIO_TECH': 'CHAIN', 'BIO_MAGIC': 'HEAL', 'BIO_SONIC': 'POISON', 'BIO_TIME': 'SMOKE',
    // Energy base
    'ENERGY_KINETIC': 'ION_BEAM', 'ENERGY_EXPLOSIVE': 'PULSE_WAVE', 'ENERGY_ELEMENTAL': 'TESLA',
    'ENERGY_TECH': 'LASER', 'ENERGY_MAGIC': 'SOLAR_FLARE', 'ENERGY_SONIC': 'PLASMA',
    'ENERGY_TIME': 'PRISM', 'ENERGY_GRAVITY_E': 'DARK_MATTER', 'ENERGY_PLASMA_E': 'ANTIMATTER',
    // Chaos base
    'CHAOS_KINETIC': 'VORTEX', 'CHAOS_EXPLOSIVE': 'RIFT', 'CHAOS_ELEMENTAL': 'INFERNO',
    'CHAOS_TECH': 'WARP_MINE', 'CHAOS_MAGIC': 'DARK_MATTER', 'CHAOS_SONIC': 'SHRAPNEL',
    'CHAOS_TIME': 'BLACKHOLE', 'CHAOS_GRAVITY_E': 'GRAVITY', 'CHAOS_PLASMA_E': 'ANTIMATTER',
    // Fill gaps in new types
    'DIRECT_GRAVITY_E': 'GRAVITY', 'SPREAD_GRAVITY_E': 'VORTEX', 'HEAVY_GRAVITY_E': 'DARK_MATTER',
    'GROUND_GRAVITY_E': 'RIFT', 'AIR_GRAVITY_E': 'METEOR', 'TRAP_GRAVITY_E': 'WARP_MINE', 'BIO_GRAVITY_E': 'LEECH',
    'DIRECT_PLASMA_E': 'PLASMA', 'SPREAD_PLASMA_E': 'PULSE_WAVE', 'HEAVY_PLASMA_E': 'ANTIMATTER',
    'GROUND_PLASMA_E': 'TESLA', 'AIR_PLASMA_E': 'SOLAR_FLARE', 'TRAP_PLASMA_E': 'ION_BEAM', 'BIO_PLASMA_E': 'ACID'
};
const RESEARCH_RECIPES_ALT = { 'AIR_ELEMENTAL': ['NAPALM', 'POISON'], 'SPREAD_MAGIC': ['FIREWORKS', 'SKYROCKET'], 'TRAP_SONIC': ['CHAIN', 'SMOKE'] };

// --- Global Variables ---
let width, height;
let terrain = [];
let particles = [];
let bullets = [];
let activeZones = [];
let currentPlayer = 1;
let wind = 0;
let isInputLocked = false;
let gameOver = false;
let tanks = {};
let gameActive = false;
let numOpponents = 1;
let playerGold = 0;
let playerInventory = {};
let unlockedWeapons = { 'STANDARD': true };
let currentMatchAmmo = {};
let waitingForCPUBullets = false;

// --- Achievement System ---
const ACHIEVEMENTS = {
    FIRST_HIT: { name: 'ファーストヒット', icon: '🎯', desc: '最初にダメージを与えた', gold: 50, color: '#3B82F6' },
    FIRST_KILL: { name: 'ファーストキル', icon: '💀', desc: '最初の撃破', gold: 100, color: '#EF4444' },
    MULTI_KILL: { name: 'マルチキル', icon: '💥', desc: '1発で2体以上撃破', gold: 200, color: '#F59E0B' },
    SNIPER_SHOT: { name: 'スナイパー', icon: '🎯', desc: '長距離ヒット (画面50%超)', gold: 80, color: '#A855F7' },
    UNTOUCHABLE: { name: 'アンタッチャブル', icon: '🛡️', desc: 'ノーダメージで勝利', gold: 300, color: '#10B981' },
    DOMINATION: { name: 'ドミネーション', icon: '👑', desc: '全CPUを撃破して勝利', gold: 150, color: '#FBBF24' },
    SURVIVOR: { name: 'サバイバー', icon: '❤️', desc: 'HP10%以下で勝利', gold: 200, color: '#F43F5E' },
    DOUBLE_KILL: { name: 'ダブルキル', icon: '⚔️', desc: '1ターンで2体以上撃破', gold: 150, color: '#EC4899' },
    OVERKILL: { name: 'オーバーキル', icon: '☠️', desc: '50以上の大ダメージ', gold: 60, color: '#DC2626' },
    CELEBRATION: { name: '祝宴', icon: '🎉', desc: '戦闘中に実績を達成', gold: 100, color: '#F472B6' },
    // New achievements
    HEADSHOT: { name: 'ヘッドショット', icon: '🧠', desc: '一撃で敵を撃破', gold: 120, color: '#6366F1' },
    TRIPLE_KILL: { name: 'トリプルキル', icon: '🔱', desc: '1ターンで3体以上撃破', gold: 300, color: '#D946EF' },
    COMEBACK: { name: 'カムバック', icon: '🔄', desc: 'HP20%以下から勝利', gold: 250, color: '#06B6D4' },
    PACIFIST: { name: 'パシフィスト', icon: '🕊️', desc: '3ターン以上ダメージを与えずに勝利', gold: 400, color: '#A3E635' },
    PERFECTIONIST: { name: 'パーフェクショニスト', icon: '💯', desc: '全弾命中させて勝利', gold: 350, color: '#F59E0B' },
    DEMOLISHER: { name: 'デモリッシャー', icon: '🏗️', desc: '累計200以上のダメージを与えた', gold: 100, color: '#78716C' },
    SPEED_RUN: { name: 'スピードラン', icon: '⏱️', desc: '5ターン以内に勝利', gold: 250, color: '#14B8A6' },
    WEAPON_MASTER: { name: 'ウェポンマスター', icon: '🗡️', desc: '1試合で3種類以上の武器で撃破', gold: 200, color: '#F97316' },
};
let matchAchievements = {}; // Achievements earned this match
let matchStats = { hits: 0, kills: 0, killsThisTurn: 0, damageTaken: 0, cpusKilled: 0, maxDamage: 0, totalDamageDealt: 0, turns: 0, shots: 0, shotsHit: 0, weaponKills: {} };
let celebrationPending = false; // Launch fireworks on next player turn

// --- Save/Load ---
function getSaveObject() { return { gold: playerGold, inv: playerInventory, unlocks: unlockedWeapons, upgrades: weaponUpgrades, v: 4 }; }
function saveGameData() { localStorage.setItem('tankWars_save_v4', JSON.stringify(getSaveObject())); }
function loadGameData() {
    const str = localStorage.getItem('tankWars_save_v4');
    if (str) {
        try {
            const data = JSON.parse(str);
            playerGold = data.gold || 0; playerInventory = data.inv || {}; unlockedWeapons = data.unlocks || { 'STANDARD': true };
            weaponUpgrades = data.upgrades || {};
            for (const key in WEAPONS) {
                if (playerInventory[key] === undefined) playerInventory[key] = key === 'STANDARD' ? Infinity : 0;
                if (unlockedWeapons[key] === undefined) unlockedWeapons[key] = key === 'STANDARD';
            }
        } catch (e) { }
    } else {
        for (const key in WEAPONS) { playerInventory[key] = key === 'STANDARD' ? Infinity : 0; unlockedWeapons[key] = key === 'STANDARD'; }
    }
}

// --- Data Manager ---
function openDataManager() {
    const json = JSON.stringify(getSaveObject());
    document.getElementById('exportArea').value = btoa(json);
    document.getElementById('importArea').value = ""; document.getElementById('importMsg').textContent = "";
    document.getElementById('dataModal').classList.remove('hidden');
}
function copySaveData() { document.getElementById('exportArea').select(); document.execCommand('copy'); alert('コピーしました'); }
function importSaveData() {
    try {
        const data = JSON.parse(atob(document.getElementById('importArea').value.trim()));
        playerGold = data.gold; playerInventory = data.inv; unlockedWeapons = data.unlocks;
        weaponUpgrades = data.upgrades || {};
        saveGameData(); updateDisplays(); document.getElementById('importMsg').textContent = "成功！";
        setTimeout(closeModals, 1000);
    } catch (e) { document.getElementById('importMsg').textContent = "データ無効"; }
}

// --- UI ---
const ui = {
    angleInput: document.getElementById('angleInput'), angleValue: document.getElementById('angleValue'),
    powerInput: document.getElementById('powerInput'), powerValue: document.getElementById('powerValue'),
    fireBtn: document.getElementById('fireBtn'), windArrow: document.getElementById('windArrow'), windValue: document.getElementById('windValue'),
    turnIndicator: document.getElementById('turnIndicator'), p1Health: document.getElementById('p1HealthBar'), p1Text: document.getElementById('p1HealthText'),
    cpuHudContainer: document.getElementById('cpuHudContainer'), playerHud: document.getElementById('playerHud'),
    gameOverModal: document.getElementById('gameOverModal'), winnerText: document.getElementById('winnerText'),
    uiLayer: document.getElementById('ui-layer'), titleScreen: document.getElementById('titleScreen'), weaponSelect: document.getElementById('weaponSelect'),
    titleGold: document.getElementById('titleGoldDisplay'), shopModal: document.getElementById('shopModal'), shopGold: document.getElementById('shopGoldDisplay'), shopItems: document.getElementById('shopItemsContainer'),
    labModal: document.getElementById('labModal'), labGold: document.getElementById('labGoldDisplay'), cpuInput: document.getElementById('cpuCountInput'), cpuDisplay: document.getElementById('cpuCountDisplay'),
    labBase: document.getElementById('labBaseSelect'), labEnhance: document.getElementById('labEnhanceSelect'), labPred: document.getElementById('labPredictionText'),
    unlockedList: document.getElementById('unlockedList')
};

ui.cpuInput.addEventListener('input', e => ui.cpuDisplay.textContent = e.target.value);

function updateLabPrediction() {
    const comboKey = ui.labBase.value + '_' + ui.labEnhance.value;
    let res = RESEARCH_RECIPES[comboKey] || (RESEARCH_RECIPES_ALT[comboKey] ? RESEARCH_RECIPES_ALT[comboKey][0] : null);
    if (!res) {
        ui.labPred.textContent = "実験失敗の可能性大..."; ui.labPred.className = "font-bold text-lg text-gray-500";
    } else if (unlockedWeapons[res]) {
        ui.labPred.textContent = `発明済み: ${WEAPONS[res].name}`; ui.labPred.className = "font-bold text-lg text-yellow-400";
    } else {
        ui.labPred.textContent = `${WEAPONS[res].name} (未発明)`; ui.labPred.className = "font-bold text-lg text-purple-300 animate-pulse";
    }
}
ui.labBase.addEventListener('change', updateLabPrediction);
ui.labEnhance.addEventListener('change', updateLabPrediction);

function resize() { width = window.innerWidth; height = window.innerHeight; canvas.width = width; canvas.height = height; if (terrain.length === 0) generateTerrain(0); }
window.addEventListener('resize', resize);
function updateDisplays() { const t = `${playerGold} G`; ui.titleGold.textContent = t; ui.shopGold.textContent = t; ui.labGold.textContent = t; }

// --- Logic ---
function generateTerrain(n) {
    terrain = new Array(width).fill(0);
    let y = height * 0.6; let slope = 0;
    for (let x = 0; x < width; x++) {
        slope += (Math.random() - 0.5) * 0.5; slope = Math.max(Math.min(slope, 1.5), -1.5); y += slope;
        if (y > height - 180) { y = height - 180; slope -= 0.5; } if (y < height * 0.2) { y = height * 0.2; slope += 0.5; }
        terrain[x] = y;
    }
    for (let i = 0; i < 5; i++) { const nT = [...terrain]; for (let x = 1; x < width - 1; x++) nT[x] = (terrain[x - 1] + terrain[x] + terrain[x + 1]) / 3; terrain = nT; }
    if (n > 0) setupTanks(n);
}

function setupTanks(n) {
    tanks = {}; numOpponents = n;
    tanks[1] = { x: Math.floor(width * 0.05) + 20, y: 0, color: '#3B82F6', health: 100, angle: 45, power: 50, isCPU: false, name: 'PLAYER' };
    const range = 0.8; const step = range / n;
    for (let i = 0; i < n; i++) {
        const id = i + 2; const r = 0.15 + (step * i) + (Math.random() * step * 0.8);
        tanks[id] = { x: Math.floor(width * r), y: 0, color: CPU_COLORS[i % 10], health: 100, angle: 135, power: 50, isCPU: true, name: `CPU ${i + 1}` };
    }
    for (const id in tanks) updateTankY(id);
    createHUD(n); currentMatchAmmo = { ...playerInventory }; updateWeaponSelect();
}

function createHUD(n) {
    ui.cpuHudContainer.innerHTML = ''; ui.p1Health.style.width = '100%'; ui.p1Text.textContent = '100%';
    for (let i = 0; i < n; i++) {
        const id = i + 2; const c = CPU_COLORS[i % 10];
        ui.cpuHudContainer.innerHTML += `<div class="bg-gray-800 bg-opacity-80 p-2 rounded border w-40 mb-2" style="border-color:${c}"><div class="flex justify-between text-xs mb-1"><span style="color:${c}" class="font-bold">CPU ${i + 1}</span><span id="hp-text-${id}">100%</span></div><div class="w-full bg-gray-700 h-2 rounded-full overflow-hidden"><div id="hp-bar-${id}" style="background-color:${c}" class="h-full w-full transition-all duration-300"></div></div></div>`;
    }
}

function updateTankY(id) {
    const t = tanks[id]; let total = 0, c = 0;
    for (let x = Math.floor(t.x - 10); x <= Math.floor(t.x + 10); x++) {
        let tx = x; if (tx < 0) tx += width; if (tx >= width) tx -= width;
        if (tx >= 0 && tx < width) { total += terrain[tx]; c++; }
    }
    t.y = c > 0 ? total / c : height / 2;
}

function updateHUDs() {
    if (!tanks[1]) return;
    const p1 = tanks[1];
    ui.p1Health.style.width = `${Math.max(0, p1.health)}%`;
    ui.p1Text.textContent = `${Math.max(0, p1.health)}%`;

    for (const id in tanks) {
        if (id == 1) continue;
        const cpu = tanks[id];
        const bar = document.getElementById(`hp-bar-${id}`);
        const txt = document.getElementById(`hp-text-${id}`);
        if (bar) bar.style.width = `${Math.max(0, cpu.health)}%`;
        if (txt) txt.textContent = `${Math.max(0, cpu.health)}%`;
    }
}

function checkWin() {
    if (gameOver || !gameActive) return;

    const p1 = tanks[1];
    let cpusAlive = 0;
    for (const id in tanks) {
        if (id != 1 && tanks[id].health > 0) cpusAlive++;
    }

    const isDefeat = p1.health <= 0;
    const isVictory = cpusAlive === 0;

    if (!isDefeat && !isVictory) return;

    gameOver = true;

    // --- Check end-of-game achievements ---
    if (isVictory) {
        awardAchievement('DOMINATION');
        if (matchStats.damageTaken === 0) awardAchievement('UNTOUCHABLE');
        if (p1.health > 0 && p1.health <= 10) awardAchievement('SURVIVOR');
        if (p1.health > 0 && p1.health <= 20) awardAchievement('COMEBACK');
        if (matchStats.turns <= 5) awardAchievement('SPEED_RUN');
        if (matchStats.turns >= 3 && matchStats.totalDamageDealt === 0) awardAchievement('PACIFIST');
        if (matchStats.shots > 0 && matchStats.shotsHit >= matchStats.shots) awardAchievement('PERFECTIONIST');
    }

    // --- Calculate Rewards ---
    const rewardLines = [];
    let totalGold = 0;

    if (isVictory) {
        ui.winnerText.textContent = "VICTORY!";
        ui.winnerText.className = "game-font text-3xl mb-2 text-yellow-500 leading-normal";
        document.getElementById('resultSubtext').textContent = `全${numOpponents}体のCPUを撃破！`;
        const baseReward = 300 * numOpponents;
        rewardLines.push({ label: `勝利ボーナス (×${numOpponents})`, amount: baseReward, icon: '🏆', color: '#FBBF24' });
        totalGold += baseReward;
    } else {
        ui.winnerText.textContent = "GAME OVER";
        ui.winnerText.className = "game-font text-3xl mb-2 text-red-500 leading-normal";
        const playerKilled = matchStats.cpusKilled;
        // Count all dead CPUs (including those killed by other CPUs)
        let totalDead = 0;
        for (const id in tanks) { if (id != 1 && tanks[id].health <= 0) totalDead++; }
        const otherDead = totalDead - playerKilled;
        document.getElementById('resultSubtext').textContent = totalDead > 0 ? `${totalDead}体のCPUが脱落！` : '撃破数: 0';
        if (playerKilled > 0) {
            const killReward = 100 * playerKilled;
            rewardLines.push({ label: `自力撃破 (×${playerKilled})`, amount: killReward, icon: '💀', color: '#EF4444' });
            totalGold += killReward;
        }
        if (otherDead > 0) {
            const otherReward = 75 * otherDead;
            rewardLines.push({ label: `他脱落ボーナス (×${otherDead})`, amount: otherReward, icon: '💫', color: '#9CA3AF' });
            totalGold += otherReward;
        }
    }

    // Add achievement rewards
    for (const key in matchAchievements) {
        if (matchAchievements[key]) {
            const a = ACHIEVEMENTS[key];
            rewardLines.push({ label: `${a.icon} ${a.name}`, amount: a.gold, icon: a.icon, color: a.color, isAchievement: true });
            totalGold += a.gold;
        }
    }

    playerGold += totalGold;
    saveGameData();
    updateDisplays();

    // --- Render Reward Breakdown ---
    const linesContainer = document.getElementById('rewardLines');
    linesContainer.innerHTML = '';
    rewardLines.forEach((line, i) => {
        const div = document.createElement('div');
        div.className = 'reward-line flex justify-between items-center px-2 py-1 rounded';
        div.style.animationDelay = `${i * 0.15}s`;
        if (line.isAchievement) {
            div.style.background = `${line.color}15`;
            div.style.borderLeft = `3px solid ${line.color}`;
        }
        div.innerHTML = `<span class="text-sm ${line.isAchievement ? 'text-white' : 'text-gray-300'}">${line.label}</span><span class="font-bold text-yellow-400 font-mono">+${line.amount} G</span>`;
        linesContainer.appendChild(div);
    });

    // Total
    const totalEl = document.getElementById('rewardTotal');
    totalEl.style.animationDelay = `${rewardLines.length * 0.15 + 0.2}s`;
    document.getElementById('rewardTotalAmount').textContent = `+${totalGold} G`;

    // Achievement summary section
    const achKeys = Object.keys(matchAchievements).filter(k => matchAchievements[k]);
    const achSummary = document.getElementById('achievementsSummary');
    const achLines = document.getElementById('achievementLines');
    if (achKeys.length > 0) {
        achSummary.classList.remove('hidden');
        achLines.innerHTML = '';
        achKeys.forEach(key => {
            const a = ACHIEVEMENTS[key];
            const div = document.createElement('div');
            div.className = 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border';
            div.style.borderColor = a.color + '66';
            div.style.backgroundColor = a.color + '1A';
            div.innerHTML = `<span class="text-sm">${a.icon}</span><span class="text-xs font-bold" style="color:${a.color}">${a.name}</span>`;
            achLines.appendChild(div);
        });
    } else {
        achSummary.classList.add('hidden');
    }

    // Show no reward if nothing earned
    if (totalGold === 0) {
        linesContainer.innerHTML = '<div class="text-center text-gray-500 text-sm py-2">報酬なし</div>';
    }

    ui.gameOverModal.classList.remove('hidden');
}

// --- Achievement Functions ---
function awardAchievement(key) {
    if (matchAchievements[key]) return; // Already earned this match
    matchAchievements[key] = true;
    showAchievementToast(key);
    // Trigger CELEBRATION achievement (meta-achievement) and set fireworks flag
    if (key !== 'CELEBRATION') {
        celebrationPending = true;
        awardAchievement('CELEBRATION');
    }
}

function showAchievementToast(key) {
    const a = ACHIEVEMENTS[key];
    if (!a) return;
    const container = document.getElementById('achievementContainer');
    const toast = document.createElement('div');
    toast.className = 'achievement-toast flex items-center gap-3 bg-gray-800 bg-opacity-95 border rounded-lg px-4 py-3 shadow-xl min-w-[260px] max-w-[320px]';
    toast.style.borderColor = a.color;
    toast.style.boxShadow = `0 0 20px ${a.color}40`;
    toast.innerHTML = `
                <span class="text-2xl">${a.icon}</span>
                <div class="flex-1">
                    <div class="text-[10px] text-gray-400 uppercase tracking-widest">Achievement</div>
                    <div class="font-bold text-sm" style="color:${a.color}">${a.name}</div>
                    <div class="text-xs text-gray-400">${a.desc}</div>
                </div>
                <div class="text-yellow-400 font-bold text-sm">+${a.gold}G</div>
            `;
    container.appendChild(toast);
    // Remove after animation
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 3200);
}

// Fire a single CPU tank (helper for simultaneous firing)
function fireCPU(cpuId) {
    const t = tanks[cpuId];
    if (!t || !t.isCPU || t.health <= 0) return;

    // Simple AI - target player
    if (tanks[1] && tanks[1].health > 0) {
        const target = tanks[1];
        let dx = target.x - t.x;
        if (Math.abs(dx) > width / 2) dx = dx > 0 ? dx - width : dx + width;

        let angle = dx > 0 ? 45 : 135;
        t.angle = angle + (Math.random() * 20 - 10);
        t.power = 30 + Math.random() * 50;
        // Smoke debuff: extra randomness if near smoke zone
        for (const z of activeZones) {
            if (z.type === 'SMOKE') {
                let sdx = Math.abs(t.x - z.x); if (sdx > width / 2) sdx = width - sdx;
                if (sdx < z.radius + 40) { t.angle += (Math.random() - 0.5) * 40; t.power += (Math.random() - 0.5) * 30; break; }
            }
        }
    }

    // Choose weapon
    let wType = 'STANDARD';
    if (Math.random() < 0.3) {
        const keys = Object.keys(WEAPONS).filter(k => k !== 'STANDARD');
        if (keys.length) wType = keys[Math.floor(Math.random() * keys.length)];
    }

    // Spawn bullets for this CPU
    if (wType === 'SHOTGUN') {
        for (let i = -1; i <= 1; i++) bullets.push(new Bullet(t.x, t.y - 15, t.angle + i * 5, t.power, cpuId, wType));
    } else if (wType === 'GATLING') {
        for (let i = 0; i < 5; i++) setTimeout(() => bullets.push(new Bullet(t.x, t.y - 15, t.angle + (Math.random() - .5) * 2, t.power + (Math.random() - .5) * 2, cpuId, 'STANDARD')), i * 100);
    } else {
        bullets.push(new Bullet(t.x, t.y - 15, t.angle, t.power, cpuId, wType));
    }
}

// After player's bullets resolve, all CPUs fire simultaneously
function afterPlayerShot() {
    if (gameOver || !gameActive) return;
    // Check for double/triple-kill achievement
    if (matchStats.killsThisTurn >= 2) awardAchievement('DOUBLE_KILL');
    if (matchStats.killsThisTurn >= 3) awardAchievement('TRIPLE_KILL');
    // Process active zones for turn
    processActiveZones();
    updateHUDs(); checkWin(); if (gameOver) return;
    setWind(false);

    // Fire all alive CPUs simultaneously
    let anyCPUFired = false;
    for (const id in tanks) {
        if (id == 1) continue;
        if (tanks[id].health > 0) {
            // Check if frozen
            if (tanks[id].frozen && tanks[id].frozen > 0) {
                tanks[id].frozen--;
                for (let i = 0; i < 5; i++) particles.push({ x: tanks[id].x, y: tanks[id].y - 10, vx: (Math.random() - 0.5) * 3, vy: -Math.random() * 3, life: 0.5, color: '#67E8F9', size: 2 });
                continue;
            }
            fireCPU(Number(id));
            anyCPUFired = true;
        }
    }

    if (anyCPUFired) {
        // Wait for CPU bullets to resolve, then return to player
        waitingForCPUBullets = true;
        ui.turnIndicator.textContent = "CPUの攻撃中...";
    } else {
        // No CPUs alive, return to player immediately
        returnToPlayer();
    }
}

// Return control to the player
function returnToPlayer() {
    if (gameOver) return;
    // Process active zones for turn
    processActiveZones();
    updateHUDs(); checkWin(); if (gameOver) return;

    currentPlayer = 1;
    setWind(false);
    bullets = [];
    isInputLocked = false;
    waitingForCPUBullets = false;
    ui.uiLayer.classList.remove('translate-y-full');

    const t = tanks[currentPlayer];
    if (t && t.health > 0) {
        ui.turnIndicator.textContent = "あなたの番です";
        ui.fireBtn.disabled = false; ui.weaponSelect.disabled = false;
        ui.angleInput.disabled = false; ui.powerInput.disabled = false;
        ui.angleInput.value = t.angle; ui.angleValue.textContent = t.angle + "°";
        ui.powerInput.value = t.power; ui.powerValue.textContent = t.power;
        updateWeaponSelect();

        // Celebration fireworks!
        if (celebrationPending) {
            celebrationPending = false;
            launchCelebrationFireworks(t.x);
        }
    }
}

// Process active zones (extracted from old nextTurn)
function processActiveZones() {
    for (let i = activeZones.length - 1; i >= 0; i--) {
        const z = activeZones[i];
        if (z.type === 'SATELLITE' || z.type === 'THUNDER') { z.life--; if (z.life <= 0) activeZones.splice(i, 1); continue; }
        if (z.type === 'LANDMINE') {
            for (const id in tanks) {
                const t = tanks[id]; if (t.health <= 0) continue;
                let dx = Math.abs(t.x - z.x); if (dx > width / 2) dx = width - dx;
                if (Math.sqrt(dx * dx + (t.y - z.y) ** 2) < 20) { explode(z.x, z.y, 'IMPACT'); activeZones.splice(i, 1); break; }
            }
            continue;
        }
        if (z.type === 'C4') {
            z.life--; if (z.life % 100 === 0) { /* Tick sound? */ }
            if (z.life <= 0) { explode(z.x, z.y, 'NUKE'); activeZones.splice(i, 1); }
            continue;
        }
        if (z.type === 'SENTRY') {
            z.life--;
            if (z.life % 60 === 0) {
                let target = null, minD = 9999;
                for (const id in tanks) {
                    if (tanks[id].health <= 0 || id == z.owner) continue;
                    let dx = Math.abs(tanks[id].x - z.x); if (dx > width / 2) dx = width - dx;
                    if (dx < minD) { minD = dx; target = tanks[id]; }
                }
                if (target) {
                    let dx = target.x - z.x; if (Math.abs(dx) > width / 2) dx = dx > 0 ? dx - width : dx + width;
                    const ang = Math.atan2(-(target.y - 10 - z.y), dx) * 180 / Math.PI;
                    bullets.push(new Bullet(z.x, z.y - 10, ang, 30, z.owner, 'STANDARD'));
                }
            }
            if (z.life <= 0) activeZones.splice(i, 1);
            continue;
        }
        if (z.type === 'WARP_MINE') {
            for (const id in tanks) {
                const t = tanks[id]; if (t.health <= 0 || id == z.owner) continue;
                let dx = Math.abs(t.x - z.x); if (dx > width / 2) dx = width - dx;
                if (Math.sqrt(dx * dx + (t.y - z.y) ** 2) < 20) {
                    t.x = Math.random() * width;
                    updateTankY(id);
                    for (let j = 0; j < 15; j++) particles.push({ x: t.x, y: t.y - 10, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, life: 0.8, color: '#818CF8', size: 3 });
                    activeZones.splice(i, 1); break;
                }
            }
            continue;
        }
        if (z.type === 'GRAVITY') {
            for (const id in tanks) {
                const t = tanks[id]; if (t.health <= 0) continue;
                let dx = Math.abs(t.x - z.x); if (dx > width / 2) dx = width - dx;
                if (Math.sqrt(dx * dx + (t.y - z.y) ** 2) < z.radius) {
                    t.health = Math.max(0, t.health - 8);
                }
            }
            z.life--; if (z.life <= 0) activeZones.splice(i, 1);
            continue;
        }
        if (z.type === 'SMOKE') {
            z.life--; if (z.life <= 0) activeZones.splice(i, 1);
            continue;
        }
        if (z.type === 'TESLA_ZONE') {
            for (const id in tanks) {
                const t = tanks[id]; if (t.health <= 0) continue;
                let dx = Math.abs(t.x - z.x); if (dx > width / 2) dx = width - dx;
                if (Math.sqrt(dx * dx + (t.y - z.y) ** 2) < z.radius) {
                    t.health = Math.max(0, t.health - 10);
                    for (let j = 0; j < 5; j++) particles.push({ x: t.x, y: t.y - 10, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, life: 0.4, color: '#FCD34D', size: 2 });
                }
            }
            z.life--; if (z.life <= 0) activeZones.splice(i, 1);
            continue;
        }
        for (const id in tanks) {
            const t = tanks[id]; if (t.health <= 0) continue;
            let dx = Math.abs(t.x - z.x); if (dx > width / 2) dx = width - dx;
            if (Math.sqrt(dx * dx + (t.y - z.y) ** 2) < z.radius) {
                t.health = Math.max(0, t.health - (z.type === 'POISON' ? 3 : (z.type === 'VIRUS' ? 5 : 5)));
            }
        }
        z.life--; if (z.life <= 0) activeZones.splice(i, 1);
    }
}

function startGame() { initGame(parseInt(ui.cpuInput.value)); }
function initGame(n) {
    gameActive = true; gameOver = false; currentPlayer = 1; bullets = []; particles = []; activeZones = [];
    matchAchievements = {}; matchStats = { hits: 0, kills: 0, killsThisTurn: 0, damageTaken: 0, cpusKilled: 0, maxDamage: 0, totalDamageDealt: 0, turns: 0, shots: 0, shotsHit: 0, weaponKills: {} };
    celebrationPending = false;
    document.getElementById('achievementContainer').innerHTML = '';
    ui.titleScreen.classList.add('hidden'); ui.gameOverModal.classList.add('hidden'); ui.shopModal.classList.add('hidden'); ui.labModal.classList.add('hidden');
    ui.uiLayer.classList.remove('hidden'); ui.playerHud.classList.remove('hidden'); ui.cpuHudContainer.classList.remove('hidden'); ui.turnIndicator.classList.remove('hidden');
    generateTerrain(n); setWind(true); ui.fireBtn.disabled = false;
}
function returnToTitle() {
    gameActive = false; ui.gameOverModal.classList.add('hidden'); ui.uiLayer.classList.add('hidden');
    ui.playerHud.classList.add('hidden'); ui.cpuHudContainer.classList.add('hidden'); ui.turnIndicator.classList.add('hidden');
    ui.titleScreen.classList.remove('hidden'); updateDisplays(); generateTerrain(0);
}

function closeModals() { ui.shopModal.classList.add('hidden'); ui.labModal.classList.add('hidden'); document.getElementById('dataModal').classList.add('hidden'); }
function openShop() { renderShopItems(); updateDisplays(); ui.shopModal.classList.remove('hidden'); ui.labModal.classList.add('hidden'); }
function openShopFromGame() { openShop(); }
function buyItem(key) {
    if (playerGold >= WEAPONS[key].price) {
        playerGold -= WEAPONS[key].price; if (key !== 'STANDARD') playerInventory[key]++;
        saveGameData(); updateDisplays(); renderShopItems();
    }
}
function renderShopItems() {
    ui.shopItems.innerHTML = ''; let has = false;
    for (const key in WEAPONS) {
        if (key === 'STANDARD' || !unlockedWeapons[key]) continue; has = true;
        const w = WEAPONS[key];
        const upg = WEAPON_UPGRADES[key];
        const upgLevel = weaponUpgrades[key] || 0;
        const afford = playerGold >= (w.price || 0);

        const typeTags = `<div class="flex gap-1 mb-1">
                    <span class="text-[10px] bg-blue-900/50 text-blue-300 px-1 border border-blue-700/50 rounded">${w.baseType || 'OTHER'}</span>
                    <span class="text-[10px] bg-red-900/50 text-red-300 px-1 border border-red-700/50 rounded">${w.enhanceType || 'OTHER'}</span>
                </div>`;

        let upgradeHTML = '';
        if (upg) {
            if (upgLevel === 0) {
                const canAff1 = playerGold >= 1000;
                upgradeHTML = `<div class="mt-2 pt-2 border-t border-gray-700 flex justify-between items-center">
                            <div class="flex-1 text-[10px]"><span class="text-blue-400 font-bold">⬆ 強化Ⅰ: ${upg.tier1.effect}</span><br>${upg.tier1.desc}</div>
                            <button onclick="buyUpgrade('${key}')" class="ml-2 px-2 py-1 rounded text-[10px] font-bold ${canAff1 ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}">1000G</button>
                        </div>`;
            } else if (upgLevel === 1) {
                const canAff2 = playerGold >= 5000;
                upgradeHTML = `<div class="mt-2 pt-2 border-t border-gray-700 flex justify-between items-center">
                            <div class="flex-1 text-[10px]"><span class="text-red-400 font-bold">⬆⬆ 強化Ⅱ: ${upg.tier2.effect}</span><br>${upg.tier2.desc}</div>
                            <button onclick="buyUpgrade('${key}')" class="ml-2 px-2 py-1 rounded text-[10px] font-bold ${canAff2 ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}">5000G</button>
                        </div>`;
            } else {
                upgradeHTML = `<div class="mt-2 pt-2 border-t border-gray-700 text-center text-[10px] font-bold text-yellow-500">✨ 最大強化済 ✨</div>`;
            }
        }

        const nameLabel = upgLevel >= 2 ? `${w.name} <span class="text-red-400 text-xs">⬆⬆</span>` : upgLevel >= 1 ? `${w.name} <span class="text-orange-400 text-xs">⬆</span>` : w.name;
        const borderClass = upgLevel >= 2 ? 'border-red-500/40' : upgLevel >= 1 ? 'border-orange-500/40' : 'border-gray-600';

        const div = document.createElement('div');
        div.className = `bg-gray-700 p-4 rounded-lg flex flex-col justify-between border ${borderClass}`;
        div.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex-1">
                            ${typeTags}
                            <div class="flex items-center gap-2">
                                <span class="text-2xl">${w.icon}</span>
                                <h3 class="font-bold text-white">${nameLabel}</h3>
                            </div>
                        </div>
                        <span class="text-yellow-400 font-mono">${w.price} G</span>
                    </div>
                    <p class="text-gray-300 text-xs mb-4 h-10 leading-tight">${w.desc}</p>
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-xs text-gray-400">所有上限: <span class="text-white font-bold">${playerInventory[key] || 0}</span></span>
                        <button onclick="buyItem('${key}')" class="px-4 py-2 rounded text-sm font-bold transition-all ${afford ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}">拡張 (+1)</button>
                    </div>
                    ${upgradeHTML}
                `;
        ui.shopItems.appendChild(div);
    }
    if (!has) ui.shopItems.innerHTML = '<div class="col-span-2 text-center text-gray-400 py-10">ショップに並ぶ商品がありません。<br>研究所で新しい武器を発明してください。</div>';
}
function buyUpgrade(key) {
    const currentLevel = weaponUpgrades[key] || 0;
    if (currentLevel >= 2) return;
    const cost = currentLevel === 0 ? 1000 : 5000;
    if (playerGold < cost) return;
    playerGold -= cost;
    weaponUpgrades[key] = currentLevel + 1;
    saveGameData(); updateDisplays(); renderShopItems();
}

function openLab() { updateDisplays(); renderUnlockedList(); document.getElementById('researchResult').textContent = ''; updateLabPrediction(); ui.shopModal.classList.add('hidden'); ui.labModal.classList.remove('hidden'); }
function conductResearch() {
    if (playerGold < 500) { document.getElementById('researchResult').textContent = "資金不足 (500G)"; return; }
    const key = ui.labBase.value + '_' + ui.labEnhance.value;
    let res = RESEARCH_RECIPES[key];
    if (!res && RESEARCH_RECIPES_ALT[key]) res = RESEARCH_RECIPES_ALT[key][Math.floor(Math.random() * RESEARCH_RECIPES_ALT[key].length)];

    playerGold -= 500; updateDisplays(); saveGameData();
    const txt = document.getElementById('researchResult');
    if (res) {
        if (unlockedWeapons[res]) { txt.textContent = `すでに発明済み: ${WEAPONS[res].name}`; txt.className = "mt-4 text-center font-bold text-yellow-400"; }
        else {
            unlockedWeapons[res] = true; playerInventory[res] = 1; saveGameData();
            txt.textContent = `発明成功！: ${WEAPONS[res].name}`; txt.className = "mt-4 text-center font-bold text-green-400 text-xl animate-bounce";
            renderUnlockedList(); updateLabPrediction();
        }
    } else { txt.textContent = "失敗..."; txt.className = "mt-4 text-center font-bold text-gray-400"; }
}
function renderUnlockedList() {
    ui.unlockedList.innerHTML = '';
    for (const k in unlockedWeapons) if (unlockedWeapons[k]) ui.unlockedList.innerHTML += `<span class="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300 border border-gray-600">${WEAPONS[k].icon} ${WEAPONS[k].name}</span>`;
}

function updateWeaponSelect() {
    ui.weaponSelect.innerHTML = '';
    for (const key in WEAPONS) {
        if (unlockedWeapons[key] && (playerInventory[key] > 0 || key === 'STANDARD')) {
            const upgMark = (weaponUpgrades[key] || 0) >= 2 ? '⬆⬆' : (weaponUpgrades[key] || 0) >= 1 ? '⬆' : '';
            const txt = key === 'STANDARD' ? `${WEAPONS[key].icon} ${WEAPONS[key].name} (∞)` : `${WEAPONS[key].icon} ${WEAPONS[key].name}${upgMark} (${currentMatchAmmo[key]}/${playerInventory[key]})`;
            const opt = document.createElement('option'); opt.value = key; opt.text = txt;
            if (key !== 'STANDARD' && currentMatchAmmo[key] <= 0) opt.disabled = true;
            ui.weaponSelect.appendChild(opt);
        }
    }
}

class Bullet {
    constructor(x, y, angle, power, ownerId, type = 'STANDARD') {
        this.x = x; this.y = y; this.ownerId = ownerId; this.type = type; this.radius = 4;
        const rad = angle * (Math.PI / 180); let v = power * 0.35;
        this.vx = Math.cos(rad) * v; this.vy = -Math.sin(rad) * v;
        if (type === 'SNIPER') { this.vx *= 1.5; this.vy *= 1.5; this.radius = 3; }
        if (type === 'LASER') { this.vx *= 3; this.vy *= 3; this.radius = 3; }
        if (type === 'SCREECH') { this.vx *= 1.2; this.vy *= 1.2; this.radius = 5; }
        if (type === 'ROLLER') this.radius = 6;
        if (type === 'PLASMA') { this.vx *= 2; this.vy *= 2; this.radius = 5; }
        if (type === 'HOMING') { this.vx *= 0.8; this.vy *= 0.8; }
        this.history = []; this.hasSplit = false;
        this.bounceCount = (weaponUpgrades['BOUNCER'] || 0) >= 2 ? 9 : (weaponUpgrades['BOUNCER'] || 0) >= 1 ? 5 : 2; this.rollTime = 120; this.isRolling = false; this.life = 300;
        this.drillPower = (weaponUpgrades['DRILL'] || 0) >= 2 ? 80 : (weaponUpgrades['DRILL'] || 0) >= 1 ? 40 : 20; this.isDrilling = false;
        this.boomerangDist = 0;
    }
    update() {
        this.life--; if (this.life <= 0) return false;
        if (this.type === 'ACCEL') { this.vx *= 1.05; this.vy *= 1.05; }

        if (this.isDrilling) { this.vx *= 0.8; this.vy *= 0.8; }
        else if (this.isRolling) {
            this.rollTime--; if (this.rollTime <= 0) { explode(this.x, this.y, this.type, this.ownerId); return 'hit'; }
            this.vy += GRAVITY;
            const fY = terrain[Math.floor(this.x)] || height;
            if (this.y >= fY - 5) {
                this.y = fY - 5; this.vy = 0; const hL = terrain[Math.floor(this.x - 2)] || fY; const hR = terrain[Math.floor(this.x + 2)] || fY;
                this.vx += (hR - hL) * 0.2; this.vx *= 0.95;
            } else { this.x += this.vx; this.y += this.vy; return true; }
            this.x += this.vx;
        } else if (this.type === 'LASER' || this.type === 'SCREECH' || this.type === 'PLASMA') { /* Straight */ }
        else if (this.type === 'SNIPER') { this.vy += GRAVITY * 0.4; this.vx += wind * 0.2; }
        else if (this.type === 'HOMING') {
            this.vy += GRAVITY;
            this.vx += wind;
            // Seek nearest enemy
            let closest = null; let closestDist = Infinity;
            for (const id in tanks) {
                if (id == this.ownerId || tanks[id].health <= 0) continue;
                let dx = tanks[id].x - this.x; if (Math.abs(dx) > width / 2) dx = dx > 0 ? dx - width : dx + width;
                const dy = tanks[id].y - this.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < closestDist) { closestDist = d; closest = { dx, dy, d }; }
            }
            if (closest && closest.d > 0) {
                const str = (weaponUpgrades['HOMING'] || 0) >= 1 ? 0.15 : 0.08;
                this.vx += (closest.dx / closest.d) * str;
                this.vy += (closest.dy / closest.d) * str;
            }
        }
        else if (this.type === 'BOOMERANG') {
            this.vy += GRAVITY * 0.5;
            this.vx += wind;
            this.boomerangDist++;
            if (this.boomerangDist > 60) { this.vx *= -0.95; this.boomerangDist = -999; }
        }
        else { this.vy += GRAVITY; this.vx += wind; }

        if (!this.isRolling) { this.x += this.vx; this.y += this.vy; }

        // Wrap
        if (this.x < 0) { this.x += width; this.history = []; } else if (this.x >= width) { this.x -= width; this.history = []; }
        else { this.history.push({ x: this.x, y: this.y }); if (this.history.length > 20) this.history.shift(); }

        if (this.y > height) return 'hit';

        // Air Specials
        if (this.type === 'CLUSTER' && !this.hasSplit && this.vy > 0 && this.y < height - 150) { this.hasSplit = true; spawnCluster(this.x, this.y, this.vx, this.vy, this.ownerId); return false; }
        if (this.type === 'SHOWER' && !this.hasSplit && this.vy > 0 && this.y > 100) { this.hasSplit = true; spawnShower(this.x, this.ownerId); return false; }
        if (this.type === 'SATELLITE' && !this.hasSplit && this.vy > 0 && this.y > height / 3) { this.hasSplit = true; fireSatellite(this.x); return false; }
        if (this.type === 'THUNDER' && !this.hasSplit && this.vy < 0 && this.y < height * 0.2) { this.hasSplit = true; fireThunder(this.x); return false; }
        if (this.type === 'SKYROCKET' && !this.hasSplit && this.vy > 0 && this.y < height * 0.4) { this.hasSplit = true; spawnSkyrocket(this.x, this.y, this.ownerId); return false; }
        if (this.type === 'METEOR' && !this.hasSplit && this.vy > 0 && this.y > height * 0.3) {
            this.hasSplit = true;
            const mc = (weaponUpgrades['METEOR'] || 0) >= 2 ? 5 : (weaponUpgrades['METEOR'] || 0) >= 1 ? 3 : 1;
            for (let i = 0; i < mc; i++) {
                const b = new Bullet(this.x + (i - Math.floor(mc / 2)) * 40, -30, 0, 0, this.ownerId, 'STANDARD');
                b.vx = (Math.random() - 0.5) * 2; b.vy = 8 + Math.random() * 4; b.radius = 6;
                bullets.push(b);
            }
            // Big particle burst
            for (let i = 0; i < 20; i++) particles.push({ x: this.x, y: this.y, vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10, life: 0.8, color: '#F97316', size: 3 });
            return false;
        }
        if (this.type === 'PRISM' && !this.hasSplit && this.vy > 0 && this.y > height * 0.5) {
            this.hasSplit = true;
            for (let i = 0; i < 7; i++) {
                const b = new Bullet(this.x, this.y, 0, 0, this.ownerId, 'STANDARD');
                const a = (i / 7) * Math.PI * 2;
                b.vx = Math.cos(a) * 8; b.vy = Math.sin(a) * 8; b.radius = 2;
                bullets.push(b);
            }
            for (let i = 0; i < 15; i++) particles.push({ x: this.x, y: this.y, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, life: 0.6, color: `hsl(${i * 25}, 100 %, 70 %)`, size: 2 });
            return false;
        }

        // Hit
        const fY = terrain[Math.floor(this.x)];
        if (fY !== undefined && this.y >= fY) {
            if (this.type === 'SCREECH') return true;
            // Upgraded Volcano sub-bullets re-scatter on ground hit
            if (this.type === 'VOLCANO_SUB') {
                for (let i = 0; i < 3; i++) {
                    const b2 = new Bullet(this.x, this.y - 5, 0, 0, this.ownerId, 'STANDARD');
                    b2.vx = (Math.random() - 0.5) * 6; b2.vy = -5 - Math.random() * 8; b2.radius = 2;
                    bullets.push(b2);
                }
                explode(this.x, this.y, 'STANDARD', this.ownerId);
                return 'hit';
            }
            if (this.type === 'ECHO') { explode(this.x, this.y, this.type, this.ownerId); return 'hit'; }
            if (this.type === 'ROLLER' && !this.isRolling) { this.isRolling = true; this.y = fY - 5; this.vy = 0; return true; }
            if (this.type === 'BOUNCER' && this.bounceCount > 0) {
                this.y = fY - 1; this.vy *= -0.6; this.vx *= 0.8; this.bounceCount--;
                if (Math.abs(this.vy) < 1) { explode(this.x, this.y, this.type, this.ownerId); return 'hit'; } return true;
            }
            if (this.type === 'DRILL') { if (!this.isDrilling) this.isDrilling = true; this.drillPower--; if (this.drillPower <= 0) { explode(this.x, this.y, this.type, this.ownerId); return 'hit'; } }
            else if (this.type === 'LANDMINE' || this.type === 'SENTRY' || this.type === 'C4') { activeZones.push({ x: this.x, y: fY - 5, type: this.type, life: 300, owner: this.ownerId, radius: 30 }); return 'hit'; }
            else if (this.type === 'WARP_MINE') { activeZones.push({ x: this.x, y: fY - 5, type: 'WARP_MINE', life: 300, owner: this.ownerId, radius: 30 }); return 'hit'; }
            else if (this.type === 'SHIELD') {
                // Create shield on player
                const t = tanks[this.ownerId];
                if (t) t.shielded = true;
                for (let i = 0; i < 15; i++) particles.push({ x: t ? t.x : this.x, y: t ? t.y - 10 : this.y, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, life: 0.8, color: '#22D3EE', size: 3 });
                return 'hit';
            }
            else if (this.type === 'SMOKE') {
                activeZones.push({ x: this.x, y: fY - 5, type: 'SMOKE', life: 4, radius: 60 });
                for (let i = 0; i < 20; i++) particles.push({ x: this.x, y: this.y, vx: (Math.random() - 0.5) * 6, vy: -Math.random() * 4, life: 1.0, color: '#9CA3AF', size: 4 });
                return 'hit';
            }
            else if (this.type === 'PLASMA' || this.type === 'ION_BEAM') {
                // Pierces through terrain
                return true;
            }
            else { explode(this.x, this.y, this.type, this.ownerId); return 'hit'; }
        }
        for (const id in tanks) {
            const t = tanks[id]; if (t.health <= 0) continue;
            let dx = Math.abs(this.x - t.x); if (dx > width / 2) dx = width - dx;
            if (Math.sqrt(dx * dx + (this.y - (t.y - 10)) ** 2) < 15) {
                if (this.type === 'PLASMA' || this.type === 'ION_BEAM') {
                    // Pierces through enemies
                    explode(this.x, this.y, this.type, this.ownerId);
                    continue;
                }
                if (this.type === 'GLACIER') {
                    t.frozen = 2; // Freeze for 2 turns
                    for (let i = 0; i < 15; i++) particles.push({ x: t.x, y: t.y - 10, vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5, life: 0.8, color: '#67E8F9', size: 3 });
                    explode(this.x, this.y, this.type, this.ownerId);
                    return 'hit';
                }
                explode(this.x, this.y, this.type, this.ownerId);
                return 'hit';
            }
        }
        return true;
    }
    draw() {
        const wDef = WEAPONS[this.type];
        const bColor = wDef ? wDef.color : '#b91c1c';
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fillStyle = bColor; ctx.fill();
        if (this.type === 'LASER' || this.type === 'SNIPER' || this.type === 'SCREECH') { ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(this.x - this.vx * 3, this.y - this.vy * 3); ctx.strokeStyle = bColor; ctx.stroke(); }
        if (this.history.length > 0) { ctx.beginPath(); ctx.moveTo(this.history[0].x, this.history[0].y); for (let i = 1; i < this.history.length; i++) if (Math.abs(this.history[i].x - this.history[i - 1].x) < 100) ctx.lineTo(this.history[i].x, this.history[i].y); ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.stroke(); }
    }
}

function spawnCluster(x, y, vx, vy, oid) { const cc = (weaponUpgrades['CLUSTER'] || 0) >= 2 ? 16 : (weaponUpgrades['CLUSTER'] || 0) >= 1 ? 10 : 6; for (let i = 0; i < cc; i++) { const b = new Bullet(x, y, 0, 0, oid, 'STANDARD'); b.vx = vx + (Math.random() - 0.5) * 8; b.vy = vy + (Math.random() - 0.5) * 8; b.radius = 2; bullets.push(b); } }
function spawnShower(x, oid) { const sc = (weaponUpgrades['SHOWER'] || 0) >= 2 ? 22 : (weaponUpgrades['SHOWER'] || 0) >= 1 ? 14 : 8; for (let i = 0; i < sc; i++) { const b = new Bullet(x + (Math.random() - 0.5) * 100, -50 - Math.random() * 100, 0, 0, oid, 'STANDARD'); b.vx = (Math.random() - 0.5) * 2; b.vy = 5 + Math.random() * 5; b.radius = 3; bullets.push(b); } }
function fireSatellite(x) { activeZones.push({ x: x, y: 0, type: 'SATELLITE', life: 30, radius: 40 }); explode(x, terrain[Math.floor(x)] || height, 'NUKE'); }
function fireThunder(x) { activeZones.push({ x: x, y: 0, type: 'THUNDER', life: 20, radius: 20 }); for (let i = 0; i < 3; i++) explode(x + (Math.random() - 0.5) * 30, terrain[Math.floor(x)] || height, 'IMPACT'); }

function spawnSkyrocket(x, y, oid) {
    const count = (weaponUpgrades['SKYROCKET'] || 0) >= 2 ? 22 : (weaponUpgrades['SKYROCKET'] || 0) >= 1 ? 14 : 8;
    // Colorful burst particles
    for (let i = 0; i < 30; i++) {
        particles.push({ x: x, y: y, vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12, life: 1.0, color: `hsl(${Math.random() * 360}, 100 %, 60 %)`, size: Math.random() * 4 + 1 });
    }
    // Spawn sub-bullets in a radial pattern
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const b = new Bullet(x, y, 0, 0, oid, 'STANDARD');
        const speed = 5 + Math.random() * 5;
        b.vx = Math.cos(angle) * speed;
        b.vy = Math.sin(angle) * speed;
        b.radius = 3;
        bullets.push(b);
    }
}

function launchCelebrationFireworks(px) {
    // Launch 3 cosmetic firework bursts near the player
    for (let k = 0; k < 3; k++) {
        const fx = px + (Math.random() - 0.5) * 200;
        const fy = 50 + Math.random() * 100;
        setTimeout(() => {
            for (let i = 0; i < 40; i++) {
                particles.push({
                    x: fx, y: fy,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    life: 1.2,
                    color: `hsl(${Math.random() * 360}, 100 %, 60 %)`,
                    size: Math.random() * 4 + 1
                });
            }
        }, k * 300);
    }
}

function explode(x, y, type, ownerId) {
    if (ownerId === undefined) ownerId = currentPlayer;
    const wc = WEAPONS[type]; const color = wc ? wc.color : '#F59E0B';
    let pCount = 20; let rad = EXPLOSION_RADIUS;
    if (type === 'NUKE') { pCount = 60; rad = (weaponUpgrades['NUKE'] || 0) >= 2 ? 150 : (weaponUpgrades['NUKE'] || 0) >= 1 ? 120 : 80; }
    else if (type === 'EARTH') rad = 40;
    else if (type === 'BLACKHOLE') { rad = (weaponUpgrades['BLACKHOLE'] || 0) >= 2 ? 140 : (weaponUpgrades['BLACKHOLE'] || 0) >= 1 ? 120 : 100; pCount = 40; }
    else if (type === 'ACID') rad = 50;
    else if (type === 'INFERNO') { pCount = 40; rad = 60; }
    else if (type === 'GRAVITY') { pCount = 30; rad = 50; }
    else if (type === 'HEAL') { pCount = 15; rad = 5; }
    else if (type === 'PULSE_WAVE') { pCount = 40; rad = 70; }
    else if (type === 'TESLA') { pCount = 25; rad = 40; }
    else if (type === 'SOLAR_FLARE') { pCount = 50; rad = 90; }
    else if (type === 'VORTEX') { pCount = 30; rad = 60; }
    else if (type === 'RIFT') { pCount = 35; rad = 80; }
    else if (type === 'DARK_MATTER') { pCount = 45; rad = 70; }
    else if (type === 'ANTIMATTER') { pCount = 60; rad = 100; }

    for (let i = 0; i < pCount; i++) {
        const p = { x: x, y: y, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, life: 1.0, color: color, size: Math.random() * 3 + 1 };
        if (type === 'FIREWORKS') p.color = `hsl(${Math.random() * 360}, 100 %, 50 %)`;
        if (type === 'BLACKHOLE') { p.vx = (Math.random() - 0.5) * 20; p.vy = (Math.random() - 0.5) * 20; } // Sucking visual later? just chaos for now
        particles.push(p);
    }

    if (type === 'NAPALM' || type === 'POISON' || type === 'VIRUS') {
        const naLife = (type === 'NAPALM' && (weaponUpgrades['NAPALM'] || 0) >= 2) ? 10 : (type === 'NAPALM' && (weaponUpgrades['NAPALM'] || 0) >= 1) ? 6 : 3;
        activeZones.push({ x: x, y: y, type: type, life: naLife, radius: type === 'POISON' ? 60 : 40 });
    }
    if (type === 'TELEPORT') {
        const t = tanks[ownerId]; if (t) { t.x = x; t.y = y - 10; if (t.x < 0) t.x += width; if (t.x >= width) t.x -= width; updateTankY(ownerId); } return;
    }
    if (type === 'VOLCANO') {
        const vType = (weaponUpgrades['VOLCANO'] || 0) >= 1 ? 'VOLCANO_SUB' : 'STANDARD';
        for (let i = 0; i < 8; i++) { const b = new Bullet(x, y - 10, 0, 0, ownerId, vType); b.vx = (Math.random() - 0.5) * 10; b.vy = -10 - Math.random() * 15; bullets.push(b); }
    }
    if (type === 'ECHO') for (let i = 0; i < 5; i++) { const b = new Bullet(x, y - 5, 0, 0, ownerId, 'STANDARD'); const a = Math.PI + (i - 2) * 0.5; b.vx = Math.cos(a) * 5; b.vy = Math.sin(a) * 5; b.radius = 2; bullets.push(b); }
    if (type === 'SHRAPNEL') { for (let i = 0; i < 12; i++) { const b = new Bullet(x, y - 5, 0, 0, ownerId, 'STANDARD'); const a = (i / 12) * Math.PI * 2; b.vx = Math.cos(a) * 7; b.vy = Math.sin(a) * 7; b.radius = 2; bullets.push(b); } }
    if (type === 'CHAIN') {
        // Chain lightning to nearby enemies
        let chainTargets = [];
        for (const id in tanks) {
            if (tanks[id].health <= 0) continue;
            let cdx = Math.abs(tanks[id].x - x); if (cdx > width / 2) cdx = width - cdx;
            const cd = Math.sqrt(cdx * cdx + (tanks[id].y - y) ** 2);
            if (cd < 200 && cd > 10) chainTargets.push(tanks[id]);
        }
        chainTargets.sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x));
        for (let i = 0; i < Math.min(3, chainTargets.length); i++) {
            const ct = chainTargets[i];
            ct.health = Math.max(0, ct.health - 20);
            for (let j = 0; j < 8; j++) particles.push({ x: ct.x, y: ct.y - 10, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, life: 0.6, color: '#38BDF8', size: 2 });
        }
    }
    if (type === 'HEAL') {
        const t = tanks[ownerId];
        if (t) { t.health = Math.min(100, t.health + 30); }
        for (let i = 0; i < 15; i++) particles.push({ x: x, y: y, vx: (Math.random() - 0.5) * 4, vy: -Math.random() * 5, life: 1.0, color: '#34D399', size: 3 });
        return; // No terrain damage for heal
    }
    if (type === 'INFERNO') {
        activeZones.push({ x: x, y: y, type: 'NAPALM', life: 8, radius: 80 });
    }
    if (type === 'GRAVITY') {
        activeZones.push({ x: x, y: y, type: 'GRAVITY', life: 3, radius: 80 });
    }
    if (type === 'TESLA') {
        activeZones.push({ x: x, y: y, type: 'TESLA_ZONE', life: 4, radius: 60, owner: ownerId });
    }
    if (type === 'VORTEX') {
        // Pull enemies toward center
        for (const id in tanks) {
            const t = tanks[id]; if (t.health <= 0) continue;
            let vdx = t.x - x; if (Math.abs(vdx) > width / 2) vdx = vdx > 0 ? vdx - width : vdx + width;
            const vdist = Math.sqrt(vdx * vdx + (t.y - y) ** 2);
            if (vdist < 100 && vdist > 5) {
                t.x -= vdx * 0.4;
                if (t.x < 0) t.x += width; if (t.x >= width) t.x -= width;
                updateTankY(id);
            }
        }
    }
    if (type === 'PULSE_WAVE') {
        // Radial shockwave bullets
        for (let i = 0; i < 8; i++) { const b = new Bullet(x, y - 5, 0, 0, ownerId, 'STANDARD'); const a = (i / 8) * Math.PI * 2; b.vx = Math.cos(a) * 8; b.vy = Math.sin(a) * 8; b.radius = 3; bullets.push(b); }
    }
    if (type === 'SOLAR_FLARE') {
        activeZones.push({ x: x, y: y, type: 'NAPALM', life: 5, radius: 100 });
    }

    const startX = Math.floor(x - rad), endX = Math.floor(x + rad);
    for (let ix = startX; ix <= endX; ix++) {
        let tx = ix; if (tx < 0) tx += width; if (tx >= width) tx -= width;
        if (tx >= 0 && tx < width) {
            const dist = Math.abs(ix - x);
            if (dist < rad) {
                const depth = Math.sqrt(rad * rad - dist * dist);
                if (type === 'EARTH') { terrain[tx] -= depth * 0.5; if (terrain[tx] < 0) terrain[tx] = 0; }
                else if (type === 'SCREECH') { }
                else if (type === 'ACID') { const by = y + depth * 1.5; if (terrain[tx] < by) terrain[tx] = Math.max(terrain[tx], by); }
                else { const by = y + depth; if (terrain[tx] < by) terrain[tx] = Math.max(terrain[tx], by); }
            }
        }
    }

    let dmgR = DAMAGE_RADIUS;
    if (type === 'NUKE') dmgR = 120; if (type === 'MAGNET' || type === 'BLACKHOLE') dmgR = 150; if (type === 'INFERNO') dmgR = 80; if (type === 'GRAVITY') dmgR = 80;
    if (type === 'PULSE_WAVE') dmgR = 70; if (type === 'SOLAR_FLARE') dmgR = 100; if (type === 'VORTEX') dmgR = 60; if (type === 'DARK_MATTER') dmgR = 80; if (type === 'ANTIMATTER') dmgR = 120;

    let killsInThisExplosion = 0;
    for (const id in tanks) {
        const t = tanks[id]; if (t.health <= 0) continue;
        let dx = Math.abs(t.x - x); if (dx > width / 2) dx = width - dx;
        const dist = Math.sqrt(dx * dx + (t.y - 10 - y) ** 2);
        if (dist < dmgR) {
            let dmg = 40;
            if (type === 'NUKE') dmg = (weaponUpgrades['NUKE'] || 0) >= 2 ? 120 : 90; if (type === 'SNIPER') dmg = (weaponUpgrades['SNIPER'] || 0) >= 2 ? 130 : (weaponUpgrades['SNIPER'] || 0) >= 1 ? 90 : 60; if (type === 'IMPACT' || type === 'POISON') dmg = 5;
            if (type === 'MAGNET' || type === 'EARTH' || type === 'BLACKHOLE') dmg = 0; if (type === 'SCREECH') dmg = 20; if (type === 'ACCEL') dmg = 60;
            if (type === 'LEECH') { dmg = 30; if (tanks[ownerId]) tanks[ownerId].health = Math.min(100, tanks[ownerId].health + 10); }
            if (type === 'GLACIER') dmg = 25; if (type === 'PLASMA') dmg = 35; if (type === 'INFERNO') dmg = 50;
            if (type === 'GRAVITY') { dmg = 30; /* Gravity push down */ }
            if (type === 'CHAIN') dmg = 30; if (type === 'SHRAPNEL') dmg = 20; if (type === 'HOMING') dmg = 45; if (type === 'BOOMERANG') dmg = 35;
            if (type === 'ION_BEAM') dmg = 45; if (type === 'PULSE_WAVE') dmg = 25; if (type === 'TESLA') dmg = 30;
            if (type === 'SOLAR_FLARE') dmg = 55; if (type === 'VORTEX') dmg = 35; if (type === 'RIFT') dmg = 10;
            if (type === 'DARK_MATTER') dmg = 60; if (type === 'ANTIMATTER') dmg = 100;

            const prevHealth = t.health;
            const actualDmg = Math.floor((1 - dist / dmgR) * dmg);
            // Shield absorbs damage
            if (t.shielded && actualDmg > 0) {
                t.shielded = false;
                for (let si = 0; si < 10; si++) particles.push({ x: t.x, y: t.y - 10, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6, life: 0.6, color: '#22D3EE', size: 3 });
                continue;
            }
            t.health = Math.max(0, t.health - actualDmg);

            // --- Achievement tracking (player-sourced damage) ---
            if (ownerId == 1 && id != 1 && actualDmg > 0) {
                if (matchStats.hits === 0) awardAchievement('FIRST_HIT');
                matchStats.hits++;
                matchStats.totalDamageDealt += actualDmg;
                matchStats.shotsHit++;
                if (actualDmg >= 50) awardAchievement('OVERKILL');
                if (matchStats.totalDamageDealt >= 200) awardAchievement('DEMOLISHER');
                if (matchStats.maxDamage < actualDmg) matchStats.maxDamage = actualDmg;
                // Long range check
                const shooterTank = tanks[1];
                if (shooterTank) {
                    let sdx = Math.abs(shooterTank.x - t.x); if (sdx > width / 2) sdx = width - sdx;
                    if (sdx > width * 0.5) awardAchievement('SNIPER_SHOT');
                }
                // Kill tracking
                if (prevHealth > 0 && t.health <= 0) {
                    if (matchStats.kills === 0) awardAchievement('FIRST_KILL');
                    matchStats.kills++;
                    matchStats.cpusKilled++;
                    killsInThisExplosion++;
                    matchStats.killsThisTurn++;
                    // Track weapon kills for WEAPON_MASTER
                    const wUsed = matchStats.lastWeaponUsed || 'STANDARD';
                    matchStats.weaponKills[wUsed] = (matchStats.weaponKills[wUsed] || 0) + 1;
                    if (Object.keys(matchStats.weaponKills).length >= 3) awardAchievement('WEAPON_MASTER');
                    // Headshot: one-shot kill (enemy was at full health)
                    if (prevHealth >= 90) awardAchievement('HEADSHOT');
                }
            }
            // Track damage taken by player
            if (id == 1 && actualDmg > 0) {
                matchStats.damageTaken += actualDmg;
            }

            if (type === 'IMPACT' || type === 'NUKE' || type === 'SCREECH') {
                const dir = (t.x - x) > 0 ? 1 : -1; const push = type === 'NUKE' ? 100 : 60;
                t.x += dir * push;
            }
            if (type === 'MAGNET' || type === 'BLACKHOLE') {
                const dir = (t.x - x) > 0 ? -1 : 1; const pull = 50 * (1 - dist / dmgR);
                t.x += dir * pull;
            }
            if (t.x < 0) t.x += width; if (t.x >= width) t.x -= width;
            updateTankY(id);
        }
    }
    // Multi-kill achievement
    if (ownerId == 1 && killsInThisExplosion >= 2) awardAchievement('MULTI_KILL');
    updateHUDs(); checkWin();
}

function setWind(init) {
    if (init) wind = (Math.random() * MAX_WIND * 2) - MAX_WIND;
    else {
        wind += (Math.random() - 0.5) * 0.1; // Small change
        if (wind > MAX_WIND) wind = MAX_WIND; if (wind < -MAX_WIND) wind = -MAX_WIND;
    }
    const wp = Math.round((wind / MAX_WIND) * 100);
    ui.windValue.textContent = Math.abs(wp);
    ui.windArrow.style.transform = `rotate(${wind > 0 ? 0 : 180}deg)`;
}

// nextTurn is no longer used - replaced by afterPlayerShot / returnToPlayer

function fire() {
    if (isInputLocked || bullets.length > 0 || gameOver) return;
    if (currentPlayer !== 1) return; // Only player can fire via this function
    const t = tanks[currentPlayer];
    let wType = ui.weaponSelect.value;
    if (wType !== 'STANDARD') {
        if (currentMatchAmmo[wType] > 0) { currentMatchAmmo[wType]--; updateWeaponSelect(); } else wType = 'STANDARD';
    }
    if (wType === 'SHOTGUN') {
        const sgCount = (weaponUpgrades['SHOTGUN'] || 0) >= 2 ? 7 : (weaponUpgrades['SHOTGUN'] || 0) >= 1 ? 5 : 3;
        const halfSpread = Math.floor(sgCount / 2);
        for (let i = -halfSpread; i <= halfSpread; i++) bullets.push(new Bullet(t.x, t.y - 15, t.angle + i * 5, t.power, currentPlayer, wType));
    }
    else if (wType === 'GATLING') { const gc = (weaponUpgrades['GATLING'] || 0) >= 2 ? 12 : (weaponUpgrades['GATLING'] || 0) >= 1 ? 8 : 5; for (let i = 0; i < gc; i++) setTimeout(() => bullets.push(new Bullet(t.x, t.y - 15, t.angle + (Math.random() - .5) * 2, t.power + (Math.random() - .5) * 2, currentPlayer, 'STANDARD')), i * 100); }
    else { bullets.push(new Bullet(t.x, t.y - 15, t.angle, t.power, currentPlayer, wType)); }
    isInputLocked = true;
    waitingForCPUBullets = false; // Player shot phase
    matchStats.killsThisTurn = 0; // Reset per-turn kill counter
    matchStats.turns++;
    matchStats.shots++;
    matchStats.lastWeaponUsed = wType;
    ui.fireBtn.disabled = true; ui.weaponSelect.disabled = true;
    ui.uiLayer.classList.add('translate-y-full');
}

function gameLoop() {
    if (gameActive && !gameOver) {
        for (let i = bullets.length - 1; i >= 0; i--) {
            const r = bullets[i].update();
            if (r !== true) bullets.splice(i, 1);
        }
        if (bullets.length === 0 && isInputLocked && !gameOver) {
            if (!window.turnTimeout) {
                window.turnTimeout = setTimeout(() => {
                    if (waitingForCPUBullets) {
                        // CPU bullets just resolved, return to player
                        returnToPlayer();
                    } else {
                        // Player bullets just resolved, now fire all CPUs
                        afterPlayerShot();
                    }
                    window.turnTimeout = null;
                }, 500);
            }
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.life -= 0.02;
        if (p.life <= 0) particles.splice(i, 1);
    }

    const grd = ctx.createLinearGradient(0, 0, 0, height);
    grd.addColorStop(0, "#1e3a8a");
    grd.addColorStop(1, "#3b82f6");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, terrain[0]);
    for (let x = 1; x < width; x++) ctx.lineTo(x, terrain[x]);
    ctx.lineTo(width, height);
    ctx.fill();

    const g2 = ctx.createLinearGradient(0, 0, 0, height);
    g2.addColorStop(0, "transparent");
    g2.addColorStop(1, "rgba(50,30,10,0.8)");
    ctx.fillStyle = g2;
    ctx.fill();

    activeZones.forEach(z => {
        if (z.type === 'SATELLITE') {
            ctx.fillStyle = `rgba(239, 68, 68, ${z.life / 30})`;
            ctx.fillRect(z.x - 5, 0, 10, height);
            ctx.fillStyle = `rgba(255, 255, 255, ${z.life / 30})`;
            ctx.fillRect(z.x - 2, 0, 4, height);
        } else if (z.type === 'THUNDER') {
            ctx.strokeStyle = `rgba(255, 255, 0, ${z.life / 20})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(z.x, 0);
            ctx.lineTo(z.x + (Math.random() - 0.5) * 20, height);
            ctx.stroke();
        } else if (z.type === 'LANDMINE') {
            const alpha = Math.sin(Date.now() / 200) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
            ctx.beginPath(); ctx.arc(z.x, z.y, 3, 0, Math.PI * 2); ctx.fill();
        } else if (z.type === 'SENTRY') {
            ctx.fillStyle = '#475569'; ctx.fillRect(z.x - 5, z.y - 10, 10, 10);
            ctx.fillStyle = '#ef4444'; ctx.fillRect(z.x - 2, z.y - 12, 4, 4);
        } else if (z.type === 'C4') {
            const alpha = Math.sin(Date.now() / 100) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
            ctx.fillRect(z.x - 3, z.y - 3, 6, 6);
        } else if (z.type === 'WARP_MINE') {
            const alpha = Math.sin(Date.now() / 200) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(129, 140, 248, ${alpha})`;
            ctx.beginPath(); ctx.arc(z.x, z.y, 4, 0, Math.PI * 2); ctx.fill();
        } else if (z.type === 'SMOKE') {
            ctx.fillStyle = `rgba(156, 163, 175, ${0.15 + Math.random() * 0.1})`;
            ctx.beginPath();
            ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2);
            ctx.fill();
        } else if (z.type === 'GRAVITY') {
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.3 + Math.sin(Date.now() * 0.01) * 0.2})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(z.x, z.y, z.radius * (0.8 + Math.sin(Date.now() * 0.005) * 0.2), 0, Math.PI * 2);
            ctx.stroke();
        } else if (z.type === 'TESLA_ZONE') {
            ctx.strokeStyle = `rgba(252, 211, 77, ${0.4 + Math.sin(Date.now() * 0.02) * 0.3})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(z.x, z.y, z.radius * (0.9 + Math.sin(Date.now() * 0.01) * 0.1), 0, Math.PI * 2);
            ctx.stroke();
            // Electric sparks
            ctx.strokeStyle = `rgba(252, 211, 77, ${0.3 + Math.random() * 0.3})`;
            ctx.beginPath();
            ctx.moveTo(z.x + (Math.random() - 0.5) * z.radius, z.y + (Math.random() - 0.5) * z.radius);
            ctx.lineTo(z.x + (Math.random() - 0.5) * z.radius, z.y + (Math.random() - 0.5) * z.radius);
            ctx.stroke();
        } else {
            let color = `rgba(249, 115, 22, ${0.2 + Math.random() * 0.2})`;
            if (z.type === 'POISON') color = `rgba(163, 230, 53, ${0.2 + Math.random() * 0.1})`;
            if (z.type === 'VIRUS') color = `rgba(77, 124, 15, ${0.2 + Math.random() * 0.1})`;

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(z.x, z.y, z.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    for (const id in tanks) {
        const t = tanks[id];
        if (t.health <= 0) continue;

        ctx.save();
        ctx.translate(t.x, t.y);

        let xL = Math.floor(t.x - 5); if (xL < 0) xL += width;
        let xR = Math.floor(t.x + 5); if (xR >= width) xR -= width;
        const hL = (terrain[xL] !== undefined) ? terrain[xL] : t.y;
        const hR = (terrain[xR] !== undefined) ? terrain[xR] : t.y;
        const ang = Math.atan2(hR - hL, 10);

        ctx.rotate(ang);

        ctx.fillStyle = t.color;
        ctx.beginPath(); ctx.arc(0, -10, 10, Math.PI, 0); ctx.rect(-12, -10, 24, 10); ctx.fill();
        ctx.fillStyle = '#1f2937'; ctx.fillRect(-14, -2, 28, 6);

        ctx.save();
        ctx.translate(0, -10);
        ctx.rotate(-(t.angle * Math.PI / 180) - ang);
        ctx.fillStyle = '#4b5563';
        ctx.fillRect(0, -3, 20, 6);
        ctx.restore();
        ctx.restore();

        if (id == 1 && !gameOver && bullets.length === 0 && !waitingForCPUBullets) {
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.moveTo(t.x, t.y - 40);
            ctx.lineTo(t.x - 5, t.y - 50);
            ctx.lineTo(t.x + 5, t.y - 50);
            ctx.fill();
        }
        // Shield visual
        if (t.shielded) {
            ctx.strokeStyle = '#22D3EE';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.005) * 0.3;
            ctx.beginPath();
            ctx.arc(t.x, t.y - 10, 20, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
        // Frozen visual
        if (t.frozen && t.frozen > 0) {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#67E8F9';
            ctx.beginPath();
            ctx.arc(t.x, t.y - 10, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    bullets.forEach(b => b.draw());

    particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    });

    requestAnimationFrame(gameLoop);
}

ui.angleInput.addEventListener('input', e => { if (tanks[1]) tanks[1].angle = parseInt(e.target.value); ui.angleValue.textContent = e.target.value + "°"; });
ui.powerInput.addEventListener('input', e => { if (tanks[1]) tanks[1].power = parseInt(e.target.value); ui.powerValue.textContent = e.target.value; });
ui.fireBtn.addEventListener('click', fire);
window.addEventListener('keydown', e => {
    if (gameActive && currentPlayer === 1 && !isInputLocked) {
        if (e.code === 'Space') fire();
        if (e.code === 'ArrowLeft') { tanks[1].angle = Math.min(180, tanks[1].angle + 1); ui.angleInput.value = tanks[1].angle; ui.angleValue.textContent = tanks[1].angle + "°"; }
        if (e.code === 'ArrowRight') { tanks[1].angle = Math.max(0, tanks[1].angle - 1); ui.angleInput.value = tanks[1].angle; ui.angleValue.textContent = tanks[1].angle + "°"; }
    }
});

loadGameData(); resize(); updateDisplays(); requestAnimationFrame(gameLoop);
