import api from "./index";

export const getBranches = () =>
  api.get("/api/admin/branches");

export const createBranch = (data) =>
  api.post("/api/admin/branches", data);

export const updateBranch = (id, data) =>
  api.put(`/api/admin/branches/${id}`, data);

export const deleteBranch = (id) =>
  api.delete(`/api/admin/branches/${id}`);

export const getFields = () =>
  api.get("/api/admin/fields");

export const getField = (id) =>
  api.get(`/api/admin/fields/${id}`);

export const createField = (data) =>
  api.post("/api/admin/fields", data);

export const updateField = (id, data) =>
  api.put(`/api/admin/fields/${id}`, data);

export const deleteField = (id) =>
  api.delete(`/api/admin/fields/${id}`);

export const getTimeSlots = (fieldId) =>
  api.get(`/api/admin/fields/${fieldId}/timeslots`);

export const createTimeSlot = (fieldId, data) =>
  api.post(`/api/admin/fields/${fieldId}/timeslots`, data);

export const updateTimeSlot = (id, data) =>
  api.put(`/api/admin/timeslots/${id}`, data);

export const deleteTimeSlot = (id) =>
  api.delete(`/api/admin/timeslots/${id}`);

export const getBookings = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/api/admin/bookings${query ? `?${query}` : ""}`);
};

export const getBooking = (id) =>
  api.get(`/api/admin/bookings/${id}`);

export const approveBooking = (id) =>
  api.put(`/api/admin/bookings/${id}/approve`);

export const cancelBooking = (id) =>
  api.put(`/api/admin/bookings/${id}/cancel`);

export const completeBooking = (id) =>
  api.put(`/api/admin/bookings/${id}/complete`);

export const deleteBooking = (id) =>
  api.delete(`/api/admin/bookings/${id}`);

export const getCustomers = () =>
  api.get("/api/admin/customers");

export const getAllReviews = () =>
  api.get("/api/admin/reviews");

export const deleteReview = (id) =>
  api.delete(`/api/admin/reviews/${id}`);

export const getRevenue = (year) =>
  api.get(`/api/admin/revenue${year ? `?year=${year}` : ""}`);

export const getRevenueSummary = () =>
  api.get("/api/admin/revenue/summary");

export const getTopFields = (limit) =>
  api.get(`/api/admin/revenue/top-fields?limit=${limit || 5}`);
