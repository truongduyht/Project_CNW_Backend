import db from "../models/index.js";

const existReader = async (phone) => {
  const Reader = await db.Reader.findOne({
    SoDienThoai: phone,
  });
  if (Reader) {
    return true;
  } else {
    return false;
  }
};

const exitsReaderByid = async (IdUser) => {
  const Reader = await db.Reader.findById(IdUser);
  if (!Reader) {
    return false;
  } else {
    return true;
  }
};

const update = async (rawData) => {
  try {
    const exist = await exitsReaderByid(rawData?.IdUser);
    if (!exist) {
      return {
        EM: "Người dùng không tồn tại !!! ",
        EC: -2,
        DT: [],
      };
    }

    const data = await db.Reader.findOneAndUpdate(
      rawData.IdUser,
      {
        HoTen: rawData.HoTen,
        SoDienThoai: rawData.SoDienThoai,
        DiaChi: rawData.DiaChi,
      },
      { new: true }
    );

    if (data) {
      return {
        EM: "Update đọc giả thành công ",
        EC: 0,
        DT: data,
      };
    }

    if (data) {
      return {
        EM: "Tạo thêm đọc giả thành công ",
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
      const data = await db.Reader.find({ Role: { $ne: "admin" } }); // Lọc những người dùng có vai trò khác admin
      console.log("------------", data);
      return {
        EM: "Lấy dữ liệu thành công",
        EC: 0,
        DT: data,
      };
    }

    let offset = (page - 1) * limit;

    const filter = { Role: { $ne: "admin" } }; // Lọc những người dùng có vai trò khác admin
    const sorter = {};

    if (sort?.startsWith("-")) {
      sorter[sort.substring(1)] = -1;
    } else {
      sorter[sort] = 1;
    }

    const pagination = await db.Reader.find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sorter)
      .exec();

    const totalRecords = await db.Reader.countDocuments(filter);
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

export default { update, readPanigation };
