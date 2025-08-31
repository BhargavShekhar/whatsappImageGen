import crypto from "crypto";
export function generateSignature(normalize) {
    if (!normalize)
        throw new Error("generateSignature :: did not recived normalize");
    const sortedKeys = Object.keys(normalize).sort();
    const sortedObj = {};
    for (const key of sortedKeys) {
        sortedObj[key] = normalize[key];
    }
    const hash = crypto.createHash("sha256").update(JSON.stringify(sortedObj)).digest("hex");
    return hash;
}
//# sourceMappingURL=generateSignature.js.map