import express from "express";
import { signUp } from "../controllers/authController.js";
import User from "../models/userModel.js";

const router = express.Router();

router.post("/signup", signUp);





// seulement valable pour les tests et vider la collection
router.delete("/deleteAllUsers", async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).send("Toutes les données ont été supprimées.");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Une erreur est survenue lors de la suppression des données.");
  }
});

export default router;
