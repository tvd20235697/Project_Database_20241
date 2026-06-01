import api from "./index";

export const getPublicFields = (branchId) =>
  branchId
    ? api.get(`/api/public/fields?branchId=${branchId}`)
    : api.get("/api/public/fields");

export const getFieldDetails = (id) =>
  api.get(`/api/public/fields/${id}`);

export const getFieldAvailability = (id, date) =>
  api.get(`/api/public/fields/${id}/availability?date=${date}`);

export const getBranches = () =>
  api.get("/api/public/branches");
