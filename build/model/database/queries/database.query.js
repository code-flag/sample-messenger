"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConversation = exports.getConversation = exports.createConversation = exports.createChat = exports.getUserChatList = void 0;
const chat_schema_1 = require("../chat.schema");
const chat_schema_2 = require("../chat.schema");
const getUserChatList = (userId, roomId, messageObj) => __awaiter(void 0, void 0, void 0, function* () {
    const chatInfo = chat_schema_1.chatRooms.findOne({ $or: [{ userOneId: userId }, { userTwoId: userId }] });
    if (chatInfo) {
    }
    return chatInfo;
});
exports.getUserChatList = getUserChatList;
const createChat = (userId, roomId, messageObj) => {
    const chatInfo = chat_schema_1.chatRooms.findOne({ $or: [{ userOneId: userId }, { userTwoId: userId }] });
    return chatInfo;
};
exports.createChat = createChat;
const createConversation = (roomId, messageObj) => {
    const chatInfo = chat_schema_2.conversations.create({ roomId: roomId, conversation: messageObj });
    return chatInfo;
};
exports.createConversation = createConversation;
const getConversation = (userId, roomId, messageObj) => {
    const chatInfo = chat_schema_1.chatRooms.findOne({ $or: [{ userOneId: userId }, { userTwoId: userId }] });
    return chatInfo;
};
exports.getConversation = getConversation;
const updateConversation = (roomId, messageObj) => {
    const conversation = chat_schema_2.conversations.findOne({ roomId: roomId });
    if (conversation) {
        // update the conversation
        chat_schema_2.conversations.findOneAndUpdate({ roomId: roomId }, { $set: messageObj }, { new: true });
    }
    else {
        return false;
    }
};
exports.updateConversation = updateConversation;
