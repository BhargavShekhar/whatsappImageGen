import { openAi } from "./openAi.service.js";
export async function generateImage(prompt) {
    const res = await openAi.images.generate({
        model: "dall-e-3",
        prompt,
        size: "1024x1024", // TODO change later,
    });
    if (!res.data) {
        console.log("generateImage :: could not generate image!!");
        return;
    }
    console.log(res.data[0]?.url);
    return res.data[0]?.url;
}
//# sourceMappingURL=generate-image.service.js.map