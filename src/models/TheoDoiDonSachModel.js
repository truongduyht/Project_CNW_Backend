import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderDetailSchema = new Schema(
  {
    IdOrder: { type: mongoose.Types.ObjectId, ref: "DonSach" },
    IdUser: { type: mongoose.Types.ObjectId, ref: "DocGia" },
    IdBook: { type: mongoose.Types.ObjectId, ref: "Sach" },
    Quantity: Number,
    Price: Number,
  },
  {
    timestamps: true,
  }
);
const OrderDetail = mongoose.model("TheoDoiDonMuon", OrderDetailSchema);
export default OrderDetail;
