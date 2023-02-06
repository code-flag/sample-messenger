import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

const Notification = new Schema({
    title: {type: String, required: true}, 
    message: {type: String, required: true},
    data: {type: Object},
    requestId: {type: String, default: null},
    notificationId: {type: String, required: true},
    isRead: {type: Boolean, default: false},
});

  Notification.set("toJSON", {
    transform: function (doc, ret, options) {
      delete ret.__v;
    },
  });


  Notification.plugin(mongoosePaginate);
 
  export const notification = mongoose.model("Notification", Notification);
