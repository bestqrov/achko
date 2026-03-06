const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const agencyRoutes = require('./routes/agencies');
const vehicleRoutes = require('./routes/vehicles');
const tripRoutes = require('./routes/trips');
const factureRoutes = require('./routes/factures');
const missionRoutes = require('./routes/missions');
const maintenanceRoutes = require('./routes/maintenance');
const consommationRoutes = require('./routes/consommation');
const administratifRoutes = require('./routes/administratif');
const gestionRoutes = require('./routes/gestion');
const planEntretienRoutes = require('./routes/planEntretien');
const kilometrageRoutes   = require('./routes/kilometrages');

const app = express();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://arwapark.digima.cloud',
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
const API = '/api/v1';
app.use(`${API}/auth`, authRoutes);
app.use(`${API}/users`, userRoutes);
app.use(`${API}/agencies`, agencyRoutes);
app.use(`${API}/vehicles`, vehicleRoutes);
app.use(`${API}/trips`, tripRoutes);
app.use(`${API}/factures`, factureRoutes);
app.use(`${API}/missions`, missionRoutes);
app.use(`${API}/maintenance`, maintenanceRoutes);
app.use(`${API}/consommation`, consommationRoutes);
app.use(`${API}/administratif`, administratifRoutes);
app.use(`${API}/gestion`, gestionRoutes);
app.use(`${API}/plan-entretien`, planEntretienRoutes);
app.use(`${API}/kilometrages`,   kilometrageRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
