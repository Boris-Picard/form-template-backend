import express from "express";

const router = express.Router();

router.post("coin", createCoin);

export default router;
