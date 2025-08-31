import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config({ override: true });
const S3_BUCKET = process.env.AWS_BUCKET_NAME;
export const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_KEY
    }
});
export async function uploadImageFromUrl(imageUrl, filename) {
    if (!S3_BUCKET) {
        throw new Error("S3_BUCKET_NAME environment variable is not set.");
    }
    try {
        console.log(`Downloading image from: ${imageUrl}`);
        const res = await axios.get(imageUrl, {
            responseType: "arraybuffer"
        });
        const imageBuffer = Buffer.from(res.data);
        const contentType = res.headers['content-type'] || 'image/png';
        const params = {
            Bucket: S3_BUCKET,
            Key: filename,
            Body: imageBuffer,
            ContentType: contentType
        };
        console.log(`Uploading ${filename} to S3 bucket ${S3_BUCKET}...`);
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        const publicUrl = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
        console.log(`Successfully uploaded. Public URL: ${publicUrl}`);
        return publicUrl;
    }
    catch (error) {
        console.error("Error in uploadImageFromUrl:", error);
        throw new Error("Failed to download or upload the image.");
    }
}
//# sourceMappingURL=aws-s3.service.js.map