const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
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
const ItemSchema = new mongoose.Schema({
	name: String,
	description: String,
});

const Item = mongoose.model("Item", ItemSchema);

// Simple GET endpoint
app.get("/api/items", async (req, res) => {
	try {
		const items = await Item.find();
		res.json(items);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching items", error: error.message });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
