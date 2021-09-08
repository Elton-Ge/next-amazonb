import mongoose from "mongoose";

const connection = {};

async function connect() {
  if (connection.isConnected) {
    console.log("already connected");
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState === 1;
    if (connection.isConnected) {
      console.log("use previous connection");
      return;
    }
    await mongoose.disconnect();
  }
  await mongoose.connect(
    process.env.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    },
    () => {
      console.log("new connection");
      connection.isConnected = mongoose.connections[0].readyState===1;
    }
  );
}

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log("not disconnected");
    }
  }
}

function convertDocToObj(doc) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

function convertOrderDocToObj(orderDoc) {
  orderDoc._id = orderDoc._id.toString();
  orderDoc.user = orderDoc.user.toString();
  orderDoc.createdAt = orderDoc.createdAt.toString();
  orderDoc.updatedAt = orderDoc.updatedAt.toString();
  orderDoc.paidAt = orderDoc.paidAt ? JSON.stringify(orderDoc.paidAt) : null;
  orderDoc.deliveredAt = orderDoc.deliveredAt
    ? JSON.stringify(orderDoc.deliveredAt)
    : null;
  orderDoc.orderItems = orderDoc.orderItems.map((x) => ({
    ...x,
    _id: x._id.toString(),
  }));
  return orderDoc;
}

const db = { connect, disconnect, convertDocToObj, convertOrderDocToObj };
export default db;
