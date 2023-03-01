import { chatRooms } from "../schemas/chat.schema";
import { conversations } from "../schemas/chat.schema";


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
export const getChats = async (roomId: string) => {
    const chatInfo: any = await chatRooms.findOne({roomId: roomId}).populate('conversations');
    return chatInfo;
}

export const getStaffChats = async (roomId_1: string, roomId_2: string) => {
    const chatInfo: any = await chatRooms.findOne({roomId: {$in: [roomId_1, roomId_2]}}).populate('conversations');
    return chatInfo;
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
                { $addToSet: { conversation: data.conversation[0] } }
              );
    }
    else {
        return false;
    }
}