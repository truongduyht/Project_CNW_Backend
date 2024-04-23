import db from "../models/index.js";

const exitBookCart = async (IdBook, IdUser) => {
  const Cart = await db.Cart.findOne({
    IdUser: IdUser,
    IdBook: IdBook,
  });
  return Cart;
};

const create = async (rawData) => {
  console.log(rawData);
  try {
    const exitCart = await exitBookCart(rawData.IdBook, rawData.IdUser);

    if (exitCart) {
      const updateCart = await db.Cart.findOneAndUpdate(
        {
          _id: exitCart._id,
        },
        { $set: { Quantity: +exitCart.Quantity + +rawData.Quantity } },
        { new: true }
      );
      return {
        EM: "Cập nhật đơn sách thành công ",
        EC: 0,
        DT: updateCart,
      };
    }

    const data = await db.Cart.create({
      IdUser: rawData.IdUser,
      IdBook: rawData.IdBook,
      Quantity: rawData.Quantity,
    });

    if (data) {
      return {
        EM: "Tạo đơn sách thành công ",
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
  const { page, limit, sort, IdUser } = rawData;

  try {
    if (!page && !limit && !sort) {
      const data = await db.Cart.find({ IdUser: IdUser })
        .populate({
          path: "IdUser", // Liên kết với KhachHang
          model: "Reader", // Tên model của KhachHang
        })
        .populate({
          path: "IdBook", // Liên kết với KhachHang
          model: "Book", // Tên model của KhachHang
        });

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

    if (IdUser) {
      filter.IdUser = IdUser;
    }

    const pagination = await db.Cart.find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sorter)
      .exec();

    const totalRecords = await db.Cart.countDocuments(filter);
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

const updateCart = async (rawData) => {
  try {
    const cart = await db.Cart.findById({ _id: rawData.IdCart });

    if (!cart) {
      return {
        EM: "Không tìm thấy giỏ sách! ",
        EC: -2,
        DT: [],
      };
    }

    const updateNumber = await db.Cart.findOneAndUpdate(
      { _id: rawData.IdCart },
      { $set: { Quantity: rawData.Quantity } },
      { new: true }
    );

    return {
      EM: "Cập nhật số lượng thành công.",
      EC: 0,
      DT: updateNumber,
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

const deletedCart = async (rawData) => {
  try {
    const exitID_Cart = await db.Cart.findById({ _id: rawData.IdCart });
    if (!exitID_Cart) {
      return {
        EM: "Không tồn tại giỏ hàng!!!",
        EC: -2,
        DT: exitID_Cart,
      };
    }

    const deletedCart = await db.Cart.findByIdAndDelete({
      _id: rawData.IdCart,
    });
    return {
      EM: "Xóa sản phẩm thành công  !!!",
      EC: 0,
      DT: deletedCart,
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

export default { create, readPanigation, updateCart, deletedCart };
