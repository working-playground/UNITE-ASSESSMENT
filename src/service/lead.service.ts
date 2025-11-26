import { CreateLeadDto, LeadFilterQueryDto, UpdateLeadDto } from "../common/dto/lead.dto";
import { createError } from "../common/errors/simpleError";
import { ILead } from "../models/mysql/leadModel";
import {
    createLead,
    deleteLead,
    findLeadByEmailOrPhone,
    findLeadById,
    listLeads,
    updateLead
} from "../persistence/mysql/leadRepository";
import { uploadCsvToS3, uploadImageToS3 } from "../utils/s3.service";

export async function createLeadService(dto: CreateLeadDto): Promise<ILead> {
    const existing = await findLeadByEmailOrPhone(dto.email, dto.phone);
    if (existing) {
        throw createError(409, "Lead with same email or phone already exists", "LEAD_DUPLICATE");
    }

    const lead = await createLead({
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        status: dto.status,
        source: dto.source,
        assignedToUserId: dto.assignedToUserId || null,
        imageUrl: dto.imageUrl || null,
    });

    return lead;
}

export async function getLeadByIdService(id: number): Promise<ILead> {
    const lead = await findLeadById(id);
    if (!lead) {
        throw createError(404, "Lead not found", "LEAD_NOT_FOUND");
    }
    return lead;
}

export async function updateLeadService(id: number, dto: UpdateLeadDto): Promise<ILead> {
    if (dto.email || dto.phone) {
        const existing = await findLeadByEmailOrPhone(dto.email || "", dto.phone || "");
        if (existing && existing.id !== id) {
            throw createError(409, "Lead with same email or phone already exists", "LEAD_DUPLICATE");
        }
    }

    const updated = await updateLead(id, dto as any);
    if (!updated) {
        throw createError(404, "Lead not found", "LEAD_NOT_FOUND");
    }

    return updated;
}

export async function deleteLeadService(id: number): Promise<void> {
    const lead = await findLeadById(id);
    if (!lead) {
        throw createError(404, "Lead not found", "LEAD_NOT_FOUND");
    }
    await deleteLead(id);
}

export async function listLeadsService(filters: LeadFilterQueryDto): Promise<ILead[]> {
    const leads = await listLeads(filters);
    return leads;
}

export async function uploadLeadImage(
    id: number,
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
): Promise<ILead> {
    const existingLead = await getLeadByIdService(id);
    if (!existingLead) {
        throw createError(404, "Lead not found", "LEAD_NOT_FOUND");
    }

    const result = await uploadImageToS3(fileBuffer, originalName, mimeType);

    const updatedLead = await updateLeadService(id, { imageUrl: result.url });

    return updatedLead;
}

export async function uploadLeadCsvToS3(
    fileBuffer: Buffer,
    originalName: string
): Promise<{ s3Key: string; s3Url: string }> {
    const result = await uploadCsvToS3(fileBuffer, originalName);

    return {
        s3Key: result.key,
        s3Url: result.url
    };
}
