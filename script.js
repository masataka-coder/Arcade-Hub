const translations = {
    ja: {
        portal_title: "Arcade Hub",
        portal_desc: "最高に楽しい体験のために開発された、プレミアム・アーケードゲーム・コレクション。",
        game_block_title: "ブロック崩し",
        game_block_desc: "モダンなアレンジを加えたクラシックなアクション。ブロックを壊して強力なアビリティを解放しよう。",
        game_tank_title: "タンクウォーズ",
        game_tank_desc: "戦略的な戦車戦。兵器をアップグレードし、新技術を研究して戦場を支配しよう。",
        game_tower_title: "タワーディフェンス",
        game_tower_desc: "マルチステージの戦略的チャレンジ。高度なタワーを研究し、無限のウェーブを生き残れ。",
        play_game: "ゲームをプレイ",
        view_details: "詳細を見る",
        video_label_concept: "コンセプト映像",
        video_label_gameplay: "プレイ映像",
        game_neon_title: "ネオンストライク",
        game_neon_desc: "究極のネオン・シューティング体験。新技術を駆使して迫りくる敵と巨大なボスを撃破せよ。ショップで機体を強化し、ハイスコアを目指せ。",
        game_village_title: "村の調和：Evolution",
        game_village_desc: "資源を集め、村を発展させ、襲来する敵から村を守り抜こう。交易所や遠征を活用して村をレベルアップ！",
        game_cafe_title: "ハッピーカフェ神業版",
        game_cafe_desc: "農園経営からM&A、恐竜＆サイバーパンクタイムトラベルまで！至高の店舗経営シミュレーション。",
        pwa_install_btn: "インストール",
        pwa_install_msg: "Arcade Hub をアプリとして追加しますか？",
        footer_copy: "&copy; 2026 Takahide Kohata. All rights reserved."
    },
    en: {
        portal_title: "Arcade Hub",
        portal_desc: "A collection of premium arcade games developed for the ultimate fun experience.",
        game_block_title: "Block Breaker",
        game_block_desc: "Classic arcade action with a modern twist. Break through layers of blocks and unlock powerful abilities.",
        game_tank_title: "Tank Wars",
        game_tank_desc: "Strategic tank combat. Upgrade your arsenal, research new tech, and dominate the battlefield.",
        game_tower_title: "Tower Defense",
        game_tower_desc: "Protect your base in this multi-stage strategic challenge. Research advanced towers and survive infinite waves.",
        play_game: "Play Game",
        view_details: "View Details",
        video_label_concept: "Concept",
        video_label_gameplay: "Gameplay",
        game_neon_title: "Neon Strike",
        game_neon_desc: "The ultimate neon shooting experience. Use advanced technology to defeat waves of enemies and giant bosses. Upgrade your ship in the shop and aim for the high score.",
        game_village_title: "Village Harmony: Evolution",
        game_village_desc: "Gather resources, expand your village, and defend against incoming enemies. Utilize trading and expeditions to level up your village!",
        game_cafe_title: "Happy Cafe God Edition",
        game_cafe_desc: "From farms and M&As to time-traveling dinosaur & cyberpunk branches! The ultimate simulation game.",
        pwa_install_btn: "Install",
        pwa_install_msg: "Do you want to add Arcade Hub as an app?",
        footer_copy: "&copy; 2026 Takahide Kohata. All rights reserved."
    }
};

const gameData = {
    block: {
        video: "assets/movies/block.mp4",
        path: "games/block/index.html"
    },
    tank: {
        video: "assets/movies/tank-cg.mp4",
        video2: "assets/movies/tank.mp4",
        path: "games/tank/index.html"
    },
    tower: {
        video: "assets/movies/tower.mp4",
        path: "games/tower/index.html"
    },
    neon: {
        video: "assets/movies/neon-cg.mp4",
        video2: "assets/movies/neon.mp4",
        path: "games/neon/index.html"
    },
    village: {
        video: "",
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' style='background:%230f172a'><text x='50%25' y='50%25' fill='%23fff' font-size='48' font-family='sans-serif' text-anchor='middle' dominant-baseline='middle'>🏕️ Village</text></svg>",
        path: "games/village/index.html"
    },
    cafe: {
        video: "",
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' style='background:%230f172a'><text x='50%25' y='50%25' fill='%23fff' font-size='48' font-family='sans-serif' text-anchor='middle' dominant-baseline='middle'>☕ Happy Cafe</text></svg>",
        path: "games/cafe/index.html"
    }
};

function applyTranslations() {
    const lang = localStorage.getItem('arcade_hub_lang') || 'ja';
    const dict = translations[lang] || translations['ja'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.innerHTML = dict[key];
        }
    });

    // Update active button
    document.getElementById('lang-ja').classList.toggle('active', lang === 'ja');
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
}

function setLanguage(lang) {
    localStorage.setItem('arcade_hub_lang', lang);
    applyTranslations();
}

// Basic interactions for the portal page
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    const cards = document.querySelectorAll('.game-card');

    // Smooth appearance on load
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';

        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
    });

    // Interaction logic
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseenter', () => {
            const video = card.querySelector('.preview-video');
            if (video) video.play().catch(e => console.log("Video play failed:", e));
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            const video = card.querySelector('.preview-video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });

        card.addEventListener('click', () => {
            const gameId = card.getAttribute('data-game');
            openModal(gameId);
        });
    });

    // Modal logic
    const modal = document.getElementById('details-modal');
    const closeBtn = modal.querySelector('.close-btn');
    const modalVideo = document.getElementById('modal-video');
    const modalVideo2 = document.getElementById('modal-video-2');
    const videoWrapper2 = document.getElementById('video-wrapper-2');
    const labelVideo1 = document.getElementById('label-video-1');
    const labelVideo2 = document.getElementById('label-video-2');
    const modalImagePlaceholder = document.getElementById('modal-image-placeholder');
    const modalImage = document.getElementById('modal-image');

    function openModal(id) {
        const lang = localStorage.getItem('arcade_hub_lang') || 'ja';
        const dict = translations[lang];
        const data = gameData[id];

        document.getElementById('modal-title').innerText = dict[`game_${id}_title`];
        document.getElementById('modal-description').innerText = dict[`game_${id}_desc`];
        document.getElementById('modal-play-link').href = data.path;

        labelVideo1.innerText = dict.video_label_concept;
        labelVideo2.innerText = dict.video_label_gameplay;

        if (data.video) {
            modalVideo.src = data.video;
            document.getElementById('video-wrapper-1').classList.remove('hidden');

            if (data.video2) {
                // Sequential playback
                modalVideo.loop = false;
                modalVideo2.src = data.video2;
                videoWrapper2.classList.add('hidden'); // Hide second initially
                labelVideo1.classList.remove('hidden');

                modalVideo.onended = () => {
                    document.getElementById('video-wrapper-1').classList.add('hidden');
                    videoWrapper2.classList.remove('hidden');
                    modalVideo2.play().catch(e => console.log("Modal video 2 play failed:", e));
                };
            } else {
                // Single video: Loop it
                modalVideo.loop = true;
                modalVideo.onended = null;
                videoWrapper2.classList.add('hidden');
                labelVideo1.classList.add('hidden');
            }

            modalVideo.play().catch(e => console.log("Modal video play failed:", e));
            modalImagePlaceholder.classList.add('hidden');
        } else if (data.image) {
            modalVideo.src = "";
            modalVideo.parentElement.classList.add('hidden');
            videoWrapper2.classList.add('hidden');
            modalImage.src = data.image;
            modalImagePlaceholder.classList.remove('hidden');
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.add('hidden');
        modalVideo.pause();
        modalVideo.src = "";
        modalVideo.onended = null;
        modalVideo2.pause();
        modalVideo2.src = "";
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // PWA Install Prompt
    let deferredPrompt;
    const installToast = document.getElementById('install-toast');
    const installBtn = document.getElementById('install-confirm-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can add to home screen
        installToast.classList.remove('hidden');
    });

    installBtn.addEventListener('click', (e) => {
        // hide our install banner
        installToast.classList.add('hidden');
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
    });

    document.getElementById('install-close-btn').addEventListener('click', () => {
        installToast.classList.add('hidden');
    });
});
