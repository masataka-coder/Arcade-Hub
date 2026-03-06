const translations = {
    ja: {
        portal_title: "Arcade Hub",
        portal_desc: "最高に楽しい体験のために開発された、プレミアム・アーケードゲーム・コレクション。",
        play_game: "ゲームをプレイ",
        view_details: "詳細を見る",
        video_label_concept: "コンセプト映像",
        video_label_gameplay: "プレイ映像",
        pwa_install_btn: "インストール",
        pwa_install_msg: "Arcade Hub をアプリとして追加しますか？",
        footer_copy: "&copy; 2026 Takahide Kohata. All rights reserved."
    },
    en: {
        portal_title: "Arcade Hub",
        portal_desc: "A collection of premium arcade games developed for the ultimate fun experience.",
        play_game: "Play Game",
        view_details: "View Details",
        video_label_concept: "Concept",
        video_label_gameplay: "Gameplay",
        pwa_install_btn: "Install",
        pwa_install_msg: "Do you want to add Arcade Hub as an app?",
        footer_copy: "&copy; 2026 Takahide Kohata. All rights reserved."
    }
};

// Game data is now loaded from ALL_GAMES in games.js

function applyTranslations() {
    const lang = localStorage.getItem('arcade_hub_lang') || 'ja';
    const dict = translations[lang] || translations['ja'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.innerHTML = dict[key];
        }
    });

    renderGames(); // Build game grid dynamically

    // Update active button
    document.getElementById('lang-ja').classList.toggle('active', lang === 'ja');
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
}

function renderGames() {
    const lang = localStorage.getItem('arcade_hub_lang') || 'ja';
    const dict = translations[lang] || translations['ja'];
    const grid = document.getElementById('game-grid');
    if (!grid) return;

    const filteredGames = ALL_GAMES.filter(game => game[lang]);

    grid.innerHTML = filteredGames.map((game, index) => {
        const info = game[lang];
        return `
            <div class="game-card" data-game="${game.id}" style="opacity:0; transform:translateY(30px)">
                <div class="card-img-container">
                    <img src="${game.image || ''}" alt="${info.title}" class="preview-img" ${!game.image ? 'style="display:none"' : ''}>
                    ${game.movie ? `<video src="${game.movie}" muted loop class="preview-video"></video>` : ''}
                    ${!game.image && !game.movie ? '<div class="w-full h-full bg-slate-800 flex items-center justify-center text-4xl">🎮</div>' : ''}
                </div>
                <div class="card-content">
                    <h2>${info.title}</h2>
                    <p>${info.description}</p>
                </div>
                <div class="card-footer">
                    <span class="play-badge">${dict.view_details}</span>
                </div>
            </div>
        `;
    }).join('');

    // Attach interactions to newly created cards
    const cards = grid.querySelectorAll('.game-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 80 * (index + 1));

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });

        card.addEventListener('mouseenter', () => {
            const video = card.querySelector('.preview-video');
            if (video) video.play().catch(e => console.log("Video play failed:", e));
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
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
}

function openModal(id) {
    const lang = localStorage.getItem('arcade_hub_lang') || 'ja';
    const dict = translations[lang];
    const game = ALL_GAMES.find(g => g.id === id);
    if (!game) return;

    const info = game[lang] || game['ja'];

    document.getElementById('modal-title').innerText = info.title;
    document.getElementById('modal-description').innerText = info.description;
    document.getElementById('modal-play-link').href = game.link;

    document.getElementById('label-video-1').innerText = dict.video_label_concept;
    document.getElementById('label-video-2').innerText = dict.video_label_gameplay;

    const modalVideo = document.getElementById('modal-video');
    const modalVideo2 = document.getElementById('modal-video-2');
    const videoWrapper2 = document.getElementById('video-wrapper-2');
    const modalImagePlaceholder = document.getElementById('modal-image-placeholder');
    const modalImage = document.getElementById('modal-image');
    const labelVideo1 = document.getElementById('label-video-1');

    // Reset display
    modalVideo.parentElement.classList.add('hidden');
    videoWrapper2.classList.add('hidden');
    modalImagePlaceholder.classList.add('hidden');

    if (game.movie_cg || game.movie) {
        modalVideo.parentElement.classList.remove('hidden');
        modalVideo.src = game.movie_cg || game.movie;

        if (game.movie_cg && game.movie) {
            // Both concept and gameplay exist
            modalVideo.loop = false;
            modalVideo2.src = game.movie;
            labelVideo1.classList.remove('hidden');

            modalVideo.onended = () => {
                document.getElementById('video-wrapper-1').classList.add('hidden');
                videoWrapper2.classList.remove('hidden');
                modalVideo2.play().catch(e => console.log("Modal video 2 play failed:", e));
            };
        } else {
            // Only one video
            modalVideo.loop = true;
            modalVideo.onended = null;
            labelVideo1.classList.add('hidden');
        }

        modalVideo.play().catch(e => console.log("Modal video play failed:", e));
    } else if (game.image) {
        modalVideo.src = "";
        modalImage.src = game.image;
        modalImagePlaceholder.classList.remove('hidden');
    }

    document.getElementById('details-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('details-modal');
    const modalVideo = document.getElementById('modal-video');
    const modalVideo2 = document.getElementById('modal-video-2');
    modal.classList.add('hidden');
    modalVideo.pause();
    modalVideo.src = "";
    modalVideo.onended = null;
    modalVideo2.pause();
    modalVideo2.src = "";
    document.body.style.overflow = '';
}

function setLanguage(lang) {
    localStorage.setItem('arcade_hub_lang', lang);
    applyTranslations();
}

// Basic interactions for the portal page
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    // Dynamic cards are handled within applyTranslations -> renderGames

    // Modal logic
    const modal = document.getElementById('details-modal');
    const closeBtn = modal.querySelector('.close-btn');

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
