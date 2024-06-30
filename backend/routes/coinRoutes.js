import express from "express";
import {
  createCoin,
  addTransactionToCoin,
  updateCoin,
  getDetailedTransactions,
} from "../controllers/coinController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(auth);

router.post("/", createCoin);
router.post("/transaction", addTransactionToCoin);
router.get("/detailed/:id", getDetailedTransactions);
router.put("/:id", updateCoin);

export default router;
