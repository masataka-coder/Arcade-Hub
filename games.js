const ALL_GAMES = [
    {
        id: "block",
        ja: {
            title: "ブロック崩し",
            description: "モダンなアレンジを加えたクラシックなアクション。ブロックを壊して強力なアビリティを解放しよう。"
        },
        en: {
            title: "Block Breaker",
            description: "Classic arcade action with a modern twist. Break through layers of blocks and unlock powerful abilities."
        },
        image: "assets/thumbnails/block.png",
        movie: "assets/movies/block.mp4",
        movie_cg: null,
        link: "games/block/index.html"
    },
    {
        id: "tank",
        ja: {
            title: "タンク・ウォーズ",
            description: "戦略的な戦車戦。兵器をアップグレードし、新技術を研究して戦場を支配しよう。"
        },
        en: {
            title: "Tank Wars",
            description: "Strategic tank combat. Upgrade your arsenal, research new tech, and dominate the battlefield."
        },
        image: "assets/thumbnails/tank.png",
        movie: "assets/movies/tank.mp4",
        movie_cg: "assets/movies/tank-cg.mp4",
        link: "games/tank/index.html"
    },
    {
        id: "tower",
        ja: {
            title: "タワーディフェンス",
            description: "マルチステージの戦略的チャレンジ。高度なタワーを研究し、無限のウェーブを生き残れ。"
        },
        en: {
            title: "Tower Defense",
            description: "Protect your base in this multi-stage strategic challenge. Research advanced towers and survive infinite waves."
        },
        image: "assets/thumbnails/tower.png",
        movie: "assets/movies/tower.mp4",
        movie_cg: null,
        link: "games/tower/index.html"
    },
    {
        id: "neon",
        ja: {
            title: "ネオン・ストライク",
            description: "究極のネオン・シューティング体験。新技術を駆使して迫りくる敵と巨大なボスを撃破せよ。ショップで機体を強化し、ハイスコアを目指せ。"
        },
        en: {
            title: "Neon Strike",
            description: "The ultimate neon shooting experience. Use advanced technology to defeat waves of enemies and giant bosses. Upgrade your ship in the shop and aim for the high score."
        },
        image: "assets/thumbnails/neon.png",
        movie: "assets/movies/neon.mp4",
        movie_cg: "assets/movies/neon-cg.mp4",
        link: "games/neon/index.html"
    },
    {
        id: "cafe",
        ja: {
            title: "ハッピーカフェ・オーナー",
            description: "農園経営からM&A、恐竜＆サイバーパンクタイムトラベルまで！至高の店舗経営シミュレーション。"
        },
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' style='background:%230f172a'><text x='50%25' y='50%25' fill='%23fff' font-size='48' font-family='sans-serif' text-anchor='middle' dominant-baseline='middle'>☕ Happy Cafe</text></svg>",
        movie: null,
        movie_cg: null,
        link: "games/cafe/index.html"
    },
    {
        id: "village",
        ja: {
            title: "村の調和：エボリューション",
            description: "資源を集め、村を発展させ、襲来する敵から村を守り抜こう。交易所や遠征を活用して村をレベルアップ！"
        },
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' style='background:%230f172a'><text x='50%25' y='50%25' fill='%23fff' font-size='48' font-family='sans-serif' text-anchor='middle' dominant-baseline='middle'>🏕️ Village</text></svg>",
        movie: null,
        movie_cg: "assets/movies/village-cg.mp4",
        link: "games/village/index.html"
    },
    {
        id: "golf",
        ja: {
            title: "惑星軌道ゴルフ",
            description: "宇宙の重力を操り、ホールインワンを目指せ！惑星の引力を計算し、美しく神秘的な宇宙空間を駆け抜けよう。"
        },
        en: {
            title: "Orbital Golf",
            description: "Master the gravity of space and aim for a hole-in-one! Calculate planetary pull and soar through a beautiful, mysterious cosmos."
        },
        image: "assets/thumbnails/golf.png",
        movie: null,
        movie_cg: "assets/movies/golf-cg.mp4",
        link: "games/golf/index.html"
    },
    {
        id:"color",
        ja:{
            title:"ネオン流体錬金術",
            description:"3色のインクを注いで混ぜ合わせ、目的の色を作り出そう。1滴が成功を左右する。"
        },
        en:{
            title:"Neon Fluid Alchemy",
            description:"Pour and mix three ink colors to create your desired color. Every drop counts."
        },
        image:"assets/thumbnails/color.png",
        movie:"assets/movies/color.mp4",
        movie_cg:"assets/movies/color-cg.mp4",
        link:"games/color/index.html"
    }
];