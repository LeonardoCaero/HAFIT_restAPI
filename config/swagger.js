const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const Product = require('../models/product');
const User = require('../models/user');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HAFIT Swagger',
      version: '0.1.0',
      description:
        'This is a CRUD API application made with Express and documented with Swagger for HAFIT services',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Hafit',
        url: 'https://hafit.com',
        email: 'hafit@info.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The unique identifier of the product',
              example: '60920a25a1e53a9b649e8f4c',
            },
            productId:{
              type: 'number',
              description: 'APP-use ID',
              example: 1,
            },
            name: {
              type: 'string',
              description: 'The name of the product',
              example: 'Product 1',
            },
            price: {
              type: 'number',
              format: 'decimal',
              description: 'The price of the product',
              example: 10.99,
            },
            description: {
              type: 'string',
              description: 'The description of the product',
              example: 'This is product 1',
            },
            type: {
              type: 'string',
              description: 'The type of the product',
              example: 'Type 1',
            },
            stock: {
              type: 'integer',
              description: 'The stock quantity of the product',
              example: 100,
            },
            image: {
              type: 'file',
              description: 'The URL of the product image',
              example: 'data:image/png;base64,iV...',
            },
          },
        },
        User:{
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The unique identifier of the product',
              example: '60920a25a1e53a9b649e8f4c -> is autogenerated (not needed)',
            },
            name: {
              type: 'string',
              description: 'The name of the user',
              example: 'User name',
            },
            email: {
              type: 'string',
              description: 'Email of the user',
              example: 'user@example.com',
            },
            type: {
              type: 'string',
              description: 'Type of user [client, admin, soci, treballador]',
              example: 'admin',
            }
          }
        },
        
      },
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
};

