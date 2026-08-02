import express, { request } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { sql } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import rateLimit from "./middleware/rateLimit.js";

dotenv.config();

const PORT = process.env.PORT || 3001;

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(
    helmet({
        contentSecurityPolicy: false,
    }),
);

// arcjet middleware

app.use(cors());
app.use(morgan("dev"));

// apply arcjet rate limit to all routes
app.use(rateLimit);

app.use("/api/products", productRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
    });
}

async function initDB() {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS products(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection failed", error);
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
