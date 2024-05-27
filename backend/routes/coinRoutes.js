import express from "express";
import { createCoin } from "../controllers/coinController.js";

const router = express.Router();

router.post("coin", createCoin);

export default router;
