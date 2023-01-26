/**
 * This file contain all the methods needs to create a chat for a user
 */
import { createChat, createConversation, getChats, getConversation, updateConversation } from "../model/database/queries/database.query";
import { Namespace, Socket } from "socket.io";


const chatData = (roomID: string, qrData: any, conversationId: string) => {
    const data = {
        roomId: roomID, // this is combination of senderId and receiverId e.g user1-ID_user2-ID  5we65451sd154sf_s94s64dfsf6ag8
        userOneId: qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.receiverId : qrData.senderId,
        userTwoId: qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.senderId : qrData.receiverId,
        userOneRole: qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.receiverRole : qrData.senderRole,
        userTwoRole: qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.senderRole : qrData.receiverRole,
        userOneName: qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.receiverName : qrData.senderName,
        userTwoName: qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.senderName : qrData.receiverName,
        userOneAvatar: qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.receiverAvatar : qrData.senderAvatar,
        userTwoAvatar: qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.senderAvatar : qrData.receiverAvatar,
        productId: qrData.productId, // gate-house access key
        accessId: qrData.accessId, // estate id
        productName: qrData.productName, // gate-house
        conversations: conversationId,
        isActive: true
    }
    // console.log('User connected successfully: Handshake data', data);
    return data;
}

const conversationData = (roomId: string, msgData: any, senderId: any) => {
    const data = {
        roomId: roomId,
        conversation: [{
            message: msgData.message,
            messageType: msgData.messageType,
            senderId: senderId,
            timeCreated: new Date().toISOString()
        }]
    }

    return data;
}

/**
 *
 * @param {Namespace} chatNsp - resident route namespace
 * @param {*} socket - socket instance
 */
export const chatController = async (chatNsp: Namespace, socket: Socket) => {

    let handshake = socket.handshake;
    const qrData = JSON.parse(JSON.stringify(handshake.query));

    const connectionId = socket.id;
    const roomId: string = qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.receiverId + "_" + qrData.senderId : qrData.senderId + "_" + qrData.receiverId;

    const convData: any = await getChats(roomId);
    // console.log('Old conversation', convData);
    if (!convData) {
        const msgObj: any = conversationData(roomId, { message: 'chat initiated', messageType: 'text' }, qrData.senderId);
        // console.log('conversation data', msgObj);
        const conv: any = await createConversation(msgObj);
        if (conv) {
            await createChat(chatData(roomId, qrData, conv._id));
        }
        else {
            // console.log('conv', conv);
            return conv;
        }
    }
    else {
        //    socket.emit('old-messages', {chats: convData});
        socket.emit('connected', { data: { connectionId: socket.id, chats: convData } });
    }

    socket.on("disconnecting", (data) => {
        // socket.emit('ride-request-available', setMessage({}, 'resident: you are now connected', 'r-1', true));
        // console.log(qrData.senderName + " disconnecting");
    });

    /** add user to a specific room */
    socket.join(roomId);
    console.log("resident added back room: ", socket.rooms);

    /** event to recieve sent message */
    socket.on("send-new-message", async (data) => {
        // console.log('send-new-message', data);
        /**  check database if this room id is existing
         * if found update the conversation
         * else save the query data and create the conversation
         */
        const msgObj: any = conversationData(roomId, { message: data.message, messageType: data.messageType }, qrData.senderId);
        // console.log('new message data', msgObj, ": Db res", await updateConversation(msgObj));

        socket.to(roomId).emit('receive-new-message', { message: data.message, messageType: data.messageType, error: false });
        // socket.emit('send-new-message-done', { message: 'message sent', data: data, error: false });
        
    });

    socket.on("get-messages", async (data) => {
        // console.log('get-messages', data);
        const allMsg: any = await getConversation(roomId);
        // retrieve message from database
        socket.emit('get-messages-done', { message: 'all messages retrieved', data: allMsg, error: false });
    });

};