import mongoose from "mongoose";
const { Schema } = mongoose;

const StaffSchema = new Schema(
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

const Staff = mongoose.model("Staff", StaffSchema);
export default Staff;
