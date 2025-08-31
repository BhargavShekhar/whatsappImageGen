import { Router } from "express";
import { prismaClient } from "../db/prisma.js";
import { findOrCreateImage } from "../services/orchestrator.service.js";
import twilio from "twilio";
const webhookRouter = Router();
webhookRouter.post("/", async (req, res) => {
    const { Body: message, From: phone } = req.body;
    const twiml = new twilio.twiml.MessagingResponse();
    if (!message || !phone) {
        return res.status(400).json({ error: "Missing 'message' or 'phone' in request body." });
    }
    const user = await prismaClient.user.upsert({
        where: { phone },
        update: {},
        create: { phone }
    });
    const userId = user.id;
    try {
        await findOrCreateImage(message, userId, phone);
        twiml.message("I've received your request and am working on your creative! I'll send it to you as soon as it's ready.");
        res.writeHead(200, { "Content-Type": "text/xml" });
        res.end(twiml.toString());
    }
    catch (error) {
        console.error("Error processing request:", error);
        twiml.message("An unexpected error occurred. Please try again.");
        res.writeHead(500, { "Content-Type": "text/xml" });
        res.end(twiml.toString());
    }
});
export default webhookRouter;
//# sourceMappingURL=webhook.router.js.map