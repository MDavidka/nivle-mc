import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "phonix_store";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// Initialize global mock database for server-side fallback
interface MockDb {
  users: any[];
  orders: any[];
}

declare global {
  var __mockDb: MockDb | undefined;
}

if (!global.__mockDb) {
  global.__mockDb = {
    users: [
      // Seed a default user for testing
      // Password is "password123" hashed with bcryptjs (will hash at runtime or use standard hash)
      // Let's seed an empty array so they can register, or we can seed one.
    ],
    orders: [],
  };
}

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    // Return null to trigger fallback mode
    return { client: null, db: null };
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Database helper operations supporting both MongoDB and Fallback
export const dbOperations = {
  // --- USER OPERATIONS ---
  async findUserByEmail(email: string) {
    const { db } = await connectToDatabase();
    const normalizedEmail = email.toLowerCase().trim();

    if (db) {
      return await db.collection("users").findOne({ email: normalizedEmail });
    } else {
      const user = global.__mockDb?.users.find(
        (u) => u.email.toLowerCase().trim() === normalizedEmail
      );
      return user ? { ...user } : null;
    }
  },

  async createUser(user: any) {
    const { db } = await connectToDatabase();
    const normalizedUser = {
      ...user,
      email: user.email.toLowerCase().trim(),
      createdAt: new Date(),
    };

    if (db) {
      const result = await db.collection("users").insertOne(normalizedUser);
      return { ...normalizedUser, _id: result.insertedId };
    } else {
      const id = "user_" + Math.random().toString(36).substr(2, 9);
      const newUser = { ...normalizedUser, _id: id, id };
      global.__mockDb?.users.push(newUser);
      return newUser;
    }
  },

  // --- ORDER OPERATIONS ---
  async createOrder(order: any) {
    const { db } = await connectToDatabase();
    const newOrder = {
      ...order,
      status: "Processing",
      createdAt: new Date(),
    };

    if (db) {
      const result = await db.collection("orders").insertOne(newOrder);
      return { ...newOrder, _id: result.insertedId };
    } else {
      const id = "order_" + Math.random().toString(36).substr(2, 9);
      const orderWithId = { ...newOrder, _id: id, id };
      global.__mockDb?.orders.push(orderWithId);
      return orderWithId;
    }
  },

  async getOrdersByUser(email: string) {
    const { db } = await connectToDatabase();
    const normalizedEmail = email.toLowerCase().trim();

    if (db) {
      return await db
        .collection("orders")
        .find({ userEmail: normalizedEmail })
        .sort({ createdAt: -1 })
        .toArray();
    } else {
      const orders = global.__mockDb?.orders
        .filter((o) => o.userEmail.toLowerCase().trim() === normalizedEmail)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) || [];
      return JSON.parse(JSON.stringify(orders)); // Deep clone to break references
    }
  },
};
