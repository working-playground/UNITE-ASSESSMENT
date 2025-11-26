import { CallLogModel } from "../../models/mongo/callLogModel";

export interface RawAgentPerformanceDoc {
    agentId: number;
    totalCalls: number;
    outcomes: {
        outcome: string;
        count: number;
    }[];
}

export async function aggregateAgentPerformanceRaw(): Promise<RawAgentPerformanceDoc[]> {
    const pipeline = [
        {
            $group: {
                _id: { agentId: "$agentId", outcome: "$outcome" },
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: "$_id.agentId",
                totalCalls: { $sum: "$count" },
                outcomes: {
                    $push: {
                        outcome: "$_id.outcome",
                        count: "$count"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                agentId: "$_id",
                totalCalls: 1,
                outcomes: 1
            }
        }
    ];

    const raw = await CallLogModel.aggregate(pipeline).exec();
    return raw as RawAgentPerformanceDoc[];
}