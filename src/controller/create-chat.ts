/**
 * This file contain all the methods needs to create a chat for a user
 */
import { createChat, createConversation, getChats, getConversation, getStaffChats, updateConversation } from "../model/database/queries/database.query";
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
        requestId: qrData.requestId, 
        useRequestId: qrData.useRequestId, 
        conversations: conversationId,
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
/** this method is used to get roomId if both users are staffs */
const getStaffData = async (userOneId: string, userTwoId: string) => {
    // get any chat related to this id
    const roomId_1 = userOneId + "_" + userTwoId ;
    const roomId_2 = userTwoId + "_" + userOneId ;
    const staffChat = await getStaffChats(roomId_1, roomId_2);
    console.log("staffChat : ", staffChat);
    return staffChat;
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
    var rmId: string;
        
    var roomId: string;

    var convData: any;
    console.log("condition ", qrData.receiverRole == "staff", qrData.senderRole == "staff", qrData.useRequestId, !qrData.useRequestId, typeof qrData.useRequestId);
    qrData.useRequestId = typeof qrData.useRequestId == "string" && qrData.useRequestId == "false" ? false : true;
    console.log("typeof qrData.useRequestId: ", typeof qrData.useRequestId);
    
    if (!qrData.useRequestId && qrData.receiverRole == "staff" && qrData.senderRole == "staff") {
       const data = await getStaffData(qrData.senderId, qrData.receiverId);
       console.log("data: ", data);
       roomId = data.roomId;
       convData = data;
       
    } else {
        rmId = qrData.senderRole == 'visitor' || qrData.senderRole == 'user' ? `${qrData.receiverId}_${qrData.senderId}` : `${qrData.senderId}_${qrData.receiverId}`;
        
        roomId = qrData.useRequestId || qrData.useRequestId === "true"? qrData.requestId : rmId ;
    
        convData = await getChats(roomId);
    }
    // console.log('Old conversation', convData);
    if (!convData) {
        const msgObj: any = conversationData(roomId, { message: 'chat initiated', messageType: 'text' }, qrData.senderId, qrData.senderName);
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
        const msgObj: any = conversationData(roomId, { message: data.message, messageType: data.messageType }, qrData.senderId, qrData.senderName);
        // console.log('new message data', msgObj, ": Db res", );
        await updateConversation(msgObj);

        socket.to(roomId).emit('receive-new-message', { senderId: qrData.senderId, senderName: qrData.senderName, messageId: roomId,  message: data.message, messageType: data.messageType, error: false });
        socket.emit('send-new-message-done', { message: 'message sent', data: data?.meta ?? [], "timestamp": new Date().toISOString(), error: false });
        
    });

    socket.on("get-messages", async (data) => {
        // console.log('get-messages', data);
        const allMsg: any = await getConversation(roomId);
        // retrieve message from database
        socket.emit('get-messages-done', { message: 'all messages retrieved', data: allMsg, error: false });
    });

};