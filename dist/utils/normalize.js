import { systemPrompt } from "../constants/systemPrompt.js";
import { openAi } from "../services/openAi.service.js";
export async function normalizePrompt(prompt) {
    const res = await openAi.chat.completions.create({
        model: "chatgpt-4o-latest",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
        ]
    });
    if (!res.choices?.length || !res.choices[0]?.message.content) {
        console.error("Could not normalize prompt!");
        return null;
    }
    return res.choices[0].message.content;
}
//# sourceMappingURL=normalize.js.map