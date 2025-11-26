import { createError } from "../src/common/errors/simpleError";
import * as leadServiceModule from "../src/service/lead.service";
import { uploadLeadImage } from "../src/service/lead.service";
import * as s3UtilModule from "../src/utils/s3.service";

describe("lead.service - uploadLeadImage", function () {
    it("should throw if lead does not exist", async function () {
        const getLeadByIdServiceSpy = jest
            .spyOn(leadServiceModule, "getLeadByIdService")
            .mockResolvedValueOnce(null as any);

        await expect(
            uploadLeadImage(1, Buffer.from("test"), "test.png", "image/png")
        ).rejects.toMatchObject(createError(404, "Lead not found", "LEAD_NOT_FOUND"));

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
            .mockResolvedValueOnce(lead as any);

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
            } as any);

        const result = await uploadLeadImage(
            1,
            Buffer.from("test"),
            "test.png",
            "image/png"
        );

        expect(uploadImageToS3Spy).toHaveBeenCalledTimes(1);
        expect(updateLeadServiceSpy).toHaveBeenCalledTimes(1);
        expect(result.imageUrl).toBe("https://bucket.s3.region.amazonaws.com/images/test.png");

        getLeadByIdServiceSpy.mockRestore();
        uploadImageToS3Spy.mockRestore();
        updateLeadServiceSpy.mockRestore();
    });
});
