import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = "http://localhost:3001/api";

export const useProductStore = create((set, get) => ({
    products: [],
    isLoading: false,
    error: null,

    formData: {
        name: "",
        price: "",
        image: "",
    },

    setFormData: (formData) => set({ formData }),
    resetForm: () => set({ formData: { name: "", price: "", image: "" } }),

    addProduct: async (e) => {
        set({ loading: true, error: null });
        e.preventDefault();

        try {
            const { formData } = get();
            await axios.post(`${BASE_URL}/products`, formData);
            await get().fetchProducts();
            get().resetForm();
            toast.success("Product added successfully");
            document.getElementById("add_product_modal").close();
        } catch (error) {
            console.error("error adding the product", error);
            toast.error("Failed to add product");
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

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

    deleteProduct: async (id) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`${BASE_URL}/products/${id}`);
            set((prev) => ({
                products: prev.products.filter((p) => p.id !== id),
                loading: false,
            }));
            toast.success("Product deleted successfully");
        } catch (err) {
            set({ error: err.message, loading: false });
            console.error(err);
            toast.error(
                err.response.data.message || "Failed to delete product",
            );
        } finally {
            set({ loading: false });
        }
    },
}));
