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

  // test if validation schema is valid
  it("should return validation errors if email or password is invalid", async () => {
    req.body.mail = "invalid-email";
    req.body.password = "short";

    userSchema.parse.mockImplementation(() => {
      throw { errors: ["Email is invalid", "Password is too short"] };
    });

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Array),
      })
    );
  });

  // test if user already exist
  it("should return error if mail already exist", async () => {
    req.body = { mail: "test@test.com", password: "validPassword123" };

    User.findOne.mockResolvedValue({ mail: req.body.mail });

    await signUp(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ mail: req.body.mail });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "User already exist" });
  });
});
