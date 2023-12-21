import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import * as bodyParser from "body-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { expressjwt } from "express-jwt";

import helmet from "helmet";

const app = express();

app.use(helmet());


app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
const port = process.env.APP_PORT || 3000;

const jwtSecret = process.env.JWT_SECRET;

console.log(jwtSecret);

app.use(
  expressjwt({ secret: jwtSecret, algorithms: ['HS256'] }).unless({
    path: [/^\/api-docs\/.*/, '/login', '/register', '/status'],
  })
);

const swaggerOpts = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Back-end for Avarts",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./controller/*.routes.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOpts);

app.use(cors());
app.use(bodyParser.json());

// routes
var blogpost = require('./controller/blogposts.routes');
var blogcomment = require('./controller/blogcomment.routes');
var login = require('./controller/login.routes');
app.use('/', blogpost);
app.use('/', blogcomment);
app.use('/', login);

app.get("/status", (req, res) => {
  res.json({ message: "Back-end is running..." });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port || 3000, () => {
  console.log(`Back-end is running on port ${port}.`);
});
