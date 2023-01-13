"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const { engine } = require("express-handlebars");
// const express = require("express");
const express_1 = __importDefault(require("express"));
const path = require('path');
// const expressHbs = require("express-handlebars");
const expressHbs = __importStar(require("express-handlebars"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const options_1 = require("./config/options");
const staff_event_1 = require("./model/staff.event");
const resident_event_1 = require("./model/resident.event");
// const http = require("http");
// const riderController = require("./src/controllers/rider/rider-controller");
// const driverController = require("./src/controllers/driver/driver-socket");
// import { NotificationManager } from "./routes/app-notification/library/library.notification-manager";
/**_________________________Require Endpoints__________________________ */
// const home= require("./src/controllers/client-controller/routes.home");
const routes_resident_1 = __importDefault(require("./controller/client-controller/routes.resident"));
const routes_service_1 = __importDefault(require("./controller/client-controller/routes.service"));
const routes_staff_1 = __importDefault(require("./controller/client-controller/routes.staff"));
const create_chat_1 = require("./controller/create-chat");
var app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
// instatiating template engine
app.engine(".hbs", expressHbs.engine({ defaultLayout: 'main', extname: ".hbs" }));
app.set("views", path.join(__dirname, "./public/views"));
app.set("view engine", ".hbs");
// var hbs = expressHbs.create({});
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, Object.assign({}, options_1.serverOptions));
const PORT = process.env.PORT || 3200;
const host = process.env.HOST || "http://localhost";
/**
 * An instance notification manager.
 * Create an instance of notification storage manager
 */
// const NotificationManagerInstance =  NotificationManager.getInstance(); 
// NotificationManagerInstance.loadNotificationFromDB();
/**
 * Handles all user socket events
 */
const staffSocket = io.of("/staffNsp");
/**
 * Handles all Driver socket events
 */
const serviceProviderSocket = io.of("/service-provider-nsp");
/**
 * Handles all user socket events
 */
const chatSocket = io.of("/chat");
/**
 * Handles all Driver socket events
 */
const residentSocket = io.of("/residentNsp");
// driver.use((socket, next) => {
// 	// let handshake = socket.handshake;
// 	// ensure the user has sufficient rights
// 	next();
//   });
staffSocket.on("connection", (socket) => {
    socket.emit('connected', { data: { connectionId: socket.id } });
    let handshake = socket.handshake;
    const qrData = JSON.parse(JSON.stringify(handshake.query));
    console.log('Staff connected successfully: Handshake', qrData.userId, qrData.userType, qrData.userName);
    (0, staff_event_1.staffController)(staffSocket, socket, qrData, residentSocket, '');
});
chatSocket.on("connection", (socket) => {
    console.log(" User connected");
    socket.emit('connected', { data: { connectionId: socket.id } });
    (0, create_chat_1.chatController)(chatSocket, socket);
});
residentSocket.on("connection", (socket) => {
    socket.emit('connected', { data: { connectionId: socket.id } });
    let handshake = socket.handshake;
    const qrData = JSON.parse(JSON.stringify(handshake.query));
    console.log('Resident connected successfully: Handshake', qrData.userId, qrData.senderRole, qrData.userName);
    (0, resident_event_1.residentController)(residentSocket, socket, qrData, staffSocket, '');
});
serviceProviderSocket.on("connection", (socket) => {
    socket.emit('connected', { data: { connectionId: socket.id } });
    let handshake = socket.handshake;
    const qrData = JSON.parse(JSON.stringify(handshake.query));
    console.log('Provider connected successfully: Handshake', qrData.userId, qrData.userType, qrData.userName);
    // riderController(rider, socket, driver, handshake.query?.userId);
});
/**_________________________________ Middleware ________________________________ */
// header preflight configuration to prevent cors error
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    credentials: false,
}));
// Body Parser middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// make folders visible
app.use(express_1.default.static(path.join(__dirname, 'public')));
/** _______________________________API ROUTES_________________________________ */
app.use("/", routes_staff_1.default);
app.use("/staff", routes_staff_1.default);
app.use("/service", routes_service_1.default);
app.use("/resident", routes_resident_1.default);
// app.listen(PORT || 3000, () => {
//   console.log("server started on port", PORT);
// });
server.listen(PORT || 3200, () => {
    console.log(`Mesenger Server is running on ${host}:${PORT}`);
});
