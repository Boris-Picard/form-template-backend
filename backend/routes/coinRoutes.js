import express from "express";
import {
  createCoin,
  addTransactionToCoin,
  updateCoin,
} from "../controllers/coinController.js";

const router = express.Router();

router.post("/", createCoin);
router.post("/transaction", addTransactionToCoin);
router.put("/:id", updateCoin);

export default router;
