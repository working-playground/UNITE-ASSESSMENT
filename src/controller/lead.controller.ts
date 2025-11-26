import { NextFunction, Request, Response } from "express";
import { LeadFilterQueryDto } from "../common/dto/lead.dto";
import { createError } from "../common/errors/simpleError";
import {
    createLeadService,
    deleteLeadService,
    getLeadByIdService,
    listLeadsService,
    updateLeadService,
    uploadLeadCsvToS3,
    uploadLeadImage
} from "../service/lead.service";

export async function createLeadController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const lead = await createLeadService(req.body);
        res.status(201).json(lead);
    } catch (error) {
        next(error);
    }
}

export async function getLeadByIdController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id: number = Number(req.params.id);
        const lead = await getLeadByIdService(id);
        res.status(200).json(lead);
    } catch (error) {
        next(error);
    }
}

export async function updateLeadController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id: number = Number(req.params.id);
        const lead = await updateLeadService(id, req.body);
        res.status(200).json(lead);
    } catch (error) {
        next(error);
    }
}

export async function deleteLeadController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id: number = Number(req.params.id);
        await deleteLeadService(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export async function listLeadsController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const filters: LeadFilterQueryDto = {
            status: req.query.status as any,
            source: req.query.source as any,
            assignedToUserId: req.query.assignedToUserId ? Number(req.query.assignedToUserId) : undefined
        };

        const leads = await listLeadsService(filters);
        res.status(200).json(leads);
    } catch (error) {
        next(error);
    }
}
export async function uploadLeadImageController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.file?.buffer || !req.file.originalname || !req.file.mimetype) {
            throw createError(400, "Provide all data to upload lead image", "BAD_REQUEST");
        }

        const id: number = Number(req.params.id);

        const updatedLead = await uploadLeadImage(
            id,
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype
        );

        res.status(200).json(updatedLead);
    } catch (error) {
        next(error);
    }
}

export async function importLeadCsvController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.file?.buffer || !req.file.originalname) {
            throw createError(400, "CSV file is required", "BAD_REQUEST");
        }

        const result = await uploadLeadCsvToS3(req.file.buffer, req.file.originalname);

        res.status(202).json({
            message: "CSV uploaded to S3. Processing will be handled asynchronously by Lambda.",
            s3Key: result.s3Key,
            s3Url: result.s3Url
        });
    } catch (error) {
        next(error);
    }
}
