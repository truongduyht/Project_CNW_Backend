import db from "../models/index.js";

const existBookByName = async (name) => {
  const book = await db.Book.findOne({
    TenSach: name,
  });
  if (book) {
    return true;
  } else {
    return false;
  }
};

const existBookById = async (id) => {
  const book = await db.Book.findById(id);
  if (book) {
    return true;
  } else {
    return false;
  }
};

const getBookById = async (id) => {
  const book = await db.Book.findOne({
    _id: id,
  });
  return book;
};

const create = async (rawData, AnhSach) => {
  console.log("------------", rawData);
  try {
    const existProdut = await existBookByName(rawData?.TenSach);
    if (existProdut) {
      return {
        EM: "Tên sách đã tồn tại !!! ",
        EC: -2,
        DT: [],
      };
    }

    const data = await db.Book.create({
      TenSach: rawData.TenSach,
      DonGia: rawData.DonGia,
      SoQuyen: rawData.SoQuyen,
      NamXB: rawData.NamXB,
      TacGia: rawData.TacGia,
      TheLoai: rawData.TheLoai,
      TenNXB: rawData.TenNXB,
      AnhSach: AnhSach,
    });

    if (data) {
      return {
        EM: "Thêm sách thành công ",
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

const update = async (rawData, AnhSach) => {
  try {
    const existProdut = await existBookById(rawData?.id);
    if (!existProdut) {
      return {
        EM: "Sách không tồn tại !!! ",
        EC: -2,
        DT: [],
      };
    }

    const data = await db.Book.findByIdAndUpdate(
      rawData.id,
      {
        TenSach: rawData.TenSach,
        DonGia: rawData.DonGia,
        SoQuyen: rawData.SoQuyen,
        NamXB: rawData.NamXB,
        TacGia: rawData.TacGia,
        TheLoai: rawData.TheLoai,
        TenNXB: rawData.TenNXB,
        AnhSach: AnhSach,
      },
      { new: true }
    );

    if (data) {
      return {
        EM: "Cập nhật sách thành công ",
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

const getBookWithPagination = async (rawData) => {
  const { page, limit, sort, type, author } = rawData;

  try {
    if (!page && !limit && !sort && !type && !author) {
      const data = await db.Book.find({});
      return {
        EM: "Lấy dữ liệu thành công",
        EC: 0,
        DT: data,
      };
    }

    let offset = (+page - 1) * limit;

    const filter = {};
    const sorter = {};

    if (sort?.startsWith("-")) {
      sorter[sort.substring(1)] = -1;
    } else {
      sorter[sort] = 1;
    }

    if (author) {
      filter.TacGia = author;
    }

    if (type) {
      filter.TheLoai = type;
    }

    console.log("Kiem tra >>>>>>>>>>>", offset, limit);

    const pagination = await db.Book.find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sorter)
      .exec();

    const totalRecords = await db.Book.countDocuments(filter);
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

const read = async (rawData) => {
  try {
    console.log(rawData);
    const exitProduct = await existBookById(rawData.id);
    if (!exitProduct) {
      return {
        EM: "Sách không tồn tại !!!",
        EC: -3,
        DT: [],
      };
    }
    const book = await getBookById(rawData.id);
    if (book) {
      return {
        EM: "Lấy sách thành công",
        EC: 0,
        DT: book,
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

const deleted = async (rawData) => {
  try {
    const exitProduct = await existBookById(rawData.id);
    if (!exitProduct) {
      return {
        EM: "Không tồn tại sách !!!",
        EC: -3,
        DT: [],
      };
    }

    const deleted = await db.Book.findByIdAndDelete({
      _id: rawData?.id,
    });

    if (deleted) {
      return {
        EM: "Xóa sách thành công",
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

export default { create, getBookWithPagination, read, update, deleted };
