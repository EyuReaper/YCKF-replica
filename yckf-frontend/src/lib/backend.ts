import { Currency } from "lucide-react";

export const BACKEND_API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_BASE || 'http://localhost:4000';

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BACKEND_API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/pdf') || ct.includes('application/octet-stream')) {
    return res.arrayBuffer();
  }
  return res.json();
}

export const BackendApi = {
  // Auth
  register(data: { name: string; email: string; password: string }) {
    return request('/auth/register', { method: 'POST', body: JSON.stringify(data) });
  },
  login(data: { email: string; password: string }) {
    return request('/auth/login', { method: 'POST', body: JSON.stringify(data) });
  },
  forgotPassword(email: string) {
    return request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
  },
  resetPassword(token: string, password: string) {
    return request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) });
  },

  // Courses
  listCourses() {
    return request('/courses');
  },
  createCourse(token: string, payload: any) {
    return request('/courses', { method: 'POST', body: JSON.stringify(payload), headers: { Authorization: `Bearer ${token}` } });
  },
  updateCourse(token: string, id: string, payload: any) {
    return request(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(payload), headers: { Authorization: `Bearer ${token}` } });
  },
  deleteCourse(token: string, id: string) {
    return request(`/courses/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  },

  // Payments / Donations
  donate(params: {
    courseId: string;
    amount: number;
    currency?: 'GHS' | 'USD'; // supports dual currencies
    paymentMethod: 'card' | 'mobile_money';
    donor: { name: string; email: string; phone?: string }; // for MTN/Telecel
    tier?: string;
  }) {
    return request('/payments/donate', { 
      method: 'POST', 
      body: JSON.stringify({ 
        ...params, 
        currency: params.currency || 'GHS' // default currency
      }) 
    });
  },

  // Certificates
  generateCertificate(token: string, progressId: string) {
    return request('/certificates/generate', { method: 'POST', body: JSON.stringify({ progressId }), headers: { Authorization: `Bearer ${token}` } });
  },
  verifyCertificate(certificateId: string) {
    return request(`/certificates/verify/${certificateId}`);
  },

  // Admin
  analytics(token: string) {
    return request('/admin/analytics', { headers: { Authorization: `Bearer ${token}` } });
  },
};