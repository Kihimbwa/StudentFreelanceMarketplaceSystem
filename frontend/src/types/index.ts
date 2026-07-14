export type UserRole = "student" | "client";

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export type JobStatus = "open" | "closed" | "in_progress" | "completed";

export interface Job {
  id: number;
  client_id: number;
  title: string;
  description: string;
  budget: string;
  skills_required: string;
  status: JobStatus;
  created_at: string;
}

export interface JobPayload {
  title: string;
  description: string;
  budget: string;
  skills_required: string;
}

export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface Application {
  id: number;
  student: number;
  job: number;
  proposal: string;
  bid_amount: string;
  status: ApplicationStatus;
  created_at: string;
}

export interface ApplicationPayload {
  job: number;
  proposal: string;
  bid_amount: string;
}

export interface Message {
  id: number;
  sender: number;
  receiver: number;
  content: string;
  timestamp: string;
  is_read: boolean;
}

export interface MessagePayload {
  receiver: number;
  content: string;
}

export interface Review {
  id: number;
  reviewer: number;
  reviewer_name: string;
  reviewee: number;
  reviewee_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewPayload {
  reviewee: number;
  rating: number;
  comment: string;
}

export interface ApiError {
  detail?: string;
  [key: string]: unknown;
}
