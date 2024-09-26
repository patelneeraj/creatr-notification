const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
var cors = require("cors");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define a simple schema and model
const NotifSchema = new mongoose.Schema({
  notifId: String,
  message: String,
  projectId: String,
  module: String,
  priority: Number,
  projectType: String,
  newStage: String,
  timestamp: String,
  readUsers: [String],
  description: String,
});

let sse_clients = [];

const Notif = mongoose.model("Notif", NotifSchema);

// Simple GET endpoint
app.post("/api/notifications", async (req, res) => {
  const { projectId, sort } = req.body;
  var items;
  try {
    if (projectId) {
      items = await Notif.find({ projectId: projectId }).sort({
        priority: sort,
      });
    } else {
      items = await Notif.find().sort({
        priority: sort,
      });
    }
    res.json(items);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching items", error: error.message });
  }
});

app.post("/api/readNotification", async (req, res) => {
  const { userId, notifId } = req.body;

  try {
    let notif = await Notif.findOne({ notifId: notifId });
    notif.readUsers = [...notif.readUsers, userId];
    notif.save();
    res.json({ message: "notification read successfully" });
  } catch (error) {
    res.status(500).json({ message: "notification could not be read" });
  }
});

app.post("/api/notifTrigger", async (req, res) => {
  const {
    message,
    projectId,
    module,
    priority,
    projectType,
    newStage,
    description,
  } = req.body;

  let newNotif = new Notif();

  newNotif.message = message;
  newNotif.projectId = projectId;
  newNotif.module = module;
  newNotif.priority = priority;
  newNotif.projectType = projectType;
  newNotif.newStage = newStage;
  newNotif.timestamp = Date.now().toString();
  newNotif.description = description;

  newNotif.notifId = uuidv4();

  try {
    await newNotif.save();
  } catch (error) {
    res.status(500);
    res.json({ message: "notification creation failed" });
  }

  sse_clients.forEach((client) => {
    client.res.write(`data: ${JSON.stringify(newNotif)}\n\n`);
    //client.res.json({ data: newNotif });
  });

  res.json({ message: "notification created successfully" });
});

app.get("/api/sse", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res,
  };
  sse_clients.push(newClient);

  req.on("close", () => {
    sse_clients = sse_clients.filter((client) => client.id !== clientId);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
