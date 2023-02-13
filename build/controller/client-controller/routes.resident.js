"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// const { initData } = require("./mediator.controller");
const router = express_1.default.Router();
/**
 * This method check if a string is hex color code or not
 * @param color - hex color code
 * @returns - true or false
 */
const isHexColor = (color) => {
    console.log('test', typeof color === 'string'
        && (color.length === 6 || color.length === 3)
        && !isNaN(Number('0x' + color)));
    return typeof color === 'string'
        && (color.length === 6 || color.length === 3)
        && !isNaN(Number('0x' + color));
};
/**
 * This method check if a string is hex color code or not: this is not efficient as isHexCode method
 * @param color - hex color code
 * @returns - true or false
 */
const isValidColor = (color) => {
    color = '#' + color;
    console.log('color test 2', /^#[0-9A-F]{6}$/i.test(color));
    console.log('color test 3', /^#([0-9A-F]{3}){1, 2}$/i.test(color));
    return /^#[0-9A-F]{6}$/i.test(color);
};
router.get("/", (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    // const data = await initData();
    console.log('resident query', req.query.requestId);
    req.query.appColor = isHexColor(req.query.appColor) ? req.query.appColor : '000';
    req.query.appBgColor = isHexColor(req.query.appBgColor) ? req.query.appBgColor : '33ccff';
    req.query.messengerName = req.query.messengerName && req.query.messengerName != '' ? req.query.messengerName : 'CPAAT Messenger';
    /**
     *  const appData = JSON.parse(JSON.stringify(req.query.appData));
    console.log('resident query',appData, appData.userType);
    
    appData.appColor = isHexColor(appData.appColor) ? appData.appColor : '000';
    appData.appBgColor = isHexColor(appData.appBgColor) ? appData.appBgColor : '33ccff';
    appData.messengerName = appData.messengerName && appData.messengerName != '' ? appData.messengerName : 'CPAAT Messenger';

     */
    const appInitData = {
        appName: (_b = (_a = req.query) === null || _a === void 0 ? void 0 : _a.messengerName) !== null && _b !== void 0 ? _b : "",
        userType: (_d = (_c = req.query) === null || _c === void 0 ? void 0 : _c.userType) !== null && _d !== void 0 ? _d : "user",
        receiverId: (_f = (_e = req.query) === null || _e === void 0 ? void 0 : _e.receiverId) !== null && _f !== void 0 ? _f : "id_not_available",
        chatPage: (_h = (_g = req.query) === null || _g === void 0 ? void 0 : _g.chatPage) !== null && _h !== void 0 ? _h : 1,
        meta: (_j = req.query) === null || _j === void 0 ? void 0 : _j.meta
    };
    res.render('resident-chat', { appInitData: appInitData, appName: (_l = (_k = req.query) === null || _k === void 0 ? void 0 : _k.messengerName) !== null && _l !== void 0 ? _l : "",
        appColor: (_m = req.query) === null || _m === void 0 ? void 0 : _m.appColor, appBgColor: (_o = req.query) === null || _o === void 0 ? void 0 : _o.appBgColor,
        requestId: (_q = (_p = req.query) === null || _p === void 0 ? void 0 : _p.requestId) !== null && _q !== void 0 ? _q : 203, useRequestId: (_s = (_r = req.query) === null || _r === void 0 ? void 0 : _r.useRequestId) !== null && _s !== void 0 ? _s : true,
        senderId: (_u = (_t = req.query) === null || _t === void 0 ? void 0 : _t.senderId) !== null && _u !== void 0 ? _u : 101, receiverId: (_w = (_v = req.query) === null || _v === void 0 ? void 0 : _v.receiverId) !== null && _w !== void 0 ? _w : 201 });
});
router.get("/:userType", (req, res) => {
    // const data = await initData();
    console.log('resident type', req.params.userType, req.params.appColor, req.params.messengerName);
    res.render('resident-chat', { vendorsData: '' });
});
exports.default = router;
