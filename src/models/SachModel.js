import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;

const BookSchema = new Schema(
  {
    TenSach: String,
    DonGia: Number,
    SoQuyen: Number,
    NamXB: String,
    TacGia: String,
    TheLoai: String,
    MaNXB: { type: Schema.Types.ObjectId, ref: "NXB" },
    AnhSach: String,
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Sach", BookSchema);
export default Book;
