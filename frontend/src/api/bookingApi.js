import api from "./index";

export const createBooking = (data) =>
  api.post("/api/bookings", data);

export const getMyBookings = () =>
  api.get("/api/bookings");

export const createReview = (data) =>
  api.post("/api/bookings/reviews", data);
