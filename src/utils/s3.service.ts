import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const region: string = process.env.AWS_REGION || "ap-south-1";
const bucketName: string = process.env.S3_BUCKET_NAME || "";
const csvPrefixEnv: string = process.env.S3_CSV_PREFIX || "csv";
const imagePrefixEnv: string = process.env.S3_IMAGE_PREFIX || "images";

const s3Client = new S3Client({ region });

function buildObjectKey(prefix: string, originalName: string): string {
    const extension = originalName.includes(".")
        ? originalName.substring(originalName.lastIndexOf(".") + 1)
        : "bin";

    const uniqueId = randomUUID();

    const key = prefix.replace(/\/$/, "") + "/" + uniqueId + "." + extension;

    return key;
}

export async function uploadImageToS3(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
): Promise<{ key: string; url: string }> {
    const key: string = buildObjectKey(imagePrefixEnv, originalName);

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType
    });

    await s3Client.send(command);

    const url: string = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + key;

    return { key, url };
}

export async function uploadCsvToS3(
    fileBuffer: Buffer,
    originalName: string
): Promise<{ key: string; url: string }> {
    const key: string = buildObjectKey(csvPrefixEnv, originalName);

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: "text/csv"
    });

    await s3Client.send(command);

    const url: string = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + key;

    return { key, url };
}