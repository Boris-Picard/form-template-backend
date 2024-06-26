import { signIn, signUp } from "../controllers/authController.js";
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
    User.Create = jest.fn();
    req = { body: { mail: "", password: "" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Test si le schéma de validation est valide
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

  // Test si un utilisateur existe déjà
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

  // Test que l'utilisateur est bien créer et les données envoyées sont correct
  it("should create a new user and return all values needed", async () => {
    req.body = { mail: "test@test.com", password: "validPassword123" };

    User.findOne.mockResolvedValue(null);

    const mockedUser = {
      _id: "mocked_id",
      mail: req.body.mail,
      role: "user",
      transactions: [],
      coins: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: req.body.password,
      generateToken: jest.fn().mockResolvedValue("mocked_token"),
    };

    User.create.mockResolvedValue(mockedUser);

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: "mocked_token",
      user: {
        id: "mocked_id",
        mail: req.body.mail,
        role: "user",
        transactions: [],
        coins: 0,
        createdAt: mockedUser.createdAt,
        updatedAt: mockedUser.updatedAt,
        password: req.body.password,
      },
    });
  });
});

describe("User Controller - signIn", () => {
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

  // Test si le schéma de validation est valide
  it("should return validation errors if email or password is invalid", async () => {
    // Prépare les données de requête avec un email invalide et un mot de passe trop court
    req.body = { mail: "invalid-email", password: "short" };

    // Mocke userSchema.parse pour générer une exception avec des erreurs spécifiques
    // mockImplementationOnce au lieu de mockResolvedValue pour les exceptions
    userSchema.parse.mockImplementationOnce(() => {
      throw { errors: ["Email is invalid", "Password is too short"] };
    });

    // Appelle la fonction signUp avec les données de requête
    await signIn(req, res);

    // Vérifie que la réponse a un statut 400 et retourne un objet JSON contenant des erreurs
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Array),
      })
    );
  });

  // Test si un utilisateur n'existe pas
  it("should return a 401 status if user doesnt exist", async () => {
    req.body = { mail: "test@test.com", password: "validPassword123" };

    User.findOne.mockImplementationOnce(null);

    await signIn(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ mail: req.body.mail });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid email or password",
    });
  });

  it("should return an error if password is not ok", async () => {
    req.body = { mail: "test@test.com", password: "validPassword123" };

    const mockUser = {
      mail: req.body.mail,
      comparePassword: jest.fn().mockResolvedValue(false),
    };

    User.findOne.mockResolvedValue(mockUser);

    await signIn(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ mail: req.body.mail });
    expect(mockUser.comparePassword).toHaveBeenCalledWith(req.body.password);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid email or password",
    });
  });

  // Test réussi de connexion
  it("should successfully login and return user data with token", async () => {
    req.body = { mail: "test@test.com", password: "validPassword123" };

    const mockUser = {
      _id: "mocked_id",
      mail: req.body.mail,
      role: "user",
      transactions: [],
      coins: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      comparePassword: jest.fn().mockResolvedValue(true),
      generateToken: jest.fn().mockResolvedValue("mocked_token"),
    };

    User.findOne.mockResolvedValue(mockUser);

    await signIn(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ mail: req.body.mail });
    expect(mockUser.comparePassword).toHaveBeenCalledWith(req.body.password);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Successfully connected to website",
      token: "mocked_token",
      user: {
        id: mockUser._id,
        mail: mockUser.mail,
        role: mockUser.role,
        transactions: mockUser.transactions,
        coins: mockUser.coins,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
        password: mockUser.password,
      },
    });
  });
});
