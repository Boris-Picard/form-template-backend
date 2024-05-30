import express from "express";
import {
  createTransaction,
  getCoins,
  deleteTransaction,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.post("/", createTransaction);
router.get("/", getCoins);
router.delete("/:id", deleteTransaction);

export default router;
