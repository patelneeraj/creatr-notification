const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");

dotenv.config();

const app = express();
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
});

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

  let notif = Notif.findOne({ notifId: notifId });
  notif.readUsers = [...notif.readUsers, userId];
});

app.post("/api/notifTrigger", async (req, res) => {
  const { message, projectId, module, priority, projectType, newStage } =
    req.body;

  let newNotif = new Notif();

  newNotif.message = message;
  newNotif.projectId = projectId;
  newNotif.module = module;
  newNotif.priority = priority;
  newNotif.projectType = projectType;
  newNotif.newStage = newStage;
  newNotif.timestamp = Date.now().toString();

  newNotif.notifId = uuidv4();

  try {
    await newNotif.save();
  } catch (error) {
    res.status(500);
    res.json({ message: "notification creation failed" });
  }
  res.json({ message: "notification created successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
