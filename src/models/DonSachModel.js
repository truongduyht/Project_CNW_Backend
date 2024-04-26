import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    IdUser: { type: mongoose.Types.ObjectId, ref: "Reader" },
    IdStaff: { type: mongoose.Types.ObjectId, ref: "Staff" },
    DayOrder: { type: Date, default: Date.now },
    DayRefund: Date,
    Status: String,
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", OrderSchema);
export default Order;
