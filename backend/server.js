// Importer les modules nécessaires
import express from "express"; // Framework web pour Node.js
import dotenv from "dotenv"; // Charger les variables d'environnement à partir d'un fichier .env
import mongoose from "mongoose"; // ODM (Object Data Mapping) pour MongoDB
import process from "process"; // Objet global de processus Node.js
import cors from "cors";
import coinRoutes from "./routes/coinRoutes.js";
import transactionsRoutes from "./routes/transactionsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Charger les variables d'environnement à partir du fichier .env
dotenv.config();

// Créer une instance de l'application Express
const app = express();

// configuration cors
const corsOptions = {
  origin: ["http://localhost:5173"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware pour parser les requêtes JSON
app.use(express.json());

app.use("/api/coin/", coinRoutes);
app.use("/api/transaction/", transactionsRoutes);
app.use("/api/auth/", authRoutes);

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
