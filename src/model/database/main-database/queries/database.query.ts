import { chatRooms } from "../schemas/chat.schema";
import { conversations } from "../schemas/chat.schema";


export const getUserChatList = (userId: string | number, roomId: string, messageObj: any) => {
    const chatInfo = chatRooms.findOne({$or:[{userOneId: userId}, {userTwoId: userId}]});
    return chatInfo;
}

export const createChat = (userId: string | number, roomId: string, messageObj: any) => {
    const chatInfo = chatRooms.findOne({$or:[{userOneId: userId}, {userTwoId: userId}]});
    return chatInfo;
}

export const createConversation = (userId: string | number, roomId: string, messageObj: any) => {
    const chatInfo = chatRooms.findOne({$or:[{userOneId: userId}, {userTwoId: userId}]});
    return chatInfo;
}

export const updateChat = (userId: string | number, roomId: string, messageObj: any) => {
    const chatInfo = chatRooms.findOne({$or:[{userOneId: userId}, {userTwoId: userId}]});
    return chatInfo;
}

export const updateConversation = (userId: string | number, roomId: string, messageObj: any) => {
    const chatInfo = chatRooms.findOne({$or:[{userOneId: userId}, {userTwoId: userId}]});
    return chatInfo;
}