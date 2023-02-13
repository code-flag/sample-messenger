
import { UUID } from "../helper/library/unique-id";
import { Socket } from "socket.io";
import { createNotification } from "../model/database/queries/database.query";

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

export const pushNotification = async (socket:any, request: any, response: any) => {
    const notification = request.body;
    const id = request.params?.id;
    const notificationObj: any = notificationData({ message: notification.message, title: notification.title, data:  notification.data }, id);
    // console.log("notificationObj", notificationObj);
    
    // const dbResponse = await createNotification(notificationObj);
    if(id){
        socket.to(id).emit('subscribe-new-notification', { message: "Notification available", data: notificationObj, error: false });
        response.status(200).json({message: "Notification sent successfully", status: "success"});
    }
    else {
     response.status(400).json({message: "Notification was not sent", status: "failed"});
    }
}
