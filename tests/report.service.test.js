"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reportRepository_1 = require("../src/persistence/mongo/reportRepository");
const reportRepository_2 = require("../src/persistence/mysql/reportRepository");
const report_service_1 = require("../src/service/report.service");
jest.mock("../src/persistence/mysql/reportRepository");
jest.mock("../src/persistence/mongo/reportRepository");
const mockedFetchDailySummaryRows = reportRepository_2.fetchDailySummaryRows;
const mockedAggregateAgentPerformanceRaw = reportRepository_1.aggregateAgentPerformanceRaw;
describe("report.service", function () {
    describe("getDailyCallSummary", function () {
        it("should map mysql rows into summary dto and compute totals", async function () {
            mockedFetchDailySummaryRows.mockResolvedValueOnce([
                {
                    assigned_to_user_id: 3,
                    totalCalls: 5,
                    completedCalls: 4,
                    missedCalls: 1
                },
                {
                    assigned_to_user_id: 4,
                    totalCalls: 2,
                    completedCalls: 1,
                    missedCalls: 1
                }
            ]);
            const epoch = Date.UTC(2025, 0, 10); // 2025-01-10
            const result = await (0, report_service_1.getDailyCallSummary)(epoch);
            expect(result.date).toBe("2025-01-10");
            expect(result.totalCalls).toBe(7);
            expect(result.completedCalls).toBe(5);
            expect(result.missedCalls).toBe(2);
            expect(result.perAgent).toHaveLength(2);
            const agent3 = result.perAgent.find(function (a) {
                return a.assignedToUserId === 3;
            });
            expect(agent3).toBeDefined();
            expect(agent3?.completionPercentage).toBe(80);
        });
    });
    describe("getAgentPerformanceReport", function () {
        it("should map mongo aggregation result and compute busiest agent", async function () {
            mockedAggregateAgentPerformanceRaw.mockResolvedValueOnce([
                {
                    agentId: 3,
                    totalCalls: 5,
                    outcomes: [
                        { outcome: "SUCCESS", count: 3 },
                        { outcome: "FAILED", count: 2 }
                    ]
                },
                {
                    agentId: 4,
                    totalCalls: 2,
                    outcomes: [
                        { outcome: "FAILED", count: 2 }
                    ]
                }
            ]);
            const result = await (0, report_service_1.getAgentPerformanceReport)();
            expect(result.agents).toHaveLength(2);
            expect(result.busiestAgentId).toBe(3);
            const agent3 = result.agents.find(function (a) {
                return a.agentId === 3;
            });
            expect(agent3).toBeDefined();
            expect(agent3?.totalCalls).toBe(5);
            const successOutcome = agent3?.outcomes.find(function (o) {
                return o.outcome === "SUCCESS";
            });
            expect(successOutcome?.count).toBe(3);
        });
    });
});
