import {
    AgentPerformanceItem,
    AgentPerformanceOutcome,
    AgentPerformanceResponse,
    DailySummaryItem,
    DailySummaryResponse
} from "../common/dto/report.dto";
import { aggregateAgentPerformanceRaw } from "../persistence/mongo/reportRepository";
import { DailySummaryRow, fetchDailySummaryRows } from "../persistence/mysql/reportRepository";

export async function getDailyCallSummary(
    date: number
): Promise<DailySummaryResponse> {
    const rows: DailySummaryRow[] = await fetchDailySummaryRows(date);

    const perAgent: DailySummaryItem[] = rows.map(function (row: DailySummaryRow): DailySummaryItem {
        const total: number = row.totalCalls || 0;
        const completed: number = row.completedCalls || 0;
        const missed: number = row.missedCalls || 0;
        const completionPercentage: number = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            assignedToUserId: row.assigned_to_user_id,
            totalCalls: total,
            completedCalls: completed,
            missedCalls: missed,
            completionPercentage
        };
    });

    const totalCalls: number = perAgent.reduce(function (acc, item) {
        return acc + item.totalCalls;
    }, 0);

    const completedCalls: number = perAgent.reduce(function (acc, item) {
        return acc + item.completedCalls;
    }, 0);

    const missedCalls: number = perAgent.reduce(function (acc, item) {
        return acc + item.missedCalls;
    }, 0);

    return {
        date,
        totalCalls,
        completedCalls,
        missedCalls,
        perAgent
    };
}

export async function getAgentPerformanceReport(): Promise<AgentPerformanceResponse> {
    const raw = await aggregateAgentPerformanceRaw();

    const agents: AgentPerformanceItem[] = raw.map(function (doc): AgentPerformanceItem {
        const outcomes: AgentPerformanceOutcome[] = (doc.outcomes || []).map(function (o) {
            return {
                outcome: o.outcome,
                count: o.count
            };
        });

        return {
            agentId: doc.agentId,
            totalCalls: doc.totalCalls,
            outcomes
        };
    });

    let busiestAgentId: number | null = null;
    let maxCalls: number = 0;

    agents.forEach(function (item: AgentPerformanceItem) {
        if (item.totalCalls > maxCalls) {
            maxCalls = item.totalCalls;
            busiestAgentId = item.agentId;
        }
    });

    return {
        agents,
        busiestAgentId
    };
}