import express from "express";
import {
  createCoin,
  addTransactionToCoin,
  updateCoin,
} from "../controllers/coinController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(auth);

router.post("/", createCoin);
router.post("/transaction", addTransactionToCoin);
router.put("/:id", updateCoin);

export default router;
