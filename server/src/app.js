import express from "express";
import cors from "cors";
import invoiceRoutes from "./routes/invoice.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    message: "Atomos Invoice API running",
  });
});

app.use("/api/invoice", invoiceRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;