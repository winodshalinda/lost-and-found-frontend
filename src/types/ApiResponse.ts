export interface ApiResponse<T> {
    data: T | null;
    error: any | null;
}