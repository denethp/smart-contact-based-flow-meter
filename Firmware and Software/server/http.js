// http.js
import express from "express";
import router from "./routes/router.js";
import bodyParser from "body-parser";
import cors from "cors";
import Config from "dotenv";

export const startHttpServer = () => {
  Config.config();

  const app = express();
  const http_port = 3000;

  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors({ origin: "*" }));
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
  app.use("/", router);

  app.listen(http_port, () => {
    console.log(`Listening on http://localhost:${http_port}`);
  });
};
