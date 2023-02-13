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
exports.updateNotification = exports.getNotifications = exports.createNotification = exports.updateConversation = exports.getConversation = exports.createConversation = exports.getAdminChats = exports.getChats = exports.getChatsBYRoomId = exports.createChat = exports.getUserChatList = void 0;
const chat_schema_1 = require("../schemas/chat.schema");
const chat_schema_2 = require("../schemas/chat.schema");
const notification_1 = require("../schemas/notification");
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
    try {
        const chatInfo = yield chat_schema_1.chatRooms.findOne({ userOneId: adminId }).populate('conversations');
        return chatInfo;
    }
    catch (error) {
        console.log(error === null || error === void 0 ? void 0 : error.message);
    }
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
const createNotification = (NotificationData) => __awaiter(void 0, void 0, void 0, function* () {
    const NotificationInfo = yield notification_1.notification.create(NotificationData);
    return NotificationInfo;
});
exports.createNotification = createNotification;
const getNotifications = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (id) {
        const notificationData = yield notification_1.notification.findOne({ requestId: id });
        return notificationData;
    }
    else {
        return 0;
    }
});
exports.getNotifications = getNotifications;
const updateNotification = (requestId, notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationRes = yield notification_1.notification.findOne({ requestId: requestId, notificationId: notificationId });
    if (notificationRes) {
        // update the conversation
        return yield notification_1.notification.findOneAndUpdate({ requestId: requestId, notificationId: notificationId }, { $set: { isRead: true } }, { $new: true });
    }
    else {
        return false;
    }
});
exports.updateNotification = updateNotification;
