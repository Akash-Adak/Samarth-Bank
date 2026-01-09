import axios from "axios";

export const handleLogin = async ({
  e,
  form,
  API,
  login,
  navigate,
  setError,
  setLoading
}) => {
  e.preventDefault();

  if (!form.username || !form.password) {
    setError("Please enter your Customer ID and Password.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const res = await axios.post(`${API}/api/auth/login`, form);

    localStorage.setItem("username", res.data.username);
    localStorage.setItem(`${res.data.username}-role`, res.data.role);

    login(res.data.token);

    navigate(res.data.role === "ADMIN" ? "/admin" : "/dashboard");

  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Authentication failed. Please check your credentials."
    );
  } finally {
    setLoading(false);
  }
};
