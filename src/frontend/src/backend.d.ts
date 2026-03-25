import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface MatrimonyProfile {
    age: bigint;
    bio: string;
    name: string;
    createdAt: Time;
    education: string;
    community: string;
    profession: string;
    isActive: boolean;
    imageUrl: string;
    gender: Gender;
    contactEmail: string;
    location: string;
}
export interface ContactInquiry {
    subject: InquirySubject;
    name: string;
    createdAt: Time;
    email: string;
    message: string;
    phone: string;
}
export interface UserProfile {
    name: string;
}
export interface CateringService {
    name: string;
    createdAt: Time;
    description: string;
    isActive: boolean;
    priceRange: PriceRange;
    imageUrl: string;
    category: CateringCategory;
    phone: string;
}
export enum CateringCategory {
    festival = "festival",
    wedding = "wedding",
    birthday = "birthday",
    corporate = "corporate"
}
export enum Gender {
    other = "other",
    female = "female",
    male = "male"
}
export enum InquirySubject {
    matrimony = "matrimony",
    catering = "catering",
    general = "general"
}
export enum PriceRange {
    premium = "premium",
    budget = "budget",
    standard = "standard"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCateringService(service: CateringService): Promise<bigint>;
    addMatrimonyProfile(profile: MatrimonyProfile): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteCateringService(id: bigint): Promise<void>;
    deleteMatrimonyProfile(id: bigint): Promise<void>;
    filterMatrimonyProfiles(community: string | null, location: string | null, gender: Gender | null): Promise<Array<MatrimonyProfile>>;
    getAllActiveCateringServices(): Promise<Array<CateringService>>;
    getAllActiveMatrimonyProfiles(): Promise<Array<MatrimonyProfile>>;
    getAllContactInquiries(): Promise<Array<ContactInquiry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactInquiry(inquiry: ContactInquiry): Promise<bigint>;
    updateCateringService(id: bigint, service: CateringService): Promise<void>;
    updateMatrimonyProfile(id: bigint, profile: MatrimonyProfile): Promise<void>;
}
