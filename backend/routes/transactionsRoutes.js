import express from "express";
import {
  // createTransaction,
  createOnlyTransaction,
  getCoins,
  getCoin,
  updateTransaction,
  deleteCoinAndTransactions,
  deleteTransaction,
} from "../controllers/transactionsController.js";

const router = express.Router();

// router.post("/", createTransaction);
router.post("/name/:name", createOnlyTransaction);
router.get("/", getCoins);
router.get("/id/:id", getCoin);
router.get("/name/:name", getCoin);
router.put("/id/:id", updateTransaction);
router.delete("/:id", deleteCoinAndTransactions);
router.delete("/id/delete/:id", deleteTransaction);

export default router;
