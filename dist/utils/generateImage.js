import { openAi } from "../services/openAi.service.js";
export async function generateImage(prompt) {
    const res = await openAi.images.generate({
        model: "dall-e-2",
        prompt,
        size: "256x256" // TODO change later
    });
    if (!res.data) {
        console.log("generateImage :: could not generate image!!");
        return;
    }
    console.log(res.data[0]?.url);
    return res.data[0]?.url;
}
//# sourceMappingURL=generateImage.js.map