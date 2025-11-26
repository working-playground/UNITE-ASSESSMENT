import { parse } from "csv-parse";
import { NextFunction, Request, Response } from "express";
import { Readable } from "stream";
import { CreateLeadDto } from "../common/dto/lead.dto";
import { LeadSource, LeadStatus } from "../common/enums/common";
import { uploadCsvToS3 } from "../utils/s3.service";

export async function csvHandler(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.file) {
            res.status(400).json({ message: "CSV file is required" });
            return;
        }

        const result = await uploadCsvToS3(req.file.buffer, req.file.originalname);

        res.status(202).json({
            message: "CSV uploaded to S3. Processing will be handled asynchronously.",
            s3Key: result.key,
            s3Url: result.url
        });
    } catch (error) {
        next(error);
    }
}
export async function parseLeadCsv(fileBuffer: Buffer): Promise<CreateLeadDto[]> {
    return new Promise(function (resolve, reject) {
        const rows: CreateLeadDto[] = [];

        const stream = Readable.from(fileBuffer);

        stream
            .pipe(
                parse({
                    columns: true,
                    trim: true
                })
            )
            .on("data", function (row: any) {
                const dto: CreateLeadDto = {
                    name: row.name,
                    phone: row.phone,
                    email: row.email,
                    status: (row.status as LeadStatus) || LeadStatus.New,
                    source: (row.source as LeadSource) || LeadSource.Other,
                    assignedToUserId: row.assignedToUserId ? Number(row.assignedToUserId) : null
                };

                rows.push(dto);
            })
            .on("end", function () {
                resolve(rows);
            })
            .on("error", function (error: Error) {
                reject(error);
            });
    });
}