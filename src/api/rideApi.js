import client from "./client";

export const getPendingRides = async () => {
  const res = await client.get("/rides/pending");
  return res.data;
};

export const acceptRide = async (rideId) => {
  const res = await client.post(`/rides/${rideId}/accept`);
  return res.data;
};

export const rejectRide = async (rideId) => {
  const res = await client.post(`/rides/${rideId}/reject`);
  return res.data;
};

export const completeRide = async (rideId) => {
  const res = await client.post(`/rides/${rideId}/complete`);
  return res.data;
};
