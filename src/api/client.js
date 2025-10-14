import axios from "axios";

const client = axios.create({
  baseURL: "http://192.168.0.4:8080/api", // ⚠️ Replace with your backend LAN IP
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
