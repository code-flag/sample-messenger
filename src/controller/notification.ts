/**
 * This file contain all the methods needs to create a chat for a user
 */
import {createNotification, getNotifications,  updateNotification } from "../model/database/queries/database.query";
import { Socket } from "socket.io";
import { UUID } from "../helper/library/unique-id";


const notificationData = (notificationData: any, requestId: string) => {
    const data = {
        title: notificationData?.title,
        message: notificationData?.message, 
        data: notificationData.data, 
        notificationId: UUID(),
        requestId: requestId
    }
    // console.log('User connected successfully: Handshake data', data);
    return data;
}


/**
 *
 * @param {Namespace} chatNsp - resident route namespace
 * @param {*} socket - socket instance
 */
export const NotificationController = async (socket: Socket) => {

    let handshake = socket.handshake;
    const qrData = JSON.parse(JSON.stringify(handshake.query));

    const connectionId = socket.id;
    let roomId: string = qrData.estateId;

    const responseData = 1254 //await getNotifications(qrData.estateId);
    
    // console.log('Notification',responseData );
    if (responseData || 1) {
        socket.emit('connected', { data: responseData, connectionId: connectionId,  message: "Notification is available", error: false});
    }else {
        socket.emit('connected', { data: [], connectionId: connectionId, message: "Notification is available", error: false});
    }

    socket.on("disconnecting", (data) => {
        // socket.emit('ride-request-available', setMessage({}, 'resident: you are now connected', 'r-1', true));
        // console.log(qrData.senderName + " disconnecting");
    });

    /** add user to a specific room */
    socket.join(roomId);

    /** event to recieve sent message */
    socket.on("new-notification", async (data) => {
      
        const notificationObj: any = notificationData({ message: data.message, title: data.title, data:  data.data }, qrData.estateId);
        await createNotification(notificationObj);
        // console.log('new message data', notificationObj, ": Db res", await updateConversation(notificationObj));

        socket.to(roomId).emit('subscribe-new-notification', { message: "Notification available", data: notificationObj, error: false });
        socket.emit('new-notification-done', { data: [], message: 'Notification sent', error: false });
        
    });

    socket.on("get-notification", async () => {
    const responseData = await getNotifications(qrData.estateId);
    // console.log('Notification',responseData );
    if (responseData ) {
        socket.emit('get-notification-done', { data: responseData, message: "Notification successfully retrieved", error: false});
    }
  });

  socket.on("acknowledge-notification", async (notificationId) => {
   if (notificationId) {
    const responseData = await updateNotification(qrData.estateId, notificationId);
    // console.log('Notification',responseData );
    if (responseData ) {
        socket.emit('acknowledge-notification-done', { data: responseData, message: "Notification successfully retrieved", error: false});
    }
   }
   else {
    socket.emit('acknowledge-notification-done', {data: [], message: "Notification Id is required", error: true});
   }
  });

};