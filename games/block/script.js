/**
 * ブロック崩しゲームロジック
 */

const translations = {
    ja: {
        game_title: "BLOCK BREAKER",
        subtitle_ready: "準備はいい？",
        mode_normal: "ノーマル",
        mode_chaos: "カオス！",
        btn_start: "スタート",
        hint_move: "移動",
        hint_launch: "発射",
        msg_victory: "完全制覇！",
        msg_gameover: "ゲームオーバー",
        msg_level_clear: "レベルクリア！",
        msg_next_level: "NEXT LEVEL",
        status_expand: "パドル拡大！",
        status_rocket: "ロケットショット！",
        status_stun: "スタン中！",
        status_bubble: "バブルゾーン！",
        status_1up: "1 UP!",
        status_bonus: "スコアボーナス！",
        status_shoot: "シュート装備！",
        status_multi: "マルチボール！",
        status_shoot_left: "シュート残り: ",
        score_label: "SCORE: ",
        level_label: "LV: "
    },
    en: {
        game_title: "BLOCK BREAKER",
        subtitle_ready: "Ready to Play?",
        mode_normal: "NORMAL",
        mode_chaos: "CHAOS!",
        btn_start: "START",
        hint_move: "Move",
        hint_launch: "Launch",
        msg_victory: "VICTORY!",
        msg_gameover: "GAME OVER",
        msg_level_clear: "LEVEL CLEAR!",
        msg_next_level: "NEXT LEVEL",
        status_expand: "PADDLE EXPAND!",
        status_rocket: "ROCKET SHOT!",
        status_stun: "STUNNED!",
        status_bubble: "BUBBLE ZONE!",
        status_1up: "1 UP!",
        status_bonus: "SCORE BONUS!",
        status_shoot: "SHOOT EQUIPPED!",
        status_multi: "MULTI BALL!",
        status_shoot_left: "SHOOT: ",
        score_label: "SCORE: ",
        level_label: "LV: "
    }
};

function getT(key) {
    const lang = localStorage.getItem('arcade_hub_lang') || 'ja';
    return translations[lang][key] || key;
}

function applyTranslations() {
    const lang = localStorage.getItem('arcade_hub_lang') || 'ja';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // Update displays that are dynamic
    scoreDisplay.textContent = `${getT('score_label')}${score}`;
    levelDisplay.textContent = `${getT('level_label')}${level}`;

    // Update active button
    const btnJa = document.getElementById('lang-ja');
    const btnEn = document.getElementById('lang-en');
    if (btnJa) btnJa.classList.toggle('active', lang === 'ja');
    if (btnEn) btnEn.classList.toggle('active', lang === 'en');
}

function setLanguage(lang) {
    localStorage.setItem('arcade_hub_lang', lang);
    applyTranslations();
}

// キャンバスとコンテキストの設定
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score-display');
const levelDisplay = document.getElementById('level-display');
const livesDisplay = document.getElementById('lives-display');
const itemStatusDisplay = document.getElementById('item-status');
const messageOverlay = document.getElementById('message-overlay');
const titleText = document.getElementById('title-text');
const subtitleText = document.getElementById('subtitle-text');
const modeButtons = document.getElementById('mode-buttons');
const normalBtn = document.getElementById('normal-btn');
const chaosBtn = document.getElementById('chaos-btn');
const actionBtn = document.getElementById('action-btn');

// ゲームの状態管理
let animationId;
let lastTime = 0;
let score = 0;
let lives = 3;
let level = 1;
let gameState = 'TITLE'; // TITLE, START, PLAYING, GAMEOVER, VICTORY, LEVEL_TRANSITION
let isPaused = false;
let isChaosMode = false;

// 色の設定 (マテリアルデザイン風)
const COLORS = {
    red: '#FF5252',
    yellow: '#FFD740',
    blue: '#448AFF',
    green: '#69F0AE',
    paddle: '#FFFFFF',
    ball: '#FFFFFF',
    text: '#FFFFFF',
    itemPlus: '#69F0AE',
    itemRocket: '#FF5252',
    itemStun: '#FFD740',
    itemBubble: '#40C4FF', // 水色
    itemLife: '#FF80AB',   // ピンク
    itemShoot: '#FF9800',  // オレンジ
    itemMulti: '#AB47BC'   // 紫色
};

const BRICK_COLORS = [COLORS.red, COLORS.yellow, COLORS.green, COLORS.blue];
const TNT_COLOR = '#FF4500'; // TNTの色 (OrangeRed)
const HARD_COLOR = '#607D8B'; // Hardブロックの色 (BlueGrey)

// ゲームオブジェクト群
let balls = []; // 複数のボールを管理
let ballActive = false; // ボールが発射されているかどうか

const paddle = {
    x: 0,
    y: 0,
    baseWidth: 100, // 基本幅
    width: 100,
    height: 15,
    color: COLORS.paddle,
    speed: 12,
    stunTimer: 0, // 操作不能タイマー
    shootCharges: 0 // シュート効果の残り回数
};

let bricks = [];
const brickConfig = {
    rowCount: 5,
    columnCount: 8,
    padding: 10,
    offsetTop: 80,
    offsetLeft: 35,
    width: 0, // 動的に計算
    height: 25
};

// 画面揺れ効果用
let shakeDuration = 0;

// パーティクルシステム
let particles = [];
// アイテムシステム
let items = [];
// バブルシステム
let bubbles = [];
// 弾（シュート）システム
let bullets = [];

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.01;
        this.size = Math.random() * 3 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        this.size *= 0.95;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class BubbleArea {
    constructor() {
        // パドルの上空、ブロックの下あたりのランダムな位置に発生
        this.x = Math.random() * (canvas.width - 200) + 100;
        this.y = Math.random() * (canvas.height - 400) + 200;
        this.radius = 0;
        this.maxRadius = 120;
        this.life = 600; // 約10秒
        this.alpha = 0;
    }

    update() {
        if (this.radius < this.maxRadius) {
            this.radius += 2;
        }

        if (this.life > 60) {
            this.alpha = Math.min(this.alpha + 0.05, 0.4);
        } else {
            this.alpha -= 0.01; // フェードアウト
        }

        this.life--;

        // ふわふわ動く
        this.x += Math.sin(Date.now() / 500) * 0.5;
        this.y += Math.cos(Date.now() / 700) * 0.5;
    }

    draw(ctx) {
        if (this.life <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = COLORS.itemBubble;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 枠線
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();

        // 光沢
        ctx.globalAlpha = this.alpha + 0.2;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

class Item {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'expand', 'rocket', 'stun', 'bubble', 'life', 'shoot', 'multi'
        this.dy = 2.5; // 落下速度
        this.size = 20;
        this.active = true;

        switch (type) {
            case 'expand':
                this.text = "＋";
                this.color = COLORS.itemPlus;
                break;
            case 'rocket':
                this.text = "🚀";
                this.color = COLORS.itemRocket;
                break;
            case 'stun':
                this.text = "⚡";
                this.color = COLORS.itemStun;
                break;
            case 'bubble':
                this.text = "🫧";
                this.color = COLORS.itemBubble;
                break;
            case 'life':
                this.text = "🥎";
                this.color = COLORS.itemLife;
                break;
            case 'shoot':
                this.text = "🔫";
                this.color = COLORS.itemShoot;
                break;
            case 'multi':
                this.text = "🏀";
                this.color = COLORS.itemMulti;
                break;
        }
    }

    update() {
        this.y += this.dy;
        if (this.y > canvas.height) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.save();
        ctx.shadowBlur = 5;
        ctx.shadowColor = this.color;

        // アイテムの背景
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2 + 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.color;
        ctx.stroke();

        // アイコン
        ctx.fillStyle = "white"; // 絵文字や記号の色
        ctx.font = "16px Poppins";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.x, this.y + 1);

        ctx.restore();
    }
}

function createParticles(x, y, color) {
    for (let i = 0; i < 10; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function spawnItem(x, y, type) {
    if (type) {
        items.push(new Item(x, y, type));
    }
}

// リサイズ処理
function resize() {
    // 画面サイズに合わせてCanvasサイズを設定
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // パドルとボールの位置を調整
    paddle.y = canvas.height - 40;
    if (!ballActive && balls.length > 0) {
        resetBall();
    }

    // ブロックの幅を再計算
    calculateBrickDimensions();
}

function calculateBrickDimensions() {
    // 画面幅に応じて列数を調整（スマホは少なめに）
    if (canvas.width < 600) {
        brickConfig.columnCount = 5;
        brickConfig.rowCount = 6;
        brickConfig.padding = 6;
        brickConfig.offsetLeft = 15;
    } else {
        brickConfig.columnCount = 9;
        brickConfig.rowCount = 5;
        brickConfig.padding = 10;
        brickConfig.offsetLeft = 35;
    }

    const availableWidth = canvas.width - (brickConfig.offsetLeft * 2);
    brickConfig.width = (availableWidth - (brickConfig.padding * (brickConfig.columnCount - 1))) / brickConfig.columnCount;
}

function initBricks() {
    bricks = [];
    calculateBrickDimensions(); // 確実に寸法を決める

    for (let c = 0; c < brickConfig.columnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickConfig.rowCount; r++) {
            const rand = Math.random();
            let type = 'normal';
            let hp = 1;
            let color = BRICK_COLORS[r % 4];
            let itemType = null;

            if (isChaosMode) {
                // カオスモード: 全てが特殊ブロック (TNT or Hard)
                if (rand < 0.25) {
                    type = 'tnt';
                    color = TNT_COLOR;
                } else {
                    type = 'hard';
                    hp = 2;
                    color = HARD_COLOR;
                }

                // カオスモード: 100%アイテムを所持 (サンダーなし)
                const itemRand = Math.random();
                if (itemRand < 0.15) itemType = 'expand';      // 15%
                else if (itemRand < 0.35) itemType = 'rocket'; // 20%
                else if (itemRand < 0.50) itemType = 'bubble'; // 15%
                else if (itemRand < 0.60) itemType = 'life';   // 10%
                else if (itemRand < 0.80) itemType = 'shoot';  // 20%
                else itemType = 'multi';                       // 20%

            } else {
                // ノーマルモード: 通常の確率
                // 5%の確率でTNT
                if (rand < 0.05) {
                    type = 'tnt';
                    color = TNT_COLOR;
                }
                // 15%の確率でHardブロック
                else if (rand < 0.20) {
                    type = 'hard';
                    hp = 2;
                    color = HARD_COLOR;
                }

                // アイテム所持判定 (確率調整)
                const itemRand = Math.random();
                // Total 35%程度
                if (itemRand < 0.06) {
                    itemType = 'expand'; // 6%
                } else if (itemRand < 0.11) {
                    itemType = 'rocket'; // 5%
                } else if (itemRand < 0.16) {
                    itemType = 'stun';   // 5%
                } else if (itemRand < 0.21) {
                    itemType = 'bubble'; // 5%
                } else if (itemRand < 0.25) {
                    itemType = 'life';   // 4%
                } else if (itemRand < 0.30) {
                    itemType = 'shoot';  // 5%
                } else if (itemRand < 0.35) {
                    itemType = 'multi';  // 5%
                }
            }

            bricks[c][r] = {
                x: 0,
                y: 0,
                status: 1,
                color: color,
                type: type,
                hp: hp,
                itemType: itemType // アイテム情報をブロックに持たせる
            };
        }
    }
}

function resetBall() {
    ballActive = false;
    balls = [{
        x: paddle.x + paddle.width / 2,
        y: paddle.y - 8,
        dx: 0,
        dy: 0,
        radius: 8,
        speed: 6,
        explosiveCharges: 0,
        trail: [] // 追加: 軌跡用
    }];

    paddle.stunTimer = 0;
    paddle.shootCharges = 0;
    bullets = [];
}

function startBall() {
    if (!ballActive) {
        ballActive = true;
        let currentLevelSpeed = Math.min(6 + (level - 1) * 0.5, 10);

        balls.forEach(ball => {
            const angle = -Math.PI / 2 + (Math.random() * 0.5 - 0.25); // 上方向中心に少しランダム
            ball.speed = currentLevelSpeed;
            ball.dx = Math.cos(angle) * ball.speed;
            ball.dy = Math.sin(angle) * ball.speed;
        });
    }
}

// 入力処理
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// タッチ操作対応
canvas.addEventListener('touchstart', touchHandler, { passive: false });
canvas.addEventListener('touchmove', touchHandler, { passive: false });

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    } else if (e.key == "Up" || e.key == "ArrowUp" || e.key == " " || e.key == "Spacebar") {
        // 上キー または スペースキー でボール発射
        if (gameState === 'PLAYING' && !ballActive) {
            startBall();
            e.preventDefault(); // デフォルトのスクロールなどを防ぐ
        }
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function touchHandler(e) {
    if (gameState !== 'PLAYING' && gameState !== 'START') return;

    // スクロール防止
    e.preventDefault();

    const touch = e.touches[0];
    const relativeX = touch.clientX - canvas.offsetLeft;

    // スタート
    if (e.type === 'touchstart' && gameState === 'PLAYING' && !ballActive) {
        startBall();
    }

    if (relativeX > 0 && relativeX < canvas.width && paddle.stunTimer <= 0) {
        paddle.x = relativeX - paddle.width / 2;

        // 壁へのめり込み防止
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;

        if (!ballActive) {
            balls.forEach(ball => ball.x = paddle.x + paddle.width / 2);
        }
    }
}

// ゲームロジック更新
function update() {
    if (gameState !== 'PLAYING') return;

    // パドル制御 (スタン中は動けない)
    if (paddle.stunTimer > 0) {
        paddle.stunTimer--;
    } else {
        // パドル移動 (キーボード)
        if (rightPressed && paddle.x < canvas.width - paddle.width) {
            paddle.x += paddle.speed;
            if (!ballActive) balls.forEach(b => b.x = paddle.x + paddle.width / 2);
        } else if (leftPressed && paddle.x > 0) {
            paddle.x -= paddle.speed;
            if (!ballActive) balls.forEach(b => b.x = paddle.x + paddle.width / 2);
        }
    }

    // アイテム更新
    items.forEach((item, index) => {
        item.update();
        if (!item.active) {
            items.splice(index, 1);
            return;
        }

        // パドルとの衝突判定（アイテム取得）
        if (item.y + item.size / 2 >= paddle.y &&
            item.y - item.size / 2 <= paddle.y + paddle.height &&
            item.x >= paddle.x &&
            item.x <= paddle.x + paddle.width) {

            activateItem(item.type);
            item.active = false;
            items.splice(index, 1);
            createParticles(paddle.x + paddle.width / 2, paddle.y, item.color);
        }
    });

    // バブル更新
    bubbles.forEach((b, index) => {
        b.update();
        if (b.life <= 0) {
            bubbles.splice(index, 1);
        }
    });

    // 弾の更新と衝突判定
    bullets.forEach((bullet, bIndex) => {
        bullet.y += bullet.dy;
        if (bullet.y < 0) {
            bullet.active = false;
        } else {
            // ブロック衝突判定
            for (let c = 0; c < brickConfig.columnCount; c++) {
                if (!bricks[c]) continue;
                for (let r = 0; r < brickConfig.rowCount; r++) {
                    if (!bricks[c][r]) continue;
                    let b = bricks[c][r];
                    if (b.status === 1) {
                        if (bullet.x > b.x && bullet.x < b.x + brickConfig.width && bullet.y > b.y && bullet.y < b.y + brickConfig.height) {
                            bullet.active = false;
                            hitBrick(c, r);
                            break; // 1つの弾は1つのブロックのみ
                        }
                    }
                }
                if (!bullet.active) break; // 列のループも抜ける
            }
        }
    });
    // activeでない弾を削除
    bullets = bullets.filter(b => b.active);

    // パーティクル更新
    particles.forEach((p, index) => {
        p.update();
        if (p.alpha <= 0) {
            particles.splice(index, 1);
        }
    });

    // 画面揺れ更新
    if (shakeDuration > 0) {
        shakeDuration--;
        const dx = (Math.random() - 0.5) * 10;
        const dy = (Math.random() - 0.5) * 10;
        canvas.style.transform = `translate(${dx}px, ${dy}px)`;
    } else {
        canvas.style.transform = 'none';
    }

    if (!ballActive) return;

    // 複数ボールの移動と判定処理
    for (let i = balls.length - 1; i >= 0; i--) {
        let currentBall = balls[i];

        // バブルの影響計算
        let speedMultiplier = 1;
        bubbles.forEach(b => {
            const dist = Math.hypot(currentBall.x - b.x, currentBall.y - b.y);
            if (dist < b.radius) {
                speedMultiplier = 0.4; // 速度を40%に低下
            }
        });

        // 次の位置を計算して衝突判定
        let nextX = currentBall.x + currentBall.dx * speedMultiplier;
        let nextY = currentBall.y + currentBall.dy * speedMultiplier;

        // 壁衝突判定 (nextX, nextY を使用)
        if (nextX > canvas.width - currentBall.radius || nextX < currentBall.radius) {
            currentBall.dx = -currentBall.dx;
            nextX = currentBall.x + currentBall.dx * speedMultiplier; // 反転後の位置で再計算
        }

        if (nextY < currentBall.radius) {
            currentBall.dy = -currentBall.dy;
            nextY = currentBall.y + currentBall.dy * speedMultiplier;
        } else if (nextY > canvas.height - currentBall.radius) {
            // ボール落下
            createParticles(currentBall.x, currentBall.y, '#fff'); // 落下エフェクト
            balls.splice(i, 1); // 落ちたボールを配列から削除
            continue; // 次のボールへ
        }

        // 座標更新
        currentBall.x = nextX;
        currentBall.y = nextY;

        // 軌跡を追加
        currentBall.trail.push({ x: currentBall.x, y: currentBall.y });
        if (currentBall.trail.length > 10) {
            currentBall.trail.shift();
        }

        // パドル衝突判定
        if (currentBall.y + currentBall.radius >= paddle.y &&
            currentBall.y - currentBall.radius <= paddle.y + paddle.height &&
            currentBall.x >= paddle.x &&
            currentBall.x <= paddle.x + paddle.width) {

            // 衝突位置によって反射角を変える
            let collidePoint = currentBall.x - (paddle.x + paddle.width / 2);
            collidePoint = collidePoint / (paddle.width / 2);

            // 角度を計算 (最大60度)
            let angle = collidePoint * (Math.PI / 3);

            // 速度は維持または少し加速
            let currentSpeed = Math.sqrt(currentBall.dx * currentBall.dx + currentBall.dy * currentBall.dy);
            currentSpeed = Math.min(currentSpeed * 1.02, 12 + level); // 上限速度設定

            currentBall.dx = currentSpeed * Math.sin(angle);
            currentBall.dy = -currentSpeed * Math.cos(angle);

            // シュートの発射処理
            if (paddle.shootCharges > 0) {
                paddle.shootCharges--;
                // 左端と右端から発射
                bullets.push({ x: paddle.x, y: paddle.y - 5, dx: 0, dy: -10, radius: 4, active: true });
                bullets.push({ x: paddle.x + paddle.width, y: paddle.y - 5, dx: 0, dy: -10, radius: 4, active: true });

                createParticles(paddle.x, paddle.y, COLORS.itemShoot);
                createParticles(paddle.x + paddle.width, paddle.y, COLORS.itemShoot);

                if (paddle.shootCharges > 0) {
                    showItemStatus(`${getT('status_shoot_left')}${paddle.shootCharges}`, COLORS.itemShoot);
                }
            }

            // めり込み防止
            currentBall.y = paddle.y - currentBall.radius;
        }

        // ブロック衝突判定
        for (let c = 0; c < brickConfig.columnCount; c++) {
            if (!bricks[c]) continue;
            for (let r = 0; r < brickConfig.rowCount; r++) {
                if (!bricks[c][r]) continue;
                let b = bricks[c][r];
                if (b.status === 1) {
                    if (currentBall.x > b.x && currentBall.x < b.x + brickConfig.width && currentBall.y > b.y && currentBall.y < b.y + brickConfig.height) {
                        currentBall.dy = -currentBall.dy;

                        // ブロック破壊処理
                        hitBrick(c, r);

                        // ロケット効果の発動判定
                        if (currentBall.explosiveCharges > 0) {
                            explodeBrick(c, r);
                            currentBall.explosiveCharges--;
                            createParticles(currentBall.x, currentBall.y, COLORS.itemRocket);
                        }

                        // スピードアップ
                        if (score > 0 && score % 50 === 0) {
                            currentBall.dx *= 1.05;
                            currentBall.dy *= 1.05;
                        }
                    }
                }
            }
        }
    }

    // すべてのボールが画面外に落ちた時の処理
    if (balls.length === 0) {
        lives--;
        updateLivesDisplay();

        // パドルリセット（幅など）
        paddle.width = paddle.baseWidth;
        paddle.stunTimer = 0;

        if (lives <= 0) {
            setGameOver();
        } else {
            resetBall();
        }
        return;
    }

    // クリア判定 (全てのブロックが消えたか)
    let activeBricksCount = 0;
    for (let c = 0; c < brickConfig.columnCount; c++) {
        if (!bricks[c]) continue;
        for (let r = 0; r < brickConfig.rowCount; r++) {
            if (bricks[c][r] && bricks[c][r].status === 1) {
                activeBricksCount++;
            }
        }
    }

    if (activeBricksCount === 0) {
        levelClear();
    }
}

function activateItem(type) {
    if (type === 'expand') {
        paddle.width = Math.min(paddle.width + 40, canvas.width * 0.6);
        // パドルの位置調整（右にはみ出さないように）
        if (paddle.x + paddle.width > canvas.width) {
            paddle.x = canvas.width - paddle.width;
        }
        showItemStatus(getT('status_expand'), COLORS.itemPlus);
    } else if (type === 'rocket') {
        balls.forEach(b => b.explosiveCharges = 3); // 全てのボールにロケット付与
        showItemStatus(getT('status_rocket'), COLORS.itemRocket);
    } else if (type === 'stun') {
        paddle.stunTimer = 180; // 約3秒 (60fps想定)
        showItemStatus(getT('status_stun'), COLORS.itemStun);
    } else if (type === 'bubble') {
        bubbles.push(new BubbleArea());
        showItemStatus(getT('status_bubble'), COLORS.itemBubble);
    } else if (type === 'life') {
        if (lives < 5) { // 上限5
            lives++;
            updateLivesDisplay();
            showItemStatus(getT('status_1up'), COLORS.itemLife);
        } else {
            score += 50; // カンスト時はスコアボーナス
            scoreDisplay.textContent = `${getT('score_label')}${score}`;
            showItemStatus(getT('status_bonus'), COLORS.itemLife);
        }
    } else if (type === 'shoot') {
        paddle.shootCharges += 5;
        showItemStatus(`${getT('status_shoot')} (5)`, COLORS.itemShoot);
    } else if (type === 'multi') {
        let newBalls = [];
        balls.forEach(ball => {
            // ボールが多すぎると重くなるため制限
            if (balls.length + newBalls.length < 15) {
                let nb = Object.assign({}, ball); // 現在のボールを複製
                // 角度を少しずらして発射
                let speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy) || Math.min(6 + (level - 1) * 0.5, 10);
                let angle = Math.atan2(ball.dy, ball.dx) + (Math.random() * 0.5 - 0.25);
                nb.dx = Math.cos(angle) * speed;
                nb.dy = Math.sin(angle) * speed;
                nb.trail = []; // 複製時も初期化
                newBalls.push(nb);
            }
        });
        balls = balls.concat(newBalls); // ボールを追加
        showItemStatus(getT('status_multi'), COLORS.itemMulti);
    }
}

function showItemStatus(text, color) {
    itemStatusDisplay.textContent = text;
    itemStatusDisplay.style.color = color;
    itemStatusDisplay.style.opacity = 1;

    // アニメーションで消す
    setTimeout(() => {
        itemStatusDisplay.style.opacity = 0;
        itemStatusDisplay.style.transition = "opacity 1s";
    }, 1500);
}

function hitBrick(c, r) {
    // 安全策
    if (!bricks[c] || !bricks[c][r]) return;

    let b = bricks[c][r];

    if (b.type === 'hard') {
        b.hp--;
        if (b.hp > 0) {
            // ダメージを受けたエフェクト
            createParticles(b.x + brickConfig.width / 2, b.y + brickConfig.height / 2, '#aaa');
            return; // まだ壊れない
        }
    }

    // 破壊確定
    b.status = 0;
    score += (b.type === 'tnt' ? 30 : 10);
    if (b.type === 'hard') score += 20;

    scoreDisplay.textContent = `${getT('score_label')}${score}`;
    createParticles(b.x + brickConfig.width / 2, b.y + brickConfig.height / 2, b.color);

    // アイテム生成 (ブロックが持っている場合)
    if (b.itemType) {
        spawnItem(b.x + brickConfig.width / 2, b.y + brickConfig.height / 2, b.itemType);
    }

    if (b.type === 'tnt') {
        explodeBrick(c, r);
    }
}

function explodeBrick(c, r) {
    // 画面揺れ
    shakeDuration = 10;

    // 周囲3x3を破壊
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue; // 自分自身は既に処理済み

            let nc = c + i;
            let nr = r + j;

            if (nc >= 0 && nc < brickConfig.columnCount && nr >= 0 && nr < brickConfig.rowCount) {
                // ブロックが存在するかチェック
                if (!bricks[nc] || !bricks[nc][nr]) continue;

                let target = bricks[nc][nr];
                if (target.status === 1) {
                    // 誘爆処理
                    target.status = 0;
                    score += 10;
                    createParticles(target.x + brickConfig.width / 2, target.y + brickConfig.height / 2, target.color);

                    if (target.itemType) {
                        spawnItem(target.x + brickConfig.width / 2, target.y + brickConfig.height / 2, target.itemType);
                    }

                    // TNTなら連鎖
                    if (target.type === 'tnt') {
                        explodeBrick(nc, nr);
                    }
                }
            }
        }
    }
    scoreDisplay.textContent = `SCORE: ${score}`;
}

// 描画処理
function draw() {
    // 画面クリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // バブル描画 (背景とブロックの間)
    bubbles.forEach(b => b.draw(ctx));

    // ブロック描画
    for (let c = 0; c < brickConfig.columnCount; c++) {
        if (!bricks[c]) continue;
        for (let r = 0; r < brickConfig.rowCount; r++) {
            if (!bricks[c][r]) continue;
            let b = bricks[c][r];

            if (b.status === 1) {
                const brickX = (c * (brickConfig.width + brickConfig.padding)) + brickConfig.offsetLeft;
                const brickY = (r * (brickConfig.height + brickConfig.padding)) + brickConfig.offsetTop;
                b.x = brickX;
                b.y = brickY;

                ctx.beginPath();
                ctx.roundRect(brickX, brickY, brickConfig.width, brickConfig.height, 5);

                // タイプ別の描画
                if (b.type === 'hard') {
                    // Hardブロック
                    ctx.fillStyle = b.hp === 2 ? HARD_COLOR : lightenDarkenColor(HARD_COLOR, 40);
                } else if (b.type === 'tnt') {
                    // TNTブロック
                    ctx.fillStyle = TNT_COLOR;
                } else {
                    // 通常ブロック
                    const gradient = ctx.createLinearGradient(brickX, brickY, brickX, brickY + brickConfig.height);
                    gradient.addColorStop(0, lightenDarkenColor(b.color, 20));
                    gradient.addColorStop(1, b.color);
                    ctx.fillStyle = gradient;
                }

                ctx.fill();
                ctx.closePath();

                // TNTの文字描画
                if (b.type === 'tnt') {
                    ctx.fillStyle = "white";
                    ctx.font = "bold 12px Poppins";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText("TNT", brickX + brickConfig.width / 2, brickY + brickConfig.height / 2);
                }
                // アイテムのマーク描画
                else if (b.itemType) {
                    ctx.fillStyle = "rgba(255,255,255,0.9)";
                    ctx.font = "bold 14px Poppins";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    let mark = "";
                    if (b.itemType === 'expand') mark = "＋";
                    else if (b.itemType === 'rocket') mark = "🚀";
                    else if (b.itemType === 'stun') mark = "⚡";
                    else if (b.itemType === 'bubble') mark = "🫧";
                    else if (b.itemType === 'life') mark = "🥎";
                    else if (b.itemType === 'shoot') mark = "🔫";
                    else if (b.itemType === 'multi') mark = "🏀";

                    ctx.fillText(mark, brickX + brickConfig.width / 2, brickY + brickConfig.height / 2);
                }

                // Hardブロックの模様
                if (b.type === 'hard') {
                    ctx.strokeStyle = "rgba(255,255,255,0.3)";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(brickX + 2, brickY + 2, brickConfig.width - 4, brickConfig.height - 4);
                }
            }
        }
    }

    // アイテム描画
    items.forEach(item => item.draw(ctx));

    // 弾の描画
    bullets.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.itemShoot;
        ctx.shadowBlur = 5;
        ctx.shadowColor = COLORS.itemShoot;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.closePath();
    });

    // パドル描画
    ctx.beginPath();
    ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 8);

    if (paddle.stunTimer > 0) {
        if (Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.fillStyle = COLORS.itemStun;
        } else {
            ctx.fillStyle = "#555";
        }
    } else {
        ctx.fillStyle = COLORS.paddle;
    }

    ctx.shadowBlur = 10;
    ctx.shadowColor = COLORS.blue;
    ctx.fill();
    ctx.shadowBlur = 0; // リセット
    ctx.closePath();

    // 複数ボールの描画
    balls.forEach(ball => {
        // 軌跡の描画
        if (ball.trail && ball.trail.length > 1) {
            ctx.save();
            const color = ball.explosiveCharges > 0 ? COLORS.itemRocket : "rgba(255, 255, 255, 0.5)";
            for (let i = 0; i < ball.trail.length; i++) {
                const pos = ball.trail[i];
                const alpha = (i + 1) / ball.trail.length * 0.5;
                const radius = ball.radius * (i + 1) / ball.trail.length;

                ctx.beginPath();
                ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.globalAlpha = alpha;
                ctx.fill();
                ctx.closePath();
            }
            ctx.restore();
        }

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

        // ロケットモード中はボールが赤くなる
        if (ball.explosiveCharges > 0) {
            ctx.fillStyle = COLORS.itemRocket;
            ctx.shadowBlur = 15;
            ctx.shadowColor = COLORS.itemRocket;
        } else {
            ctx.fillStyle = COLORS.ball;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "white";
        }

        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.closePath();
    });

    // パーティクル描画
    particles.forEach(p => p.draw(ctx));
}

// メインループ
function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    if (!isPaused) {
        update();
        draw();
    }

    animationId = requestAnimationFrame(gameLoop);
}

// 初期化処理の開始
window.addEventListener('load', () => {
    applyTranslations();
    resize();
    initBricks();
    resetBall();
    updateLivesDisplay();
    requestAnimationFrame(gameLoop);
});

// ライフ表示更新用関数
function updateLivesDisplay() {
    let livesStr = '';
    for (let i = 0; i < lives; i++) {
        livesStr += '〇';
    }
    livesDisplay.textContent = livesStr;
}

function showTitle() {
    gameState = 'TITLE';
    messageOverlay.classList.remove('hidden');
    titleText.innerText = "BLOCK BREAKER";
    subtitleText.innerText = "Select Mode";
    modeButtons.classList.remove('hidden');
    actionBtn.classList.add('hidden');

    // 背景クリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ゲーム制御関数
function initGame(chaos) {
    isChaosMode = chaos;
    score = 0;
    lives = 3;
    level = 1;
    items = [];
    bubbles = [];
    bullets = [];
    scoreDisplay.textContent = `SCORE: 0`;
    levelDisplay.textContent = `LV: 1`;
    updateLivesDisplay(); // 初期表示

    resize(); // サイズ計算
    initBricks(); // ブロック配置
    resetBall();

    // パドル初期位置
    paddle.width = paddle.baseWidth;
    paddle.x = (canvas.width - paddle.width) / 2;

    // アニメーション開始（発射はまだ）
    if (animationId) cancelAnimationFrame(animationId);
    gameLoop(0);

    startGame(); // 準備が完了したら即プレイ状態（発射待機状態）へ移行
}

function startGame() {
    gameState = 'PLAYING';
    messageOverlay.classList.add('hidden');
}

function setGameOver() {
    gameState = 'GAMEOVER';
    messageOverlay.classList.remove('hidden');
    titleText.innerText = "GAME OVER";
    subtitleText.innerText = `Final Score: ${score} (Lv.${level})`;

    // モード選択に戻る
    modeButtons.classList.remove('hidden');
    actionBtn.classList.add('hidden');
}

function levelClear() {
    gameState = 'LEVEL_TRANSITION';
    messageOverlay.classList.remove('hidden');
    titleText.innerText = "STAGE CLEAR!";
    subtitleText.innerText = "Next Level Starting...";
    messageOverlay.classList.remove('hidden');
    modeButtons.classList.add('hidden');
    actionBtn.classList.add('hidden');

    setTimeout(() => {
        startNextLevel();
    }, 2000);
}

function startNextLevel() {
    level++;
    levelDisplay.textContent = `LV: ${level}`;

    // アイテムやパーティクル、バブルのリセット
    items = [];
    particles = [];
    bubbles = [];
    bullets = [];

    // パドルの状態リセット
    paddle.width = paddle.baseWidth;
    paddle.stunTimer = 0;

    initBricks();
    resetBall();

    gameState = 'START';
    messageOverlay.classList.remove('hidden');
    titleText.innerText = `LEVEL ${level}`;
    subtitleText.innerText = isChaosMode ? "More Chaos!" : "Speed Up!";

    modeButtons.classList.add('hidden');
    actionBtn.classList.remove('hidden');
    actionBtn.innerText = "START LEVEL " + level;
}

// ユーティリティ: 色を明るく/暗くする
function lightenDarkenColor(col, amt) {
    let usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
    let num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

// イベントリスナー設定
window.addEventListener('resize', () => {
    resize();
});

// PCでのクリック発射も念のため有効化
canvas.addEventListener('mousedown', () => {
    if (gameState === 'PLAYING' && !ballActive) {
        startBall();
    }
});

normalBtn.addEventListener('click', () => {
    normalBtn.blur(); // フォーカスを外してキー入力をCanvasに戻す
    initGame(false);
});

chaosBtn.addEventListener('click', () => {
    chaosBtn.blur(); // フォーカスを外す
    initGame(true);
});

actionBtn.addEventListener('click', () => {
    actionBtn.blur(); // フォーカスを外す
    if (gameState === 'START') {
        startGame();
    }
});

// 起動
showTitle();
