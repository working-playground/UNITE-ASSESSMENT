export async function sendTaskAssignedNotification(
    phoneNumber: string,
    message: string
): Promise<void> {
    if (process.env.NOTIFICATIONS_ENABLED !== "true") {
        console.log("Notification skipped (NOTIFICATIONS_ENABLED != true):", message);
        return;
    }

    console.log("Would send SNS/Twilio for assignment to", phoneNumber, "message:", message);
}

export async function sendTaskCompletedNotification(
    phoneNumber: string,
    message: string
): Promise<void> {
    if (process.env.NOTIFICATIONS_ENABLED !== "true") {
        console.log("Notification skipped (NOTIFICATIONS_ENABLED != true):", message);
        return;
    }

    console.log("Would send SNS/Twilio for completion to", phoneNumber, "message:", message);
}
