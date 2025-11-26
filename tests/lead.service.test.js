"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const simpleError_1 = require("../src/common/errors/simpleError");
const leadServiceModule = __importStar(require("../src/service/lead.service"));
const lead_service_1 = require("../src/service/lead.service");
const s3UtilModule = __importStar(require("../src/utils/s3.service"));
describe("lead.service - uploadLeadImage", function () {
    it("should throw if lead does not exist", async function () {
        const getLeadByIdServiceSpy = jest
            .spyOn(leadServiceModule, "getLeadByIdService")
            .mockResolvedValueOnce(null);
        await expect((0, lead_service_1.uploadLeadImage)(1, Buffer.from("test"), "test.png", "image/png")).rejects.toMatchObject((0, simpleError_1.createError)(404, "Lead not found", "LEAD_NOT_FOUND"));
        getLeadByIdServiceSpy.mockRestore();
    });
    it("should upload image to s3 and update lead", async function () {
        const lead = {
            id: 1,
            name: "John",
            phone: "9990001111",
            email: "john@lead.com",
            status: "NEW",
            source: "WEBSITE",
            assignedToUserId: 3,
            imageUrl: null,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const getLeadByIdServiceSpy = jest
            .spyOn(leadServiceModule, "getLeadByIdService")
            .mockResolvedValueOnce(lead);
        const uploadImageToS3Spy = jest
            .spyOn(s3UtilModule, "uploadImageToS3")
            .mockResolvedValueOnce({
            key: "images/test.png",
            url: "https://bucket.s3.region.amazonaws.com/images/test.png"
        });
        const updateLeadServiceSpy = jest
            .spyOn(leadServiceModule, "updateLeadService")
            .mockResolvedValueOnce({
            ...lead,
            imageUrl: "https://bucket.s3.region.amazonaws.com/images/test.png"
        });
        const result = await (0, lead_service_1.uploadLeadImage)(1, Buffer.from("test"), "test.png", "image/png");
        expect(uploadImageToS3Spy).toHaveBeenCalledTimes(1);
        expect(updateLeadServiceSpy).toHaveBeenCalledTimes(1);
        expect(result.imageUrl).toBe("https://bucket.s3.region.amazonaws.com/images/test.png");
        getLeadByIdServiceSpy.mockRestore();
        uploadImageToS3Spy.mockRestore();
        updateLeadServiceSpy.mockRestore();
    });
});
