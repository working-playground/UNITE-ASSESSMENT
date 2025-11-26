import mongoose, { Document, Model, Schema } from "mongoose";
import { CallOutcome } from "../../common/enums/common";

export type CallLogAttributes = {
    callTaskId: number;
    leadId: number;
    agentId: number;
    notes: string | null;
    outcome: CallOutcome;
    createdAt: Date;
};

export interface CallLogDocument extends CallLogAttributes, Document { }

const CallLogSchema: Schema<CallLogDocument> = new Schema<CallLogDocument>(
    {
        callTaskId: { type: Number, required: true },
        leadId: { type: Number, required: true },
        agentId: { type: Number, required: true },
        notes: { type: String, required: false },
        outcome: {
            type: String,
            enum: Object.values(CallOutcome),
            required: true
        },
        createdAt: { type: Date, required: true, default: Date.now }
    },
    {
        timestamps: false
    }
);

export const CallLogModel: Model<CallLogDocument> = mongoose.model<CallLogDocument>(
    "CallLog",
    CallLogSchema
);