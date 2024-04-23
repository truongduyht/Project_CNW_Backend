import mongoose from "mongoose";
const { Schema } = mongoose;

const CartSchema = new Schema(
  {
    IdUser: { type: Schema.Types.ObjectId, red: "Reader" },
    IdBook: { type: Schema.Types.ObjectId, ref: "Book" },
    Quantity: Number,
  },
  {
    timestamps: true,
  }
);
const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
