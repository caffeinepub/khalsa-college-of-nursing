import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Notice {
    title: string;
    content: string;
    isImportant: boolean;
    date: Time;
}
export interface AdmissionEnquiry {
    applicantName: string;
    programOfInterest: string;
    email: string;
    timestamp: Time;
    phone: string;
}
export type Time = bigint;
export interface NewsEvent {
    title: string;
    date: Time;
    description: string;
    isActive: boolean;
    category: NewsCategory;
}
export interface ContactSubmission {
    subject: string;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
    phone: string;
}
export enum NewsCategory {
    news = "news",
    event = "event"
}
export interface backendInterface {
    addNewsEvent(title: string, description: string, date: Time, category: NewsCategory): Promise<void>;
    addNotice(title: string, content: string, isImportant: boolean): Promise<void>;
    getActiveNewsEvents(): Promise<Array<NewsEvent>>;
    getAllAdmissionEnquiries(): Promise<Array<AdmissionEnquiry>>;
    getAllContactSubmissions(): Promise<Array<ContactSubmission>>;
    getAllNotices(): Promise<Array<Notice>>;
    submitAdmissionEnquiry(applicantName: string, email: string, phone: string, programOfInterest: string): Promise<void>;
    submitContactForm(name: string, email: string, phone: string, subject: string, message: string): Promise<void>;
    toggleNewsEventStatus(index: bigint): Promise<void>;
}
