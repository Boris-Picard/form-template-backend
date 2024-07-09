import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import process from "process";
import cors from "cors";
import coinRoutes from "./routes/coinRoutes.js";
import transactionsRoutes from "./routes/transactionsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import { authLimiter, apiLimiter } from "./middleware/rateLimitMiddleware.js";
import { fileURLToPath } from "url";
import path from "path";

// Charger les variables d'environnement à partir du fichier .env
dotenv.config();

// Définir __filename et __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Créer une instance de l'application Express
const app = express();

app.set("trust proxy", 1);

// Configuration CORS
const corsOptions = {
  origin: ["https://mycryptofolio.site"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(cookieParser());

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Vos routes API
app.use("/api/coin/", apiLimiter, coinRoutes);
app.use("/api/transaction/", apiLimiter, transactionsRoutes);
app.use("/api/auth/", authLimiter, authRoutes);

/// Servir les fichiers statiques de l'application React depuis le dossier `client/dist`
const staticFilesPath = path.join(__dirname, "./client/dist");
app.use(express.static(staticFilesPath));

// Catch-all handler pour envoyer index.html pour toute requête non API
app.get("*", (req, res) => {
  const indexPath = path.join(staticFilesPath, "index.html");
  res.sendFile(indexPath);
});

// Gestion des erreurs pour les routes non trouvées
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Middleware de gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Connexion à la base de données MongoDB
mongoose
  .connect(process.env.MONGODB) // Utilisation de l'URI MongoDB définie dans le fichier .env
  .then(() => {
    // En cas de réussite de la connexion à la base de données
    // Démarrer le serveur Express
    app.listen(process.env.PORT || 5173, () => {
      // Écouter sur le port défini dans le fichier .env ou le port par défaut 3000
      console.log(`connected to db & listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    // En cas d'échec de la connexion à la base de données
    console.log(error); // Afficher l'erreur dans la console
  });
