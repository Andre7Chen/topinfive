/* ============================================================
   五女一 FIVE GIRLS ONE — 数据层
   数据快照：2026-11-18
   所有数值均可在页脚「数据来源」中回溯
   ============================================================ */
window.DATA = (() => {
  const GROUPS = {
    ive: {
      id: 'ive', name: 'IVE', ko: '아이브', zh: 'IVE',
      color: '#FF2D7E', color2: '#FFB3D1', glow: '255,45,126',
      agency: 'Starship', debut: '2021.12.01', fandom: 'DIVE',
      members: 6,
      tagline: '自恋也可以是一种天赋',
      intro: '六人六色，把「我喜欢我自己」唱成一种时代情绪。出道首周即创下当年女团出道销量纪录，此后几乎每次回归都能贡献一个爆款动词。',
      facts: ['出道曲《ELEVEN》首周 15.2 万张', 'MMA2022 首夺年度歌曲大赏', 'MMA2026 五冠（含年度歌曲）']
    },
    aespa: {
      id: 'aespa', name: 'aespa', ko: '에스파', zh: 'aespa',
      color: '#35E0FF', color2: '#B9F4FF', glow: '53,224,255',
      agency: 'SM', debut: '2020.11.17', fandom: 'MY',
      members: 4,
      tagline: '赛博世界观，实体级统治力',
      intro: '把「虚拟分身」写进 K-pop 语法的一代。四个人，四种截然不同的声线，却共用一套冷冽的未来感。',
      facts: ['《Next Level》开启现象级翻唱潮', 'MAMA2024 六冠（含年度歌曲）', 'MMA2026 新设大赏「全球 K 艺人」']
    },
    idle: {
      id: 'idle', name: 'i-dle', ko: '아이들', zh: '(G)I-DLE',
      color: '#E01B3C', color2: '#FF8A9B', glow: '224,27,60',
      agency: 'Cube', debut: '2018.05.02', fandom: 'NEVERLAND',
      members: 5,
      tagline: '自己写歌的女团，不需要别人定义',
      intro: '从《LATATA》到《TOMBOY》，她们把「自制作」变成最锋利的标签。2025 年摘掉 (G)，2026 年站上 LoL 世界赛开幕式。',
      facts: ['全员参与作词作曲的自主制作团', '《TOMBOY》《Queencard》两次现象级逆袭', '2026 年 K/DA 时隔八年重返世界赛舞台']
    },
    lsf: {
      id: 'lsf', name: 'LE SSERAFIM', ko: '르세라핌', zh: 'LE SSERAFIM',
      color: '#7FB2FF', color2: '#E4F0FF', glow: '127,178,255',
      agency: 'HYBE / Source Music', debut: '2022.05.02', fandom: 'FEARNOT',
      members: 5,
      tagline: '承认恐惧，然后往前走',
      intro: '名字是「无所畏惧」的回文，作品却一直在讲「我很怕，但还是上了台」。这种诚实，是她们最贵的资产。',
      facts: ['连续四张专辑进入 Billboard 200 前十', '2025 年东京巨蛋收官首次巡演', '2026 年 BlizzCon 闭幕压轴']
    },
    nj: {
      id: 'nj', name: 'NewJeans', ko: '뉴진스', zh: 'NewJeans',
      color: '#4FE0A8', color2: '#C9FFE9', glow: '79,224,168',
      agency: 'ADOR', debut: '2022.07.22', fandom: 'Bunnies',
      members: 4,
      tagline: '没有预告，直接降临',
      intro: '用「不宣传的出道」重写了 K-pop 的营销教科书。2024 年后的合约风波让团体长期停摆，2026 年以四人制回归视野。',
      facts: ['出道零预告，MV 空降', '《Ditto》拿下 2023 MAMA 年度歌曲', '2025.12 Danielle 离团，2026.07 四人重启']
    }
  };

  // commerce: 代言/大使加权（全球 3 / 区域 2 / 单品·杂志 1）
  // works: 2026 年个人产出计数（solo、OST、影视、制作、综艺、主持）
  const MEMBERS = [
    // ---------- IVE ----------
    {
      id: 'wy', group: 'ive', name: '张元英', ko: '장원영', en: 'Jang Wonyoung',
      pos: '中心 · 门面', tags: ['视觉中心', 'Lucky Vicky', '直拍女王'],
      ig: 16.452, brand: 2, brandPrev: 2,
      commerce: 7, commerceNote: 'UGG 全球代言 · Dr.Althea · 时尚封面',
      works: 4, worksNote: '正规二辑 SOLO 曲《8》· AAA 六连 MC · 歌谣大祭典 MC',
      blurb: '站在「五女一」讨论正中央的人。机场照可以直接当杂志内页，生图比精修还稳。',
      fun: { t: '修图软件失业奖', n: '生图比精修还好看，站姐的 Photoshop 白买了。' }
    },
    {
      id: 'yj', group: 'ive', name: '安유진', ko: '안유진', en: 'An Yujin',
      pos: '队长 · 主唱', tags: ['清澈狂人', '综艺体质', '国民队长'],
      ig: 8.508, brand: 10, brandPrev: 2,
      commerce: 2, commerceNote: '长期品牌合作（保守计）',
      works: 3, worksNote: 'tvN《宇宙糕饼店》固定 · 歌谣大祭典 MC',
      blurb: '队长的活儿她全干，综艺的梗她全接。眼神清澈，但胜负欲写在骨头上。',
      fun: { t: '最想让她当班长奖', n: '站在那儿就自带校规，全班自动安静。' }
    },
    {
      id: 'rei', group: 'ive', name: '直井怜', ko: '레이', en: 'Rei',
      pos: 'Rapper · 日本', tags: ['模仿天才', '关西腔', '气氛担当'],
      ig: 4.706, brand: 29, brandPrev: 2,
      commerce: 2, commerceNote: '日本市场活动（保守计）',
      works: 3, worksNote: '首支 OST《너에게 다이브》· 网综《跟着做 Rei》单独 MC',
      blurb: '一个人能演完整个团。日本综艺感 + 关西腔，是 IVE 的隐藏笑点开关。',
      fun: { t: '最强模仿奖', n: '她能一个人演完整个团，包括经纪人。' }
    },
    {
      id: 'liz', group: 'ive', name: '金志垣', ko: '리즈', en: 'Liz',
      pos: '主唱', tags: ['天籁主唱', '反转音色', 'OST 收割'],
      ig: 4.355, brand: 19, brandPrev: 0,
      commerce: 2, commerceNote: 'Tony Moly 模特',
      works: 2, worksNote: 'OST《터널》· 广告曲',
      blurb: '开口那一刻，很多人会以为是音源没关。IVE 的「耳机里藏了音响」担当。',
      fun: { t: '耳机里藏了音响奖', n: '一开麦，全场以为是音源没关。' }
    },
    {
      id: 'ls', group: 'ive', name: '李瑞', ko: '이서', en: 'Leeseo',
      pos: '忙内 · 副唱', tags: ['表情管理', '忙内', '成长最快'],
      ig: 2.989, brand: null, brandPrev: 0,
      commerce: 1, commerceNote: '品牌活动（保守计）',
      works: 2, worksNote: '《人气歌谣 Live in Tokyo》MC',
      blurb: '队里最小的那个，却是舞台表情管理最狠的那个。三年直拍找不到一张崩图。',
      fun: { t: '表情管理特种兵奖', n: '三小时直拍，找不到一张崩图。' }
    },
    {
      id: 'gl', group: 'ive', name: '金秋天', ko: '가을', en: 'Gaeul',
      pos: '主舞 · 大姐', tags: ['冷都女', '反差萌', '宅家派'],
      ig: 2.774, brand: null, brandPrev: 0,
      commerce: 1, commerceNote: '品牌活动（保守计）',
      works: 2, worksNote: 'ENA 纪录片《没能说出口的话》主持',
      blurb: '台上冷到结冰，台下是个宅家追番的人。IVE 最大的反差萌供货商。',
      fun: { t: '反差萌终身成就奖', n: '台上冷都女，台下在家追番，反差大过舞台灯光。' }
    },

    // ---------- aespa ----------
    {
      id: 'kr', group: 'aespa', name: '柳智敏', ko: '카리나', en: 'Karina',
      pos: '队长 · 主舞', tags: ['AI 脸', '人间建模', '五女一候补'],
      ig: 21.841, brand: 5, brandPrev: 2,
      commerce: 7, commerceNote: 'Prada 全球大使 · Chanel Beauty · 杂志封面',
      works: 3, worksNote: 'SOLO《16 Bit》参与作词',
      blurb: '建模师看了都想删工程文件的那种脸。aespa 的视觉锚点，也是「五女一」讨论里绕不开的名字。',
      fun: { t: 'AI 出厂检测合格奖', n: '建模师看了都想删工程文件，太不讲道理。' }
    },
    {
      id: 'wn', group: 'aespa', name: '金旼炡', ko: '윈터', en: 'Winter',
      pos: '主唱', tags: ['冬哥', '短发神话', '音源体质'],
      ig: 13.612, brand: 16, brandPrev: 2,
      commerce: 3, commerceNote: '品牌合作（保守计）',
      works: 3, worksNote: 'SOLO《Saddle Up》· Dingo 项目曲《여름의 속도》',
      blurb: '短发那年，全世界的审美跟着动了一下。声音是 aespa 里最「干净」的那一把。',
      fun: { t: '短发动摇立场奖', n: '剪短发那年，无数人的审美立场当场倒戈。' }
    },
    {
      id: 'nn', group: 'aespa', name: '宁艺卓', ko: '닝닝', en: 'Ningning',
      pos: '忙内 · 主唱', tags: ['中国大主唱', '高音怪物', 'Gucci 女孩'],
      ig: 11.489, brand: null, brandPrev: 2,
      commerce: 5, commerceNote: 'Gucci 全球大使 · 品牌合作',
      works: 3, worksNote: 'SOLO 自作单曲',
      blurb: '用高音把中韩两边的粉丝一起唱服。aespa 的高音天花板，也是中国市场的钥匙。',
      fun: { t: '海豚音外交官奖', n: '一个高音下去，两边的粉丝同时闭麦。' }
    },
    {
      id: 'gs', group: 'aespa', name: '内永枝利', ko: '지젤', en: 'Giselle',
      pos: '主 Rapper', tags: ['语言切换', '东京出身', 'LOEWE'],
      ig: 11.219, brand: null, brandPrev: 1,
      commerce: 4, commerceNote: 'LOEWE 全球大使',
      works: 3, worksNote: 'SOLO《BYEB4HELLO》自作',
      blurb: '日英韩三语自由切换，采访从不需要翻译。aespa 的语速与低音担当。',
      fun: { t: '语言切换器奖', n: '日英韩三语无缝切换，采访现场自带同传。' }
    },

    // ---------- i-dle ----------
    {
      id: 'yq', group: 'idle', name: '宋雨琦', ko: '우기', en: 'Yuqi',
      pos: '副唱 · 综艺', tags: ['综艺体质', '中国顶流', '三奢'],
      ig: 9.227, brand: null, brandPrev: 0,
      commerce: 7, commerceNote: 'Fenty Beauty 大使 · Kiehl\'s 代言 · 三奢合作',
      works: 5, worksNote: 'EP《27》· 中国 5 场 fan-con（约 6 万人）',
      blurb: '镜头一给就敢演，全场笑点归她管。中国市场的绝对门面，也是团里最会接梗的人。',
      fun: { t: '综艺不装死奖', n: '镜头一给就敢演，全场笑点她一个人包了。' }
    },
    {
      id: 'mn', group: 'idle', name: 'Minnie', ko: '민니', en: 'Minnie',
      pos: '主唱 · 作曲', tags: ['氛围感', '泰籍', '深夜电台'],
      ig: 7.534, brand: null, brandPrev: 0,
      commerce: 2, commerceNote: '品牌合作（保守计）',
      works: 4, worksNote: '首张泰语 EP《i love you to the moon and back》',
      blurb: '声音一出来，房间自动变成深夜电台。写歌和唱歌是同一件事的人。',
      fun: { t: '氛围感本人奖', n: '她一开口，房间自动切换成凌晨两点的电台。' }
    },
    {
      id: 'sh', group: 'idle', name: '叶舒华', ko: '슈화', en: 'Shuhua',
      pos: '门面 · 忙内', tags: ['人间玩偶', '直球发言', '电影新人'],
      ig: 5.826, brand: null, brandPrev: 0,
      commerce: 2, commerceNote: '时尚合作（保守计）',
      works: 5, worksNote: '主演电影《Happily Ever After》入围多伦多电影节',
      blurb: '说什么都是名场面，粉丝还得替她兜着。第一次演电影就进了 TIFF。',
      fun: { t: '直球发言豁免权', n: '说什么都是名场面，粉丝负责兜底，她负责可爱。' }
    },
    {
      id: 'my', group: 'idle', name: '曺薇娟', ko: '미연', en: 'Miyeon',
      pos: '门面 · 主唱', tags: ['ending 妖精', 'K/DA', '门面主唱'],
      ig: 5.399, brand: null, brandPrev: 0,
      commerce: 3, commerceNote: 'Prada 2026 SS 广告模特',
      works: 3, worksNote: 'OST《Spring Flower》· LoL 世界赛 K/DA 舞台（Ahri）',
      blurb: '长成那样还唱成那样，确实不太讲道理。八年后再扮 Ahri，是全球玩家的青春回归。',
      fun: { t: '门面主唱双证奖', n: '长成那样还唱成那样，太不讲道理了。' }
    },
    {
      id: 'sy', group: 'idle', name: '田小娟', ko: '소연', en: 'Soyeon',
      pos: '队长 · 制作人', tags: ['版权富翁', '自制作', 'K/DA Akali'],
      ig: 5.090, brand: null, brandPrev: 0,
      commerce: 2, commerceNote: '品牌合作（保守计）',
      works: 8, worksNote: '正规专辑《What a Wonderful Life》· K/DA《Know My Name》· 全专制作',
      blurb: '团里最赚钱的那支笔，握在她自己手里。i-dle 的每一首爆款背后都有她的名字。',
      fun: { t: '版权富翁奖', n: '团里最赚钱的那支笔，握在她自己手里。' }
    },

    // ---------- LE SSERAFIM ----------
    {
      id: 'sk', group: 'lsf', name: '宫脇咲良', ko: '사쿠라', en: 'Sakura Miyawaki',
      pos: '副唱 · 日本', tags: ['三代通关', '游戏宅', 'Maybelline'],
      ig: 10.920, brand: null, brandPrev: 0,
      commerce: 3, commerceNote: 'Maybelline New York 大使',
      works: 2, worksNote: '时尚/游戏跨界活动',
      blurb: '从 AKB48 到 IZ*ONE 再到 LE SSERAFIM，三代粉丝陪她一起长大。',
      fun: { t: '跨代通关奖', n: '三代粉丝陪她长大，她还在通关。' }
    },
    {
      id: 'hu', group: 'lsf', name: '许允真', ko: '허윤진', en: 'Huh Yunjin',
      pos: '主唱 · 自作曲', tags: ['全能', '英文叙事', '创作担当'],
      ig: 9.987, brand: null, brandPrev: 0,
      commerce: 1, commerceNote: '品牌合作（保守计）',
      works: 3, worksNote: '自作曲参与专辑创作',
      blurb: '英文歌词写得比母语者还狠。LE SSERAFIM 的「诚实」大部分由她执笔。',
      fun: { t: '自作曲发言权奖', n: '英文歌词写得比母语者还狠，麦克风就是她的笔。' }
    },
    {
      id: 'cw', group: 'lsf', name: '金采源', ko: '김채원', en: 'Kim Chaewon',
      pos: '队长 · 领唱', tags: ['队长', '舞台掌控', 'IZ*ONE 出身'],
      ig: 9.582, brand: null, brandPrev: 2,
      commerce: 3, commerceNote: 'gelato pique 个人系列 · 全球大使',
      works: 2, worksNote: '参与《CELEBRATION》创作',
      blurb: '舞台一开，全队的心率由她调。2026 年颈伤休养后归队，队长没有一天缺席。',
      fun: { t: '队长兼定心丸奖', n: '她一开口，全队心率自动回到 60。' }
    },
    {
      id: 'kz', group: 'lsf', name: '中村一叶', ko: '카즈하', en: 'Kazuha',
      pos: '副唱 · 视觉', tags: ['芭蕾底子', '清冷', 'Netflix'],
      ig: 7.530, brand: 30, brandPrev: 0,
      commerce: 3, commerceNote: 'gelato pique 个人系列',
      works: 4, worksNote: '首次参与作词《Trust Exercise》· Netflix《大환장 기안장 2》',
      blurb: '一个转身就知道练了十五年芭蕾。清冷是她的保护色，不是人设。',
      fun: { t: '芭蕾底子藏不住奖', n: '一个转身，十五年的功架全露馅了。' }
    },
    {
      id: 'ec', group: 'lsf', name: '洪恩采', ko: '홍은채', en: 'Hong Eunchae',
      pos: '忙内 · MC', tags: ['忙内 MC', '综艺新星', '团宠'],
      ig: 6.228, brand: null, brandPrev: 0,
      commerce: 1, commerceNote: '品牌合作（保守计）',
      works: 3, worksNote: '《Eunchae\'s Star Diary》重启主持',
      blurb: '采访前辈时手心冒汗，观众都替她捏一把——然后她每次都稳住了。',
      fun: { t: '忙内 MC 天花板奖', n: '采访前辈手都在抖，但每次都能稳住全场。' }
    },

    // ---------- NewJeans ----------
    {
      id: 'mj', group: 'nj', name: '金玟池', ko: '민지', en: 'Minji',
      pos: '队长 · 门面', tags: ['国民初恋', 'Chanel', '演员脸'],
      ig: null, brand: null, brandPrev: 0,
      commerce: 4, commerceNote: 'Chanel 韩国大使（时装/美妆/腕表）',
      works: 1, worksNote: '团体停摆期，无个人发行',
      blurb: '什么都没做，只是站着，就像一张电影海报。NewJeans 的定海神针。',
      fun: { t: '国民初恋预备役奖', n: '只是站着，就像一张还没上映的电影海报。' }
    },
    {
      id: 'hn', group: 'nj', name: 'Hanni', ko: '하니', en: 'Hanni',
      pos: '主唱 · 舞蹈', tags: ['Gucci 女孩', '越南裔', '综艺感'],
      ig: null, brand: null, brandPrev: 0,
      commerce: 5, commerceNote: 'Gucci 全球大使 · Armani Beauty',
      works: 1, worksNote: '团体停摆期，无个人发行',
      blurb: '澳洲腔韩语、越南血统、韩国出道——谁的青春都能在她身上对上号。',
      fun: { t: '全球朋友圈奖', n: '澳洲腔、越南血统、韩国出道，谁的青春都能对上号。' }
    },
    {
      id: 'hr', group: 'nj', name: 'Haerin', ko: '해린', en: 'Haerin',
      pos: '主唱 · 视觉', tags: ['猫系颜', 'Dior 全球', '反差'],
      ig: null, brand: null, brandPrev: 0,
      commerce: 4, commerceNote: 'Dior 时装全球大使',
      works: 1, worksNote: '团体停摆期，无个人发行',
      blurb: '眼睛一抬，人类自动变成铲屎官。四个人里最安静、也最抓眼的那一个。',
      fun: { t: '猫系权威认证奖', n: '她眼睛一抬，人类自动开始当铲屎官。' }
    },
    {
      id: 'hy', group: 'nj', name: 'Hyein', ko: '혜인', en: 'Hyein',
      pos: '忙内 · 主唱', tags: ['超模忙内', 'Louis Vuitton', '身高怪物'],
      ig: null, brand: null, brandPrev: 0,
      commerce: 4, commerceNote: 'Louis Vuitton 全球大使',
      works: 1, worksNote: '团体停摆期，无个人发行',
      blurb: '十四岁走秀，二十岁还在长个儿。老天爷追着喂饭的典型样本。',
      fun: { t: '超模提前上岗奖', n: '十四岁走秀，二十岁还在长个儿，老天爷追着喂饭。' }
    }
  ];

  const SONGS = {
    ive: [
      { t: 'ELEVEN', y: 2021, d: '出道曲，把「自恋」唱成了宣言' },
      { t: 'LOVE DIVE', y: 2022, d: '爆红曲，MMA2022 年度歌曲' },
      { t: 'After LIKE', y: 2022, d: '采样名曲的二次生命' },
      { t: 'I AM', y: 2023, d: '正规一的自我宣言' },
      { t: 'BANG BANG', y: 2026, d: 'PAK 逆袭，2026 的翻身仗' }
    ],
    aespa: [
      { t: 'Black Mamba', y: 2020, d: '出道曲，世界观开场' },
      { t: 'Next Level', y: 2021, d: '现象级爆红，全民翻唱' },
      { t: 'Savage', y: 2021, d: '虚拟分身叙事的高峰' },
      { t: 'Supernova', y: 2024, d: 'MAMA2024 年度歌曲' },
      { t: 'LEMONADE', y: 2026, d: '「酸味」转型，正规二' }
    ],
    idle: [
      { t: 'LATATA', y: 2018, d: '出道曲，热带节奏' },
      { t: 'TOMBOY', y: 2022, d: '摇滚式自嘲，逆袭原点' },
      { t: 'Nxde', y: 2022, d: '卡巴莱与双关，概念巅峰' },
      { t: 'Queencard', y: 2023, d: '最大众的一次爆款' },
      { t: 'Fate', y: 2024, d: '长红逆袭曲' }
    ],
    lsf: [
      { t: 'FEARLESS', y: 2022, d: '出道宣言' },
      { t: 'ANTIFRAGILE', y: 2022, d: '爆红曲，全球挑战赛' },
      { t: 'UNFORGIVEN', y: 2023, d: '首张正规，Nile Rodgers 吉他' },
      { t: 'EASY', y: 2024, d: '转向「承认恐惧」' },
      { t: 'SPAGHETTI', y: 2025, d: 'feat. j-hope，风格外扩' }
    ],
    nj: [
      { t: 'Attention', y: 2022, d: '零预告出道的出道曲' },
      { t: 'Hype Boy', y: 2022, d: '传唱度最高的一首' },
      { t: 'Ditto', y: 2022, d: '2023 MAMA 年度歌曲' },
      { t: 'Super Shy', y: 2023, d: '全球短视频爆款' },
      { t: 'How Sweet', y: 2024, d: '五人时期的最后一张韩国作品' }
    ]
  };

  const TIMELINE = {
    ive: [
      ['2021.12', '以《ELEVEN》出道，首周 15.2 万张，创当年女团出道纪录'],
      ['2022.04', '《LOVE DIVE》爆红，成为四代代表曲'],
      ['2022.11', 'MMA2022 首夺年度歌曲大赏'],
      ['2023.04', '正规一《I\'ve IVE》+《I AM》，首个百万销量'],
      ['2024.04', '《IVE SWITCH》+《HEYA》，风格转向'],
      ['2025.08', '《IVE SECRET》+《XOXZ》，二巡开幕'],
      ['2026.02', '《BANG BANG》先行 PAK；正规二《REVIVE+》，六人各一首 SOLO'],
      ['2026.10', '《Looks Can Kill》，Hanteo 首周 63.8 万'],
      ['2026.11', 'MMA2026 五冠，含年度歌曲']
    ],
    aespa: [
      ['2020.11', '以《Black Mamba》出道，虚拟世界观登场'],
      ['2021.05', '《Next Level》现象级爆红'],
      ['2021.10', '《Savage》首张百万销量'],
      ['2023.05', '《MY WORLD》+《Spicy》，大众化转折'],
      ['2024.05', '正规一《Armageddon》+《Supernova》'],
      ['2024.11', 'MAMA2024 六冠，含年度歌曲'],
      ['2025.09', '《Rich Man》，世界观收束'],
      ['2026.05', '正规二《LEMONADE》，先行《WDA》feat. G-Dragon'],
      ['2026.09', '四人 SOLO 单曲《SYNK : COMPLæXITY》'],
      ['2026.11', 'MMA2026 夺新设大赏「全球 K 艺人」']
    ],
    idle: [
      ['2018.05', '以《LATATA》六人出道'],
      ['2019', '《Senorita》《Uh-Oh》，金唱片新人奖'],
      ['2020.08', '《DumDi DumDi》，夏日爆款'],
      ['2021.08', '穗珍退团，转为五人制'],
      ['2022.03', '《TOMBOY》音源逆袭，第二次出道'],
      ['2023.05', '《Queencard》大众爆款'],
      ['2024.12', '全员续约，队名去掉 (G) 的前奏'],
      ['2025.05', '改名 i-dle，《We are》'],
      ['2026.07', '迷你九《We made》；首次登上 Lollapalooza 芝加哥主舞台'],
      ['2026.11', 'K/DA 时隔八年重返 LoL 世界赛开幕式']
    ],
    lsf: [
      ['2022.05', '以《FEARLESS》出道'],
      ['2022.07', 'Garam 退团，五人制确立'],
      ['2022.10', '《ANTIFRAGILE》爆红'],
      ['2023.05', '正规一《UNFORGIVEN》'],
      ['2024.04', 'Coachella 舞台与唱功争议'],
      ['2025.03', '《HOT》进入 Billboard 200 第 9，连续四张前十'],
      ['2025.11', '东京巨蛋收官首次巡演'],
      ['2026.05', '正规二《PUREFLOW pt.1》+《BOOMPALA》'],
      ['2026.08', 'KWDA 三冠'],
      ['2026.09', '单曲二《Made My Night》，BlizzCon 闭幕压轴']
    ],
    nj: [
      ['2022.07', '《Attention》零预告出道，MV 空降'],
      ['2022.12', '《Ditto》先行，冬季怀旧美学'],
      ['2023.07', '《Super Shy》+ 二辑《Get Up》，三主打'],
      ['2024.05', '《How Sweet》，风格成熟化'],
      ['2024.06', '日本出道《Supernatural》，东京巨蛋粉丝会'],
      ['2024.11', '记者会宣布解约，与 ADOR 决裂'],
      ['2025.10', '一审判合约有效至 2029'],
      ['2025.12', 'Danielle 被通知解约，诉讼开启'],
      ['2026.07', '四人视频《2026 Summer of NewJeans》，宣告重启'],
      ['2026.11', '仍无新歌发行，活动待定']
    ]
  };

  const SOURCES = [
    ['한국기업평판연구소 걸그룹 개인 브랜드평판 2026년 11월', 'https://www.gpkorea.com/news/articleView.html?idxno=148622', '品牌声誉排名与指数'],
    ['한국기업평판연구소 2026년 6월 · 7월 순위', 'https://m.newsen.com/news_view.php?uid=202606210856331910&r=1', '历史入榜次数（估算用）'],
    ['Wikimedia Pageviews API（en/ko，2025.11–2026.11）', 'https://wikimedia.org/api/rest_v1/', '公共关注度：12 个月浏览量'],
    ['KPOP 데이터기 Instagram 팔로워 순위（2026-11-18）', 'https://www.snskpop.com/ig_ranking.php?type=female_artist&ranking=followers&period=daily', '个人 Instagram 粉丝数'],
    ['toretame LE SSERAFIM 人気順（2026-11-11）', 'https://toretame.jp/le-sserafim-member-popularity-ranking/', 'IG 数据交叉核对'],
    ['dramee / danmee 各团 2026 年活动报道', 'https://danmee.jp/knews/k-pop/brikorea-girlsmember2611/', '代言、SOLO、颁奖礼'],
    ['Joynews24 · i-dle K/DA 世界赛报道（2026-11-15）', 'https://m.joynews24.com/v/2026392', 'i-dle 2026 活动'],
    ['Seoul Shinmun · NewJeans 4 人制报道（2026-07-23）', 'https://amp.seoul.co.kr/news/peoples/2026/07/23/20260723023005', 'NewJeans 阵容变动'],
    ['MBC enews · IVE 正规二辑（2026-02-23）', 'https://m.imbc.com/enews/view/495667', 'IVE 2026 回归']
  ];

  const METHOD = [
    {
      key: 'brand', name: '韩国国内声量', w: 30, unit: '品牌声誉指数排名',
      desc: '韩国企业评判研究所每月对 740 名女团成员做品牌大数据分析，输出「参与/媒体/沟通/社区」四项指数。这是目前唯一覆盖全行业的月度个人榜，也是韩国广告主实际在看的榜。',
      why: '它同时衡量「被讨论」和「被喜欢」，比单纯粉丝数更接近「国民度」。缺点是月度波动大。',
      note: '未进前 30 名者按基线 42 分计；若在过去月份进入过前 30，每出现一次 +3（上限 +9）。'
    },
    {
      key: 'attention', name: '公共关注度', w: 20, unit: '英文维基百科 12 个月浏览量',
      desc: '取每人英文维基百科条目 2025.11–2026.11 的月度浏览量总和。这是学术界研究「公共注意力」时最常用的公开代理指标。',
      why: '它记录的是「非粉丝也会去查她」的行为——搜索热度、新闻事件、路人好奇，都会体现在这里。',
      note: '只用英文版：各语言版本条目覆盖率差异极大，混用会制造偏差；韩文热度已由「品牌声誉」维度覆盖。'
    },
    {
      key: 'fandom', name: '粉丝规模', w: 25, unit: '个人 Instagram 粉丝数',
      desc: '取 2026-11-18 的个人 IG 粉丝数，取对数后归一化，避免头部数字吃掉全部差异。',
      why: '粉丝数是「存量」而非「增量」，对老团有天然优势，所以做对数压缩，并与其他维度交叉。',
      note: 'NewJeans 四人无个人 IG（团体账号 1283 万），此维度缺省，权重自动分配给其余四项，页面上标注为「缺省」。'
    },
    {
      key: 'commerce', name: '商业价值', w: 15, unit: '代言与大使加权',
      desc: '按公开报道整理 2026 年在身的代言/大使：全球级 3 分、区域级 2 分、单品与杂志 1 分，累加。',
      why: '品牌方用真金白银投票，比粉丝投票更难注水。',
      note: '部分成员仅能确认长期合作，按保守值计，页面标注「保守计」；计分后做幂律压缩，避免「多一个代言」被放大成巨大分差。'
    },
    {
      key: 'works', name: '作品与个人活动', w: 10, unit: '2026 年个人产出',
      desc: '统计 2026 年内的个人产出：SOLO 发行、OST、影视、制作、常驻综艺、固定 MC，按件计数。',
      why: '衡量「今年她自己在做什么」，把长期停摆与高频活动区分开。',
      note: '件数为编辑整理，非官方统计；出道曲、团体作品不计入个人分。计分同样做幂律压缩。'
    }
  ];

  return { GROUPS, MEMBERS, SONGS, TIMELINE, SOURCES, METHOD };
})();
