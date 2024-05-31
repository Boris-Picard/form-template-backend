import express from "express";
import {
  createTransaction,
  getCoins,
  deleteTransaction,
  updateTransaction,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.post("/", createTransaction);
router.get("/", getCoins);
router.put("/:id");
router.delete("/:id", deleteTransaction);

export default router;
