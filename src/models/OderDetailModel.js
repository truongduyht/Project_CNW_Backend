import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderDetailSchema = new Schema(
  {
    IdOrder: { type: mongoose.Types.ObjectId, ref: "Order" },
    IdUser: { type: mongoose.Types.ObjectId, ref: "Reader" },
    IdBook: { type: mongoose.Types.ObjectId, ref: "Book" },
    Quantity: Number,
    Price: Number,
  },
  {
    timestamps: true,
  }
);
const OrderDetail = mongoose.model("OrderDetail", OrderDetailSchema);
export default OrderDetail;
