import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { transformOrder } from "@/lib/transformers";

export async function createOrder(orderData) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  
  const order = {
    ...orderData,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("orders").insertOne(order);
  return { ...order, id: result.insertedId.toString() };
}

export async function getOrdersByUser(userId) {
  const client = await clientPromise;
  const docs = await client.db(process.env.MONGODB_DB)
    .collection("orders")
    .find({ userId: userId.toString() })
    .sort({ createdAt: -1 })
    .toArray();
  
  return docs.map(transformOrder);
}

export async function getOrderById(id) {
  if (!ObjectId.isValid(id)) return null;
  const client = await clientPromise;
  const doc = await client.db(process.env.MONGODB_DB)
    .collection("orders")
    .findOne({ _id: new ObjectId(id) });
  
  return transformOrder(doc);
}
