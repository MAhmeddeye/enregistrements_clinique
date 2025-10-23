const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connexion à la base MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 📥 Route pour recevoir les données depuis l’app mobile
app.post("/synchronisation", async (req, res) => {
  const data = req.body;

  console.log("📩 Données reçues :", data);

  try {
    const sql = `
      INSERT INTO clinicinfo (
        nom_patient,
        age_patient,
        sexe,
        allergies,
        traitement_precedents,
        examans_respiratoire,
        examans_neuralogique,
        examans_traumatisme,
        examans_circulatoire,
        medicaments_administrer,
        rythmeCardiaque,
        etatPeau,
        hydratationPeau,
        couleurPeau,
        remplissageCapillaire,
        pouls_radial,
        pouls_femoral,
        pouls_carotide,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    await pool.query(sql, [
      data.nom_patient || "",
      data.age_patient || "",
      data.sexe || "",
      data.allergies || "",
      data.traitement_precedents || "",
      JSON.stringify(data.examans_respiratoire || {}),
      JSON.stringify(data.examans_neuralogique || {}),
      JSON.stringify(data.examans_traumatisme || {}),
      JSON.stringify(data.examans_circulatoire || {}),
      JSON.stringify(data.medicaments_administrer || {}),
      data.rythmeCardiaque || "",
      data.etatPeau || "",
      data.hydratationPeau || "",
      data.couleurPeau || "",
      data.remplissageCapillaire || "",
      data.pouls_radial || "",
      data.pouls_femoral || "",
      data.pouls_carotide || "",
    ]);

    console.log("✅ Données insérées avec succès !");
    res.status(201).json({ message: "Données sauvegardées avec succès !" });
  } catch (error) {
    console.error("❌ Erreur lors de l’insertion :", error);
    res.status(500).json({ error: "Erreur serveur lors de l’insertion." });
  }
});

// 🚀 Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur en écoute sur http://localhost:${PORT}`);
});
