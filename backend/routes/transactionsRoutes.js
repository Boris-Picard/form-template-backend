import express from "express";
import {
  createTransaction,
  getCoins,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.post("/", createTransaction);
router.get("/", getCoins);

export default router;
