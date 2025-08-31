export interface ParsedIntent {
    what_to_do: string;
    request_type: string;
    company_category: string | null;
    occasion: string | null;
    theme: string | null;
    style: string | null;
    color_scheme: string | null;
    company_logo_provided: boolean;
    needs_clarification: boolean;
    clarification_question: string | null;
    cache_lookup: {
        business_type: string | null;
        festival: string | null;
    };
}
export type ClarificationResponse = {
    status: "clarification_needed";
    imageUrl: null;
    messageToUser: string;
    context: ParsedIntent;
};
export type ImageResponse = {
    status: "hit" | "miss";
    imageUrl: string[];
    messageToUser: string;
};
export type ErrorResponse = {
    status: "error";
    messageToUser: string;
};
export type OrchestratorResponse = ClarificationResponse | ImageResponse | ErrorResponse;
//# sourceMappingURL=types.d.ts.map