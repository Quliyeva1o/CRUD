import axios from "axios";
import BASE_URL from "./constants";

interface Payload {
  [key: string]: any;
}

interface ErrorResponse {
  message: string;
  status: number;
}

interface Controller {
  post: (endpoint: string, payload: Payload) => Promise<any>;
  getAll: (endpoint: string) => Promise<any>;
  getOne: (endpoint: string, id: string | number) => Promise<any>;
  delete: (endpoint: string, id: string | number) => Promise<any>;
  put: (
    endpoint: string,
    id: string | number,
    payload: Payload
  ) => Promise<any>;
  patch: (
    endpoint: string,
    id: string | number,
    payload: Payload
  ) => Promise<any>;
}

// Utility functions
async function getAll(endpoint: string): Promise<any> {
  try {
    const response = await axios.get(BASE_URL + endpoint);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function getOne(endpoint: string, id: string | number): Promise<any> {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function post(endpoint: string, payload: Payload): Promise<any> {
  try {
    const response = await axios.post(BASE_URL + endpoint, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function deleteOne(endpoint: string, id: string | number): Promise<any> {
  try {
    const response = await axios.delete(`${BASE_URL}${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function put(
  endpoint: string,
  id: string | number,
  payload: Payload
): Promise<any> {
  try {
    const response = await axios.put(`${BASE_URL}${endpoint}/${id}`, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

async function patch(
  endpoint: string,
  id: string | number,
  payload: Payload
): Promise<any> {
  try {
    const response = await axios.patch(`${BASE_URL}${endpoint}/${id}`, payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown): ErrorResponse {
  if (axios.isAxiosError(error)) {
    return {
      message: error.message,
      status: error.response?.status ?? 500,
    };
  }
  return {
    message: "An unexpected error occurred",
    status: 500,
  };
}

const requestsController: Controller = {
  post,
  getAll,
  getOne,
  delete: deleteOne,
  put,
  patch,
};

export default requestsController;
