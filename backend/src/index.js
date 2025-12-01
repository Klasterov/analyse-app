require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const authRoutes = require('./routes/authRoutes');
const { swaggerUi, specs } = require('./swagger');
const meterReadingsRoutes = require('./routes/meterReadings');
const analysisRoutes = require('./routes/analysisRoutes');

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/auth', authRoutes);
app.use('/api/meter-readings', meterReadingsRoutes);
app.use('/api/analysis', analysisRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});