import { Router } from "express";
import { prismaClient } from "../db/prisma.js";
import { findOrCreateImage } from "../services/orchestrator.service.js";
import twilio from "twilio";

const webhookRouter: Router = Router();

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
        const imageResponse = await findOrCreateImage(message, userId);

        if (imageResponse.status === "clarification_needed" || imageResponse.status === "error") {
            twiml.message(imageResponse.messageToUser);
        } else {
            if (imageResponse.messageToUser) {
                twiml.message(imageResponse.messageToUser);
            }

            if (imageResponse.imageUrl && Array.isArray(imageResponse.imageUrl)) {
                imageResponse.imageUrl.forEach(url => {
                    twiml.message(imageResponse.messageToUser).media(url);
                });
            }
        }

        res.writeHead(200, { "Content-Type": "text/xml" });
        res.end(twiml.toString());

    } catch (error) {
        console.error("Error processing request:", error);
        twiml.message("An unexpected error occurred. Please try again.");
        res.writeHead(500, { "Content-Type": "text/xml" });
        res.end(twiml.toString());
    }
})

export default webhookRouter;