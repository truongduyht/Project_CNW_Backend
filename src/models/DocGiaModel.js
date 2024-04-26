import mongoose from "mongoose";
const { Schema } = mongoose;

const ReaderSchema = new Schema(
  {
    HoTen: String,
    Password: String,
    DiaChi: String,
    SoDienThoai: String,
    Role: String,
  },
  {
    timestamps: true,
  }
);

const Reader = mongoose.model("DocGia", ReaderSchema);
export default Reader;
