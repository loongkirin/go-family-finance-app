import axios from "@/lib/axios";

export const authApi = {
    login: async (data: LoginInput): Promise<AuthResponse> => {
        const response = await axios.post(`${API_URL}/auth/login`, data);
        return response.data;
    },
    register: async (data: RegisterInput): Promise<AuthResponse> => {
        const response = await axios.post(`${API_URL}/auth/register`, data);
        return response.data;
    },
    logout: async (): Promise<AuthResponse> => {
        const response = await axios.post(`${API_URL}/auth/logout`);
        return response.data;
    },
};
