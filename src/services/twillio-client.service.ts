import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const twilioAccount = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const twilioCLient = twilio(twilioAccount, twilioToken);

export async function createTwilioMessage(phone: string, body: string, mediaUrl?: string[]) {
    const toPhoneNumber = phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`;
    const fromPhoneNumber = twilioWhatsappNumber?.startsWith('whatsapp') ? twilioWhatsappNumber : `whatsapp:${twilioWhatsappNumber}`;

    const payload: any = {
        to: toPhoneNumber,
        from: fromPhoneNumber,
        body
    }

    if (mediaUrl && mediaUrl.length > 0) payload.mediaUrl = mediaUrl;

    return await twilioCLient.messages.create(payload);
}