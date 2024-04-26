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

const Publish = mongoose.model("NXB", PublishSchema);
export default Publish;
