const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const accountSid = "AC25f45aac8783bc2fcecb000f8aabce55";
const authToken = "2d96207a824afa6d5a6409a57d3d4c90";
const client = twilio(accountSid, authToken);

const serviceSid = "VAf9bb6aeb5217dad8918e5f024f3b8327";

// Send SMS code
app.post("/send-code", async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone required" });

    try {
        const verification = await client.verify.services(serviceSid)
            .verifications
            .create({ to: phone, channel: "sms" });
        res.json({ status: verification.status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Verify SMS code
app.post("/verify-code", async (req, res) => {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ error: "Phone and code required" });

    try {
        const verification_check = await client.verify.services(serviceSid)
            .verificationChecks
            .create({ to: phone, code });
        res.json({ status: verification_check.status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
