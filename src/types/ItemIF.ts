export enum ItemStatus {
    LOST = 'LOST',
    FOUND = 'FOUND',
    CLAIMED = 'CLAIMED'
}

export interface ItemIF {
    itemId?: string;
    itemName: string;
    itemDescription?: string;
    location?: string;
    itemImageUrl?: string;
    foundOrLostDate: string; // ISO date format
    itemStatus?: ItemStatus;
    user?: string;
    createAtDate?: string; // Read-only
    createAtTime?: string; // Read-only
    claimedBy?: string; // Read-only
}