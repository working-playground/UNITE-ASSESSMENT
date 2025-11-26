import { CallLogAttributes, CallLogModel } from "../../models/mongo/callLogModel";

export async function createCallLog(
    attributes: CallLogAttributes
): Promise<void> {
    await CallLogModel.create(attributes);
}

