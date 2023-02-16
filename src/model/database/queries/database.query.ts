import { chatRooms } from "../schemas/chat.schema";
import { conversations } from "../schemas/chat.schema";
import { notification } from "../schemas/notification";


export const getUserChatList = async (userId: string | number, roomId: string, messageObj: any) => {
    
    const chatInfo: any = await chatRooms.findOne({$or:[{userOneId: userId}, {userTwoId: userId}]});

    if (chatInfo) {
      
    }
    
    return chatInfo;
}

export const createChat = async (chatData: any) => {
    const chatInfo = await chatRooms.create(chatData);
    return chatInfo;
}

/**
 * This method get chats by room Id which could be either requestId or users id joined
 * @param roomId 
 * @returns 
 */
export const getChatsByRoomId = async (roomId: string) => {
    const chatInfo: any = await chatRooms.findOne({roomId: roomId}).populate('conversations');
    return chatInfo;
}

/**
 * This method gets chats info by request Id
 * @param requestId 
 * @returns 
 */
export const getChats = async (requestId: string) => {
    const chatInfo: any = await chatRooms.findOne({requestId: requestId}).populate('conversations');
    return chatInfo;
}

/**
 * This method return array of chats for admin
 * @param adminId 
 * @returns 
 */
export const getAdminChats = async (adminId: string) => {
    try {
        const chatInfo: any = await chatRooms.find({userOneId: adminId}).populate('conversations');
    return chatInfo;
    } catch (error: any) {
        console.log(error?.message);
        
    }
}

export const createConversation = async (conversationData:any) => {
    const chatInfo = await conversations.create(conversationData);
    return chatInfo;
}

export const getConversation = async (roomId: string) => {
    const chatInfo: any = await conversations.findOne({roomId: roomId});
    return chatInfo;
}

export const updateConversation = async (data:any) => {
    const conversation: any = await conversations.findOne({roomId: data.roomId});
    if (conversation) {
        // update the conversation
        return await conversations.updateOne(
                { roomId: data.roomId},
                { $addToSet: { conversation: data.conversation[0] } },
                {new : true}
              );
    }
    else {
        return false;
    }
}

export const createNotification = async (NotificationData: any) => {
    const NotificationInfo = await notification.create(NotificationData);
    return NotificationInfo;
}
export const getNotifications = async (id: string) => {
    if (id) {
        const notificationData: any = await notification.findOne({requestId: id});
    return notificationData;
    } else {
        return 0;
    }
}

export const updateNotification = async (requestId: string, notificationId: string) => {
    const notificationRes: any = await notification.findOne({requestId:requestId, notificationId: notificationId});
    if (notificationRes) {
        // update the conversation
        return await notification.findOneAndUpdate(
            {requestId: requestId, notificationId: notificationId},
                { $set: { isRead: true} },
                {$new: true}
              );
    }
    else {
        return false;
    }
}