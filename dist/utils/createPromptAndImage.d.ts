export declare function createPromptAndImage(data: {
    userId: string;
    rawText: string;
    processedText: string;
    tags: string[];
    embedding: number[];
    s3Url: string;
}): Promise<{
    id: string;
}>;
//# sourceMappingURL=createPromptAndImage.d.ts.map