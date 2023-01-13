"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
/**
 *
 * @param {Namespace} chatNsp - resident route namespace
 * @param {*} socket - socket instance
 */
const chatController = (chatNsp, socket) => {
    var _a, _b, _c, _d, _e;
    let handshake = socket.handshake;
    const qrData = JSON.parse(JSON.stringify(handshake.query));
    console.log('User connected successfully: Handshake data', { productName: qrData === null || qrData === void 0 ? void 0 : qrData.productName,
        productId: qrData === null || qrData === void 0 ? void 0 : qrData.productId,
        accessId: qrData === null || qrData === void 0 ? void 0 : qrData.accessId,
        senderId: qrData === null || qrData === void 0 ? void 0 : qrData.senderId,
        senderName: (_a = qrData.senderName) !== null && _a !== void 0 ? _a : "sender",
        senderAvatar: (_b = qrData.senderAvatar) !== null && _b !== void 0 ? _b : "sender_avatar",
        senderRole: (_c = qrData.senderRole) !== null && _c !== void 0 ? _c : "N/A",
        receiverId: qrData === null || qrData === void 0 ? void 0 : qrData.receiverId,
        receiverName: (_d = qrData.recieiverName) !== null && _d !== void 0 ? _d : "receiver",
        receiverAvatar: (_e = qrData.receiverAvatar) !== null && _e !== void 0 ? _e : "receiver_avatar",
        receiverRole: qrData === null || qrData === void 0 ? void 0 : qrData.receiverRole
    });
    socket.on("disconnecting", (data) => {
        // socket.emit('ride-request-available', setMessage({}, 'resident: you are now connected', 'r-1', true));
        console.log(qrData.senderName + " disconnecting");
    });
    const connectionId = socket.id;
    const roomId = qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.receiverId + "_" + qrData.senderId : qrData.senderId + "_" + qrData.receiverId;
    /** add user to a specific room */
    socket.join(roomId);
    console.log("resident added back room: ", socket.rooms);
    /** event to recieve sent message */
    socket.on("send-new-message", (data) => {
        console.log('send-new-message', data);
        /**  check database if this room id is existing
         * if found update the conversation
         * else save the query data and create the conversation
         */
        socket.to(roomId).emit('receive-new-message', { message: data.message, name: data.name, error: false });
        socket.emit('send-new-message-done', { message: 'message sent', data: data, error: false });
    });
    socket.on("get-messages", (data) => {
        console.log('get-messages', data);
        // retrieve message from database
        socket.emit('get-messages', { message: 'request is been process', data: data, error: false });
    });
};
exports.chatController = chatController;
