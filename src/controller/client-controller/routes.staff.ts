import express from "express";
// const { initData } = require("./mediator.controller");
const router = express.Router();

router.get("/",(req:any, res: any) => {
    // const data = await initData();
    res.render('staff-chat',  {requestId: req.query.requestId, useRequestId: req.query.useRequestId, senderId: req.query.senderId, receiverId: req.query.receiverId });
});

router.get("/user/:userType",(req:any, res: any) => {
    // const data = await initData();
    console.log('service type', req.params.userType);
    
    res.render('staff-chat', {vendorsData: ''});
});

export default router;