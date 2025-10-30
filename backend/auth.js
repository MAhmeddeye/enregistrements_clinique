// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'callcenter_secret_key_2024';

// Middleware
app.use(cors());
app.use(express.json());

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'call_center',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
};

const pool = mysql.createPool(dbConfig);

// Test de connexion à la base de données
pool.getConnection()
  .then(connection => {
    console.log('✅ Connecté à la base de données MySQL - call_center');
    
    // Vérifier que la table user existe
    return connection.execute('SELECT COUNT(*) as count FROM user')
      .then(([rows]) => {
        console.log(`📊 Table 'user' trouvée avec ${rows[0].count} utilisateurs`);
        connection.release();
      });
  })
  .catch(err => {
    console.error('❌ Erreur de connexion MySQL:', err.message);
  });

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Serveur Call Center en ligne',
    timestamp: new Date().toISOString()
  });
});

// Route pour lister tous les utilisateurs (pour debug)
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT user_id, username, email, display_name, state FROM user ORDER BY user_id'
    );
    
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Erreur récupération users:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// ROUTE DE CONNEXION PRINCIPALE
app.post('/api/auth/login', async (req, res) => {
  let connection;
  try {
    const { username, password } = req.body;

    console.log('📥 Tentative de connexion:', { username });

    // Validation des champs
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nom d\'utilisateur et mot de passe requis'
      });
    }

    // Obtenir une connexion
    connection = await pool.getConnection();

    // Recherche de l'utilisateur dans la base de données
    const [users] = await connection.execute(
      `SELECT user_id, username, email, display_name, password, state 
       FROM user 
       WHERE (username = ? OR email = ?) AND state = 1
       LIMIT 1`,
      [username.trim(), username.trim()]
    );

    if (users.length === 0) {
      console.log('❌ Utilisateur non trouvé ou inactif:', username);
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects ou compte inactif'
      });
    }

    const user = users[0];
    console.log('👤 Utilisateur trouvé:', user.username, '- Display:', user.display_name);

    // VÉRIFICATION DU MOT DE PASSE
    // Les mots de passe dans votre table sont hashés avec bcrypt (format $2y$...)
    // On utilise bcryptjs pour les vérifier
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    // Pour la démo, vous pouvez aussi accepter un mot de passe simple
    // const isPasswordValid = await bcrypt.compare(password, user.password) || password === 'demo123';

    if (!isPasswordValid) {
      console.log('❌ Mot de passe incorrect pour:', user.username);
      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { 
        userId: user.user_id,
        username: user.username,
        displayName: user.display_name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Mise à jour du dernier login (si vous avez une colonne last_login)
    try {
      await connection.execute(
        'UPDATE user SET last_login = NOW() WHERE user_id = ?',
        [user.user_id]
      );
      console.log('✅ Dernier login mis à jour pour:', user.username);
    } catch (updateError) {
      console.log('ℹ️ Colonne last_login non disponible, continuation...');
    }

    // Données utilisateur à retourner (sans le mot de passe)
    const userData = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      display_name: user.display_name,
      state: user.state
    };

    console.log('✅ Connexion réussie pour:', user.display_name);

    res.json({
      success: true,
      message: `Bienvenue ${user.display_name} !`,
      data: {
        token,
        user: userData
      }
    });

  } catch (error) {
    console.error('💥 Erreur serveur login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// ROUTE DE VÉRIFICATION DE TOKEN
app.get('/api/auth/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Vérifier que l'utilisateur existe toujours
    const [users] = await pool.execute(
      'SELECT user_id, username, email, display_name, state FROM user WHERE user_id = ? AND state = 1',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: {
        user: users[0]
      }
    });

  } catch (error) {
    console.error('Erreur vérification token:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré'
    });
  }
});

// ROUTE DE DÉCONNEXION
app.post('/api/auth/logout', (req, res) => {
  // En production, vous pourriez blacklister le token ici
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

// Middleware de gestion d'erreurs
app.use((error, req, res, next) => {
  console.error('💥 Erreur non gérée:', error);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👥 Liste users: http://localhost:${PORT}/api/users`);
});