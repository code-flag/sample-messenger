"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUID = void 0;
const crypto_1 = __importDefault(require("crypto"));
const UUID = () => {
    const id = crypto_1.default.randomBytes(16).toString("hex");
    return id;
};
exports.UUID = UUID;
