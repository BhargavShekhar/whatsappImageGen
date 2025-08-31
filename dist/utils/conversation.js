import { prismaClient } from "../db/prisma.js";
import { parseMessageWithGPT } from "../services/openAi.service.js";
import { executeImageGeneration, findOrCreateImage } from "../services/orchestrator.service.js";
export async function mergeContextAndCreateImage(oldContext, newMessage, userId, conversationId) {
    const clarificationPrompt = `
        The user's original request was incomplete.
        Original incomplete data: ${JSON.stringify(oldContext)}
        We asked the user the following question: "${oldContext.clarification_question}"
        The user has now replied with: "${newMessage}"

        Your task is to analyze the user's reply.
        First, determine if the reply actually answers the question.
        - If it DOES answer the question, fill in the missing null values in the original data and return the complete JSON object.
        - If the reply does NOT answer the question (e.g., the user is asking a question back or changing the topic), you MUST return the original data, but with an updated, more direct clarification_question.
    `;
    const completeIntent = await parseMessageWithGPT(clarificationPrompt);
    if (completeIntent.needs_clarification) {
        console.log("Clarification failed. Asking again.");
        await prismaClient.conversation.update({
            where: { id: conversationId },
            data: {
                context: completeIntent,
                status: "AWAITING_CLARIFICATION"
            }
        });
        return {
            status: "clarification_needed",
            messageToUser: completeIntent.clarification_question || "I'm sorry, I still don't have enough information. Could you please clarify?",
        };
    }
    console.log("Clarification successful. Proceeding with complete intent:", completeIntent);
    const combinedMessage = `${oldContext.raw_text} ${newMessage}`;
    return executeImageGeneration(completeIntent, combinedMessage, userId);
}
//# sourceMappingURL=conversation.js.map