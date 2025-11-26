export enum UserRole {
    Admin = "admin",
    Manager = "manager",
    Agent = "agent"
}

export enum UserRoleOtherThanAdmin {
    Manager = "manager",
    Agent = "agent"
}

export enum LeadStatus {
    New = "new",
    InProgress = "in_progress",
    Contacted = "contacted",
    Completed = "completed",
    Closed = "closed"
}

export enum LeadSource {
    Manual = "manual",
    CsvImport = "csv_import",
    Website = "website",
    Facebook = "facebook",
    GoogleAds = "google_ads",
    Referral = "referral",
    Other = "other"
}

export enum CallOutcome {
    Success = "success",
    NoAnswer = "no_answer",
    Busy = "busy",
    WrongNumber = "wrong_number",
    FollowUpRequired = "follow_up_required",
    NotInterested = "not_interested"
}