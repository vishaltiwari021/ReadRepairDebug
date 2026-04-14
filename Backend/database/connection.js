import mongoose from "mongoose";

const REPLICA_COLLECTIONS = ["replica_1", "replica_2", "replica_3"];

function getConnectionOptions() {
  const mongoUri = process.env.MONGO_URI?.trim();

  if (!mongoUri) {
    throw new Error("Missing MONGO_URI environment variable.");
  }

  const dbName = process.env.DB_NAME?.trim();
  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  };

  if (dbName) {
    options.dbName = dbName;
  }

  return { mongoUri, options };
}

function normalizeDocument(doc) {
  if (!doc) return null;

  return {
    _id: String(doc._id),
    data: doc.data,
    version: Number(doc.version || 1),
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
  };
}

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
    this.connectionPromise = null;
  }

  async connect() {
    if (this.isConnected && mongoose.connection.readyState === 1) {
      return;
    }

    if (!this.connectionPromise) {
      this.connectionPromise = this.openConnection();
    }

    await this.connectionPromise;
  }

  async openConnection() {
    try {
      const { mongoUri, options } = getConnectionOptions();
      await mongoose.connect(mongoUri, options);

      // MongoDB already creates a unique _id index automatically for every collection.
      // Touch each replica collection without redefining that index.
      await Promise.all(this.getReplicas().map((replica) => replica.estimatedDocumentCount()));

      this.isConnected = true;
    } catch (error) {
      this.isConnected = false;
      this.connectionPromise = null;

      if (mongoose.connection.readyState !== 0) {
        try {
          await mongoose.disconnect();
        } catch (disconnectError) {
          console.error("Failed to clean up MongoDB connection after startup error:", disconnectError);
        }
      }

      throw error;
    }
  }

  async disconnect() {
    if (!this.isConnected) {
      return;
    }

    await mongoose.disconnect();
    this.isConnected = false;
    this.connectionPromise = null;
  }

  get db() {
    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
      throw new Error("Database connection is not ready. Call connect() first.");
    }

    return mongoose.connection.db;
  }

  get replicaCount() {
    return REPLICA_COLLECTIONS.length;
  }

  getReplicas() {
    return REPLICA_COLLECTIONS.map((name) => this.db.collection(name));
  }

  getReplica(index) {
    if (index < 0 || index >= REPLICA_COLLECTIONS.length) {
      return null;
    }

    return this.db.collection(REPLICA_COLLECTIONS[index]);
  }

  normalizeDocument(doc) {
    return normalizeDocument(doc);
  }

  async findDocument(id, replica) {
    try {
      return await replica.findOne({ _id: id });
    } catch (error) {
      console.error(`Error finding document ${id} in replica:`, error);
      return null;
    }
  }

  async findDocumentsById(id) {
    return Promise.all(this.getReplicas().map((replica) => this.findDocument(id, replica)));
  }

  async getAllDocumentIds() {
    const ids = new Set();

    await Promise.all(
      this.getReplicas().map(async (replica) => {
        const documents = await replica.find({}, { projection: { _id: 1 } }).toArray();
        documents.forEach((doc) => {
          ids.add(String(doc._id));
        });
      }),
    );

    return Array.from(ids);
  }

  async writeToReplicas(doc, replicaIndices) {
    const normalizedDoc = this.normalizeDocument(doc);
    if (!normalizedDoc) {
      throw new Error("Document is required");
    }

    await Promise.all(
      replicaIndices.map(async (index) => {
        const replica = this.getReplica(index);
        if (!replica) {
          return;
        }

        await replica.updateOne(
          { _id: normalizedDoc._id },
          { $set: normalizedDoc },
          { upsert: true },
        );
      }),
    );
  }

  async writeToAllReplicas(doc) {
    const replicaIndices = REPLICA_COLLECTIONS.map((_name, index) => index);
    await this.writeToReplicas(doc, replicaIndices);
  }
}

const db = new DatabaseConnection();

export default db;
