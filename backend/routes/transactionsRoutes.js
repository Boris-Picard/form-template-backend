import express from "express";
import { createTransaction } from "../controllers/transactionsController.js";

const router = express.Router();

router.post("/", createTransaction);

export default router;
