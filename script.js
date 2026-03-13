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
        footer_copy: "&copy; 2026 Takahide Kohata. All rights reserved.",
        tag_all: "すべて",
        tag_action: "アクション",
        tag_puzzle: "パズル",
        tag_strategy: "ストラテジー",
        tag_simulation: "シミュレーション",
        tag_shooter: "シューティング",
        tag_simulation: "シミュレーション",
        tag_shooter: "シューティング",
        tag_casual: "カジュアル",
        tag_exploration: "探索",
        tag_favorites: "★ お気に入り",
        tag_funny: "バカゲー",
        clear_cache_title: "キャッシュを削除して再読み込み"
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
        footer_copy: "&copy; 2026 Takahide Kohata. All rights reserved.",
        tag_all: "All",
        tag_action: "Action",
        tag_puzzle: "Puzzle",
        tag_strategy: "Strategy",
        tag_simulation: "Simulation",
        tag_shooter: "Shooter",
        tag_simulation: "Simulation",
        tag_shooter: "Shooter",
        tag_casual: "Casual",
        tag_exploration: "Exploration",
        tag_favorites: "★ Favorites",
        tag_funny: "Funny",
        clear_cache_title: "Clear Cache & Reload"
    }
};

let activeFilter = 'all';
const AVAILABLE_TAGS = ['all', 'favorites', 'action', 'puzzle', 'strategy', 'simulation', 'shooter', 'casual', 'exploration', 'funny'];
let currentFeaturedGameId = null;

function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem('arcade_hub_favorites')) || [];
    } catch {
        return [];
    }
}

function toggleFavorite(id, event) {
    if (event) event.stopPropagation();
    let favs = getFavorites();
    if (favs.includes(id)) {
        favs = favs.filter(f => f !== id);
    } else {
        favs.push(id);
    }
    localStorage.setItem('arcade_hub_favorites', JSON.stringify(favs));
    renderGames();
}

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

    const clearBtn = document.getElementById('btn-clear-cache');
    if (clearBtn) {
        clearBtn.title = dict.clear_cache_title;
    }

    renderFilters();
    renderGames(); // Build game grid dynamically

    // Update active button
    document.getElementById('lang-ja').classList.toggle('active', lang === 'ja');
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
}

function renderFilters() {
    const lang = localStorage.getItem('arcade_hub_lang') || 'ja';
    const dict = translations[lang] || translations['ja'];
    const filterBar = document.getElementById('filter-bar');
    if (!filterBar) return;

    filterBar.innerHTML = AVAILABLE_TAGS.map(tag => {
        const label = dict['tag_' + tag] || tag;
        return `<button class="filter-btn ${activeFilter === tag ? 'active' : ''}" onclick="setFilter('${tag}')">${label}</button>`;
    }).join('');
}

function setFilter(tag) {
    activeFilter = tag;
    currentFeaturedGameId = null;
    renderFilters();
    renderGames();
}

function renderGames() {
    const lang = localStorage.getItem('arcade_hub_lang') || 'ja';
    const dict = translations[lang] || translations['ja'];
    const grid = document.getElementById('game-grid');
    if (!grid) return;

    const listGames = ALL_GAMES.filter(game => game[lang]);

    let filteredGames = listGames;
    const favorites = getFavorites();

    if (activeFilter === 'favorites') {
        filteredGames = filteredGames.filter(game => favorites.includes(game.id));
    } else if (activeFilter !== 'all') {
        filteredGames = filteredGames.filter(game => game.tags && game.tags.includes(activeFilter));
    }

    if (filteredGames.length === 0) {
        grid.innerHTML = `<p style="text-align: center; grid-column: 1/-1; color: var(--text-secondary); padding: 40px;">${lang === 'ja' ? '該当するゲームがありません。' : 'No games found.'}</p>`;
        return;
    }

    if (!currentFeaturedGameId || !filteredGames.some(g => g.id === currentFeaturedGameId)) {
        const randomIndex = Math.floor(Math.random() * filteredGames.length);
        currentFeaturedGameId = filteredGames[randomIndex].id;
    }

    const featuredGame = filteredGames.find(g => g.id === currentFeaturedGameId);
    const otherGames = filteredGames.filter(g => g.id !== currentFeaturedGameId);

    function createCardHtml(game, isFeatured) {
        const info = game[lang];
        const tagsHtml = game.tags ? game.tags.map(t => `<span class="game-tag">${dict['tag_' + t] || t}</span>`).join('') : '';
        const isFav = favorites.includes(game.id);
        const classes = `game-card ${isFeatured ? 'featured' : ''}`;

        return `
            <div class="${classes}" data-game="${game.id}" style="opacity:0; transform:translateY(30px)">
                <div class="card-img-container">
                    <button class="favorite-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite('${game.id}', event)" title="Toggle Favorite">
                        <svg viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </button>
                    <img src="${game.image || ''}" alt="${info.title}" class="preview-img" ${!game.image ? 'style="display:none"' : ''}>
                    ${game.movie_cg || game.movie ? `<video src="${game.movie_cg || game.movie}" muted playsinline class="preview-video" data-cg="${game.movie_cg || ''}" data-movie="${game.movie || ''}"></video>` : ''}
                    ${!game.image && !game.movie && !game.movie_cg ? '<div class="w-full h-full bg-slate-800 flex items-center justify-center text-4xl">🎮</div>' : ''}
                </div>
                <div class="card-content">
                    <div class="card-tags">${tagsHtml}</div>
                    <h2>${info.title}</h2>
                    <p>${info.description}</p>
                    ${game.copyright ? `<small style="color: #94a3b8; display: block; margin-top: 8px;">${game.copyright}</small>` : ''}
                </div>
                <div class="card-footer">
                    <span class="play-badge">${dict.view_details}</span>
                </div>
            </div>
        `;
    }

    let html = '';
    if (featuredGame) html += createCardHtml(featuredGame, true);
    html += otherGames.map(game => createCardHtml(game, false)).join('');

    grid.innerHTML = html;

    // Attach interactions to newly created cards
    const cards = grid.querySelectorAll('.game-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 80 * (index + 1));

        card.addEventListener('mousemove', (e) => {
            if (card.classList.contains('featured')) return;
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
            if (video) {
                const cg = video.getAttribute('data-cg');
                const mv = video.getAttribute('data-movie');

                if (cg && mv) {
                    if (!video.src.includes(cg)) {
                        video.src = cg;
                    }
                    video.loop = false;
                    video.onended = () => {
                        video.src = mv;
                        video.loop = true;
                        const playPromise = video.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(e => console.log("Gameplay video play failed:", e));
                        }
                    };
                } else {
                    video.loop = true;
                    video.onended = null;
                }

                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => console.log("Video play failed:", e));
                }
            }
        });

        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('featured')) {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            }
            const video = card.querySelector('.preview-video');
            if (video) {
                video.pause();
                video.onended = null;
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
    if (game.copyright) {
        document.getElementById('modal-description').innerHTML += `<br><br><small style="color: #94a3b8;">${game.copyright}</small>`;
    }
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

async function clearCacheAndReload() {
    try {
        // Clear all Service Worker caches
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));

        // Unregister service workers
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (let registration of registrations) {
                await registration.unregister();
            }
        }

        // Reload
        window.location.reload(true);
    } catch (err) {
        console.error('Failed to clear cache', err);
        // Fallback reload
        window.location.reload(true);
    }
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

    // iOS Safari detection
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator.standalone) || window.matchMedia('(display-mode: standalone)').matches;

    if (isIos && !isInStandaloneMode) {
        // Show PWA install instruction for iOS
        const lang = localStorage.getItem('arcade_hub_lang') || 'ja';
        const msgSpan = installToast.querySelector('span');
        msgSpan.innerHTML = lang === 'ja'
            ? "アプリとしてインストールするには、ブラウザの[共有]メニューから「ホーム画面に追加」を選択してください。"
            : "To install as an app, tap the Share menu and select 'Add to Home Screen'.";
        installBtn.style.display = 'none';
        installToast.classList.remove('hidden');
    }

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
