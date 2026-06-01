import api from "./index";

export const getCurrentUser = () =>
  api.get("/api/users/me");

export const updateCurrentUser = (data) =>
  api.put("/api/users/me", data);

export const getUserBookings = () =>
  api.get("/api/users/bookings");

export const cancelUserBooking = (id) =>
  api.delete(`/api/users/bookings/${id}`);
