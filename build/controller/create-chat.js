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
exports.chatController = void 0;
/**
 * This file contain all the methods needs to create a chat for a user
 */
const database_query_1 = require("../model/database/queries/database.query");
const chatData = (roomID, qrData, conversationId) => {
    const data = {
        roomId: roomID,
        userOneId: qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.receiverId : qrData.senderId,
        userTwoId: qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.senderId : qrData.receiverId,
        userOneRole: qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.receiverRole : qrData.senderRole,
        userTwoRole: qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.senderRole : qrData.receiverRole,
        userOneName: qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.receiverName : qrData.senderName,
        userTwoName: qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.senderName : qrData.receiverName,
        userOneAvatar: qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.receiverAvatar : qrData.senderAvatar,
        userTwoAvatar: qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.senderAvatar : qrData.receiverAvatar,
        productId: qrData === null || qrData === void 0 ? void 0 : qrData.productId,
        accessId: qrData === null || qrData === void 0 ? void 0 : qrData.accessId,
        productName: qrData.productName,
        conversations: conversationId,
        requestId: qrData === null || qrData === void 0 ? void 0 : qrData.requestId,
        useRequestId: qrData === null || qrData === void 0 ? void 0 : qrData.useRequestId,
        isActive: true
    };
    // console.log('User connected successfully: Handshake data', data);
    return data;
};
const conversationData = (roomId, msgData, senderId, senderName) => {
    const data = {
        roomId: roomId,
        conversation: [{
                message: msgData.message,
                messageType: msgData.messageType,
                senderId: senderId,
                senderName: senderName,
                timeCreated: new Date().toISOString()
            }]
    };
    return data;
};
/**
 *
 * @param {Namespace} chatNsp - resident route namespace
 * @param {*} socket - socket instance
 */
const chatController = (chatNsp, socket) => __awaiter(void 0, void 0, void 0, function* () {
    /** this is used to get connection query params */
    let handshake = socket.handshake;
    const qrData = JSON.parse(JSON.stringify(handshake.query));
    /** user connection Id */
    const connectionId = socket.id;
    /** @var userOneId - this is expected to be admin id */
    const userOneId = qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.receiverId : qrData.senderId;
    /** this used to create a unique conversation room
     * - id useRequestId is true -- then requestId is used as the room id and if false the users id is used instead
    */
    let roomId;
    if ((qrData === null || qrData === void 0 ? void 0 : qrData.useRequestId) && (qrData === null || qrData === void 0 ? void 0 : qrData.requestId) && (qrData === null || qrData === void 0 ? void 0 : qrData.useRequestId) === true) {
        roomId = qrData.requestId;
    }
    else {
        roomId = qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.receiverId + "_" + qrData.senderId : qrData.senderId + "_" + qrData.receiverId;
    }
    /** this is used to determine wether to fetch a single chat or all chats for admin */
    const fetchType = qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? false : true;
    /** holds conversation data or db response */
    let convData;
    if (fetchType) {
        console.log("userOneId", userOneId);
        convData = yield (0, database_query_1.getAdminChats)(userOneId);
    }
    else {
        console.log('qrData.requestId', qrData.requestId, qrData === null || qrData === void 0 ? void 0 : qrData.useRequestId, roomId);
        convData = (qrData === null || qrData === void 0 ? void 0 : qrData.useRequestId) === true ? yield (0, database_query_1.getChats)(qrData.requestId) : yield (0, database_query_1.getChatsBYRoomId)(roomId);
    }
    // console.log('Old conversation', convData);
    /** check if conversation data is available */
    if (!convData) {
        const msgObj = conversationData(roomId, { message: 'chat initiated', messageType: 'text' }, qrData.senderId, "");
        // console.log('conversation data', msgObj);
        const conv = yield (0, database_query_1.createConversation)(msgObj);
        if (conv) {
            yield (0, database_query_1.createChat)(chatData(roomId, qrData, conv._id));
            /** add user to a specific room */
            socket.join(roomId);
            console.log("resident added back room: ", socket.rooms);
        }
        else {
            // console.log('conv', conv);
            return conv;
        }
    }
    else {
        // reconnect user back to the previous rooms
        if (Array.isArray(convData) && convData.length > 0) {
            convData.forEach(element => {
                socket.join(element.roomId);
            });
            console.log("resident added back room: ", socket.rooms);
        }
        else if (!Array.isArray(convData)) {
            socket.join(convData.roomId);
            console.log("resident added back room: ", socket.rooms);
        }
        //    socket.emit('old-messages', {chats: convData});
        socket.emit('connected', { data: { connectionId: socket.id, chats: convData } });
    }
    socket.on("disconnecting", (data) => {
        // socket.emit('ride-request-available', setMessage({}, 'resident: you are now connected', 'r-1', true));
        // console.log(qrData.senderName + " disconnecting");
    });
    /** event to recieve sent message */
    socket.on("send-new-message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log('send-new-message', data);
        /**  check database if this room id is existing
         * if found update the conversation
         * else save the query data and create the conversation
         */
        /** @var messageRoomId - This is used to determine who is recieving the message */
        let messageRoomId = (data === null || data === void 0 ? void 0 : data.messageId) ? data === null || data === void 0 ? void 0 : data.messageId : roomId;
        const msgObj = conversationData(messageRoomId, { message: data.message, messageType: data.messageType }, qrData.senderId, data.senderName);
        yield (0, database_query_1.updateConversation)(msgObj);
        // console.log('new message data', msgObj, ": Db res", );
        socket.to(messageRoomId).emit('receive-new-message', { message: data.message, messageType: data.messageType, messageId: messageRoomId, error: false });
        socket.emit('send-new-message-done', { data: [], message: 'message sent', error: false });
    }));
    socket.on("get-messages", (data) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log('get-messages', data);
        const allMsg = yield (0, database_query_1.getConversation)(roomId);
        // retrieve message from database
        socket.emit('get-messages-done', { message: 'all messages retrieved', data: allMsg, error: false });
    }));
});
exports.chatController = chatController;
