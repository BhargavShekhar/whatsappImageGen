import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();
const twilioAccount = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
const twilioCLient = twilio(twilioAccount, twilioToken);
export async function createTwilioMessage(phone, body, mediaUrl) {
    const toPhoneNumber = phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`;
    const fromPhoneNumber = twilioWhatsappNumber?.startsWith('whatsapp') ? twilioWhatsappNumber : `whatsapp:${twilioWhatsappNumber}`;
    console.log("phone: ", phone, " toPhone: ", toPhoneNumber);
    console.log("from: ", twilioWhatsappNumber);
    const payload = {
        to: toPhoneNumber,
        from: fromPhoneNumber,
        body
    };
    if (mediaUrl && mediaUrl.length > 0)
        payload.mediaUrl = mediaUrl;
    return await twilioCLient.messages.create(payload);
}
//# sourceMappingURL=twillio-client.service.js.map