interface PromptWithEmbedding {
    id: string;
    embedding: string | null;
    base_s3_url: string | null;
}
export declare function findPromptsByTags(tags: string[]): Promise<PromptWithEmbedding[]>;
export {};
//# sourceMappingURL=findPromptsByTags.d.ts.map