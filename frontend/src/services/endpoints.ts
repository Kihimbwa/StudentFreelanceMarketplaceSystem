import api from "./api";
import {
  Application,
  ApplicationPayload,
  Job,
  JobPayload,
  LoginPayload,
  Message,
  MessagePayload,
  RegisterPayload,
  Review,
  ReviewPayload,
  User,
} from "../types";

export const authService = {
  register: (data: RegisterPayload) =>
    api.post<User>("/auth/register/", data).then((r) => r.data),
  login: (data: LoginPayload) =>
    api.post<{ access: string; refresh: string; user: User }>(
      "/auth/login/",
      data
    ).then((r) => r.data),
  logout: () => {
    const refresh = localStorage.getItem("sfm_refresh_token");
    if (refresh) {
      api.post("/auth/logout/", { refresh }).catch(() => {});
    }
  },
};

export const jobService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<Job[]>("/jobs/", { params }).then((r) => r.data),
  getById: (id: number) => api.get<Job>(`/jobs/${id}/`).then((r) => r.data),
  create: (data: JobPayload) => api.post<Job>("/jobs/", data).then((r) => r.data),
  update: (id: number, data: Partial<JobPayload>) =>
    api.patch<Job>(`/jobs/${id}/`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/jobs/${id}/`).then((r) => r.data),
};

export const applicationService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<Application[]>("/applications/", { params }).then((r) => r.data),
  create: (data: ApplicationPayload) =>
    api.post<Application>("/applications/", data).then((r) => r.data),
  update: (id: number, data: Partial<Application>) =>
    api.patch<Application>(`/applications/${id}/`, data).then((r) => r.data),
};

export const messageService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<Message[]>("/messages/", { params }).then((r) => r.data),
  create: (data: MessagePayload) =>
    api.post<Message>("/messages/", data).then((r) => r.data),
};

export const reviewService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<Review[]>("/reviews/", { params }).then((r) => r.data),
  create: (data: ReviewPayload) =>
    api.post<Review>("/reviews/", data).then((r) => r.data),
};
