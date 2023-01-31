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
exports.updateConversation = exports.getConversation = exports.createConversation = exports.getAdminChats = exports.getChats = exports.getChatsBYRoomId = exports.createChat = exports.getUserChatList = void 0;
const chat_schema_1 = require("../schemas/chat.schema");
const chat_schema_2 = require("../schemas/chat.schema");
const getUserChatList = (userId, roomId, messageObj) => __awaiter(void 0, void 0, void 0, function* () {
    const chatInfo = yield chat_schema_1.chatRooms.findOne({ $or: [{ userOneId: userId }, { userTwoId: userId }] });
    if (chatInfo) {
    }
    return chatInfo;
});
exports.getUserChatList = getUserChatList;
const createChat = (chatData) => __awaiter(void 0, void 0, void 0, function* () {
    const chatInfo = yield chat_schema_1.chatRooms.create(chatData);
    return chatInfo;
});
exports.createChat = createChat;
const getChatsBYRoomId = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const chatInfo = yield chat_schema_1.chatRooms.findOne({ roomId: roomId }).populate('conversations');
    return chatInfo;
});
exports.getChatsBYRoomId = getChatsBYRoomId;
const getChats = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    const chatInfo = yield chat_schema_1.chatRooms.findOne({ requestId: requestId }).populate('conversations');
    return chatInfo;
});
exports.getChats = getChats;
const getAdminChats = (adminId) => __awaiter(void 0, void 0, void 0, function* () {
    const chatInfo = yield chat_schema_1.chatRooms.findOne({ userOneId: adminId }).populate('conversations');
    return chatInfo;
});
exports.getAdminChats = getAdminChats;
const createConversation = (conversationData) => __awaiter(void 0, void 0, void 0, function* () {
    const chatInfo = yield chat_schema_2.conversations.create(conversationData);
    return chatInfo;
});
exports.createConversation = createConversation;
const getConversation = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const chatInfo = yield chat_schema_2.conversations.findOne({ roomId: roomId });
    return chatInfo;
});
exports.getConversation = getConversation;
const updateConversation = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const conversation = yield chat_schema_2.conversations.findOne({ roomId: data.roomId });
    if (conversation) {
        // update the conversation
        return yield chat_schema_2.conversations.updateOne({ roomId: data.roomId }, { $addToSet: { conversation: data.conversation[0] } });
    }
    else {
        return false;
    }
});
exports.updateConversation = updateConversation;
