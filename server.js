// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors()); // Autoriser les requêtes depuis n'importe quel domaine
app.use(express.json()); // Parser le JSON dans le corps des requêtes

// Créer une connexion à la base de données
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root", // Remplace par ton mot de passe MySQL
  database: "testdb", // Remplace par le nom de ta base de données
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database.");
});

// Endpoint pour obtenir des données
app.get("/api/data", (req, res) => {
  db.query("SELECT * FROM my_table", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Endpoint pour ajouter des données
app.post("/api/data", (req, res) => {
  const { name } = req.body;
  db.query("INSERT INTO my_table (name) VALUES (?)", [name], (err) => {
    if (err) throw err;
    res.status(201).send("Data added");
  });
});
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
