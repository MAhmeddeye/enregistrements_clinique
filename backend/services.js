// services.js


const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ⚡ Pool MySQLnp


const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'call_center',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // 🔧 Options de stabilité réseau :
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 10000,  // délai max avant timeout de connexion (10s)
  idleTimeout: 990000,     // ferme une connexion inactive après 60s
});

// Vérification connexion
pool.getConnection()
  .then(conn => {
    console.log('✅ Connecté à MySQL');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Erreur de connexion MySQL :', err);
    process.exit(1);
  });

// Middleware de validation minimale
function validateRecordData(data) {
  const errors = [];
  if (!data.nom) errors.push('Nom manquant');
  if (!data.age) errors.push('Âge manquant');
  if (!data.sexe) errors.push('Sexe manquant');
  return errors;
}

// Route principale pour enregistrer les données
app.post('/enregistrement', async (req, res) => {
  console.log('📥 Requête reçue');
  //console.log(req.body);
  console.log(req.body.societe_id)
  try {
    const form = req.body;

    //console.log('form data: ', form)

    // Validation minimale
    const validationErrors = validateRecordData(form);
    if (validationErrors.length) {
      return res.status(400).json({ error: 'Données invalides', details: validationErrors });
    }
const traumatismeData = {
  ...(form.examans_traumatisme ? JSON.parse(form.examans_traumatisme) : {}),
  ...(form.contusion && { contusion: form.contusion }),
  ...(form.entorse && { entorse: form.entorse }),
  ...(form.dislocation && { dislocation: form.dislocation }),
  ...(form.fractureFermee && { fracture_fermee: form.fractureFermee }),
  ...(form.fractureOuverte && { fracture_ouverte: form.fractureOuverte }),
  ...(form.amputation && { amputation: form.amputation }),
  ...(form.blessure && { blessure: form.blessure }),
  ...(form.brulure && { brulure: form.brulure }),
};
    // Préparer les données pour insertion (noms de colonnes CORRIGÉS)
  const recordData = {
  id: form.id || generateUniqueId(), // Générer un ID unique si non fourni
  societe_id:form.societe_id,
  nom_patient: form.nom ? form.nom.substring(0, 255) : '',
  
  age_patient: form.age ? form.age.toString().substring(0, 255) : '',
  sexe: form.sexe ? form.sexe.substring(0, 50) : '',
  lieu_evenment: form.lieu_evenment ? form.lieu_evenment.substring(0, 255) : null,
  numero_id: form.numero_id ? form.numero_id.substring(0, 255) : null,
  allergies: form.Descallergie || form.allergies || '',
  traitement_precedents: form.DescPreTraitement || form.traitement_precedents || '',
  code_resolution: form.code_resolution || '',
  code_pre_alerte: form.code_pre_alerte || null,
  diagnostic: form.diagnostic ? JSON.stringify(form.diagnostic) : null,
  motif_consultation: form.motifDesc || form.motif_consultation || null,
  
  // Examens en JSON
  //examans_circulatoire: form.examansCirculatoire ? JSON.stringify(form.examansCirculatoire) : null,
  examans_respiratoire: form.examans_respiratoire ? JSON.stringify(form.examans_respiratoire) : null,
  constantes: form.constantes ? JSON.stringify(form.constantes) : null,
  examans_neuralogique: form.examans_neuralogique ? JSON.stringify(form.examans_neuralogique) : null,
   examans_traumatisme: Object.keys(traumatismeData).length > 0 ? JSON.stringify(traumatismeData) : null,
  examans_circulatoire: form.examansCirculatoire 
  ? JSON.stringify(form.examansCirculatoire) 
  : null,
  // Constantes vitales (JSON)
//  constantes: JSON.stringify({
//   frequence_respiratoire: form.constante_Fréquence_respiratoire || null,
//   saturation_oxygene: form.constante_Saturation_en_oxygène_périphérique || null,
//   frequence_cardiaque: form.constante_Fréquence_cardiaque || null,
//   pression_sanguine: form.constante_Pression_sanguine || null,
//   temperature: form.constante_Température_du_corps || null,
//   glycemie: form.constante_Glycémie || null,
//   glasgow: form.constante_Échelle_de_Glasgow || null,
// }),
//constantes: JSON.stringify(mapConstantes(form)),
// examans_circulatoire: JSON.stringify({
//   etatPeau: form.etatPeau || null,
//   couleurPeau: form.couleurPeau || null,
//   hydratationPeau: form.hydratationPeau || null,
//   temperaturePeau: form.temperaturePeau || null,
//   rythmeCardiaque: form.rythmeCardiaque || null,
//   remplissageCapillaire: form.remplissageCapillaire || null,
//   pouls_radial: form.pouls_radial || null,
//   pouls_femoral: form.pouls_femoral || null,
//   pouls_carotide: form.pouls_carotide || null,
// }),


  
  // État du patient
  
 
  
  
  // Traitements et interventions
 medicaments_administrer: form.medicaments_administrer 
  ? JSON.stringify(form.medicaments_administrer) 
  : null,

  technique_immobilisation: form.technique_immobilisation ? JSON.stringify(form.technique_immobilisation) : null,
  gestion_voie_aeriennes: form.gestion_voie_aeriennes ? JSON.stringify(form.gestion_voie_aeriennes) : null,
  ventilation: form.ventilation || null,
  oxygenation: form.oxygenation ? JSON.stringify(form.oxygenation) : null,
  therapie_inhalation: form.therapie_inhalation || null,
  cannulation: form.cannulation || null,
  controle_hemoragie: form.controle_hemoragie || null,
  therapie_electrique: form.therapie_electrique || null,
  pensement: form.pensement || null,
  hopital_destination: form.hopital_destination || null,
  catheterisme: form.catheterisme || null,
  
  // Traumatismes (si présents dans votre formulaire)
 
  // Date de création
  //created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
};

console.log('record data: ', recordData)

// Fonction pour générer un ID unique comme dans votre exemple
function generateUniqueId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

    // Nettoyer les données: supprimer les clés avec valeurs undefined/null
    const cleanRecordData = {};
    for (const [key, value] of Object.entries(recordData)) {
      if (value !== undefined && value !== null) {
        cleanRecordData[key] = value;
      }
    }

    // Génération dynamique de la requête SQL
    const keys = Object.keys(cleanRecordData);
    const values = Object.values(cleanRecordData);
    
    if (keys.length === 0) {
      return res.status(400).json({ error: 'Aucune donnée valide à insérer' });
    }

    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO clinicinfo (${keys.join(', ')}) VALUES (${placeholders})`;

    console.log('📋 SQL généré:', sql);
    console.log('📦 Données:', cleanRecordData);

    // Exécution sécurisée
    const [results] = await pool.execute(sql, values);
    console.log('✅ Enregistrement créé avec ID:', results.insertId);

    res.json({
      success: true,
      id: results.insertId,
      message: 'Enregistrement clinique créé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur serveur / DB:', error);
    
    // Erreur plus détaillée pour le débogage
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      console.error('🔍 Colonne inexistante dans la table');
    }
    
    res.status(500).json({ 
      error: 'Erreur serveur ou base de données', 
      details: error.message,
      code: error.code 
    });
  }
});
app.post('/synchronisation', async (req, res) => {
  console.log('📥 Requête reçue');
  console.log('📦 Données locales reçues:', req.body);

  try {
    const form = req.body;

    // Validation minimale
    const validationErrors = validateRecordData(form);
    if (validationErrors.length) {
      return res.status(400).json({ error: 'Données invalides', details: validationErrors });
    }

const constantes_respiratoire={
 constante_Ventilation_spontanee: form.constante_Ventilation_spontanee || "",
  constante_Dyspnee: form.constante_Dyspnee || "",
  constante_Cyanose: form.constante_Cyanose || "",
  constante_Stridor: form.constante_Stridor || "",
  constante_Tirage: form.constante_Tirage || "",
  constante_Mobilité_thoracique: form.constante_Mobilité_thoracique || "",
  cause_Obstruction: form.examenResp || "",
}
const constantes = {
 constante_Fréquence_respiratoire: form.constante_Fréquence_respiratoire ,
 constante_Saturation_en_oxygène_périphérique : form.constante_Saturation_en_oxygène_périphérique ,
  constante_Fréquence_cardiaque: form.constante_Fréquence_cardiaque ,
 constante_Pression_sanguine: form.constante_Pression_sanguine,
 constante_Température_du_corps: form.constante_Température_du_corps ,
constante_Glycémie: form.constante_Glycémie ,
  constante_Échelle_de_Glasgow : form.constante_Échelle_de_Glasgow ,
};
const examansCirculatoire = {
  etatPeau: form.etatPeau || null,
  couleurPeau: form.couleurPeau || null,
  hydratationPeau: form.hydratationPeau || null,
  temperaturePeau: form.temperaturePeau || null,
  rythmeCardiaque: form.rythmeCardiaque || null,
  remplissageCapillaire: form.remplissageCapillaire || null,
  pouls_radial: form.pouls_radial || null,
  pouls_femoral: form.pouls_femoral || null,
  pouls_carotide: form.pouls_carotide || null,
};
const neurologiqueData = {
 
  
  deficitNeurologique: form.deficitNeurologique || false,
  etatConscience: form.etatConscience || "",
  orientation: form.orientation || "",
  perteConscience: form.perteConscience || false,
  pupilleGauche: form.pupilleGauche || "",
  pupilleDroite: form.pupilleDroite || "",
  reactiviteGauche: form.reactiviteGauche || "",
  reactiviteDroite: form.reactiviteDroite || ""
};
    // Préparer les données pour insertion (noms de colonnes CORRIGÉS)
  const recordData = {
  id: form.id || generateUniqueId(), // Générer un ID unique si non fourni
  
  nom_patient: form.nom ? form.nom.substring(0, 255) : '',
  age_patient: form.age ? form.age.toString().substring(0, 255) : '',
  sexe: form.sexe ? form.sexe.substring(0, 50) : '',
  lieu_evenment: form.lieu_evenment ? form.lieu_evenment.substring(0, 255) : null,
  numero_id: form.numero_id ? form.numero_id.substring(0, 255) : null,
  allergies: form.Descallergie || form.allergies || '',
  traitement_precedents: form.DescPreTraitement || form.traitement_precedents || '',
  code_resolution: form.code_resolution || '',
  code_pre_alerte: form.code_pre_alerte || null,
  diagnostic: form.diagnostic ? JSON.stringify(form.diagnostic) : null,
  motif_consultation: form.motifDesc || form.motif_consultation || null,
  
  // Examens en JSON
  //examans_circulatoire: form.examansCirculatoire ? JSON.stringify(form.examansCirculatoire) : null,
  examans_respiratoire: form.examans_respiratoire ? JSON.stringify(form.examans_respiratoire) : null,
  constantes: JSON.stringify(constantes),
   examans_respiratoire: JSON.stringify(constantes_respiratoire),
   examans_circulatoire: JSON.stringify(examansCirculatoire),
  examans_neuralogique: JSON.stringify(neurologiqueData),
   examans_traumatisme:  JSON.stringify(neurologiqueData),
  examans_circulatoire: form.examansCirculatoire 
  ? JSON.stringify(form.examansCirculatoire) 
  : null,

  // Constantes vitales (JSON)
//  constantes: JSON.stringify({
//   frequence_respiratoire: form.constante_Fréquence_respiratoire || null,
//   saturation_oxygene: form.constante_Saturation_en_oxygène_périphérique || null,
//   frequence_cardiaque: form.constante_Fréquence_cardiaque || null,
//   pression_sanguine: form.constante_Pression_sanguine || null,
//   temperature: form.constante_Température_du_corps || null,
//   glycemie: form.constante_Glycémie || null,
//   glasgow: form.constante_Échelle_de_Glasgow || null,
// }),
//constantes: JSON.stringify(mapConstantes(form)),
// examans_circulatoire: JSON.stringify({
//   etatPeau: form.etatPeau || null,
//   couleurPeau: form.couleurPeau || null,
//   hydratationPeau: form.hydratationPeau || null,
//   temperaturePeau: form.temperaturePeau || null,
//   rythmeCardiaque: form.rythmeCardiaque || null,
//   remplissageCapillaire: form.remplissageCapillaire || null,
//   pouls_radial: form.pouls_radial || null,
//   pouls_femoral: form.pouls_femoral || null,
//   pouls_carotide: form.pouls_carotide || null,
// }),


  
  // État du patient
  
 
  
  
  // Traitements et interventions
 medicaments_administrer: form.medicaments_administrer 
  ? JSON.stringify(form.medicaments_administrer) 
  : null,

  technique_immobilisation: form.technique_immobilisation ? JSON.stringify(form.technique_immobilisation) : null,
  gestion_voie_aeriennes: form.gestion_voie_aeriennes ? JSON.stringify(form.gestion_voie_aeriennes) : null,
  ventilation: form.ventilation || null,
  oxygenation: form.oxygenation ? JSON.stringify(form.oxygenation) : null,
  therapie_inhalation: form.therapie_inhalation || null,
  cannulation: form.cannulation || null,
  controle_hemoragie: form.controle_hemoragie || null,
  therapie_electrique: form.therapie_electrique || null,
  pensement: form.pensement || null,
  hopital_destination: form.hopital_destination || null,
  catheterisme: form.catheterisme || null,
  
  // Traumatismes (si présents dans votre formulaire)
 
  // Date de création
  //created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
};




// Fonction pour générer un ID unique comme dans votre exemple
function generateUniqueId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


console.log('recordata:',recordData)
    // Supprimer les valeurs null/undefined
    const cleanRecordData = {};
    for (const [key, value] of Object.entries(recordData)) {
      if (value !== undefined && value !== null) {
        cleanRecordData[key] = value;
      }
    }

    const keys = Object.keys(cleanRecordData);
    const values = Object.values(cleanRecordData);

    if (keys.length === 0) {
      return res.status(400).json({ error: 'Aucune donnée valide à insérer' });
    }

    const placeholders = keys.map(() => '?').join(', ');
    console.log('placeholders',placeholders)
    const sql = `INSERT INTO clinicinfo (${keys.join(', ')}) VALUES (${placeholders})`;

    console.log('📋 SQL généré:', sql);
    console.log('📦 Données insérées:', cleanRecordData);

    const [results] = await pool.execute(sql, values);
    console.log('✅ Enregistrement créé avec ID:', results.insertId);

    res.json({
      success: true,
      id: results.insertId,
      message: 'Enregistrement clinique créé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur serveur / DB:', error);
    if (error.code === 'ER_BAD_FIELD_ERROR') {
      console.error('🔍 Colonne inexistante dans la table');
    }

    res.status(500).json({
      error: 'Erreur serveur ou base de données',
      details: error.message,
      code: error.code
    });
  }
});



// Route de test / health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Route pour vérifier la structure de la table (utile pour débogage)
app.get('/api/table-structure', async (req, res) => {
  try {
    const [rows] = await pool.execute('DESCRIBE enregistrement');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware pour routes non trouvées
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Route API non trouvée', method: req.method, path: req.originalUrl });
});

// Démarrage serveur
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Serveur démarré sur http://${HOST}:${PORT}`);
  console.log(`📌 Health check: http://${HOST}:${PORT}/api/health`);
  console.log(`🔍 Structure table: http://${HOST}:${PORT}/api/table-structure`);
});

// Gestion propre arrêt serveur
process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  try {
    await pool.end();
    console.log('✅ Pool DB fermé');
  } catch (err) {
    console.error('❌ Erreur fermeture DB:', err);
  }
  process.exit(0);
});
app.get("/societe", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM societe ORDER BY date_creation DESC");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur lors de la récupération :", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des sociétés" });
  }
});