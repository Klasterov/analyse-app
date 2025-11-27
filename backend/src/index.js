require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const { swaggerUi, specs } = require('./swagger');
const meterReadingsRoutes = require('./routes/meterReadings');
const app = express();


app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/auth', authRoutes);

app.use('/api/meter-readings', meterReadingsRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});