import { Router } from "express";
import { previewInvoice, requestInvoice } from "../controllers/invoice.controller.js";

const router = Router();

router.post("/request", requestInvoice);
router.get("/preview/:orderNumber", previewInvoice);

export default router;