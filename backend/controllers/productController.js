import { sql } from "../config/db.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await sql`SELECT * FROM products 
        ORDER BY created_at DESC`;

        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.log("Error fetching products:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const createProduct = async (req, res) => {
    const { name, price, image } = req.body;

    if (!name || !price || !image) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields",
        });
    }
    try {
        const newProduct = await sql`
        INSERT INTO products (name,price,image)
        VALUES (${name}, ${price}, ${image})
        RETURNING *;
        `;

        console.log("Product created successfully");
        console.log("newProduct:", newProduct[0]);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: newProduct[0],
        });
    } catch (error) {
        console.log("Error creating product:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const getProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await sql`SELECT * FROM products WHERE id = ${id}`;

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        console.log("Product fetched successfully");
        console.log("product:", product[0]);

        res.status(200).json({ success: true, data: product[0] });
    } catch (error) {
        console.log("Error fetching product:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, image } = req.body;

    if (!name || !price || !image) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields",
        });
    }
    try {
        const updatedProduct = await sql`
        UPDATE  PRODUCTS
            SET name = ${name},
            price = ${price},
            image = ${image},
            updated_at = NOW()
            WHERE id = ${id}
            RETURNING *;
        `;

        if (updatedProduct.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        console.log("Product updated successfully");
        console.log("updatedProduct:", updatedProduct[0]);

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct[0],
        });
    } catch (error) {
        console.log("Error updating product:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await sql`
        DELETE FROM products WHERE id = ${id} RETURNING *;
        `;
        if (deletedProduct.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        console.log("Product deleted successfully");
        console.log("deletedProduct:", deletedProduct[0]);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: deletedProduct[0],
        });
    } catch (error) {
        console.log("Error deleting product:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
