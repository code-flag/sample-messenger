import { chatRooms } from "../chat.schema";
import { conversations } from "../chat.schema";


export const getUserChatList = async (userId: string | number, roomId: string, messageObj: any) => {
    
    const chatInfo: any = chatRooms.findOne({$or:[{userOneId: userId}, {userTwoId: userId}]});

    if (chatInfo) {
      
    }
    
    return chatInfo;
}

export const createChat = (userId: string | number, roomId: string, messageObj: any) => {
    const chatInfo = chatRooms.findOne({$or:[{userOneId: userId}, {userTwoId: userId}]});
    return chatInfo;
}

export const createConversation = ( roomId: string, messageObj: any) => {
    const chatInfo = conversations.create({roomId: roomId, conversation: messageObj});
    return chatInfo;
}

export const getConversation = (userId: string | number, roomId: string, messageObj: any) => {
    const chatInfo = chatRooms.findOne({$or:[{userOneId: userId}, {userTwoId: userId}]});
    return chatInfo;
}

export const updateConversation = (roomId: string, messageObj: any) => {
    const conversation: any = conversations.findOne({roomId: roomId});
    if (conversation) {
        // update the conversation
        conversations.findOneAndUpdate(
            { roomId: roomId},
            { $set: messageObj },
            { new: true });
    }
    else {
        return false;
    }
}