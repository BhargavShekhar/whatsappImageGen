import OpenAI from "openai";
import type { ParsedIntent } from "../types.js";
export declare const openAi: OpenAI;
export declare function parseMessageWithGPT(message: string): Promise<ParsedIntent>;
export declare function generateImageWithDallE(prompt: string): Promise<string | null>;
//# sourceMappingURL=openAi.service.d.ts.map