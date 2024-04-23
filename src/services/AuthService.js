import db from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt, { genSaltSync } from "bcrypt";
const salt = genSaltSync(10);

const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
};

const checkPassword = (inputPassword, hashPassword) => {
  return bcrypt.compare(inputPassword, hashPassword);
};

const checkPhone = async (phone) => {
  let user = null;

  user = await db.Staff.findOne({
    SoDienThoai: phone,
  });

  if (user === null) {
    user = await db.Reader.findOne({
      SoDienThoai: phone,
    });
  }

  if (user === null) {
    return false;
  }
  return true;
};

const registerNewUser = async (rawUserData) => {
  const { HoTen, SoDienThoai, Password, DiaChi } = rawUserData;
  // B1. kiểm tra SDT  -> B2. hashpassword -> B3. create new user
  try {
    // B1
    let isPhone = await checkPhone(SoDienThoai);
    if (isPhone === true) {
      return {
        EM: "Số điện thoại đã tồn tại !!!",
        EC: -1,
        DT: [],
      };
    }

    // B2
    let hashPassword = hashUserPassword(Password);

    // B3
    const reader = await db.Reader.create({
      HoTen: HoTen,
      SoDienThoai: SoDienThoai,
      Password: hashPassword,
      DiaChi: DiaChi,
      Role: "khach_hang",
    });

    if (reader) {
      return {
        EM: "Tạo tài khoản thành công",
        EC: 0,
        DT: reader,
      };
    }
  } catch (err) {
    console.log(">>> err ", err);
    return {
      EM: "Loi server !!!",
      EC: -2,
    };
  }
};

const getUserLogin = async (phone) => {
  let user = null;
  user = await db.Staff.findOne({
    SoDienThoai: phone,
  });

  if (user === null) {
    user = await db.Reader.findOne({
      SoDienThoai: phone,
    });
  }

  return user;
};

const handleUserLogin = async (rawData) => {
  const { SoDienThoai, Password } = rawData;
  console.log(rawData);
  try {
    let user = await getUserLogin(SoDienThoai);

    if (user === null) {
      return {
        EM: "SDT không đúng !!!",
        EC: -2,
        DT: "",
      };
    }

    let isCorrectPassword = await checkPassword(Password, user.Password);

    if (isCorrectPassword === true) {
      let tokentData = {
        Id: user._id,
        HoTen: user.HoTen,
        DiaChi: user.DiaChi,
        Role: user.Role,
        SoDienThoai: user.SoDienThoai,
      };
      const token = jwt.sign(tokentData, process.env.JWT_KEY);

      return {
        EM: "ok",
        EC: 0,
        DT: {
          token,
          tokentData,
        },
      };

      // Tiếp tục
    } else {
      return {
        EM: " Mật khẩu sai !!!",
        EC: -2,
        DT: "",
      };
    }
  } catch (err) {
    console.log(">>> err", err);
    return {
      EM: "Loi server !!!",
      EC: -2,
      DT: "",
    };
  }
};

export default { registerNewUser, handleUserLogin };
