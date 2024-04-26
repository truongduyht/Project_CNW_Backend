import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    IdUser: { type: mongoose.Types.ObjectId, ref: "DocGia" },
    IdStaff: { type: mongoose.Types.ObjectId, ref: "NhanVien" },
    DayOrder: { type: Date, default: Date.now },
    DayRefund: Date,
    Status: String,
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("DonSach", OrderSchema);
export default Order;
