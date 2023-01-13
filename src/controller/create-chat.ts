/**
 * This file contain all the methods needs to create a chat for a user
 */
import { Namespace, Socket } from "socket.io";

/**
 *
 * @param {Namespace} chatNsp - resident route namespace
 * @param {*} socket - socket instance
 */
export const chatController = (chatNsp: Namespace, socket: Socket) => {

    let handshake = socket.handshake;
    const qrData = JSON.parse(JSON.stringify(handshake.query));
    console.log('User connected successfully: Handshake data',
        { productName: qrData?.productName,
            productId: qrData?.productId,
            accessId: qrData?.accessId,
            senderId: qrData?.senderId,
            senderName: qrData.senderName ?? "sender",
            senderAvatar: qrData.senderAvatar ?? "sender_avatar",
            senderRole: qrData.senderRole ?? "N/A",
            receiverId: qrData?.receiverId,
            receiverName: qrData.recieiverName ?? "receiver",
            receiverAvatar: qrData.receiverAvatar ?? "receiver_avatar",
            receiverRole: qrData?.receiverRole
        }
    );

    socket.on("disconnecting", (data) => {
        // socket.emit('ride-request-available', setMessage({}, 'resident: you are now connected', 'r-1', true));
        console.log(qrData.senderName + " disconnecting");
    });

    const connectionId = socket.id;
    const roomId = qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.receiverId + "_" + qrData.senderId : qrData.senderId + "_" + qrData.receiverId ; 
   
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