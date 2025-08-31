import { prismaClient } from "../db/prisma.js";

export async function getCachedImages(promptId: string): Promise<string[]> {
    const res = await prismaClient.image.findMany({
        where: { promptId }
    })

    const cachedImages: string[] = [];
    for(let i = 0; i < res.length; i++){
        const imageUrl = res[i]?.base_s3_url;
        if(imageUrl) cachedImages.push(imageUrl);
    }
    
    return cachedImages;
}