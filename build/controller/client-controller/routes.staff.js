"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// const { initData } = require("./mediator.controller");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    // const data = await initData();
    res.render('staff-chat', { requestId: req.query.requestId, useRequestId: req.query.useRequestId, senderId: req.query.senderId, receiverId: req.query.receiverId });
});
router.get("/user/:userType", (req, res) => {
    // const data = await initData();
    console.log('service type', req.params.userType);
    res.render('staff-chat', { vendorsData: '' });
});
exports.default = router;
