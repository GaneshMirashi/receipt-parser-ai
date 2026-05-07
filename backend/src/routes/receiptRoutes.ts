import express from "express";
import upload from "../utils/multer";
import { uploadReceipt, saveReceipt, getReceipts } from "../controllers/receiptController";

const router = express.Router();

router.post(
  "/upload",
  upload.single("receipt"),
  uploadReceipt
);
router.post("/save", saveReceipt);
router.get("/", getReceipts);

export default router;