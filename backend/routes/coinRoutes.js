import express from "express";
import {
  createCoin,
  addTransactionToCoin,
} from "../controllers/coinController.js";

const router = express.Router();

router.post("/", createCoin);
router.post("/transaction", addTransactionToCoin);

export default router;
