import mongoose from "mongoose";

const connection = {};

async function connect() {
  if (connection.isConnected) {
    console.log("Already connected");
    return;
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      return;
    }

    await mongoose.disconnect();
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      serverSelectionTimeoutMS: 5000,
    });

    if (!db) {
      throw new Error("Internal server error!");
    }

    console.log("New connection");
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log("An error occured!");
  }
}

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = false;
    }
  }
}

function convertDocToObj(doc) {
  doc._id = doc._id.toString();
  if (doc.teacher?.credentials) {
    doc.teacher.credentials.name = doc.teacher.credentials.name.toString();
    doc.teacher.credentials.userImage =
      doc.teacher.credentials.userImage.toString();
    doc.teacher.credentials.email = doc.teacher.credentials.email.toString();
  }

  if (doc.members) {
    doc.members.name = doc.teacher.credentials.name.toString();
  }

  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();

  return doc;
}

const db = { connect, disconnect, convertDocToObj };
export default db;
