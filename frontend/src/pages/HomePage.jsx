import { useEffect } from "react";
import { useProductStore } from "../store/useProductStore";
import ProductCard from "../components/ProductCard";

// 1. Change the imports here:
import { Plus, RefreshCw } from "lucide-react";

const HomePage = () => {
    const { products, fetchProducts, loading, error } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );

    if (error) return <div className="alert alert-error">Error: {error}</div>;

    return (
        <main className="mx-auto px-4 py-8 max-w-6xl">
            <div className="flex justify-between items-center mb-8">
                {/* 2. Update the icon components used here */}
                <button className="btn btn-primary gap-2">
                    <Plus className="size-5" /> Add Product
                </button>
                <button
                    className="btn btn-ghost btn-circle"
                    onClick={fetchProducts}
                >
                    <RefreshCw className="size-5" />
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loading loading-spinner loading-lg" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </main>
    );
};

export default HomePage;
