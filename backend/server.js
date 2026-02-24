import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// routes
import authRoutes from './routes/authRoutes.js';
import aktivitasRoutes from './routes/aktivitasRoutes.js';
import rekapRoutes from './routes/rekapAbsenRoutes.js'; // <-- nanti untuk rekap absensi

dotenv.config();

const app = express();

// ================== Middleware ==================
app.use(cors());
app.use(express.json());

// ================== Routes ==================

// Auth
app.use('/api/auth', authRoutes);

// Aktivitas
app.use('/api/aktivitas', aktivitasRoutes);

// Rekap Absensi
app.use('/api/rekap', rekapRoutes);

// Root test
app.get('/', (req, res) => {
  res.send('API e-Kinerja Running...');
});

// ================== Server ==================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running di http://localhost:${PORT}`);
});