// const { engine } = require("express-handlebars");
// const express = require("express");
import express from 'express';
const path = require('path');
// const expressHbs = require("express-handlebars");
import * as expressHbs from 'express-handlebars';
import cors from 'cors';
import dotEnv from 'dotenv';
dotEnv.config(); 

// const socketIO = require("socket.io");
// import {Socket as socketIO} from 'socket.io';
import http from 'http';
import { Server, Socket } from "socket.io"
import { createServer } from "http";
import { serverOptions } from "./config/options";

import resident from './controller/client-controller/routes.resident';
import service from './controller/client-controller/routes.service';
import staff from './controller/client-controller/routes.staff';
import { chatController } from './controller/create-chat';
import { DBConnection } from './config/connection';

var app = express();
app.use(express.json({ limit: "50mb" }));

// instatiating template engine
app.engine(".hbs", expressHbs.engine({defaultLayout: 'main', extname: ".hbs" }));
app.set("views", path.join(__dirname, "./public/views"));
app.set("view engine", ".hbs");

// var hbs = expressHbs.create({});

const server = createServer(app);
const io = new Server(server, {
    ...serverOptions
});
const PORT: number | string = process.env.PORT || 3200;
const host: string = process.env.HOST || "http://localhost";

/** ________________________Database connection_________________________ */
DBConnection();


/**
 * Handles all user socket events
 */
const chatSocket = io.of("/chat");

chatSocket.on("connection", (socket: any) => {
	 chatController(chatSocket, socket);
});

/**_________________________________ Middleware ________________________________ */
// header preflight configuration to prevent cors error
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    credentials: false,
  })
);
// Body Parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// make folders visible
app.use(express.static(path.join(__dirname,'public')));

/** _______________________________API ROUTES_________________________________ */
app.use("/", staff);
app.use("/staff", staff);
app.use("/service", service);
app.use("/resident", resident);


// app.listen(PORT || 3000, () => {
//   console.log("server started on port", PORT);
// });

server.listen(PORT || 3200, () => {
  console.log(`Mesenger Server is running on ${host}:${PORT}`);
});