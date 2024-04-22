import db from "../models/index.js";
import bcrypt, { genSaltSync } from "bcrypt";
const salt = genSaltSync(10);

const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
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
const existStaff = async (SoDienThoai) => {
  const staff = await db.Staff.findOne({
    SoDienThoai: SoDienThoai,
  });
  if (staff) {
    return true;
  } else {
    return false;
  }
};
const existStaffById = async (id) => {
  const staff = await db.Staff.findById(id);
  if (staff) {
    return true;
  } else {
    return false;
  }
};

const getStaffById = async (id) => {
  const staff = await db.Staff.findOne({
    _id: id,
  });
  return staff;
};

const create = async (rawData) => {
  console.log("------------", rawData);
  try {
    const existStaff = await checkPhone(rawData?.SoDienThoai);
    if (existStaff) {
      return {
        EM: "Nhân viên đã tồn tại !!! ",
        EC: -2,
        DT: [],
      };
    }
    let hashPassword = hashUserPassword(rawData.Password);
    const data = await db.Staff.create({
      HoTen: rawData.HoTen,
      Password: hashPassword,
      DiaChi: rawData.DiaChi,
      SoDienThoai: rawData.SoDienThoai,
      Role: "nhan_vien",
    });

    if (data) {
      return {
        EM: "Thêm nhân viên thành công ",
        EC: 0,
        DT: data,
      };
    }
  } catch (error) {
    console.log(">>> error", error);
    return {
      EM: " Lỗi server",
      EC: -5,
      DT: [],
    };
  }
};

const update = async (rawData) => {
  try {
    const exist = await existStaff(rawData.SoDienThoai);
    if (!exist) {
      return {
        EM: "Nhân viên không tồn tại !!! ",
        EC: -2,
        DT: [],
      };
    }

    const data = await db.Staff.findOneAndUpdate(
      { SoDienThoai: rawData.SoDienThoai },
      {
        HoTen: rawData.HoTen,
        DiaChi: rawData.DiaChi,
      },
      { new: true }
    );

    if (data) {
      return {
        EM: "Update nhân viên thành công ",
        EC: 0,
        DT: data,
      };
    }
  } catch (error) {
    console.log(">>> error", error);
    return {
      EM: " Lỗi server",
      EC: -5,
      DT: [],
    };
  }
};

const readPanigation = async (rawData) => {
  const { page, limit, sort } = rawData;

  try {
    if (!page && !limit && !sort) {
      const data = await db.Staff.find({});
      console.log("------------", data);
      return {
        EM: "Lấy dữ liệu thành công",
        EC: 0,
        DT: data,
      };
    }

    let offset = (page - 1) * limit;

    const filter = {};
    const sorter = {};

    if (sort?.startsWith("-")) {
      sorter[sort.substring(1)] = -1;
    } else {
      sorter[sort] = 1;
    }

    const pagination = await db.Staff.find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sorter)
      .exec();

    const totalRecords = await db.Staff.countDocuments(filter);
    const meta = {
      current: page,
      pageSize: limit,
      pages: Math.ceil(totalRecords / limit),
      total: totalRecords,
    };
    const data = { pagination, meta };
    return {
      EM: "Lấy dữ liệu thành công",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(">>> error", error);
    return {
      EM: " Lỗi server",
      EC: -5,
      DT: [],
    };
  }
};

const deleted = async (rawData) => {
  try {
    const exist = await existStaffById(rawData.id);
    if (!exist) {
      return {
        EM: "Nhân viên không tồn tại !!! ",
        EC: -2,
        DT: [],
      };
    }

    const deleted = await db.Staff.findByIdAndDelete({
      _id: rawData?.id,
    });

    if (deleted) {
      return {
        EM: "Xóa nhân viên thành công",
        EC: 0,
        DT: deleted,
      };
    }
  } catch (error) {
    console.log(">>> error", error);
    return {
      EM: " Lỗi server",
      EC: -5,
      DT: [],
    };
  }
};

const read = async (rawData) => {
  try {
    const existStaff = await existStaffById(rawData.id);
    if (!existStaff) {
      return {
        EM: "Sách không tồn tại !!!",
        EC: -3,
        DT: [],
      };
    }
    const staff = await getStaffById(rawData.id);
    if (staff) {
      return {
        EM: "Lấy sách thành công",
        EC: 0,
        DT: staff,
      };
    }
  } catch (error) {
    console.log(">>> error", error);
    return {
      EM: " Lỗi server",
      EC: -5,
      DT: [],
    };
  }
};

export default { create, deleted, read, update, readPanigation };
