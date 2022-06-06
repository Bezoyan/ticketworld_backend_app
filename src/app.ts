import { Application } from "express";
import bodyParser, { json } from "body-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import boom from 'express-boom';
import 'dotenv/config'

import { ticketRouters } from "./tickets/routes/";
import { authRouters } from "./auth/routes";
import { orderRouters } from "./orders/routes/index";
import { eventRouters } from "./events/routes/index";
import { createChargeRouter } from "./payments/routes/index";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.app.use(boom());
    this.setConfig();
    this.setMongoConfig();
    this.app.set("trust proxy", true);
    this.app.use(json());
  }

  private setConfig() {
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    this.app.use(cors());

    // routes
    this.app.use(ticketRouters);
    this.app.use(authRouters);
    this.app.use(orderRouters);
    this.app.use(eventRouters);
    this.app.use(createChargeRouter);
  }

  private setMongoConfig() {
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost:27017/ticketworld");
  }
}

export default new App().app;