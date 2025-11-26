export interface DailySummaryItem {
    assignedToUserId: number;
    totalCalls: number;
    completedCalls: number;
    missedCalls: number;
    completionPercentage: number;
}

export interface DailySummaryResponse {
    date: number;
    totalCalls: number;
    completedCalls: number;
    missedCalls: number;
    perAgent: DailySummaryItem[];
}

export interface AgentPerformanceOutcome {
    outcome: string;
    count: number;
}

export interface AgentPerformanceItem {
    agentId: number;
    totalCalls: number;
    outcomes: AgentPerformanceOutcome[];
}

export interface AgentPerformanceResponse {
    agents: AgentPerformanceItem[];
    busiestAgentId: number | null;
}