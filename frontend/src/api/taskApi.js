import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/tasks"; // ← ここを修正！

export const getTasks = async () => {
  const res = await axios.get(API_BASE_URL);
  return res.data;
};

export const addTask = async (task) => {
  const res = await axios.post(API_BASE_URL, task);
  return res.data;
};

export const updateTask = async (id, task) => {
  const res = await axios.put(`${API_BASE_URL}/${id}`, task);
  return res.data;
};

export const deleteTask = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
