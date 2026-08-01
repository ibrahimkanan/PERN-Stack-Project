import { create } from "zustand";
import axios from "axios";

const BASE_URL = "http://localhost:3001/api";

export const useProductStore = create((set, get) => ({
    products: [],
    isLoading: false,
    error: null,
    fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${BASE_URL}/products`);
            set({ products: response.data.data, loading: false, error: null });
        } catch (err) {
            if (err.response.status === 429) {
                set({
                    error: "Too many requests",
                    loading: false,
                    products: [],
                });
            } else if (err.response.status === 401) {
                set({
                    error: "Unauthorized",
                    loading: false,
                    products: [],
                });
            } else {
                set({ error: err.message, loading: false });
            }
        } finally {
            set({ loading: false });
        }
    },
}));
