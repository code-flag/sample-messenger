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
exports.NotificationController = void 0;
/**
 * This file contain all the methods needs to create a chat for a user
 */
const database_query_1 = require("../model/database/queries/database.query");
const unique_id_1 = require("../helper/library/unique-id");
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
/**
 *
 * @param {Namespace} chatNsp - resident route namespace
 * @param {*} socket - socket instance
 */
const NotificationController = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    let handshake = socket.handshake;
    const qrData = JSON.parse(JSON.stringify(handshake.query));
    const connectionId = socket.id;
    let roomId = qrData.requestId;
    const responseData = yield (0, database_query_1.getNotifications)(qrData.requestId);
    // console.log('Notification',responseData );
    if (responseData) {
        socket.emit('connected', { data: responseData, connectionId: connectionId, message: "Notification is available", error: false });
    }
    else {
        socket.emit('connected', { data: [], connectionId: connectionId, message: "Notification is available", error: false });
    }
    socket.on("disconnecting", (data) => {
        // socket.emit('ride-request-available', setMessage({}, 'resident: you are now connected', 'r-1', true));
        // console.log(qrData.senderName + " disconnecting");
    });
    /** add user to a specific room */
    socket.join(roomId);
    console.log("resident added back room: ", socket.rooms);
    /** event to recieve sent message */
    socket.on("new-notification", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const notificationObj = notificationData({ message: data.message, title: data.title, data: data.data }, qrData.requestId);
        yield (0, database_query_1.createNotification)(notificationObj);
        // console.log('new message data', notificationObj, ": Db res", await updateConversation(notificationObj));
        socket.to(roomId).emit('subscribe-new-notification', { message: "Notification available", data: notificationObj, error: false });
        socket.emit('new-notification-done', { data: [], message: 'Notification sent', error: false });
    }));
    socket.on("get-notification", () => __awaiter(void 0, void 0, void 0, function* () {
        const responseData = yield (0, database_query_1.getNotifications)(qrData.requestId);
        // console.log('Notification',responseData );
        if (responseData) {
            socket.emit('get-notification-done', { data: responseData, message: "Notification successfully retrieved", error: false });
        }
    }));
    socket.on("acknowledge-notification", (notificationId) => __awaiter(void 0, void 0, void 0, function* () {
        if (notificationId) {
            const responseData = yield (0, database_query_1.updateNotification)(qrData.requestId, notificationId);
            // console.log('Notification',responseData );
            if (responseData) {
                socket.emit('acknowledge-notification-done', { data: responseData, message: "Notification successfully retrieved", error: false });
            }
        }
        else {
            socket.emit('acknowledge-notification-done', { data: [], message: "Notification Id is required", error: true });
        }
    }));
});
exports.NotificationController = NotificationController;
