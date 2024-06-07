import express from "express";
import {
  createTransaction,
  createOnlyTransaction,
  getCoins,
  getCoin,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.post("/", createTransaction);
router.post("/:id", createOnlyTransaction);
router.get("/", getCoins);
router.get("/:id", getCoin);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
