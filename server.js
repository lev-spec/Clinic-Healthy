const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Send SMS code (Twilio removed)
app.post("/send-code", async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone required" });

    // აქ შეგიძლია ჩასვა სხვა ლოგიკა
    res.json({ message: "Twilio logic removed" });
});

// Verify SMS code (Twilio removed)
app.post("/verify-code", async (req, res) => {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ error: "Phone and code required" });

    // აქ შეგიძლია ჩასვა სხვა ლოგიკა
    res.json({ message: "Twilio logic removed" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));