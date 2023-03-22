require('dotenv').config();
const express = require('express');
const connectToDatabase = require('./config/db');
const swaggerConfig = require('./config/swagger');
const routes = require('./routes/routes');

const cors = require('cors');


const app = express();

app.use(cors());
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
swaggerConfig(app);

// Routes
app.use('/api', routes);

// Database Connection
connectToDatabase();

// Start Server
const port = process.env.PORT || 8002;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
