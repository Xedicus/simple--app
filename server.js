const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

// Créer une instance de l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Pour parser les requêtes JSON

// Configurer la connexion à la base de données
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root", // Assure-toi que le mot de passe est correct ou vide
  database: "testdb",
});

// Vérifier la connexion à la base de données
db.connect((err) => {
  if (err) throw err;
  console.log("Connecté à la base de données MySQL.");
});

// Définir les routes API

// Récupérer toutes les données
app.get("/api/data", (req, res) => {
  db.query("SELECT * FROM my_table", (err, results) => {
    if (err) return res.status(500).send("Erreur serveur");
    res.json(results);
  });
});

// Ajouter une nouvelle donnée
app.post("/api/data", (req, res) => {
  const { name } = req.body;
  db.query("INSERT INTO my_table (name) VALUES (?)", [name], (err, result) => {
    if (err) return res.status(500).send("Erreur serveur");
    const newItem = { id: result.insertId, name };
    res.status(201).json(newItem);
  });
});

// Supprimer une donnée par ID
app.delete("/api/data/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM my_table WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send("Erreur serveur");
    res.status(200).send("Données supprimées");
  });
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

// Démarrer le serveur
const server = app.listen(3000, () => {
  console.log("Serveur en cours d'exécution sur http://localhost:3000");
});

module.exports = { app, server };
