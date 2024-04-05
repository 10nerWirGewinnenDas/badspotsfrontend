import { Api } from "./api";

const api = new Api({
  baseURL: process.env.REACT_APP_API_URL
});

export const setToken = (token: string) => {
  api.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const removeToken = () => {
  delete api.instance.defaults.headers.common['Authorization']
}

export default api;