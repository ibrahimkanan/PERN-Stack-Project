import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { productRoutes } from "./routes/productRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(helmet());

// arcjet middleware

app.use(cors());
app.use(morgan("dev"));

app.get("/api/product", productRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
