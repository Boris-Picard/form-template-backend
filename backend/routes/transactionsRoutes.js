import express from "express";
import {
  createTransaction,
  getCoins,
  getCoin,
  deleteTransaction,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.post("/", createTransaction);
router.get("/", getCoins);
router.get("/:id", getCoin);
router.delete("/:id", deleteTransaction);

export default router;
