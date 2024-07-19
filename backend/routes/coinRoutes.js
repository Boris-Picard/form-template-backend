import express from "express";
import {
  // updateCoin,
  getDetailedTransactions,
  createCoinAndTransaction,
} from "../controllers/coinController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(auth);

router.post("/createTransaction", createCoinAndTransaction);
router.get("/detailed/:id", getDetailedTransactions);
// router.put("/:id", updateCoin);

export default router;
