import { signUp } from "../controllers/authController.js";
import { jest } from "@jest/globals";

describe("User Controller - signUp", () => {
  let req, res;

  beforeEach(() => {
    req = { body: { mail: "", password: "" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return validation errors if email or password is invalid", async () => {
    req.body.mail = "invalid-email";
    req.body.password = "short";

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Array),
      })
    );
  });


});
