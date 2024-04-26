import mongoose from "mongoose";
const { Schema } = mongoose;

const PublishSchema = new Schema(
  {
    TenNXB: String,
    DiaChi: String,
  },
  {
    timestamps: true,
  }
);

const Publish = mongoose.model("Publish", PublishSchema);
export default Publish;
