"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const { Schema } = mongoose_1.default;
const Notification = new Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Object },
    requestId: { type: String, default: null },
    notificationId: { type: String, required: true },
    isRead: { type: Boolean, default: false },
});
Notification.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.__v;
    },
});
Notification.plugin(mongoose_paginate_v2_1.default);
exports.notification = mongoose_1.default.model("Notification", Notification);
