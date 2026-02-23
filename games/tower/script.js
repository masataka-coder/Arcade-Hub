const translations = {
    ja: {
        game_title: "マルチステージ・タワーディフェンス",
        select_stage: "ステージ選択",
        stage_prefix: "ステージ",
        stage_1_name: "リバースS",
        stage_2_name: "スパイラル",
        stage_3_name: "ジグザグ",
        wave_label: "ウェーブ",
        msg_boss_wave: "ボス襲来！",
        msg_victory: "完全防衛！",
        msg_gameover: "防衛失敗",
        final_wave: "到達ウェーブ",
        btn_retry: "リトライ",
        btn_title: "タイトルへ",
        tab_build: "🔨 設置",
        tab_research: "🧪 研究",
        tab_inspect: "🔍 詳細",
        tw_standard: "スタンダード",
        tw_sniper: "スナイパー",
        tw_missile: "ミサイル",
        tw_rapid: "ラピッド",
        tw_poison: "ポイズン",
        tw_heater: "ヒーター",
        tw_freeze: "フリーズ",
        tw_beam: "ビーム",
        tw_mine: "地雷",
        res_damage: "⚔️ 攻撃力アップ",
        res_speed: "⚡ 攻撃速度アップ",
        res_range: "🎯 射程アップ",
        res_defense: "🛡️ 防衛力アップ",
        btn_repair_all: "🔧 全修理",
        btn_next_wave: "次のウェーブ",
        btn_save: "💾 セーブ",
        btn_load: "📂 ロード",
        btn_top: "↩ トップへ",
        currency: "¥",
        status_selected: "選択中",
        status_hp: "耐久",
        inspect_sell: "売却",
        inspect_repair: "修理",
        msg_wave_start: "ウェーブ開始！",
        msg_wave_clear: "ウェーブクリア！",
    },
    en: {
        game_title: "Multi-Stage Tower Defense",
        select_stage: "SELECT STAGE",
        stage_prefix: "Stage",
        stage_1_name: "Reverse S",
        stage_2_name: "Spiral",
        stage_3_name: "Zigzag",
        wave_label: "Wave",
        msg_boss_wave: "BOSS WAVE!",
        msg_victory: "VICTORY!",
        msg_gameover: "GAME OVER",
        final_wave: "Reached Wave",
        btn_retry: "Retry",
        btn_title: "Title",
        tab_build: "🔨 Build",
        tab_research: "🧪 Research",
        tab_inspect: "🔍 Inspect",
        tw_standard: "Standard",
        tw_sniper: "Sniper",
        tw_missile: "Missile",
        tw_rapid: "Rapid",
        tw_poison: "Poison",
        tw_heater: "Heater",
        tw_freeze: "Freeze",
        tw_beam: "Beam",
        tw_mine: "Mine",
        res_damage: "⚔️ Power Up",
        res_speed: "⚡ Haste",
        res_range: "🎯 Scope",
        res_defense: "🛡️ Shield",
        btn_repair_all: "🔧 All Repair",
        btn_next_wave: "Next Wave",
        btn_save: "💾 SAVE",
        btn_load: "📂 LOAD",
        btn_top: "↩ TOP",
        currency: "$",
        status_selected: "Selected",
        status_hp: "HP",
        inspect_sell: "Sell",
        inspect_repair: "Repair",
        msg_wave_start: "Wave Started!",
        msg_wave_clear: "Wave Cleared!",
    }
};

function getT(key) {
    const lang = localStorage.getItem('arcade_hub_lang') || 'ja';
    return (translations[lang] && translations[lang][key]) ? translations[lang][key] : (translations['ja'][key] || key);
}

function applyTranslations() {
    const lang = localStorage.getItem('arcade_hub_lang') || 'ja';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = getT(key);
        if (text) {
            // Preservation of original icons if wrapped in span or just text
            if (el.children.length === 0) {
                el.innerText = text;
            } else {
                // If it has children, we might be replacing a specific span or needs careful handle
                // For this game, mostly we used spans for icons and text
                const textNodes = Array.from(el.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
                if (textNodes.length > 0) {
                    textNodes[0].textContent = text;
                }
            }
        }
    });

    // Update buttons
    const btnJa = document.getElementById('lang-ja');
    const btnEn = document.getElementById('lang-en');
    if (btnJa) btnJa.classList.toggle('active', lang === 'ja');
    if (btnEn) btnEn.classList.toggle('active', lang === 'en');

    // Refresh UI if game is active
    if (gameState.isRunning) updateUI();
}

function setLanguage(lang) {
    localStorage.setItem('arcade_hub_lang', lang);
    applyTranslations();
}

// --- Web Audio API を使った動的BGM生成クラス ---
class BGMPlayer {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
        this.isPlaying = false;
        this.nextNoteTime = 0;
        this.current16thNote = 0;
        this.tempo = 120;
        this.lookahead = 25.0;
        this.scheduleAheadTime = 0.1;
        this.timerID = null;
        this.isMuted = false;

        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.value = 0.2;
        this.masterGain.connect(this.audioCtx.destination);

        // シーケンスパターン (C Major / A Minor)
        this.bassLine = [33, 0, 33, 33, 36, 0, 36, 36, 38, 0, 38, 38, 31, 0, 31, 31];
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.2, this.audioCtx.currentTime);
        return this.isMuted;
    }

    m2f(note) {
        return 440 * Math.pow(2, (note - 69) / 12);
    }

    scheduleNote(beatNumber, time) {
        // キック
        if (beatNumber % 4 === 0) {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.connect(gain); gain.connect(this.masterGain);
            osc.frequency.setValueAtTime(150, time);
            osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.1);
            gain.gain.setValueAtTime(0.5, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
            osc.start(time); osc.stop(time + 0.1);
        }

        // スネア的なノイズ
        if (beatNumber % 8 === 4) {
            const bufferSize = this.audioCtx.sampleRate * 0.1;
            const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = this.audioCtx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.audioCtx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 1000;
            const gain = this.audioCtx.createGain();
            gain.gain.setValueAtTime(0.1, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
            noise.connect(filter); filter.connect(gain); gain.connect(this.masterGain);
            noise.start(time);
        }

        // ベースライン
        const bNote = this.bassLine[beatNumber];
        if (bNote) {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = this.m2f(bNote);
            gain.gain.setValueAtTime(0.2, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
            osc.connect(gain); gain.connect(this.masterGain);
            osc.start(time); osc.stop(time + 0.2);
        }

        // ウェーブ中 / ボス戦での緊迫感演出 (高音の刻み)
        if (gameState.waveActive && beatNumber % 2 === 0) {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.value = this.m2f(72 + (beatNumber % 4));
            gain.gain.setValueAtTime(0.03, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
            osc.connect(gain); gain.connect(this.masterGain);
            osc.start(time); osc.stop(time + 0.05);
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
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
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

function toggleSound() {
    if (!bgm) bgm = new BGMPlayer();
    const isMuted = bgm.toggleMute();
    document.getElementById('soundToggleBtn').innerText = isMuted ? '🔇' : '🔊';
}

// --- 設定定数 ---
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const TILE_SIZE = 40;
const FPS = 60;

const COLORS = {
    grass: '#4da64d',
    path: '#c2b280',
    pathBorder: '#a19266',
    range: 'rgba(255, 255, 255, 0.2)',
    uiOverlay: 'rgba(0,0,0,0.5)',
    grid: 'rgba(0, 0, 0, 0.15)'
};

// タワー定義
const TOWER_TYPES = {
    standard: { name: 'Standard', cost: 50, range: 120, damage: 20, fireRate: 30, color: '#2196F3' },
    sniper: { name: 'Sniper', cost: 120, range: 250, damage: 100, fireRate: 90, color: '#9C27B0' },
    missile: { name: 'Missile', cost: 150, range: 180, damage: 40, fireRate: 70, color: '#607D8B', blastRadius: 100 },
    rapid: { name: 'Rapid', cost: 200, range: 100, damage: 25, fireRate: 8, color: '#FF9800' },
    poison: { name: 'Poison', cost: 350, range: 160, damage: 5, fireRate: 50, color: '#4CAF50', poisonDuration: 180, poisonDamage: 0.5 },
    freeze: { name: 'Freeze', cost: 500, range: 150, damage: 15, fireRate: 45, color: '#00BCD4', freezeTime: 120 },
    beam: { name: 'Beam', cost: 1000, range: 2000, damage: 5, fireRate: 2, color: '#E91E63' },
    // 新規: ヒーター (解凍 + 凍結耐性)
    heater: { name: 'Heater', cost: 600, range: 100, damage: 0, fireRate: 60, color: '#FF5722', freezeImmune: true },
    // 新規: 地雷 (道の上に設置, 1回使い切り)
    mine: { name: 'Mine', cost: 100, range: 100, damage: 300, fireRate: 0, color: '#3E2723', isRoad: true }
};

// 敵タイプ定義
const ENEMY_TYPES = {
    normal: { speed: 1.0, hpMod: 1.0, color: '#e53935', radius: 12, bountyMod: 1.0, type: 'normal' },
    attacker: { speed: 0.8, hpMod: 1.8, color: '#880E4F', radius: 14, bountyMod: 1.5, type: 'attacker', attackRange: 150, damage: 30, fireRate: 120 },
    fast: { speed: 1.5, hpMod: 0.6, color: '#FFEB3B', radius: 10, bountyMod: 1.2, type: 'fast' },
    freezer: { speed: 0.9, hpMod: 1.2, color: '#00ACC1', radius: 14, bountyMod: 1.8, type: 'freezer', attackRange: 180, damage: 10, fireRate: 180 },
    boss: { speed: 0.4, hpMod: 15.0, color: '#212121', radius: 45, bountyMod: 10.0, type: 'boss' },
    golem: { speed: 0.3, hpMod: 30.0, color: '#5D4037', radius: 50, bountyMod: 20.0, type: 'golem' },
    // 新規ボス: 氷の怪獣 (強化: HPアップ + 凍結耐性)
    ice_kaiju: { speed: 0.4, hpMod: 50.0, color: '#81D4FA', radius: 45, bountyMod: 15.0, type: 'ice_kaiju', freezeImmune: true }
};

const STAGES = {
    1: {
        name: "Reverse S",
        waypoints: [
            { x: 0, y: 2 }, { x: 17, y: 2 }, { x: 17, y: 7 },
            { x: 2, y: 7 }, { x: 2, y: 12 }, { x: 19, y: 12 }
        ]
    },
    2: {
        name: "Spiral",
        waypoints: [
            { x: 0, y: 0 }, { x: 19, y: 0 }, { x: 19, y: 14 },
            { x: 0, y: 14 }, { x: 0, y: 2 }, { x: 17, y: 2 },
            { x: 17, y: 12 }, { x: 2, y: 12 }, { x: 2, y: 4 }, { x: 15, y: 4 }
        ]
    },
    3: {
        name: "Zigzag",
        waypoints: [
            { x: 0, y: 1 }, { x: 3, y: 1 }, { x: 3, y: 13 }, { x: 7, y: 13 },
            { x: 7, y: 1 }, { x: 11, y: 1 }, { x: 11, y: 13 }, { x: 15, y: 13 },
            { x: 15, y: 1 }, { x: 19, y: 1 }, { x: 19, y: 13 }
        ]
    }
};

// グローバル変数
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gameState = {
    currentStage: 1,
    money: 100,
    baseHealth: 20,
    wave: 1,
    isRunning: false,
    isGameOver: false,
    selectedTower: 'standard', // 設置モードで選択中のタワー
    inspectedTower: null,      // マップ上で選択中のタワー
    mode: 'build',             // 'build' | 'inspect' | 'research'
    waveActive: false,
    enemiesToSpawn: 0,
    spawnTimer: 0,
    research: {
        damageLevel: 0, damageCost: 300, damageMultiplier: 1.0,
        speedLevel: 0, speedCost: 300, speedMultiplier: 1.0,
        rangeLevel: 0, rangeCost: 300, rangeMultiplier: 1.0,
        defenseLevel: 0, defenseCost: 300, defenseMultiplier: 1.0
    }
};

let enemies = [];
let towers = [];
let projectiles = [];
let enemyProjectiles = [];
let particles = [];
let pathWaypoints = [];
let mapGrid = [];

// --- マップ生成 ---
function generatePathGrid() {
    mapGrid = [];
    for (let y = 0; y < CANVAS_HEIGHT / TILE_SIZE; y++) {
        let row = [];
        for (let x = 0; x < CANVAS_WIDTH / TILE_SIZE; x++) {
            row.push(0);
        }
        mapGrid.push(row);
    }
    for (let i = 0; i < pathWaypoints.length - 1; i++) {
        let start = pathWaypoints[i];
        let end = pathWaypoints[i + 1];
        let cx = start.x;
        let cy = start.y;
        while (cx !== end.x || cy !== end.y) {
            mapGrid[cy][cx] = 1;
            if (cx < end.x) cx++;
            else if (cx > end.x) cx--;
            else if (cy < end.y) cy++;
            else if (cy > end.y) cy--;
        }
        mapGrid[end.y][end.x] = 1;
    }
}

// --- クラス定義 ---

class Enemy {
    constructor(wave, typeKey) {
        this.typeKey = typeKey;
        const type = ENEMY_TYPES[typeKey];
        this.isBoss = (type.type === 'boss');
        this.isGolem = (type.type === 'golem');
        this.isIceKaiju = (type.type === 'ice_kaiju');

        this.waypointIndex = 0;
        this.x = pathWaypoints[0].x * TILE_SIZE + TILE_SIZE / 2 - TILE_SIZE;
        this.y = pathWaypoints[0].y * TILE_SIZE + TILE_SIZE / 2;

        this.targetX = pathWaypoints[1].x * TILE_SIZE + TILE_SIZE / 2;
        this.targetY = pathWaypoints[1].y * TILE_SIZE + TILE_SIZE / 2;

        this.speedBase = (1.4 + (wave * 0.1)) * type.speed;
        this.speed = this.speedBase;
        this.maxHealth = (30 + (wave * wave * 4)) * type.hpMod;
        this.health = this.maxHealth;
        this.radius = type.radius;
        this.color = type.color;
        this.bounty = Math.floor((15 + wave * 3) * type.bountyMod);
        this.angle = 0;

        this.frozenTimer = 0;
        this.poisonTimer = 0;
        this.poisonDamage = 0;

        this.freezeImmune = type.freezeImmune || false;

        this.canAttack = (type.type === 'attacker' || type.type === 'freezer');
        this.attackRange = type.attackRange || 0;
        this.attackDamage = type.damage || 0;
        this.fireRate = type.fireRate || 0;
        this.attackCooldown = 0;
        this.enemyType = type.type;

        if (this.isBoss || this.isGolem || this.isIceKaiju) {
            // Skill Timers
            this.earthquakeTimer = 180; // or ColdWave
            this.fireballTimer = 240;   // or IceShot
            this.freezeShotTimer = 300; // IceKaiju Special
            this.superFreezeTimer = 500

            // Golem
            this.smashTimer = 180;
            this.beamTimer = 300;
            this.shockwaveTimer = 240;
            this.bigWaveTimer = 500;
        }
    }

    update() {
        // Status Effects
        if (this.poisonTimer > 0) {
            this.poisonTimer--;
            this.health -= this.poisonDamage;
            if (this.poisonTimer % 20 === 0) createParticles(this.x, this.y, '#4CAF50', 1);
        }
        if (this.frozenTimer > 0) {
            this.frozenTimer--;
            this.speed = 0;
        } else {
            this.speed = this.speedBase;
        }

        // Boss AI
        if (this.isIceKaiju) {
            // 1. Cold Wave (Missile射程=180)
            this.earthquakeTimer--;
            if (this.earthquakeTimer <= 0) {
                this.triggerColdWave();
                this.earthquakeTimer = 180;
            }
            // 2. Strong Freeze Shot (冷却弾)
            let shots = Math.ceil(gameState.wave / 5);
            this.fireballTimer--;
            if (this.fireballTimer <= 0) {
                for (let i = 0; i < shots; i++) this.triggerFreezeShot(true); // true=strong
                this.fireballTimer = 240;
            }
            // 3. Ice Shards (Special)
            this.freezeShotTimer--;
            if (this.freezeShotTimer <= 0) {
                for (let i = 0; i < shots; i++) this.triggerIceShards();
                this.freezeShotTimer = 300;
            }

            this.superFreezeTimer--;
            if (this.superFreezeTimer <= 0) {
                for (let i = 0; i < shots; i++) this.triggerSuperFreeze();
                this.superFreezeTimer = 1500;
            }
        }
        else if (this.isGolem) {
            this.smashTimer--;
            if (this.smashTimer <= 0) { this.triggerSmash(); this.smashTimer = 180; }
            this.beamTimer--;
            if (this.beamTimer <= 0) { this.triggerGolemBeam(); this.beamTimer = 300; }
            this.shockwaveTimer--;
            if (this.shockwaveTimer <= 0) { this.triggerShockwave(); this.shockwaveTimer = 240; }
            this.bigWaveTimer--;
            if (this.bigWaveTimer <= 0) { this.triggerBigWeave(); this.bigWaveTimer = 500; }
        }
        else if (this.isBoss) {
            this.earthquakeTimer--;
            if (this.earthquakeTimer <= 0) { this.triggerEarthquake(); this.earthquakeTimer = 180; }
            let shots = Math.ceil(gameState.wave / 5);
            this.fireballTimer--;
            if (this.fireballTimer <= 0) { for (let i = 0; i < shots; i++) this.triggerFireball(); this.fireballTimer = 240; }
            this.freezeShotTimer--;
            if (this.freezeShotTimer <= 0) { for (let i = 0; i < shots; i++) this.triggerFreezeShot(false); this.freezeShotTimer = 300; }
        }
        // Normal Attack
        else if (this.canAttack && this.frozenTimer <= 0) {
            if (this.attackCooldown > 0) this.attackCooldown--;
            let targetTower = null;
            let minDist = this.attackRange;
            for (let t of towers) {
                let dist = Math.hypot(t.x - this.x, t.y - this.y);
                if (dist <= this.attackRange && dist < minDist) {
                    minDist = dist; targetTower = t;
                }
            }
            if (targetTower) {
                if (this.attackCooldown <= 0) {
                    if (this.enemyType === 'freezer') {
                        enemyProjectiles.push(new EnemyFreezeProjectile(this.x, this.y, targetTower));
                    } else {
                        enemyProjectiles.push(new EnemyProjectile(this.x, this.y, targetTower, this.attackDamage));
                    }
                    this.attackCooldown = this.fireRate;
                }
                if (this.attackCooldown > this.fireRate - 20) return false;
            }
        }

        // Movement
        if (this.speed > 0) {
            let dx = this.targetX - this.x;
            let dy = this.targetY - this.y;
            let dist = Math.hypot(dx, dy);
            this.angle = Math.atan2(dy, dx);

            if (dist < this.speed) {
                this.waypointIndex++;
                if (this.waypointIndex < pathWaypoints.length - 1) {
                    this.x = this.targetX;
                    this.y = this.targetY;
                    let nextWP = pathWaypoints[this.waypointIndex + 1];
                    this.targetX = nextWP.x * TILE_SIZE + TILE_SIZE / 2;
                    this.targetY = nextWP.y * TILE_SIZE + TILE_SIZE / 2;
                }
            } else {
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
            }
        }

        // Goal
        let lastWP = pathWaypoints[pathWaypoints.length - 1];
        let endX = lastWP.x * TILE_SIZE + TILE_SIZE / 2;
        let endY = lastWP.y * TILE_SIZE + TILE_SIZE / 2;
        if (Math.hypot(this.x - endX, this.y - endY) < 15) {
            let damage = (this.isBoss || this.isGolem || this.isIceKaiju) ? 7 : 1;
            takeBaseDamage(damage);
            createParticles(this.x, this.y, '#fff', 10);
            return true;
        }
        return false;
    }

    // --- Skills ---
    triggerEarthquake() {
        const range = 120;
        createParticles(this.x, this.y, '#795548', 20);
        particles.push(new Shockwave(this.x, this.y, '#795548', range, 4));
        towers.forEach(t => {
            if (Math.hypot(t.x - this.x, t.y - this.y) <= range) {
                t.takeDamage(30); createParticles(t.x, t.y, '#795548', 5);
            }
        });
    }
    triggerColdWave() {
        const range = 180; // Missile range approx
        createParticles(this.x, this.y, '#00E5FF', 30);
        particles.push(new Shockwave(this.x, this.y, '#00E5FF', range, 5));
        towers.forEach(t => {
            if (Math.hypot(t.x - this.x, t.y - this.y) <= range) {
                t.takeDamage(40); // Medium damage
                if (!t.freezeImmune) t.frozenTimer = 240; // Freeze
                createParticles(t.x, t.y, '#00E5FF', 8);
            }
        });
    }
    triggerFireball() {
        const range = 300;
        let targets = towers.filter(t => Math.hypot(t.x - this.x, t.y - this.y) <= range);
        if (targets.length > 0) {
            let target = targets[Math.floor(Math.random() * targets.length)];
            enemyProjectiles.push(new BossFireball(this.x, this.y, target));
        }
    }
    triggerFreezeShot(isStrong) {
        const range = 300;
        let targets = towers.filter(t => Math.hypot(t.x - this.x, t.y - this.y) <= range);
        if (targets.length > 0) {
            let target = targets[Math.floor(Math.random() * targets.length)];
            enemyProjectiles.push(new BossFreezeShot(this.x, this.y, target, isStrong));
        }
    }
    triggerIceShards() {
        // 左端から発射
        // ターゲットは存在するタワーのY座標付近、いなければランダム
        let ty = this.y;
        if (towers.length > 0) {
            ty = towers[Math.floor(Math.random() * towers.length)].y;
        } else {
            ty = Math.random() * CANVAS_HEIGHT;
        }
        enemyProjectiles.push(new IceShard(0, ty, CANVAS_WIDTH, ty));
    }
    triggerSuperFreeze() {
        const range = 1000;
        let targets = towers.filter(t => Math.hypot(t.x - this.x, t.y - this.y) <= range);
        if (targets.length > 0) {
            let target = targets[Math.floor(Math.random() * targets.length)];
            enemyProjectiles.push(new BossSuperFreezeBall(this.x, this.y, target));
        }
    }
    triggerSmash() {
        const range = 80;
        createParticles(this.x, this.y, '#5D4037', 30);
        particles.push(new Shockwave(this.x, this.y, '#5D4037', range, 8));
        towers.forEach(t => {
            if (Math.hypot(t.x - this.x, t.y - this.y) <= range) {
                t.takeDamage(100); createParticles(t.x, t.y, '#FF0000', 10);
            }
        });
    }
    triggerGolemBeam() {
        if (towers.length === 0) return;
        let target = towers[Math.floor(Math.random() * towers.length)];
        particles.push(new BeamEffect(this.x, this.y, target.x, target.y, '#E91E63'));
        target.takeDamage(50);
        createParticles(target.x, target.y, '#E91E63', 5);
    }
    triggerShockwave() {
        const range = 250;
        particles.push(new Shockwave(this.x, this.y, '#A1887F', range, 2));
        towers.forEach(t => { if (Math.hypot(t.x - this.x, t.y - this.y) <= range) t.takeDamage(10); });
    }
    triggerBigWeave() {
        const range = 1000
        particles.push(new Shockwave(this.x, this.y, '#A1887F', range, 2));
        towers.forEach(t => { if (Math.hypot(t.x - this.x, t.y - this.y) <= range) t.takeDamage(10); });
    }

    draw() {
        if (this.poisonTimer > 0) {
            ctx.save(); ctx.globalAlpha = 0.6; ctx.fillStyle = '#4CAF50';
            ctx.beginPath(); ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
        if (this.frozenTimer > 0) {
            ctx.save(); ctx.globalAlpha = 0.6; ctx.fillStyle = '#00FFFF';
            ctx.beginPath(); ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }

        if (this.isGolem) {
            ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);
            ctx.fillStyle = '#5D4037'; ctx.fillRect(-25, -25, 50, 50);
            ctx.fillStyle = '#795548'; ctx.fillRect(0, -10, 30, 20);
            ctx.fillStyle = '#00E676'; ctx.fillRect(15, -5, 10, 10);
            ctx.fillStyle = '#4E342E'; ctx.fillRect(-10, -45, 20, 20); ctx.fillRect(-10, 25, 20, 20);
            ctx.restore();
        }
        else if (this.isBoss || this.isIceKaiju) {
            ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);
            // Color scheme
            const bodyColor = this.isIceKaiju ? '#0288D1' : '#212121';
            const finColor = this.isIceKaiju ? '#E1F5FE' : '#90CAF9';
            const skinColor = this.isIceKaiju ? '#4FC3F7' : '#37474F';

            ctx.fillStyle = bodyColor; ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(-60, 0); ctx.lineTo(0, -10); ctx.fill();
            ctx.fillStyle = finColor; for (let i = -40; i < -15; i += 8) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i - 4, -8); ctx.lineTo(i + 4, 0); ctx.lineTo(i - 4, 8); ctx.fill(); }
            ctx.fillStyle = skinColor; ctx.beginPath(); ctx.ellipse(0, 0, 30, 20, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = finColor; ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-10, -12); ctx.lineTo(0, -5); ctx.lineTo(10, -15); ctx.lineTo(20, 0); ctx.lineTo(10, 15); ctx.lineTo(0, 5); ctx.lineTo(-10, 12); ctx.fill();
            ctx.fillStyle = skinColor;
            ctx.beginPath(); ctx.ellipse(10, -18, 10, 6, Math.PI / 4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(10, 18, 10, 6, -Math.PI / 4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(-15, -18, 12, 8, Math.PI / 3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(-15, 18, 12, 8, -Math.PI / 3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#263238'; ctx.beginPath(); ctx.ellipse(25, 0, 15, 12, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FFC107'; ctx.beginPath(); ctx.arc(28, -5, 2, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(28, 5, 2, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        } else {
            ctx.fillStyle = this.color;
            ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fill();
            if (this.canAttack) {
                ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(this.x - 4, this.y - 4); ctx.lineTo(this.x + 4, this.y + 4);
                ctx.moveTo(this.x + 4, this.y - 4); ctx.lineTo(this.x - 4, this.y + 4); ctx.stroke();
            }
        }

        const hpPercent = this.health / this.maxHealth;
        ctx.fillStyle = 'red';
        let barWidth = (this.isBoss || this.isGolem || this.isIceKaiju) ? 60 : 24;
        let barY = (this.isBoss || this.isGolem || this.isIceKaiju) ? this.y - 40 : this.y - this.radius - 8;
        ctx.fillRect(this.x - barWidth / 2, barY, barWidth, 4);
        ctx.fillStyle = '#00e676';
        ctx.fillRect(this.x - barWidth / 2, barY, barWidth * hpPercent, 4);
    }
}

class Tower {
    constructor(c, r, typeKey) {
        this.c = c; this.r = r;
        this.x = c * TILE_SIZE + TILE_SIZE / 2;
        this.y = r * TILE_SIZE + TILE_SIZE / 2;
        this.typeKey = typeKey;
        this.type = TOWER_TYPES[typeKey];
        this.cooldown = 0;
        this.direction = 0; this.angle = 0;
        this.freezeImmune = this.type.freezeImmune || false;
        this.maxHealth = 200 * gameState.research.defenseMultiplier;
        this.health = this.maxHealth;
        this.frozenTimer = 0;
        this.shield = 0;
    }

    setType(typeKey) {
        this.typeKey = typeKey;
        this.type = TOWER_TYPES[typeKey];
        this.freezeImmune = this.type.freezeImmune || false;
        this.updateMaxHealth();
    }

    updateMaxHealth() {
        let prevMax = this.maxHealth;
        this.maxHealth = 200 * gameState.research.defenseMultiplier;
        if (prevMax > 0) this.health = (this.health / prevMax) * this.maxHealth;
    }

    takeDamage(amount) {
        if (this.shield > 0) {
            if (this.shield >= amount) { this.shield -= amount; amount = 0; }
            else { amount -= this.shield; this.shield = 0; }
        }
        this.health -= amount;
        if (this.typeKey === 'mine' && this.health <= 0) {
            // 地雷爆発
            this.explodeMine();
        }
        if (gameState.mode === 'inspect' && gameState.inspectedTower === this) updateUI();
    }

    explodeMine() {
        createParticles(this.x, this.y, '#FF5722', 20);
        particles.push(new Shockwave(this.x, this.y, '#FF5722', this.type.range, 8));
        let dmg = this.type.damage * gameState.research.damageMultiplier;
        enemies.forEach(e => {
            let d = Math.hypot(e.x - this.x, e.y - this.y);
            if (d <= this.type.range) e.health -= dmg;
        });
    }

    addShield() {
        const cost = 150;
        if (gameState.money >= cost) {
            gameState.money -= cost; this.shield += 100;
            createParticles(this.x, this.y, '#3F51B5', 8); updateUI();
        }
    }

    repair() {
        if (this.health >= this.maxHealth) return;
        let loss = this.maxHealth - this.health;
        let cost = Math.floor((loss / this.maxHealth) * this.type.cost * 0.5);
        if (cost < 1) cost = 1;
        if (gameState.money >= cost) {
            gameState.money -= cost; this.health = this.maxHealth;
            createParticles(this.x, this.y, '#4CAF50', 5); updateUI();
        }
    }

    getRepairCost() {
        if (this.health >= this.maxHealth) return 0;
        let loss = this.maxHealth - this.health;
        let cost = Math.floor((loss / this.maxHealth) * this.type.cost * 0.5);
        return Math.max(1, cost);
    }

    upgrade(newTypeKey) {
        let newType = TOWER_TYPES[newTypeKey];
        let cost = newType.cost - this.type.cost;
        if (cost > 0 && gameState.money >= cost) {
            gameState.money -= cost; this.setType(newTypeKey); this.health = this.maxHealth;
            createParticles(this.x, this.y, '#FFEB3B', 10); updateUI();
        }
    }

    rotate() {
        this.direction = (this.direction + 1) % 4;
        this.angle = this.direction * (Math.PI / 2);
        updateUI();
    }

    update() {
        if (this.health <= 0) return;
        if (this.frozenTimer > 0) {
            this.frozenTimer--;
            return;
        }

        // Heater logic
        if (this.typeKey === 'heater') {
            if (this.cooldown > 0) this.cooldown--;
            else {
                // 周囲の凍結タワーを探す
                let found = false;
                for (let t of towers) {
                    if (t === this) continue;
                    if (t.frozenTimer > 0 && Math.hypot(t.x - this.x, t.y - this.y) <= this.type.range) {
                        t.frozenTimer = 0; // 解凍
                        createParticles(t.x, t.y, '#FF5722', 5);
                        found = true;
                    }
                }
                if (found) {
                    createParticles(this.x, this.y, '#FF5722', 5);
                    this.cooldown = this.type.fireRate;
                }
            }
            return;
        }

        // Mine logic
        if (this.typeKey === 'mine') {
            // 敵が踏んだら爆発
            for (let e of enemies) {
                if (Math.hypot(e.x - this.x, e.y - this.y) < 20) {
                    this.takeDamage(this.maxHealth); // 自壊 -> explodeMine
                    break;
                }
            }
            return;
        }

        if (this.cooldown > 0) this.cooldown--;

        let target = null;

        if (this.typeKey === 'beam') {
            this.angle = this.direction * (Math.PI / 2);
            if (this.cooldown <= 0) {
                if (this.checkBeamHit()) {
                    this.fireBeam();
                    let baseRate = this.type.fireRate;
                    this.cooldown = baseRate / gameState.research.speedMultiplier;
                }
            }
            return;
        }

        for (let enemy of enemies) {
            let dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
            let range = this.type.range * gameState.research.rangeMultiplier;
            if (dist <= range) { target = enemy; break; }
        }

        if (target) {
            let dx = target.x - this.x; let dy = target.y - this.y;
            this.angle = Math.atan2(dy, dx);
            if (this.cooldown <= 0) {
                projectiles.push(new Projectile(this.x, this.y, target, this.type));
                let baseRate = this.type.fireRate;
                this.cooldown = baseRate / gameState.research.speedMultiplier;
            }
        }
    }

    checkBeamHit() {
        const length = 2000;
        const endX = this.x + Math.cos(this.angle) * length;
        const endY = this.y + Math.sin(this.angle) * length;
        for (let e of enemies) {
            let dist = pointToLineDistance(e.x, e.y, this.x, this.y, endX, endY);
            if (dist < e.radius + 10) return true;
        }
        return false;
    }

    fireBeam() {
        const length = 2000;
        const endX = this.x + Math.cos(this.angle) * length;
        const endY = this.y + Math.sin(this.angle) * length;
        particles.push(new BeamEffect(this.x, this.y, endX, endY, this.type.color));
        let dmg = this.type.damage * gameState.research.damageMultiplier;
        enemies.forEach(e => {
            let dist = pointToLineDistance(e.x, e.y, this.x, this.y, endX, endY);
            if (dist < e.radius + 5) { e.health -= dmg; createParticles(e.x, e.y, this.type.color, 2); }
        });
    }

    draw() {
        if (gameState.mode === 'inspect' && gameState.inspectedTower === this) {
            ctx.strokeStyle = '#FFEB3B'; ctx.lineWidth = 3;
            ctx.strokeRect(this.x - 22, this.y - 22, 44, 44);

            if (this.typeKey !== 'beam' && this.typeKey !== 'mine') {
                let range = this.type.range * gameState.research.rangeMultiplier;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.beginPath(); ctx.arc(this.x, this.y, range, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; ctx.stroke();
            } else if (this.typeKey === 'beam') {
                ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);
                ctx.fillStyle = 'rgba(233, 30, 99, 0.1)'; ctx.fillRect(0, -5, 2000, 10);
                ctx.restore();
            }
        }

        if (this.typeKey === 'mine') {
            ctx.fillStyle = '#3E2723';
            ctx.beginPath(); ctx.arc(this.x, this.y, 10, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#F44336';
            ctx.beginPath(); ctx.arc(this.x, this.y, 4, 0, Math.PI * 2); ctx.fill();
            return; // 地雷はシンプルに
        }

        ctx.fillStyle = '#555'; ctx.fillRect(this.x - 15, this.y - 15, 30, 30);
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);

        ctx.fillStyle = this.type.color;
        if (this.type.name === 'Missile') {
            ctx.fillRect(-14, -14, 28, 28); ctx.fillStyle = '#333';
            ctx.beginPath(); ctx.arc(8, -6, 3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(8, 6, 3, 0, Math.PI * 2); ctx.fill();
        } else if (this.typeKey === 'freeze') {
            ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(10, 10); ctx.lineTo(-10, 10); ctx.fill();
        } else if (this.typeKey === 'beam') {
            ctx.fillRect(-8, -15, 16, 30); ctx.fillStyle = '#FFEB3B'; ctx.fillRect(-2, -15, 4, 30);
        } else if (this.typeKey === 'poison') {
            ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#1B5E20'; ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
        } else if (this.typeKey === 'heater') {
            ctx.fillRect(-10, -10, 20, 20); ctx.fillStyle = '#FFCCBC'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
        } else {
            ctx.fillRect(-12, -12, 24, 24); ctx.fillStyle = '#333'; ctx.fillRect(0, -4, 20, 8);
        }
        ctx.restore();

        if (this.frozenTimer > 0) {
            ctx.fillStyle = 'rgba(0, 255, 255, 0.5)'; ctx.fillRect(this.x - 18, this.y - 18, 36, 36);
            ctx.strokeStyle = '#fff'; ctx.strokeRect(this.x - 18, this.y - 18, 36, 36);
        }
        if (this.shield > 0) {
            ctx.fillStyle = '#3F51B5'; let sW = Math.min(30, (this.shield / 200) * 30);
            ctx.fillRect(this.x - 15, this.y - 25, sW, 4);
        }
        if (this.health < this.maxHealth) {
            const hpPercent = this.health / this.maxHealth;
            ctx.fillStyle = 'red'; ctx.fillRect(this.x - 15, this.y - 20, 30, 4);
            ctx.fillStyle = '#4CAF50'; ctx.fillRect(this.x - 15, this.y - 20, 30 * hpPercent, 4);
        }
    }
}

class Projectile {
    constructor(x, y, target, type) {
        this.x = x; this.y = y; this.target = target; this.type = type;
        this.speed = 10; this.hit = false;
    }
    update() {
        if (!enemies.includes(this.target)) { this.hit = true; return; }
        let dx = this.target.x - this.x; let dy = this.target.y - this.y;
        let dist = Math.hypot(dx, dy);
        if (dist < this.speed) {
            this.hit = true;
            if (this.type.blastRadius) { this.explode(); }
            else {
                let dmg = this.type.damage * gameState.research.damageMultiplier;
                this.target.health -= dmg;
                if (this.type.freezeTime && !this.target.freezeImmune) { this.target.frozenTimer = this.type.freezeTime; }
                if (this.type.poisonDuration) { this.target.poisonTimer = this.type.poisonDuration; this.target.poisonDamage = this.type.poisonDamage; }
                createParticles(this.target.x, this.target.y, this.type.color, 3);
            }
        } else { this.x += (dx / dist) * this.speed; this.y += (dy / dist) * this.speed; }
    }
    explode() {
        createParticles(this.target.x, this.target.y, '#FFA500', 12);
        particles.push(new Shockwave(this.target.x, this.target.y, '#FFFFFF', this.type.blastRadius, 4));
        let dmg = this.type.damage * gameState.research.damageMultiplier;
        for (let enemy of enemies) {
            let d = Math.hypot(enemy.x - this.target.x, enemy.y - this.target.y);
            if (d <= this.type.blastRadius) { enemy.health -= dmg; }
        }
    }
    draw() {
        ctx.fillStyle = this.type.color; ctx.beginPath(); ctx.arc(this.x, this.y, 4, 0, Math.PI * 2); ctx.fill();
    }
}

class BeamEffect {
    constructor(sx, sy, ex, ey, color) {
        this.sx = sx; this.sy = sy; this.ex = ex; this.ey = ey; this.color = color; this.life = 10;
    }
    update() { this.life--; }
    draw() {
        if (this.life <= 0) return;
        ctx.strokeStyle = this.color; ctx.lineWidth = 4 * (this.life / 10);
        ctx.beginPath(); ctx.moveTo(this.sx, this.sy); ctx.lineTo(this.ex, this.ey); ctx.stroke();
    }
}

class EnemyProjectile {
    constructor(x, y, targetTower, damage) {
        this.x = x; this.y = y; this.target = targetTower; this.damage = damage;
        this.speed = 6; this.hit = false; this.color = '#FF5722';
    }
    update() {
        if (!towers.includes(this.target)) { this.hit = true; return; }
        let dx = this.target.x - this.x; let dy = this.target.y - this.y;
        let dist = Math.hypot(dx, dy);
        if (dist < this.speed) { this.onHit(); }
        else { this.x += (dx / dist) * this.speed; this.y += (dy / dist) * this.speed; }
    }
    onHit() {
        this.target.takeDamage(this.damage); this.hit = true;
        createParticles(this.target.x, this.target.y, this.color, 5);
    }
    draw() { ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, 5, 0, Math.PI * 2); ctx.fill(); }
}

class EnemyFreezeProjectile extends EnemyProjectile {
    constructor(x, y, targetTower) { super(x, y, targetTower, 5); this.color = '#00BCD4'; }
    onHit() {
        super.onHit();
        if (!this.target.freezeImmune) this.target.frozenTimer = 180;
    }
}

class BossFireball extends EnemyProjectile {
    constructor(x, y, targetTower) { super(x, y, targetTower, 50); this.blastRadius = 100; this.speed = 4; }
    onHit() {
        this.hit = true; createParticles(this.x, this.y, '#FF5722', 15);
        particles.push(new Shockwave(this.x, this.y, '#FF5722', this.blastRadius, 6));
        towers.forEach(t => { if (Math.hypot(t.x - this.x, t.y - this.y) <= this.blastRadius) { t.takeDamage(this.damage); createParticles(t.x, t.y, '#FF5722', 5); } });
    }
}
class BossSuperFreezeBall extends EnemyProjectile {
    constructor(x, y, targetTower) { super(x, y, targetTower, 50); this.blastRadius = 1000; this.speed = 4; }
    onHit() {
        this.hit = true; createParticles(this.x, this.y, '#FF5722', 15);
        particles.push(new Shockwave(this.x, this.y, '#00E5FF', this.blastRadius, 3));
        towers.forEach(t => {
            if (Math.hypot(t.x - this.x, t.y - this.y) <= this.blastRadius) {
                t.takeDamage(this.damage);
                if (!t.freezeImmune) t.frozenTimer = 180;
                createParticles(t.x, t.y, '#00E5FF', 5);
            }
        });
    }
}

class BossFreezeShot extends EnemyProjectile {
    constructor(x, y, targetTower, isStrong) {
        super(x, y, targetTower, isStrong ? 50 : 10);
        this.color = '#00E5FF'; this.speed = 5;
        this.isStrong = isStrong;
    }
    onHit() {
        this.hit = true;
        const radius = this.isStrong ? 100 : 60;
        particles.push(new Shockwave(this.x, this.y, '#00E5FF', radius, 3));
        towers.forEach(t => {
            if (Math.hypot(t.x - this.x, t.y - this.y) <= radius) {
                t.takeDamage(this.damage);
                if (!t.freezeImmune) t.frozenTimer = 180;
                createParticles(t.x, t.y, '#00E5FF', 5);
            }
        });
    }
}

// 氷の球
class IceShard {
    constructor(sx, sy, ex, ey) {
        this.x = sx; this.y = sy; this.ex = ex; this.ey = ey;
        this.speed = 7; this.hit = false;
    }
    update() {
        this.x += this.speed;
        // タワー接触
        for (let t of towers) {
            if (Math.hypot(t.x - this.x, t.y - this.y) < 20) {
                t.takeDamage(80);
                if (!t.freezeImmune) t.frozenTimer = 240;
                createParticles(t.x, t.y, '#00E5FF', 10);
                this.hit = true; return;
            }
        }
        if (this.x > CANVAS_WIDTH) this.hit = true;
    }
    draw() {
        ctx.fillStyle = '#00E5FF';
        ctx.beginPath(); ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - 20, this.y - 5); ctx.lineTo(this.x - 20, this.y + 5);
        ctx.fill();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x; this.y = y; this.color = color;
        this.size = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 4; this.speedY = (Math.random() - 0.5) * 4; this.life = 1.0;
    }
    update() { this.x += this.speedX; this.y += this.speedY; this.life -= 0.05; }
    draw() {
        ctx.globalAlpha = this.life; ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size); ctx.globalAlpha = 1.0;
    }
}

class Shockwave {
    constructor(x, y, color, maxRadius, speed) {
        this.x = x; this.y = y; this.color = color;
        this.maxRadius = maxRadius; this.currentRadius = 1; this.speed = speed; this.life = 1.0;
    }
    update() {
        this.currentRadius += this.speed; this.life = 1.0 - (this.currentRadius / this.maxRadius);
        if (this.currentRadius >= this.maxRadius) this.life = -1;
    }
    draw() {
        if (this.life <= 0) return;
        ctx.save(); ctx.globalAlpha = Math.max(0, this.life);
        ctx.strokeStyle = this.color; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = this.color; ctx.globalAlpha = Math.max(0, this.life * 0.2); ctx.fill();
        ctx.restore();
    }
}

function createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) particles.push(new Particle(x, y, color));
}

function pointToLineDistance(px, py, x1, y1, x2, y2) {
    const A = px - x1; const B = py - y1;
    const C = x2 - x1; const D = y2 - y1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;
    let xx, yy;
    if (param < 0) { xx = x1; yy = y1; }
    else if (param > 1) { xx = x2; yy = y2; }
    else { xx = x1 + param * C; yy = y1 + param * D; }
    const dx = px - xx; const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

// --- ゲーム管理関数 ---

function initGame(stageId) {
    gameState.currentStage = stageId;
    pathWaypoints = STAGES[stageId].waypoints;
    generatePathGrid();
    document.getElementById('title-screen').classList.remove('active');
    document.getElementById('game-container').classList.add('active');
    if (!bgm) {
        bgm = new BGMPlayer();
        const soundBtn = document.getElementById('soundToggleBtn');
        if (soundBtn) soundBtn.innerText = bgm.isMuted ? '🔇' : '🔊';
    }
    bgm.start();
    resetGame();
}

function returnToTitle() {
    gameState.isRunning = false;
    if (bgm) bgm.stop();
    document.getElementById('game-container').classList.remove('active');
    document.getElementById('title-screen').classList.add('active');
}

function takeBaseDamage(amount) {
    gameState.baseHealth -= amount;
    if (gameState.baseHealth < 0) gameState.baseHealth = 0;
    updateUI();
    let lastWP = pathWaypoints[pathWaypoints.length - 1];
    let endX = lastWP.x * TILE_SIZE + TILE_SIZE / 2;
    let endY = lastWP.y * TILE_SIZE + TILE_SIZE / 2;
    createParticles(endX, endY, '#ff0000', 15);
    if (gameState.baseHealth <= 0) endGame();
}

function startGame() {
    if (gameState.waveActive) return;
    gameState.waveActive = true;

    // Check for Boss
    let isGolemWave = (gameState.wave % 10 === 0);
    let isIceKaijuWave = (gameState.wave >= 35 && gameState.wave % 5 === 0 && !isGolemWave);
    let isBossWave = !isGolemWave && !isIceKaijuWave && (gameState.wave % 5 === 0);

    if (isGolemWave) {
        showMessage("GOLEM WAVE!"); gameState.enemiesToSpawn = 1;
    } else if (isIceKaijuWave) {
        showMessage("ICE KAIJU WAVE!"); gameState.enemiesToSpawn = 1;
    } else if (isBossWave) {
        showMessage(getT('msg_boss_wave')); gameState.enemiesToSpawn = 1;
    } else {
        showMessage(getT('msg_wave_start'));
        gameState.enemiesToSpawn = 5 + Math.floor(gameState.wave * 1.5);
    }
    gameState.spawnTimer = 0;
    document.getElementById('start-wave').disabled = true;
    document.getElementById('start-wave').innerHTML = "<span>...</span>";
}

function showMessage(msg) {
    const el = document.getElementById('message-area');
    el.innerText = msg; el.style.opacity = 1;
    setTimeout(() => { el.style.opacity = 0; }, 3000);
}

function update() {
    if (gameState.isGameOver || !document.getElementById('game-container').classList.contains('active')) return;

    if (gameState.waveActive) {
        if (gameState.enemiesToSpawn > 0) {
            gameState.spawnTimer--;
            if (gameState.spawnTimer <= 0) {
                let isGolemWave = (gameState.wave % 10 === 0);
                let isIceKaijuWave = (gameState.wave >= 35 && gameState.wave % 5 === 0 && !isGolemWave);
                let isBossWave = !isGolemWave && !isIceKaijuWave && (gameState.wave % 5 === 0);

                if (isGolemWave) {
                    enemies.push(new Enemy(gameState.wave, 'golem'));
                    gameState.enemiesToSpawn = 0;
                } else if (isIceKaijuWave) {
                    enemies.push(new Enemy(gameState.wave, 'ice_kaiju'));
                    gameState.enemiesToSpawn = 0;
                } else if (isBossWave) {
                    enemies.push(new Enemy(gameState.wave, 'boss'));
                    gameState.enemiesToSpawn = 0;
                } else {
                    let types = ['normal'];
                    if (gameState.wave >= 2) types.push('attacker');
                    if (gameState.wave >= 3) types.push('fast');
                    if (gameState.wave >= 6) types.push('freezer');

                    let rand = Math.random();
                    let typeKey = 'normal';
                    if (types.includes('freezer') && rand < 0.15) typeKey = 'freezer';
                    else if (types.includes('fast') && rand < 0.35) typeKey = 'fast';
                    else if (types.includes('attacker') && rand < 0.55) typeKey = 'attacker';

                    enemies.push(new Enemy(gameState.wave, typeKey));
                    gameState.enemiesToSpawn--;
                }
                gameState.spawnTimer = 40;
            }
        } else if (enemies.length === 0) {
            gameState.waveActive = false; gameState.wave++;
            showMessage(getT('msg_wave_clear'));
            updateUI();
            document.getElementById('start-wave').disabled = false;
            document.getElementById('start-wave').innerHTML = `<span>${getT('btn_next_wave')}</span>`;
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        let reachedEnd = e.update();
        if (reachedEnd) { enemies.splice(i, 1); }
        else if (e.health <= 0) {
            gameState.money += e.bounty; updateUI();
            createParticles(e.x, e.y, e.color, 8); enemies.splice(i, 1);
        }
    }
    for (let i = towers.length - 1; i >= 0; i--) {
        let t = towers[i]; t.update();
        if (t.health <= 0) {
            createParticles(t.x, t.y, '#555', 10);
            if (gameState.inspectedTower === t) deselectTower();
            towers.splice(i, 1);
        }
    }
    for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i]; p.update();
        if (p.hit) projectiles.splice(i, 1);
    }
    for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
        let p = enemyProjectiles[i]; p.update();
        if (p.hit) enemyProjectiles.splice(i, 1);
    }
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i]; p.update();
        if (p.life <= 0) particles.splice(i, 1);
    }
}

function drawMap() {
    ctx.fillStyle = COLORS.grass; ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.strokeStyle = COLORS.grid; ctx.lineWidth = 1;
    for (let x = 0; x <= CANVAS_WIDTH; x += TILE_SIZE) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_HEIGHT); ctx.stroke(); }
    for (let y = 0; y <= CANVAS_HEIGHT; y += TILE_SIZE) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y); ctx.stroke(); }
    for (let y = 0; y < mapGrid.length; y++) {
        for (let x = 0; x < mapGrid[y].length; x++) {
            if (mapGrid[y][x] === 1) {
                ctx.fillStyle = COLORS.path; ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                ctx.strokeStyle = COLORS.pathBorder; ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
    let lastWP = pathWaypoints[pathWaypoints.length - 1];
    let endX = lastWP.x * TILE_SIZE + TILE_SIZE / 2; let endY = lastWP.y * TILE_SIZE + TILE_SIZE / 2;
    ctx.font = '30px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🏰', endX, endY);
    const hpPercent = Math.max(0, gameState.baseHealth / 20);
    ctx.fillStyle = 'red'; ctx.fillRect(endX - 20, endY - 25, 40, 5);
    ctx.fillStyle = '#2196F3'; ctx.fillRect(endX - 20, endY - 25, 40 * hpPercent, 5);
}

function draw() {
    if (!document.getElementById('game-container').classList.contains('active')) return;
    drawMap();
    towers.forEach(t => t.draw());
    enemies.forEach(e => e.draw());
    projectiles.forEach(p => p.draw());
    enemyProjectiles.forEach(p => p.draw());
    particles.forEach(p => p.draw());

    // Build Preview
    if (mousePos.x >= 0 && mousePos.x < CANVAS_WIDTH && mousePos.y >= 0 && mousePos.y < CANVAS_HEIGHT && !gameState.isGameOver && gameState.mode === 'build') {
        let c = Math.floor(mousePos.x / TILE_SIZE);
        let r = Math.floor(mousePos.y / TILE_SIZE);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);

        const towerInfo = TOWER_TYPES[gameState.selectedTower];
        // Check placing condition
        let canPlace = false;
        if (gameState.selectedTower === 'mine') {
            // Mine: Road only
            if (mapGrid[r] && mapGrid[r][c] === 1) canPlace = true;
        } else {
            // Others: Grass only
            if (mapGrid[r] && mapGrid[r][c] === 0 && !towers.some(t => t.c === c && t.r === r)) canPlace = true;
        }

        let isLocked = (gameState.selectedTower === 'freeze' && gameState.wave < 6) ||
            (gameState.selectedTower === 'beam' && gameState.wave < 11) ||
            (gameState.selectedTower === 'poison' && gameState.wave < 8) ||
            (gameState.selectedTower === 'heater' && gameState.wave < 6);

        if (canPlace && !isLocked) {
            let range = towerInfo.range * gameState.research.rangeMultiplier;
            ctx.fillStyle = COLORS.range;
            ctx.beginPath(); ctx.arc(c * TILE_SIZE + TILE_SIZE / 2, r * TILE_SIZE + TILE_SIZE / 2, range, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 0.5; ctx.fillStyle = towerInfo.color;
            ctx.fillRect(c * TILE_SIZE + 5, r * TILE_SIZE + 5, TILE_SIZE - 10, TILE_SIZE - 10); ctx.globalAlpha = 1.0;
        } else {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// --- Save / Load ---
function saveGame() {
    if (gameState.isGameOver) return;
    const saveObj = {
        money: gameState.money,
        wave: gameState.wave,
        baseHealth: gameState.baseHealth,
        research: gameState.research,
        towers: towers.map(t => ({ c: t.c, r: t.r, typeKey: t.typeKey, health: t.health, direction: t.direction, shield: t.shield }))
    };
    try {
        localStorage.setItem(`towerDefenseSave_stage${gameState.currentStage}`, JSON.stringify(saveObj));
        showMessage(getT('btn_save'));
    } catch (e) { alert('Save failed: ' + e); }
}

function loadGame() {
    const json = localStorage.getItem(`towerDefenseSave_stage${gameState.currentStage}`);
    if (!json) { alert(`No save found.`); return; }
    try {
        const saveObj = JSON.parse(json);
        gameState.money = saveObj.money;
        gameState.wave = saveObj.wave;
        gameState.baseHealth = saveObj.baseHealth || 20;
        if (saveObj.research) gameState.research = saveObj.research;
        towers = []; enemies = []; projectiles = []; enemyProjectiles = []; particles = [];
        saveObj.towers.forEach(tData => {
            let newTower = new Tower(tData.c, tData.r, tData.typeKey);
            newTower.health = tData.health;
            if (tData.direction !== undefined) {
                newTower.direction = tData.direction; newTower.angle = newTower.direction * (Math.PI / 2);
            }
            if (tData.shield) newTower.shield = tData.shield;
            towers.push(newTower);
        });
        gameState.waveActive = false; gameState.isGameOver = false;
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('start-wave').disabled = false;
        document.getElementById('start-wave').innerText = getT('btn_next_wave');
        deselectTower();
        updateUI();
        showMessage(getT('btn_load'));
    } catch (e) { alert('Load failed: ' + e); }
}

// --- Input & UI ---
let mousePos = { x: 0, y: 0 };
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left; mousePos.y = e.clientY - rect.top;
});

canvas.addEventListener('click', (e) => {
    if (gameState.isGameOver || !document.getElementById('game-container').classList.contains('active')) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const c = Math.floor(x / TILE_SIZE); const r = Math.floor(y / TILE_SIZE);
    if (r < 0 || r >= mapGrid.length || c < 0 || c >= mapGrid[0].length) return;

    let clickedTower = towers.find(t => t.c === c && t.r === r);
    if (clickedTower) {
        inspectTower(clickedTower); return;
    }

    if (gameState.mode === 'inspect') {
        deselectTower(); return;
    }

    if (gameState.mode === 'research') return;

    const towerInfo = TOWER_TYPES[gameState.selectedTower];
    let isLocked = (gameState.selectedTower === 'freeze' && gameState.wave < 6) ||
        (gameState.selectedTower === 'beam' && gameState.wave < 11) ||
        (gameState.selectedTower === 'poison' && gameState.wave < 8) ||
        (gameState.selectedTower === 'heater' && gameState.wave < 6);
    if (isLocked) return;

    // Placement logic
    let canPlace = false;
    if (gameState.selectedTower === 'mine') {
        if (mapGrid[r][c] === 1) canPlace = true; // Mine on road
    } else {
        if (mapGrid[r][c] === 0) canPlace = true; // Tower on grass
    }

    if (canPlace) {
        if (gameState.money >= towerInfo.cost) {
            gameState.money -= towerInfo.cost;
            towers.push(new Tower(c, r, gameState.selectedTower));
            updateUI();
            createParticles(c * TILE_SIZE + TILE_SIZE / 2, r * TILE_SIZE + TILE_SIZE / 2, '#fff', 5);
        }
    }
});

function selectTower(type) {
    if (type === 'freeze' && gameState.wave < 6) return;
    if (type === 'beam' && gameState.wave < 11) return;
    if (type === 'poison' && gameState.wave < 8) return;
    if (type === 'heater' && gameState.wave < 6) return;

    gameState.selectedTower = type;
    switchMode('build');
}

function switchMode(mode) {
    gameState.mode = mode;
    if (mode !== 'inspect') gameState.inspectedTower = null;
    updateUI();
}

function inspectTower(tower) {
    gameState.mode = 'inspect';
    gameState.inspectedTower = tower;
    updateUI();
}

function deselectTower() {
    switchMode('build');
}

function doRepair() { if (gameState.inspectedTower) gameState.inspectedTower.repair(); }
function doUpgrade(newType) { if (gameState.inspectedTower) gameState.inspectedTower.upgrade(newType); }
function doRotate() { if (gameState.inspectedTower) gameState.inspectedTower.rotate(); }
function doAddShield() { if (gameState.inspectedTower) gameState.inspectedTower.addShield(); }

function repairAll() {
    let totalCost = 0;
    let targets = [];
    for (let t of towers) {
        let cost = t.getRepairCost();
        if (cost > 0) {
            totalCost += cost;
            targets.push(t);
        }
    }
    if (targets.length === 0) return;

    if (gameState.money >= totalCost) {
        gameState.money -= totalCost;
        targets.forEach(t => {
            t.health = t.maxHealth;
            createParticles(t.x, t.y, '#4CAF50', 5);
        });
        updateUI();
        alert(`Repaired all towers for $${totalCost}`);
    } else {
        alert(`Not enough money to repair all. Cost: $${totalCost}`);
    }
}

function doResearch(type) {
    if (type === 'damage') {
        if (gameState.money >= gameState.research.damageCost) {
            gameState.money -= gameState.research.damageCost;
            gameState.research.damageLevel++; gameState.research.damageMultiplier += 0.2;
            gameState.research.damageCost = Math.floor(gameState.research.damageCost * 1.5);
            updateUI(); createParticles(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, '#F44336', 20);
        }
    } else if (type === 'speed') {
        if (gameState.money >= gameState.research.speedCost) {
            gameState.money -= gameState.research.speedCost;
            gameState.research.speedLevel++; gameState.research.speedMultiplier += 0.2;
            gameState.research.speedCost = Math.floor(gameState.research.speedCost * 1.5);
            updateUI(); createParticles(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, '#FFEB3B', 20);
        }
    } else if (type === 'range') {
        if (gameState.money >= gameState.research.rangeCost) {
            gameState.money -= gameState.research.rangeCost;
            gameState.research.rangeLevel++; gameState.research.rangeMultiplier += 0.1;
            gameState.research.rangeCost = Math.floor(gameState.research.rangeCost * 1.5);
            updateUI(); createParticles(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, '#2196F3', 20);
        }
    } else if (type === 'defense') {
        if (gameState.money >= gameState.research.defenseCost) {
            gameState.money -= gameState.research.defenseCost;
            gameState.research.defenseLevel++; gameState.research.defenseMultiplier += 0.2;
            gameState.research.defenseCost = Math.floor(gameState.research.defenseCost * 1.5);
            towers.forEach(t => t.updateMaxHealth());
            updateUI(); createParticles(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, '#4CAF50', 20);
        }
    }
}

function updateUI() {
    document.getElementById('score-display').innerText = `💰 ${gameState.money}`;
    document.getElementById('base-hp-display').innerText = `🏰 HP: ${gameState.baseHealth}`;
    document.getElementById('wave-display').innerHTML = `<span data-i18n="wave_label">${getT('wave_label')}</span>: ${gameState.wave}`;

    document.querySelectorAll('.panel-content').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    if (gameState.mode === 'inspect' && gameState.inspectedTower) {
        document.getElementById('inspect-panel').classList.add('active');
        document.getElementById('tab-inspect').style.display = 'block';
        document.getElementById('tab-inspect').classList.add('active');

        const t = gameState.inspectedTower;
        const info = TOWER_TYPES[t.typeKey];
        document.getElementById('inspect-status').innerText = `${getT('status_selected')}: ${getT('tw_' + t.typeKey)} (${getT('status_hp')}: ${Math.floor(t.health)}/${Math.floor(t.maxHealth)})`;

        const btnArea = document.getElementById('inspect-buttons');
        btnArea.innerHTML = '';

        // Repair
        const repairCost = t.getRepairCost();
        const repBtn = document.createElement('button');
        repBtn.className = 'repair-btn';
        repBtn.innerText = `${getT('inspect_repair')} ($${repairCost})`;
        repBtn.disabled = (t.health >= t.maxHealth || gameState.money < repairCost);
        repBtn.onclick = doRepair;
        btnArea.appendChild(repBtn);

        // Sell
        const sellBtn = document.createElement('button');
        sellBtn.className = 'back-btn';
        sellBtn.innerText = `${getT('inspect_sell')} ($${Math.floor(info.cost * 0.7)})`;
        sellBtn.onclick = () => {
            gameState.money += Math.floor(info.cost * 0.7);
            towers = towers.filter(tw => tw !== t);
            deselectTower();
            updateUI();
        };
        btnArea.appendChild(sellBtn);

        // Rotate (for beam tower)
        if (t.typeKey === 'beam') {
            const rotBtn = document.createElement('button');
            rotBtn.className = 'rotate-btn'; rotBtn.innerText = getT('inspect_rotate'); rotBtn.onclick = doRotate;
            btnArea.appendChild(rotBtn);
        }

        // Add Shield
        const shieldCost = 150;
        const shieldBtn = document.createElement('button');
        shieldBtn.className = 'shield-btn'; shieldBtn.innerText = `${getT('inspect_shield')} ($${shieldCost})`;
        shieldBtn.disabled = (gameState.money < shieldCost || t.shield); shieldBtn.onclick = doAddShield;
        btnArea.appendChild(shieldBtn);

        // Upgrades (for standard tower)
        if (t.typeKey === 'standard') {
            const upgrades = [
                { key: 'sniper', wave: 1 }, { key: 'missile', wave: 1 }, { key: 'rapid', wave: 1 },
                { key: 'poison', wave: 8 }, { key: 'freeze', wave: 6 }, { key: 'beam', wave: 11 }, { key: 'heater', wave: 1 }
            ];
            upgrades.forEach(up => {
                if (gameState.wave >= up.wave) {
                    const targetType = TOWER_TYPES[up.key];
                    const cost = targetType.cost - TOWER_TYPES.standard.cost;
                    const btn = document.createElement('button');
                    btn.className = 'upgrade-btn'; btn.innerText = `To ${targetType.name} ($${cost})`;
                    btn.disabled = (gameState.money < cost); btn.onclick = () => doUpgrade(up.key);
                    btnArea.appendChild(btn);
                }
            });
        }
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'back-btn'; cancelBtn.innerText = 'Back'; cancelBtn.onclick = deselectTower;
        btnArea.appendChild(cancelBtn);

    } else if (gameState.mode === 'research') {
        document.getElementById('research-panel').classList.add('active');
        const r = gameState.research;

        const dmgBtn = document.getElementById('btn-res-damage');
        const spdBtn = document.getElementById('btn-res-speed');
        const rngBtn = document.getElementById('btn-res-range');
        const defBtn = document.getElementById('btn-res-defense');

        dmgBtn.querySelector('span:nth-child(2)').innerText = `$${r.damageCost} (Lv.${r.damageLevel})`;
        spdBtn.querySelector('span:nth-child(2)').innerText = `$${r.speedCost} (Lv.${r.speedLevel})`;
        rngBtn.querySelector('span:nth-child(2)').innerText = `$${r.rangeCost} (Lv.${r.rangeLevel})`;
        defBtn.querySelector('span:nth-child(2)').innerText = `$${r.defenseCost} (Lv.${r.defenseLevel})`;

        dmgBtn.disabled = (gameState.money < r.damageCost);
        spdBtn.disabled = (gameState.money < r.speedCost);
        rngBtn.disabled = (gameState.money < r.rangeCost);
        defBtn.disabled = (gameState.money < r.defenseCost);

    } else {
        document.getElementById('build-panel').classList.add('active');

        document.querySelectorAll('.tower-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.id === `btn-${gameState.selectedTower}`) btn.classList.add('active');
        });

        const poisonBtn = document.getElementById('btn-poison');
        const freezeBtn = document.getElementById('btn-freeze');
        const beamBtn = document.getElementById('btn-beam');
        const heaterBtn = document.getElementById('btn-heater');

        if (gameState.wave >= 8) { poisonBtn.classList.remove('locked'); poisonBtn.disabled = false; } else { poisonBtn.classList.add('locked'); }
        if (gameState.wave >= 6) { freezeBtn.classList.remove('locked'); freezeBtn.disabled = false; } else { freezeBtn.classList.add('locked'); }
        if (gameState.wave >= 11) { beamBtn.classList.remove('locked'); beamBtn.disabled = false; } else { beamBtn.classList.add('locked'); }
        if (gameState.wave >= 6) { heaterBtn.classList.remove('locked'); heaterBtn.disabled = false; } else { heaterBtn.classList.add('locked'); }
    }
}

function endGame() {
    gameState.isGameOver = true;
    if (bgm) bgm.stop();
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-title').innerText = getT('msg_gameover');
    document.getElementById('final-score').innerText = `${getT('final_wave')}: ${gameState.wave}`;
}

function resetGame() {
    gameState.money = 100; gameState.baseHealth = 20; gameState.wave = 1;
    gameState.isRunning = true; gameState.isGameOver = false;
    gameState.selectedTower = 'standard'; gameState.waveActive = false;
    gameState.enemiesToSpawn = 0; gameState.spawnTimer = 0;
    gameState.research = {
        damageLevel: 0, damageCost: 300, damageMultiplier: 1.0,
        speedLevel: 0, speedCost: 300, speedMultiplier: 1.0,
        rangeLevel: 0, rangeCost: 300, rangeMultiplier: 1.0,
        defenseLevel: 0, defenseCost: 300, defenseMultiplier: 1.0
    };

    switchMode('build');
    enemies = []; towers = []; projectiles = []; enemyProjectiles = []; particles = [];

    document.getElementById('game-over').style.display = 'none';
    document.getElementById('start-wave').disabled = false;
    document.getElementById('start-wave').innerHTML = `<span>${getT('btn_next_wave')}</span>`;
    selectTower('standard');
    updateUI();
}

// 起動時に翻訳を適用設定
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
});

gameLoop();

