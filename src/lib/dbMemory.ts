import bcrypt from "bcryptjs";

// In-memory fallback for Vercel when DATABASE_URL not set or DB fails
// This allows the app to work even without external Postgres

type User = {
  id: number;
  username: string;
  password: string; // hashed
  role: string;
  expiresAt: Date | null;
  createdAt: Date;
  profilePic: string | null;
  isActive: boolean;
};

type ChatMessage = {
  id: number;
  userId: number;
  username: string;
  message: string;
  createdAt: Date;
};

type Announcement = {
  id: number;
  message: string;
  createdAt: Date;
  isActive: boolean;
};

type AppSetting = {
  id: number;
  key: string;
  value: string | null;
  updatedAt: Date;
};

type AttackLog = {
  id: number;
  userId: number;
  username: string;
  attackType: string;
  target: string;
  status: string;
  createdAt: Date;
};

const globalStore = globalThis as unknown as {
  __memoryDB?: {
    users: User[];
    chatMessages: ChatMessage[];
    announcements: Announcement[];
    appSettings: AppSetting[];
    attackLogs: AttackLog[];
    prankCalls: any[];
    spamOtps: any[];
    nextIds: Record<string, number>;
  };
  __memoryDBInitialized?: boolean;
};

function getMemoryDB() {
  if (!globalStore.__memoryDB) {
    globalStore.__memoryDB = {
      users: [],
      chatMessages: [],
      announcements: [],
      appSettings: [],
      attackLogs: [],
      prankCalls: [],
      spamOtps: [],
      nextIds: {
        users: 1,
        chatMessages: 1,
        announcements: 1,
        appSettings: 1,
        attackLogs: 1,
        prankCalls: 1,
        spamOtps: 1,
      },
    };
  }
  return globalStore.__memoryDB;
}

async function initMemoryDB() {
  if (globalStore.__memoryDBInitialized) return;
  const db = getMemoryDB();
  
  // Pre-hash passwords for default users
  const adminHash = await bcrypt.hash("pwnya admin?0987#$@", 12);
  const resellerHash = await bcrypt.hash("reseller123", 12);
  const userHash = await bcrypt.hash("user123", 12);

  const now = new Date();
  const in30Days = new Date();
  in30Days.setDate(in30Days.getDate() + 30);
  const in7Days = new Date();
  in7Days.setDate(in7Days.getDate() + 7);

  db.users = [
    {
      id: 1,
      username: "admin0987",
      password: adminHash,
      role: "developer",
      expiresAt: null,
      createdAt: now,
      profilePic: null,
      isActive: true,
    },
    {
      id: 2,
      username: "reseller01",
      password: resellerHash,
      role: "reseller",
      expiresAt: in30Days,
      createdAt: now,
      profilePic: null,
      isActive: true,
    },
    {
      id: 3,
      username: "user01",
      password: userHash,
      role: "user",
      expiresAt: in7Days,
      createdAt: now,
      profilePic: null,
      isActive: true,
    },
  ];
  db.nextIds.users = 4;

  // Default background is null (will use black red default)
  db.appSettings = [];

  globalStore.__memoryDBInitialized = true;
  console.log("✅ Memory DB initialized with default users for Vercel fallback");
}

// Ensure initialized
initMemoryDB().catch(console.error);

export const memoryDB = {
  get: getMemoryDB,
  init: initMemoryDB,

  // Users
  async findUserByUsername(username: string): Promise<User | undefined> {
    await initMemoryDB();
    return getMemoryDB().users.find(u => u.username === username);
  },

  async findUserById(id: number): Promise<User | undefined> {
    await initMemoryDB();
    return getMemoryDB().users.find(u => u.id === id);
  },

  async getAllUsers(): Promise<User[]> {
    await initMemoryDB();
    return [...getMemoryDB().users].sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime());
  },

  async createUser(username: string, hashedPassword: string, role: string, expiresAt: Date | null): Promise<User> {
    await initMemoryDB();
    const db = getMemoryDB();
    const newUser: User = {
      id: db.nextIds.users++,
      username,
      password: hashedPassword,
      role,
      expiresAt,
      createdAt: new Date(),
      profilePic: null,
      isActive: true,
    };
    db.users.push(newUser);
    return newUser;
  },

  async deleteUser(id: number): Promise<void> {
    await initMemoryDB();
    const db = getMemoryDB();
    db.users = db.users.filter(u => u.id !== id);
  },

  async updateUser(id: number, updates: Partial<User>): Promise<void> {
    await initMemoryDB();
    const db = getMemoryDB();
    const idx = db.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      db.users[idx] = { ...db.users[idx], ...updates };
    }
  },

  // Chat
  async getChatMessages(limit = 100): Promise<ChatMessage[]> {
    await initMemoryDB();
    const db = getMemoryDB();
    return [...db.chatMessages].sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime()).slice(-limit);
  },

  async createChatMessage(userId: number, username: string, message: string): Promise<ChatMessage> {
    await initMemoryDB();
    const db = getMemoryDB();
    const newMsg: ChatMessage = {
      id: db.nextIds.chatMessages++,
      userId,
      username,
      message,
      createdAt: new Date(),
    };
    db.chatMessages.push(newMsg);
    // Keep only last 200 messages in memory
    if (db.chatMessages.length > 200) {
      db.chatMessages = db.chatMessages.slice(-200);
    }
    return newMsg;
  },

  // Announcements
  async getLatestAnnouncement(): Promise<Announcement | null> {
    await initMemoryDB();
    const db = getMemoryDB();
    const active = db.announcements.filter(a => a.isActive).sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
    return active[0] || null;
  },

  async createAnnouncement(message: string): Promise<Announcement> {
    await initMemoryDB();
    const db = getMemoryDB();
    const ann: Announcement = {
      id: db.nextIds.announcements++,
      message,
      createdAt: new Date(),
      isActive: true,
    };
    db.announcements.push(ann);
    return ann;
  },

  // Settings
  async getSetting(key: string): Promise<AppSetting | undefined> {
    await initMemoryDB();
    return getMemoryDB().appSettings.find(s => s.key === key);
  },

  async getAllSettings(): Promise<AppSetting[]> {
    await initMemoryDB();
    return [...getMemoryDB().appSettings];
  },

  async setSetting(key: string, value: string): Promise<AppSetting> {
    await initMemoryDB();
    const db = getMemoryDB();
    let setting = db.appSettings.find(s => s.key === key);
    if (setting) {
      setting.value = value;
      setting.updatedAt = new Date();
      return setting;
    } else {
      const newSetting: AppSetting = {
        id: db.nextIds.appSettings++,
        key,
        value,
        updatedAt: new Date(),
      };
      db.appSettings.push(newSetting);
      return newSetting;
    }
  },

  async deleteSetting(key: string): Promise<void> {
    await initMemoryDB();
    const db = getMemoryDB();
    db.appSettings = db.appSettings.filter(s => s.key !== key);
  },

  // Attack Logs
  async getAttackLogs(userId?: number, limit = 200): Promise<AttackLog[]> {
    await initMemoryDB();
    const db = getMemoryDB();
    let logs = [...db.attackLogs];
    if (userId) {
      logs = logs.filter(l => l.userId === userId);
    }
    return logs.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
  },

  async createAttackLog(userId: number, username: string, attackType: string, target: string, status = "success"): Promise<AttackLog> {
    await initMemoryDB();
    const db = getMemoryDB();
    const log: AttackLog = {
      id: db.nextIds.attackLogs++,
      userId,
      username,
      attackType,
      target,
      status,
      createdAt: new Date(),
    };
    db.attackLogs.push(log);
    if (db.attackLogs.length > 500) {
      db.attackLogs = db.attackLogs.slice(-500);
    }
    return log;
  },
};
