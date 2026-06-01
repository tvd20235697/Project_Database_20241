import api from "./index";

export const signin = (email, password) =>
  api.post("/api/auth/signin", { email, password });

export const signup = (data) =>
  api.post("/api/auth/signup", data);

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
};
