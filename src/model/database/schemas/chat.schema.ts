import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

const ChatRoomSchema = new Schema({
    roomId: {type: String, required: true}, // this is combination of senderId and receiverId e.g user1-ID_user2-ID  5we65451sd154sf_s94s64dfsf6ag8
    userOneId: {type: String, required: true}, 
    userTwoId: {type: String, required: true},
    userOneRole: {type: String, required: true},
    userTwoRole: {type: String, required: true},
    userOneName: {type: String, required: true},
    userTwoName: {type: String, required: true},
    userOneAvatar: {type: String, default: null},
    userTwoAvatar: {type: String,default: null},
    productId: {type: String,default: null}, // gate-house access key
    accessId: {type: String,default: null}, // estate id
    productName: {type: String,default: null}, // gate-house
    conversations: {type: Schema.Types.ObjectId, required: true, ref: "Conversations"},
    isActive: {type: Boolean, required: false, default: true}
});
 
const ConversationsSchema = new Schema({
    roomId: {type: String, required: true},
    conversation: [
      {
      message: {type: String, required: true},
      messageType: {type: String, default: 'text'},
      senderId: {type: String, required: true},
      timeCreated: {type: String, required: true}
    }
    ]
});

  ChatRoomSchema.set("toJSON", {
    transform: function (doc, ret, options) {
      delete ret.__v;
    },
  });
  ConversationsSchema.set("toJSON", {
    transform: function (doc, ret, options) {
      delete ret.__v;
    },
  });

  ChatRoomSchema.plugin(mongoosePaginate);
  ConversationsSchema.plugin(mongoosePaginate);

  export const chatRooms = mongoose.model("ChatRooms", ChatRoomSchema);
  export const conversations = mongoose.model("Conversations", ConversationsSchema);
