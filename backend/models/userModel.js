import mongoose from "mongoose";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    mail: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
    coins: [
      {
        type: Schema.Types.ObjectId,
        ref: "Coin",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;

  // Vérifie si le mot de passe a été modifié ou est nouveau
  if (!user.isModified("password")) {
    return next(); // Si non, passe au middleware suivant
  }

  try {
    // Hachage du mot de passe avant de sauvegarder l'utilisateur
    user.password = await argon2.hash(user.password);
    next(); // Passe au middleware suivant après le hachage
  } catch (error) {
    next(error); // Passe l'erreur au middleware suivant en cas de problème
  }
});

// Méthode pour comparer le mot de passe
userSchema.methods.comparePassword = async function (password) {
  // Utilise une fonction traditionnelle pour accéder à `this` qui fait référence à l'instance courante de l'utilisateur
  return argon2.verify(this.password, password);
};

// Méthode pour générer un token JWT
userSchema.methods.generateToken = async function () {
  // Utilise une fonction traditionnelle pour accéder à `this`
  return jwt.sign({ id: this._id, mail: this.mail }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const user = mongoose.model("User", userSchema);

export default user;
