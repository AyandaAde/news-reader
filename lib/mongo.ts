import { MongoClient, type Db, type UpdateFilter } from "mongodb";

import { env } from "@/env";

export type UserPodcast = {
  id: string;
  userId: string;
  podcastName: string;
  imageUrl: string | null;
  description: string | null;
  tags: string[];
  audioUrl: string;
  createdAt: string;
};

type MongoUserDocument = {
  clerkUserId: string;
  podcasts: UserPodcast[];
  createdAt?: string;
  updatedAt?: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __eiloMongoClientPromise: Promise<MongoClient> | undefined;
}

function getMongoUri() {
  const uri = env.MONGODB_URI ?? process.env.MONGODB_URI;
  if (!uri?.trim()) {
    throw new Error("MONGODB_URI is not configured.");
  }

  return uri.trim();
}

function getMongoClientPromise() {
  if (!globalThis.__eiloMongoClientPromise) {
    const client = new MongoClient(getMongoUri());
    globalThis.__eiloMongoClientPromise = client.connect();
  }

  return globalThis.__eiloMongoClientPromise;
}

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClientPromise();
  return client.db("eilo");
}

export async function getUserPodcasts(clerkUserId: string) {
  const db = await getMongoDb();
  const user = await db.collection<MongoUserDocument>("users").findOne({
    clerkUserId,
  });

  return user?.podcasts ?? [];
}

export async function appendUserPodcast(
  clerkUserId: string,
  podcast: UserPodcast,
) {
  const db = await getMongoDb();
  const users = db.collection<MongoUserDocument>("users");

  const update: UpdateFilter<MongoUserDocument> = {
    $setOnInsert: {
      clerkUserId,
      createdAt: new Date().toISOString(),
    },
    $push: {
      podcasts: podcast,
    },
    $set: {
      updatedAt: new Date().toISOString(),
    },
  };

  await users.updateOne({ clerkUserId }, update, { upsert: true });

  return podcast;
}
