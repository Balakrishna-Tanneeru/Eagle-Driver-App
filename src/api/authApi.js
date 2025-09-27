import client from "./client";

// Register driver
export const registerDriver = async (driverData) => {
  const res = await client.post("/driver/auth/register", driverData);
  return res.data;
};

// Login driver
export const loginDriver = async (credentials) => {
  const res = await client.post("/driver/auth/login", credentials);
  return res.data; // { token, refreshToken, user }
};
