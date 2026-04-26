import express from "express";
import { registerRoutes } from "../server/routes.js";
import { createServer } from "http";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Vercel serverless functions environment
const server = createServer(app);

// Register API routes
registerRoutes(server, app).catch(console.error);

export default app;
