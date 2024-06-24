import { signUp } from "../controllers/authController.js";
import { jest } from "@jest/globals";
import User from "../models/userModel.js";
import userSchema from "../schemas/userSchema.js";

jest.mock("../models/userModel.js");
jest.mock("../schemas/userSchema.js");

describe("User Controller - signUp", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    User.findOne = jest.fn();
    req = { body: { mail: "", password: "" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Teste si le schéma de validation est valide
  it("should return validation errors if email or password is invalid", async () => {
    // Prépare les données de requête avec un email invalide et un mot de passe trop court
    req.body = { mail: "invalid-email", password: "short" };

    // Mocke userSchema.parse pour générer une exception avec des erreurs spécifiques
    // mockImplementationOnce au lieu de mockResolvedValue pour les exceptions
    userSchema.parse.mockImplementationOnce(() => {
      throw { errors: ["Email is invalid", "Password is too short"] };
    });

    // Appelle la fonction signUp avec les données de requête
    await signUp(req, res);

    // Vérifie que la réponse a un statut 400 et retourne un objet JSON contenant des erreurs
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Array),
      })
    );
  });

  // Teste si un utilisateur existe déjà
  it("should return error if mail already exist", async () => {
    // Prépare les données de requête avec un email existant et un mot de passe valide
    req.body = { mail: "test@test.com", password: "validPassword123" };

    // Mocke User.findOne pour simuler la présence d'un utilisateur avec le même email
    User.findOne.mockResolvedValue({ mail: req.body.mail });

    // Appelle la fonction signUp avec les données de requête
    await signUp(req, res);

    // Vérifie que User.findOne a été appelé avec l'email de la requête
    expect(User.findOne).toHaveBeenCalledWith({ mail: req.body.mail });

    // Vérifie que la réponse a un statut 401 et retourne un objet JSON avec une erreur d'utilisateur existant
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "User already exist" });
  });
});
