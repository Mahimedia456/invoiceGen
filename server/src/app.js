import express from "express";
import cors from "cors";
import invoiceRoutes from "./routes/invoice.routes.js";

const app = express();

const allowedOrigins = [
  (process.env.APP_URL || "").replace(/\/+$/, ""),
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/+$/, "");

      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "Invoice API is live",
  });
});

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