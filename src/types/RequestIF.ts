export interface RequestIF {
    requestId?: string;
    item: string;
    user?: string;
    requestStatus?: RequestStatus;
    requestMessage: string;
    requestDate?: string;
    requestTime?: string;
    reviewDate?: string;
    reviewTime?: string;
}

export enum RequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}