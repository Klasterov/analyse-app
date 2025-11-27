const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'API endpoints for authentication, meter readings and more',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    './src/routes/**/*.js',        
    './src/controllers/**/*.js',  
    './src/models/**/*.js',
    './src/middlewares/**/*.js',
    './src/utils/**/*.js',
  ],
};

const specs = swaggerJsDoc(options);

module.exports = { swaggerUi, specs };
