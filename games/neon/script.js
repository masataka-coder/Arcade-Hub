const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// DOM Elements
const scoreEl = document.getElementById('scoreEl');
const levelEl = document.getElementById('levelEl');
const gameCoinEl = document.getElementById('gameCoinEl');
const shieldContainer = document.getElementById('shieldContainer');
const bombContainer = document.getElementById('bombContainer');
const flashLayer = document.getElementById('flashLayer');
const soundToggleBtn = document.getElementById('soundToggleBtn');

const modalEl = document.getElementById('modalEl');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const finalScoreEl = document.getElementById('finalScoreEl');
const finalScoreVal = document.getElementById('finalScoreVal');
const totalCoinEl = document.getElementById('totalCoinEl');
const startBtn = document.getElementById('startBtn');
const shopBtn = document.getElementById('shopBtn');

const shipNameDisplay = document.getElementById('shipNameDisplay');
const shipDescDisplay = document.getElementById('shipDescDisplay');
const prevShipBtn = document.getElementById('prevShipBtn');
const nextShipBtn = document.getElementById('nextShipBtn');

const shopModalEl = document.getElementById('shopModalEl');
const closeShopBtn = document.getElementById('closeShopBtn');
const shopCoinEl = document.getElementById('shopCoinEl');
const shopItemsContainer = document.getElementById('shopItemsContainer');

const bossHpContainer = document.getElementById('bossHpContainer');
const bossHpBar = document.getElementById('bossHpBar');

// キャンバスリサイズ
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// --- セーブデータ (localStorage) 管理 ---
const SAVE_KEY = 'neonStrikeSaveData_v2';
let savedData = JSON.parse(localStorage.getItem(SAVE_KEY)) || {
    coins: 0,
    upgrades: {
        initShields: 0, // max 3
        initBombs: 1,   // max 5
        coinRate: 1     // max 5
    }
};

function saveData() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(savedData));
    updateMenuUI();
}

// --- Web Audio API を使った動的BGM生成クラス ---
class BGMPlayer {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
        this.isPlaying = false;
        this.nextNoteTime = 0;
        this.current16thNote = 0;
        this.tempo = 135;
        this.lookahead = 25.0; // 実行間隔(ms)
        this.scheduleAheadTime = 0.1; // 事前スケジューリング時間(秒)
        this.timerID = null;
        this.isMuted = false;

        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.value = 0.3; // 基本音量
        this.masterGain.connect(this.audioCtx.destination);

        // シーケンスパターン (MIDIノート番号)
        // C Minor Pentatonic
        this.bassLine = [36, 36, 48, 36, 39, 36, 43, 36, 36, 36, 48, 36, 43, 36, 46, 36];
        this.melody = [60, 0, 63, 0, 67, 0, 70, 0, 72, 0, 67, 0, 63, 0, 60, 0];
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.3, this.audioCtx.currentTime);
        return this.isMuted;
    }

    m2f(note) {
        return 440 * Math.pow(2, (note - 69) / 12);
    }

    scheduleNote(beatNumber, time) {
        // キックドラム (4つ打ち)
        if (beatNumber % 4 === 0) {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.connect(gain); gain.connect(this.masterGain);
            osc.frequency.setValueAtTime(120, time);
            osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.1);
            gain.gain.setValueAtTime(0.7, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
            osc.start(time); osc.stop(time + 0.1);
        }

        // ハイハット (裏拍)
        if (beatNumber % 2 !== 0) {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.connect(gain); gain.connect(this.masterGain);
            osc.type = 'square';
            osc.frequency.setValueAtTime(5000, time);
            gain.gain.setValueAtTime(0.04, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
            osc.start(time); osc.stop(time + 0.05);
        }

        // ベースライン
        const bNote = this.bassLine[beatNumber];
        if (bNote) {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            const filter = this.audioCtx.createBiquadFilter();

            osc.type = 'sawtooth';
            // ボス戦時はピッチを下げて不気味な雰囲気に
            const pitchShift = isBossFight ? -4 : 0;
            osc.frequency.value = this.m2f(bNote + pitchShift);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(isBossFight ? 1500 : 800, time);
            filter.frequency.exponentialRampToValueAtTime(100, time + 0.15);

            gain.gain.setValueAtTime(0.3, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

            osc.connect(filter); filter.connect(gain); gain.connect(this.masterGain);
            osc.start(time); osc.stop(time + 0.15);
        }

        // メロディ (レベル2以降、かつボス戦ではない時)
        if (level >= 2 && !isBossFight) {
            const mNote = this.melody[beatNumber];
            if (mNote) {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                osc.type = 'square';
                osc.frequency.value = this.m2f(mNote);
                gain.gain.setValueAtTime(0.08, time);
                gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
                osc.connect(gain); gain.connect(this.masterGain);
                osc.start(time); osc.stop(time + 0.1);
            }
        }

        // ボス戦用アラート音 (不協和音)
        if (isBossFight && beatNumber % 8 === 0) {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.value = this.m2f(72); // C5
            osc.frequency.linearRampToValueAtTime(this.m2f(71), time + 0.2); // ピッチダウン
            gain.gain.setValueAtTime(0.1, time);
            gain.gain.linearRampToValueAtTime(0.01, time + 0.2);
            osc.connect(gain); gain.connect(this.masterGain);
            osc.start(time); osc.stop(time + 0.2);
        }
    }

    nextNote() {
        const secondsPerBeat = 60.0 / this.tempo;
        this.nextNoteTime += 0.25 * secondsPerBeat;
        this.current16thNote = (this.current16thNote + 1) % 16;
    }

    scheduler() {
        while (this.nextNoteTime < this.audioCtx.currentTime + this.scheduleAheadTime) {
            this.scheduleNote(this.current16thNote, this.nextNoteTime);
            this.nextNote();
        }
        this.timerID = setTimeout(() => this.scheduler(), this.lookahead);
    }

    start() {
        if (this.isPlaying) return;
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        this.isPlaying = true;
        this.current16thNote = 0;
        this.nextNoteTime = this.audioCtx.currentTime + 0.05;
        this.scheduler();
    }

    stop() {
        this.isPlaying = false;
        clearTimeout(this.timerID);
    }
}

let bgm = null;

// --- 機体データ ---
const SHIPS = [
    { id: 'balance', name: 'TYPE-A: BALANCE', color: '#0ff', desc: '連射と威力のバランスが良い標準機。', projSpeed: -15, fireRate: 12 },
    { id: 'laser', name: 'TYPE-B: LASER', color: '#f43f5e', desc: '敵を貫通する高威力レーザー。連射は遅め。', projSpeed: -20, fireRate: 25 },
    { id: 'spread', name: 'TYPE-C: SPREAD', color: '#22c55e', desc: '広範囲に多数の弾をばらまく。威力は低い。', projSpeed: -12, fireRate: 8 }
];
let currentShipIndex = 0;

// --- ショップのアップグレード定義 ---
const UPGRADES = {
    initShields: { name: '初期シールド', maxLevel: 3, getCost: (lvl) => [50, 150, 300][lvl] },
    initBombs: { name: '初期ボム所持数', maxLevel: 5, getCost: (lvl) => [100, 200, 400, 800, 1500][lvl] },
    coinRate: { name: 'コイン獲得率', maxLevel: 5, getCost: (lvl) => [50, 100, 200, 400, 800][lvl] }
};

// --- ゲームのステータス管理 ---
let isPlaying = false;
let score = 0;
let level = 1;
let currentCoins = 0; // プレイ中に獲得したコイン
let animationId;
let frameCount = 0;
let enemySpawnRate = 100;
let isBossFight = false;
let bossLevel = 0;

let shakeAmount = 0;
let hitStopFrames = 0;

// --- エンティティの配列 ---
let player;
let projectiles = [];
let enemies = [];
let particles = [];
let stars = [];
let powerUps = [];
let enemyProjectiles = [];
let bosses = [];
let obstacles = [];
let coins = []; // ドロップしたコイン

// --- マウス/タッチ座標 ---
const mouse = { x: canvas.width / 2, y: canvas.height - 100 };
let lastTapTime = 0;

// 入力処理
window.addEventListener('mousemove', (e) => {
    if (isPlaying) { mouse.x = e.clientX; mouse.y = e.clientY; }
});

window.addEventListener('touchmove', (e) => {
    if (isPlaying) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY - 60; }
}, { passive: false });

// ボム発動入力（ダブルクリック / ダブルタップ / 右クリック）
window.addEventListener('dblclick', (e) => {
    if (isPlaying) activateBomb();
});
window.addEventListener('contextmenu', (e) => {
    if (isPlaying) { e.preventDefault(); activateBomb(); }
});
window.addEventListener('touchstart', (e) => {
    if (!isPlaying) return;
    const now = Date.now();
    if (now - lastTapTime < 300) {
        activateBomb();
        e.preventDefault();
    }
    lastTapTime = now;
}, { passive: false });

function screenShake(amount) { shakeAmount = amount; }

// --- クラス定義 ---

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speed = (Math.random() * 0.5 + 0.1) * (this.size * 0.8);
        this.alpha = Math.random() * 0.5 + 0.3;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    update() {
        const currentSpeed = isBossFight ? this.speed * 6 : this.speed;
        this.y += currentSpeed;
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
        this.draw();
    }
}

class Player {
    constructor(x, y, shipData) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.ship = shipData;
        this.color = shipData.color;
        this.shootTimer = 0;
        this.shootInterval = shipData.fireRate;

        // アップグレードの適用
        this.shields = savedData.upgrades.initShields;
        this.maxShields = 3;
        this.bombs = savedData.upgrades.initBombs;

        this.powerUpTimers = { rapid: 0, spread: 0 };
        this.invincibleTimer = 60; // 開始時無敵
    }
    draw() {
        if (this.invincibleTimer > 0 && frameCount % 6 < 3) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;

        // 機体の形
        ctx.beginPath();
        ctx.moveTo(0, -this.radius * 1.2);
        ctx.lineTo(this.radius, this.radius);
        ctx.lineTo(0, this.radius * 0.4);
        ctx.lineTo(-this.radius, this.radius);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();

        if (this.shields > 0) {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 1.6, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.5 + Math.sin(frameCount * 0.1) * 0.2})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        ctx.restore();
    }
    update() {
        this.x += (mouse.x - this.x) * 0.2;
        this.y += (mouse.y - this.y) * 0.2;
        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));

        if (this.invincibleTimer > 0) this.invincibleTimer--;

        this.draw();

        this.shootTimer++;
        if (this.powerUpTimers.rapid > 0) this.powerUpTimers.rapid--;
        if (this.powerUpTimers.spread > 0) this.powerUpTimers.spread--;

        const currentInterval = this.powerUpTimers.rapid > 0 ? this.shootInterval * 0.6 : this.shootInterval;

        if (this.shootTimer >= currentInterval) {
            this.shoot();
            this.shootTimer = 0;
        }
    }
    shoot() {
        const speedY = this.ship.projSpeed;
        const pColor = this.powerUpTimers.rapid > 0 ? '#ff0' : this.color;
        const hasSpread = this.powerUpTimers.spread > 0;
        const lvl = level + (hasSpread ? 3 : 0); // スプレッド状態は擬似的にレベルを上げて弾数増加

        if (this.ship.id === 'balance') {
            // Type A: 標準
            projectiles.push(new Projectile(this.x, this.y - this.radius, 3, pColor, { x: 0, y: speedY }, 1, false));
            if (lvl >= 2) {
                projectiles.push(new Projectile(this.x - 10, this.y, 3, pColor, { x: -1, y: speedY }, 1, false));
                projectiles.push(new Projectile(this.x + 10, this.y, 3, pColor, { x: 1, y: speedY }, 1, false));
            }
            if (lvl >= 4) {
                projectiles.push(new Projectile(this.x, this.y, 3, '#a855f7', { x: -3, y: speedY * 0.8 }, 1, false));
                projectiles.push(new Projectile(this.x, this.y, 3, '#a855f7', { x: 3, y: speedY * 0.8 }, 1, false));
            }
        }
        else if (this.ship.id === 'laser') {
            // Type B: 貫通レーザー
            // 縦長で貫通属性を持つ
            projectiles.push(new Projectile(this.x, this.y - this.radius, 4, pColor, { x: 0, y: speedY }, 3, true));
            if (lvl >= 3) {
                projectiles.push(new Projectile(this.x - 15, this.y, 3, pColor, { x: 0, y: speedY }, 2, true));
                projectiles.push(new Projectile(this.x + 15, this.y, 3, pColor, { x: 0, y: speedY }, 2, true));
            }
        }
        else if (this.ship.id === 'spread') {
            // Type C: スプレッド
            const baseAngles = [-0.2, 0, 0.2];
            if (lvl >= 2) baseAngles.push(-0.4, 0.4);
            if (lvl >= 4) baseAngles.push(-0.6, 0.6);
            if (lvl >= 6) baseAngles.push(-0.8, 0.8);

            baseAngles.forEach(angle => {
                const vx = Math.sin(angle) * Math.abs(speedY);
                const vy = -Math.cos(angle) * Math.abs(speedY);
                projectiles.push(new Projectile(this.x, this.y - this.radius, 2.5, pColor, { x: vx, y: vy }, 0.5, false));
            });
        }
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity, damage = 1, pierce = false) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.damage = damage;
        this.pierce = pierce; // 貫通するかどうか
        this.hitEnemies = new Set(); // 貫通時に同じ敵に連続ヒットしないよう記録
    }
    draw() {
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;

        if (this.pierce) {
            // レーザー風の描画
            ctx.translate(this.x, this.y);
            ctx.rotate(Math.atan2(this.velocity.y, this.velocity.x) + Math.PI / 2);
            ctx.fillRect(-this.radius, -this.radius * 4, this.radius * 2, this.radius * 8);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw();
    }
}

class EnemyProjectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x; this.y = y; this.radius = radius; this.color = color; this.velocity = velocity;
    }
    draw() {
        ctx.save();
        ctx.shadowBlur = 10; ctx.shadowColor = this.color; ctx.fillStyle = this.color;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }
    update() {
        this.x += this.velocity.x; this.y += this.velocity.y; this.draw();
    }
}

class PowerUp {
    constructor(x, y, type) {
        this.x = x; this.y = y; this.radius = 12; this.type = type; this.velocity = { x: 0, y: 1.5 }; this.angle = 0;
        switch (type) {
            case 'shield': this.color = '#0ff'; this.text = 'S'; break;
            case 'rapid': this.color = '#ff0'; this.text = 'R'; break;
            case 'spread': this.color = '#a855f7'; this.text = 'W'; break;
            case 'bomb': this.color = '#ef4444'; this.text = 'B'; break;
        }
    }
    draw() {
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);
        ctx.shadowBlur = 15; ctx.shadowColor = this.color; ctx.strokeStyle = this.color; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.rect(-this.radius, -this.radius, this.radius * 2, this.radius * 2); ctx.stroke();
        ctx.fillStyle = this.color; ctx.font = '14px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.rotate(-this.angle); ctx.fillText(this.text, 0, 0); ctx.restore();
    }
    update() { this.y += this.velocity.y; this.angle += 0.05; this.draw(); }
}

class Coin {
    constructor(x, y, value = 1) {
        this.x = x; this.y = y; this.radius = 6; this.value = value;
        this.velocity = { x: (Math.random() - 0.5) * 4, y: Math.random() * -3 - 2 };
        this.color = '#fbbf24'; // yellow-400
    }
    draw() {
        ctx.save(); ctx.translate(this.x, this.y);
        ctx.shadowBlur = 10; ctx.shadowColor = this.color;
        ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(0, 0, this.radius * 0.6, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }
    update() {
        this.velocity.y += 0.1; // 重力
        this.x += this.velocity.x; this.y += this.velocity.y;
        // 画面端でバウンド
        if (this.x < 0 || this.x > canvas.width) this.velocity.x *= -1;
        this.draw();
    }
}

class Obstacle {
    constructor(x, y, radius) {
        this.x = x; this.y = y; this.radius = radius;
        this.velocity = { x: (Math.random() - 0.5) * 1, y: Math.random() * 2 + 1 };
        this.rotation = 0; this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.vertices = [];
        for (let i = 0; i < 8; i++) this.vertices.push(0.7 + Math.random() * 0.5);
    }
    draw() {
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rotation);
        ctx.shadowBlur = 5; ctx.shadowColor = '#000'; ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 2; ctx.fillStyle = '#374151';
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8; const r = this.radius * this.vertices[i];
            if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r); else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    }
    update() { this.x += this.velocity.x; this.y += this.velocity.y; this.rotation += this.rotationSpeed; this.draw(); }
}

class Boss {
    constructor(level) {
        this.radius = 70; this.x = canvas.width / 2; this.y = -this.radius; this.targetY = 150;
        this.color = '#ef4444'; this.hp = 200 + (level * 100); this.maxHp = this.hp;
        this.velocity = { x: 2 + (level * 0.5), y: 0 }; this.angle = 0;
        this.shootTimer = 0; this.shootInterval = Math.max(30, 80 - (level * 10));
    }
    draw() {
        ctx.save(); ctx.translate(this.x, this.y); ctx.shadowBlur = 30; ctx.shadowColor = this.color;
        ctx.fillStyle = '#111'; ctx.strokeStyle = this.color; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.rotate(this.angle); ctx.beginPath();
        for (let i = 0; i < 6; i++) { ctx.moveTo(0, 0); ctx.lineTo(0, -this.radius - 20); ctx.rotate(Math.PI / 3); }
        ctx.stroke();
        ctx.fillStyle = `rgba(239, 68, 68, ${0.5 + Math.sin(frameCount * 0.1) * 0.5})`;
        ctx.beginPath(); ctx.arc(0, 0, this.radius * 0.5, 0, Math.PI * 2); ctx.fill();
        if (this.hp < this.maxHp) {
            ctx.fillStyle = `rgba(255, 255, 255, ${1 - (this.hp / this.maxHp)})`;
            ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
    }
    update() {
        if (this.y < this.targetY) this.y += 2;
        else {
            this.x += this.velocity.x;
            if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) this.velocity.x *= -1;
            this.shootTimer++;
            if (this.shootTimer >= this.shootInterval) { this.shoot(); this.shootTimer = 0; }
        }
        this.angle += 0.02; this.draw();
        bossHpBar.style.width = `${(this.hp / this.maxHp) * 100}%`;
    }
    shoot() {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        const speed = 6;
        enemyProjectiles.push(new EnemyProjectile(this.x, this.y, 6, '#f87171', { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }));
        if (this.hp < this.maxHp * 0.5) {
            for (let i = 0; i < 5; i++) {
                const spreadAngle = angle - 0.4 + (i * 0.2);
                enemyProjectiles.push(new EnemyProjectile(this.x, this.y, 4, '#fca5a5', { x: Math.cos(spreadAngle) * (speed * 0.8), y: Math.sin(spreadAngle) * (speed * 0.8) }));
            }
        }
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity, sides, hp, type = 'normal') {
        this.x = x; this.y = y; this.radius = radius; this.color = color; this.velocity = velocity;
        this.sides = sides; this.rotation = 0; this.rotationSpeed = (Math.random() - 0.5) * 0.05;
        this.hp = hp; this.maxHp = hp; this.type = type;
        this.shootTimer = 0; this.shootInterval = Math.random() * 60 + 60;

        if (this.type === 'kamikaze') { this.color = '#f97316'; this.sides = 3; }
        else if (this.type === 'shooter') { this.color = '#3b82f6'; this.sides = 4; }
        else if (this.type === 'slime') { this.color = '#22c55e'; this.sides = 6; }
    }
    draw() {
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rotation);
        ctx.shadowBlur = 15; ctx.shadowColor = this.color; ctx.strokeStyle = this.color; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        for (let i = 0; i < this.sides; i++) {
            const angle = (i * Math.PI * 2) / this.sides; ctx.lineTo(Math.cos(angle) * this.radius, Math.sin(angle) * this.radius);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        if (this.hp < this.maxHp) { ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; ctx.fill(); }
        ctx.restore();
    }
    update() {
        if (this.type === 'kamikaze') {
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            const speed = Math.hypot(this.velocity.x, this.velocity.y) + 0.08;
            this.velocity.x = Math.cos(angle) * Math.min(speed, 8); this.velocity.y = Math.sin(angle) * Math.min(speed, 8);
            this.rotation = angle + Math.PI / 2;
        } else this.rotation += this.rotationSpeed;

        this.x += this.velocity.x; this.y += this.velocity.y;

        if (this.type === 'shooter') {
            this.shootTimer++;
            if (this.shootTimer >= this.shootInterval && this.y > 0 && this.y < canvas.height - 100) {
                const angle = Math.atan2(player.y - this.y, player.x - this.x);
                enemyProjectiles.push(new EnemyProjectile(this.x, this.y, 4, this.color, { x: Math.cos(angle) * 4, y: Math.sin(angle) * 4 }));
                this.shootTimer = 0;
            }
        }
        this.draw();
    }
}

class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x; this.y = y; this.radius = radius; this.color = color; this.velocity = velocity;
        this.alpha = 1; this.friction = 0.98;
    }
    draw() {
        ctx.save(); ctx.globalAlpha = this.alpha; ctx.shadowBlur = 10; ctx.shadowColor = this.color;
        ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    update() {
        this.velocity.x *= this.friction; this.velocity.y *= this.friction;
        this.x += this.velocity.x; this.y += this.velocity.y;
        this.alpha -= 0.02; this.draw();
    }
}

// --- ゲームシステム関数 ---

function updateShieldAndBombUI() {
    shieldContainer.innerHTML = '';
    for (let i = 0; i < player.shields; i++) {
        shieldContainer.innerHTML += `<div class="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_8px_#0ff]"></div>`;
    }
    bombContainer.innerHTML = '';
    for (let i = 0; i < player.bombs; i++) {
        bombContainer.innerHTML += `<div>💣</div>`;
    }
}

// ボム（必殺技）発動
function activateBomb() {
    if (player.bombs <= 0) return;
    player.bombs--;
    updateShieldAndBombUI();

    // 演出
    screenShake(50);
    hitStopFrames = 15;

    // 画面フラッシュ
    flashLayer.classList.remove('flash-active');
    void flashLayer.offsetWidth; // reflow
    flashLayer.classList.add('flash-active');

    // エフェクト生成（中央から円形に広がる）
    for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 15 + 5;
        particles.push(new Particle(player.x, player.y, Math.random() * 5 + 2, '#ef4444', { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }));
    }

    // 効果：敵弾全消去
    enemyProjectiles = [];

    // 効果：画面内の敵すべてに大ダメージ
    enemies.forEach(enemy => {
        if (enemy.y > 0 && enemy.y < canvas.height) {
            enemy.hp -= 50; // 即死級ダメージ
            createExplosion(enemy.x, enemy.y, '#ef4444', 5);
        }
    });
    bosses.forEach(boss => {
        boss.hp -= 100;
        createExplosion(boss.x, boss.y, '#ef4444', 20);
    });

    showFloatingText(player.x, player.y - 50, "BOMB ACTIVATED!");
}

function playerHit() {
    if (player.invincibleTimer > 0) return;

    screenShake(15);
    hitStopFrames = 10;
    createExplosion(player.x, player.y, '#fff', 20);

    if (player.shields > 0) {
        player.shields--;
        updateShieldAndBombUI();
        showFloatingText(player.x, player.y - 30, "SHIELD BROKEN");
        player.invincibleTimer = 60;
    } else {
        createExplosion(player.x, player.y, player.color, 50);
        gameOver();
    }
}

function init() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    score = 0; level = 1; frameCount = 0; enemySpawnRate = 100;
    isBossFight = false; bossLevel = 0; shakeAmount = 0; hitStopFrames = 0; currentCoins = 0;

    scoreEl.innerText = score;
    levelEl.innerText = level;
    gameCoinEl.innerText = currentCoins;
    bossHpContainer.classList.add('hidden');
    flashLayer.classList.remove('flash-active');

    const selectedShipData = SHIPS[currentShipIndex];
    player = new Player(canvas.width / 2, canvas.height - 100, selectedShipData);
    updateShieldAndBombUI();
    mouse.x = canvas.width / 2; mouse.y = canvas.height - 100;

    projectiles = []; enemies = []; particles = []; stars = [];
    powerUps = []; enemyProjectiles = []; bosses = []; obstacles = []; coins = [];

    for (let i = 0; i < 150; i++) stars.push(new Star());
}

function spawnEnemies() {
    if (isBossFight) return;

    if (frameCount % enemySpawnRate === 0) {
        const radius = Math.random() * 20 + 15;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const speedMult = 1 + (level * 0.2);

        if (level >= 2 && Math.random() < 0.1) {
            obstacles.push(new Obstacle(x, -radius, Math.random() * 30 + 30));
            return;
        }

        let type = 'normal';
        if (level >= 2) {
            const rand = Math.random();
            if (rand < 0.2) type = 'shooter'; else if (rand < 0.4) type = 'kamikaze'; else if (rand < 0.55) type = 'slime';
        }

        const velocity = { x: (Math.random() - 0.5) * 2, y: (Math.random() * 1.5 + 1) * speedMult };
        const hue = Math.random() * 360;
        const color = `hsl(${hue}, 100%, 50%)`;
        const sides = Math.floor(Math.random() * 4) + 3;
        // HP調整 (スプレッドなど威力が低い機体でも倒せるように)
        const hp = Math.floor(radius / 8) + Math.floor(level / 2);

        enemies.push(new Enemy(x, -radius, radius, color, velocity, sides, hp, type));
    }

    if (frameCount % 600 === 0 && enemySpawnRate > 20) enemySpawnRate -= 5;

    if (level > 0 && level % 3 === 0 && level > bossLevel * 3) {
        isBossFight = true; bossLevel = Math.floor(level / 3);
        bosses.push(new Boss(bossLevel));
        bossHpContainer.classList.remove('hidden');
        showFloatingText(canvas.width / 2 - 100, canvas.height / 2, `WARNING: BOSS APPROACHING`);
        screenShake(20);
    }
}

function createExplosion(x, y, color, amount = 15) {
    for (let i = 0; i < amount; i++) {
        const angle = Math.random() * Math.PI * 2; const speed = Math.random() * 6;
        particles.push(new Particle(x, y, Math.random() * 3 + 1, color, { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }));
    }
}

function showFloatingText(x, y, text, color = '#0ff') {
    const el = document.createElement('div');
    el.className = 'floating-text'; el.innerText = text; el.style.left = `${x}px`; el.style.top = `${y}px`; el.style.color = color;
    document.body.appendChild(el); setTimeout(() => el.remove(), 1000);
}

// --- メインゲームループ ---
function animate() {
    if (!isPlaying) return;
    animationId = requestAnimationFrame(animate);

    if (hitStopFrames > 0) { hitStopFrames--; return; }

    frameCount++;
    ctx.fillStyle = isBossFight ? 'rgba(20, 5, 5, 0.3)' : 'rgba(5, 5, 16, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    ctx.save();
    if (shakeAmount > 0) {
        ctx.translate((Math.random() - 0.5) * shakeAmount, (Math.random() - 0.5) * shakeAmount);
        shakeAmount *= 0.9; if (shakeAmount < 0.5) shakeAmount = 0;
    }

    stars.forEach(s => s.update());
    player.update();

    // 弾の更新
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const proj = projectiles[i];
        proj.update();
        if (proj.y < -proj.radius || proj.y > canvas.height + proj.radius || proj.x < 0 || proj.x > canvas.width) {
            projectiles.splice(i, 1);
        }
    }

    // 敵弾の更新
    for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
        const eProj = enemyProjectiles[i]; eProj.update();
        if (eProj.y > canvas.height || eProj.x < 0 || eProj.x > canvas.width) { enemyProjectiles.splice(i, 1); continue; }
        if (Math.hypot(player.x - eProj.x, player.y - eProj.y) < eProj.radius + player.radius) {
            enemyProjectiles.splice(i, 1); playerHit();
        }
    }

    // アイテムの更新
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const pu = powerUps[i]; pu.update();
        if (pu.y > canvas.height) { powerUps.splice(i, 1); continue; }
        if (Math.hypot(player.x - pu.x, player.y - pu.y) < pu.radius + player.radius) {
            showFloatingText(pu.x, pu.y, pu.type.toUpperCase() + "!");
            if (pu.type === 'shield' && player.shields < player.maxShields) { player.shields++; updateShieldAndBombUI(); }
            else if (pu.type === 'bomb' && player.bombs < 5) { player.bombs++; updateShieldAndBombUI(); }
            else if (pu.type === 'rapid') player.powerUpTimers.rapid = 600;
            else if (pu.type === 'spread') player.powerUpTimers.spread = 600;
            else { score += 500; scoreEl.innerText = score; } // 上限時ボーナス
            powerUps.splice(i, 1);
        }
    }

    // コインの更新
    for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i]; c.update();
        if (c.y > canvas.height) { coins.splice(i, 1); continue; }
        // プレイヤーに引き寄せられる（磁石効果）
        const dist = Math.hypot(player.x - c.x, player.y - c.y);
        if (dist < 100) {
            c.velocity.x += (player.x - c.x) * 0.05;
            c.velocity.y += (player.y - c.y) * 0.05;
        }
        // 取得
        if (dist < c.radius + player.radius) {
            currentCoins += c.value;
            gameCoinEl.innerText = currentCoins;
            showFloatingText(c.x, c.y, "+1", '#fbbf24');
            coins.splice(i, 1);
        }
    }

    // 障害物
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i]; obs.update();
        if (obs.y > canvas.height + obs.radius) { obstacles.splice(i, 1); continue; }

        for (let j = projectiles.length - 1; j >= 0; j--) {
            const proj = projectiles[j];
            if (Math.hypot(proj.x - obs.x, proj.y - obs.y) < obs.radius + proj.radius) {
                createExplosion(proj.x, proj.y, '#9ca3af', 2);
                if (!proj.pierce) projectiles.splice(j, 1);
            }
        }
        if (Math.hypot(player.x - obs.x, player.y - obs.y) < obs.radius + player.radius) playerHit();
    }

    // ボス
    for (let i = bosses.length - 1; i >= 0; i--) {
        const boss = bosses[i]; boss.update();

        for (let j = projectiles.length - 1; j >= 0; j--) {
            const proj = projectiles[j];
            if (Math.hypot(proj.x - boss.x, proj.y - boss.y) < boss.radius + proj.radius) {
                if (proj.pierce) {
                    if (proj.hitEnemies.has('boss_' + i)) continue;
                    proj.hitEnemies.add('boss_' + i);
                } else {
                    projectiles.splice(j, 1);
                }

                createExplosion(proj.x, proj.y, proj.color, 5);
                boss.hp -= proj.damage;

                if (boss.hp <= 0) {
                    createExplosion(boss.x, boss.y, boss.color, 150);
                    score += boss.maxHp * 10; scoreEl.innerText = score;
                    showFloatingText(boss.x, boss.y, `BOSS DESTROYED!`);

                    // ボス撃破で大量コイン
                    for (let k = 0; k < 10; k++) coins.push(new Coin(boss.x, boss.y));

                    screenShake(30); hitStopFrames = 20;
                    bosses.splice(i, 1); isBossFight = false; bossHpContainer.classList.add('hidden');
                    level++; levelEl.innerText = level;
                    powerUps.push(new PowerUp(boss.x - 30, boss.y, 'shield'));
                    powerUps.push(new PowerUp(boss.x + 30, boss.y, 'rapid'));
                    break;
                }
            }
        }
        if (boss && Math.hypot(player.x - boss.x, player.y - boss.y) < boss.radius + player.radius) playerHit();
    }

    spawnEnemies();

    // 敵
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i]; enemy.update();
        if (enemy.y > canvas.height + enemy.radius) { enemies.splice(i, 1); continue; }

        for (let j = projectiles.length - 1; j >= 0; j--) {
            const proj = projectiles[j];
            if (Math.hypot(proj.x - enemy.x, proj.y - enemy.y) < enemy.radius + proj.radius) {
                // 貫通弾の処理
                if (proj.pierce) {
                    if (proj.hitEnemies.has(enemy)) continue;
                    proj.hitEnemies.add(enemy);
                } else {
                    projectiles.splice(j, 1);
                }

                createExplosion(proj.x, proj.y, proj.color, 3);
                enemy.hp -= proj.damage;

                if (enemy.hp <= 0) {
                    createExplosion(enemy.x, enemy.y, enemy.color, 20);
                    hitStopFrames = 1;

                    if (enemy.type === 'slime') {
                        for (let k = 0; k < 2; k++) {
                            enemies.push(new Enemy(enemy.x, enemy.y, enemy.radius * 0.6, enemy.color, { x: enemy.velocity.x + (Math.random() - 0.5) * 4, y: enemy.velocity.y + (Math.random() - 0.5) * 2 }, enemy.sides, Math.max(1, Math.ceil(enemy.maxHp / 2)), 'normal'));
                        }
                    }

                    // アイテムドロップ
                    if (Math.random() < 0.05 && !isBossFight) {
                        const types = ['shield', 'rapid', 'spread', 'bomb'];
                        powerUps.push(new PowerUp(enemy.x, enemy.y, types[Math.floor(Math.random() * types.length)]));
                    }

                    // コインドロップ (アップグレードレベルに応じて確率上昇)
                    const coinDropChance = 0.1 + (savedData.upgrades.coinRate * 0.05);
                    if (Math.random() < coinDropChance) {
                        coins.push(new Coin(enemy.x, enemy.y));
                    }

                    const points = Math.floor(enemy.radius);
                    score += points; scoreEl.innerText = score;
                    showFloatingText(enemy.x, enemy.y, `+${points}`);

                    if (score > level * 1500) {
                        level++; levelEl.innerText = level;
                        showFloatingText(canvas.width / 2 - 50, canvas.height / 2, `LEVEL UP!`);
                    }
                    enemies.splice(i, 1);
                }
                break;
            }
        }
        if (Math.hypot(player.x - enemy.x, player.y - enemy.y) < enemy.radius + player.radius) {
            enemies.splice(i, 1); playerHit();
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]; if (p.alpha <= 0) particles.splice(i, 1); else p.update();
    }

    ctx.restore();
    ctx.globalCompositeOperation = 'source-over';
}

function gameOver() {
    isPlaying = false;
    cancelAnimationFrame(animationId);

    if (bgm) bgm.stop(); // BGM停止

    // 獲得したコインを保存
    savedData.coins += currentCoins;
    saveData();

    setTimeout(() => {
        modalTitle.innerText = "GAME OVER";
        modalTitle.className = "text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 text-5xl md:text-6xl font-extrabold mb-2 tracking-widest drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]";
        modalDesc.innerText = `獲得コイン: +${currentCoins} C`;
        finalScoreEl.classList.remove('hidden');
        finalScoreVal.innerText = score;
        startBtn.innerText = "リトライ";
        startBtn.className = "bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 border-2 border-red-300 text-xl";
        modalEl.style.opacity = '1';
        modalEl.style.pointerEvents = 'auto';
    }, 1000);
}

// --- メニュー・ショップUI処理 ---

function updateMenuUI() {
    totalCoinEl.innerText = savedData.coins;
    shopCoinEl.innerText = savedData.coins;

    const ship = SHIPS[currentShipIndex];
    shipNameDisplay.innerText = ship.name;
    shipNameDisplay.style.color = ship.color;
    shipDescDisplay.innerText = ship.desc;
}

function renderShopItems() {
    shopItemsContainer.innerHTML = '';
    for (const [key, upgrade] of Object.entries(UPGRADES)) {
        const currentLevel = savedData.upgrades[key];
        const isMax = currentLevel >= upgrade.maxLevel;
        const cost = isMax ? 'MAX' : upgrade.getCost(currentLevel);

        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex justify-between items-center bg-gray-800 p-3 rounded-lg border border-gray-600';

        itemDiv.innerHTML = `
            <div>
                <div class="font-bold text-gray-200">${upgrade.name}</div>
                <div class="text-sm text-yellow-400">Lv: ${currentLevel} / ${upgrade.maxLevel}</div>
            </div>
            <button class="buy-btn bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors" 
                    data-key="${key}" data-cost="${cost}" ${isMax || savedData.coins < cost ? 'disabled' : ''}>
                ${isMax ? 'MAX' : cost + ' C'}
            </button>
        `;
        shopItemsContainer.appendChild(itemDiv);
    }

    // 購入ボタンのイベント設定
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const key = e.target.getAttribute('data-key');
            const cost = parseInt(e.target.getAttribute('data-cost'));

            if (savedData.coins >= cost && savedData.upgrades[key] < UPGRADES[key].maxLevel) {
                savedData.coins -= cost;
                savedData.upgrades[key]++;
                saveData();
                renderShopItems(); // 再描画
            }
        });
    });
}

// イベントリスナー設定
prevShipBtn.addEventListener('click', () => {
    currentShipIndex = (currentShipIndex - 1 + SHIPS.length) % SHIPS.length;
    updateMenuUI();
});
nextShipBtn.addEventListener('click', () => {
    currentShipIndex = (currentShipIndex + 1) % SHIPS.length;
    updateMenuUI();
});

shopBtn.addEventListener('click', () => {
    renderShopItems();
    shopModalEl.classList.remove('hidden');
});
closeShopBtn.addEventListener('click', () => {
    shopModalEl.classList.add('hidden');
    updateMenuUI();
});

startBtn.addEventListener('click', () => {
    if (!bgm) {
        bgm = new BGMPlayer();
        if (bgm.isMuted) soundToggleBtn.innerText = '🔇';
    }
    init();
    modalEl.style.opacity = '0';
    modalEl.style.pointerEvents = 'none';
    isPlaying = true;
    bgm.start();
    animate();
});

soundToggleBtn.addEventListener('click', () => {
    if (!bgm) bgm = new BGMPlayer();
    const isMuted = bgm.toggleMute();
    soundToggleBtn.innerText = isMuted ? '🔇' : '🔊';
});

// 初期化実行
updateMenuUI();
init();
stars.forEach(s => s.draw());
if (player) player.draw();
