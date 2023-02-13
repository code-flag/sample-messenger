/**
 * This file contain all the methods needs to create a chat for a user
 */
import { createChat, createConversation, getAdminChats, getChats, getChatsBYRoomId, getConversation, updateConversation } from "../model/database/queries/database.query";
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
        productId: qrData?.productId, // gate-house access key
        accessId: qrData?.accessId, // estate id
        productName: qrData.productName, // gate-house
        conversations: conversationId,
        requestId: qrData?.requestId,
        useRequestId: qrData?.useRequestId,
        isActive: true
    }
    // console.log('User connected successfully: Handshake data', data);
    return data;
}

const conversationData = (roomId: string, msgData: any, senderId: any, senderName: any) => {
    const data = {
        roomId: roomId,
        conversation: [{
            message: msgData.message,
            messageType: msgData.messageType,
            senderId: senderId,
            senderName: senderName,
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
    let roomId: string;

    if (qrData?.useRequestId && qrData?.requestId && qrData?.useRequestId === true) {
        roomId = qrData.requestId;
    }
    else {
        roomId = qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? qrData.receiverId + "_" + qrData.senderId : qrData.senderId + "_" + qrData.receiverId;

    }
    /** this is used to determine wether to fetch a single chat or all chats for admin */
    const fetchType: boolean = qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? false : true;

    /** holds conversation data or db response */
    let convData: any;
    if (fetchType) {
        console.log("userOneId", userOneId);

        convData = await getAdminChats(userOneId);
    }
    else {
        console.log('qrData.requestId', qrData.requestId, qrData?.useRequestId, roomId);

        convData = qrData?.useRequestId === true ? await getChats(qrData.requestId) : await getChatsBYRoomId(roomId);
    }

    // console.log('Old conversation', convData);
    /** check if conversation data is available */
    if (!convData) {
        const msgObj: any = conversationData(roomId, { message: 'chat initiated', messageType: 'text' }, qrData.senderId, "");
        // console.log('conversation data', msgObj);
        const conv: any = await createConversation(msgObj);
        if (conv) {
            await createChat(chatData(roomId, qrData, conv._id));
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
        } else if (!Array.isArray(convData)) {
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
    socket.on("send-new-message", async (data) => {
        // console.log('send-new-message', data);
        /**  check database if this room id is existing
         * if found update the conversation
         * else save the query data and create the conversation
         */
        /** @var messageRoomId - This is used to determine who is recieving the message */
        let messageRoomId = data?.messageId ? data?.messageId : roomId;
        const msgObj: any = conversationData(messageRoomId, { message: data.message, messageType: data.messageType }, qrData.senderId, data.senderName);
        await updateConversation(msgObj);
        // console.log('new message data', msgObj, ": Db res", );

        socket.to(messageRoomId).emit('receive-new-message', { message: data.message, messageType: data.messageType, messageId: messageRoomId, error: false });
        socket.emit('send-new-message-done', { data: [], message: 'message sent', error: false });

    });

    socket.on("get-messages", async (data) => {
        // console.log('get-messages', data);
        const allMsg: any = await getConversation(roomId);
        // retrieve message from database
        socket.emit('get-messages-done', { message: 'all messages retrieved', data: allMsg, error: false });
    });

};