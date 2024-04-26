import mongoose from "mongoose";
const { Schema } = mongoose;

const CartSchema = new Schema(
  {
    IdUser: { type: Schema.Types.ObjectId, ref: "DocGia" },
    IdBook: { type: Schema.Types.ObjectId, ref: "Sach" },
    Quantity: Number,
  },
  {
    timestamps: true,
  }
);
const Cart = mongoose.model("GioSach", CartSchema);
export default Cart;
