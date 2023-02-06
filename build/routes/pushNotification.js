"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushNotification = void 0;
const unique_id_1 = require("../helper/library/unique-id");
const database_query_1 = require("../model/database/queries/database.query");
const notificationData = (notificationData, requestId) => {
    const data = {
        title: notificationData === null || notificationData === void 0 ? void 0 : notificationData.title,
        message: notificationData === null || notificationData === void 0 ? void 0 : notificationData.message,
        data: notificationData.data,
        notificationId: (0, unique_id_1.UUID)(),
        requestId: requestId
    };
    // console.log('User connected successfully: Handshake data', data);
    return data;
};
const pushNotification = (socket, request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = request.body;
    const id = request.params.id;
    const notificationObj = notificationData({ message: notification.message, title: notification.title, data: notification.data }, id);
    const dbResponse = yield (0, database_query_1.createNotification)(notificationObj);
    if (dbResponse) {
        socket.to(id).emit('subscribe-new-notification', { message: "Notification available", data: notificationObj, error: false });
        response.status(200).json({ message: "Notification sent successfully", status: "success" });
    }
    else {
        response.status(400).json({ message: "Notification was not sent", status: "failed" });
    }
});
exports.pushNotification = pushNotification;
