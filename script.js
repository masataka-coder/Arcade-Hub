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
        play_game: "プレイする",
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
        footer_copy: "&copy; 2026 Takahide Kohata. All rights reserved."
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
    // ... rest of the code

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

    // Tilt effect logic (optional but adds premium feel)
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

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
});
