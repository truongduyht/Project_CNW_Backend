import db from "../models/index.js";

const checkAvailableOrder = async (IdBook, Quantity) => {
  const BookDoc = await db.Book.findOne({ _id: IdBook });

  if (BookDoc) {
    const QuantityMax = BookDoc.SoQuyen || 0;
    const BookAll = await db.OrderDetail.find({
      IdBook: IdBook,
    });

    // Tính số hàng còn lại trong kho của sản phẩm
    const ordered = BookAll.reduce((total, item) => {
      return (total += item.Quantity);
    }, 0);

    if (ordered + Quantity > QuantityMax)
      return {
        isAvailable: false,
        quantityAvailable: QuantityMax - ordered,
        BookDoc: BookDoc.TenSach,
      };

    return {
      isAvailable: true,
      quantityAvailable: QuantityMax - ordered,
    };
  }
};

const create = async (rawData) => {
  const { DataUpdateReader, DataOrder } = rawData;
  try {
    // Kiểm tra số lượng hàng coi đủ không================================================================

    const promiseCheckAvailable = DataOrder.map(async (p) => {
      const orderAvailable = await checkAvailableOrder(p.IdBook, p.Quantity);

      return {
        BookCart: p,
        isAvailable: orderAvailable.isAvailable,
        quantityAvailable: orderAvailable.quantityAvailable,
        data: orderAvailable.BookDoc,
      };
    });
    const checkOrderMap = await Promise.all(promiseCheckAvailable);

    const BookNotOrder = checkOrderMap.filter((c) => c.isAvailable == false);

    const msgText = BookNotOrder.reduce((acc, item) => {
      return acc + item.data + ":" + item.quantityAvailable + "\n";
    }, "");

    if (BookNotOrder.length > 0) {
      return {
        DT: [],
        EC: -2,
        EM: `Đã có người vừa đặt số lượng không đủ cấp cho bạn.\nSố lượng có thể đặt:\n${msgText}`,
      };
    }

    //====================================================================================================

    // Cập nhật thông tin người dùng

    const updateReader = await db.Reader.findOneAndUpdate(
      { SoDienThoai: DataUpdateReader.SoDienThoai },
      {
        HoTen: DataUpdateReader.HoTen,
        DiaChi: DataUpdateReader.DiaChi,
      },
      { new: true }
    ).lean();
    if (!updateReader) {
      return {
        EM: "Cập nhật người dùng thất bại , không thể đặt hàng !!!",
        EC: -2,
        DT: updateReader,
      };
    }

    // Tạo đặt hàng
    const order = await db.Order.create({
      IdUser: DataUpdateReader.IdUser,
      Status: 0,
    });

    if (!order._id) {
      return {
        EM: "Tạo đơn hàng thất bại !!!",
        EC: -2,
        DT: [],
      };
    }

    // Xoa cac sản phẩm trong giỏ hàng
    const orderIdArrayToDelete = DataOrder.map((item) => {
      return item.IdCart;
    });
    const deleteCondition = {
      _id: { $in: orderIdArrayToDelete },
    };
    const deleteItemCart = await db.Cart.deleteMany(deleteCondition);

    // Tạo chi tiết đặt hàng
    const DataOrderDetail = DataOrder.map((item) => ({
      ...item,
      IdOrder: order._id,
    }));

    const data = await db.OrderDetail.insertMany(DataOrderDetail);

    // if (data) {
    return {
      EM: "Tạo đơn hàng thành công ",
      EC: 0,
      DT: data,
    };
    // }
  } catch (error) {
    console.log(">>> error", error);
    return {
      EM: " Lỗi server",
      EC: -5,
      DT: [],
    };
  }
};

// const read = async (rawData) => {
//   const { IdUser, type, sort } = rawData;
//   console.log(IdUser);
//   const sorter = {};
//   if (sort?.startsWith("-")) {
//     sorter[sort.substring(1)] = -1;
//   } else {
//     sorter[sort] = 1;
//   }

//   try {
//     const UserOrder = await db.Order.find({
//       IdUser: IdUser,
//       Status: type,
//     })
//       .sort(sorter)
//       .lean();

//     const orderIds = UserOrder.map((order) => order.id);
//     const orderDetails = await db.OrderDetail.find({
//       IdOrder: { $in: orderIds },
//     })
//       .populate("IdUser")
//       .lean();

//     const orderDetailMap = {};
//     orderDetails.forEach((detail) => {
//       if (!orderDetailMap[detail.IdOrder]) {
//         orderDetailMap[detail.IdOrder] = [];
//       }
//       orderDetailMap[detail.IdOrder].push(detail);
//     });

//     const data = UserOrder.map((order) => ({
//       ...order,
//       OrderDetail: orderDetailMap[order.id] || [],
//     }));

//     return {
//       EM: "Lấy dữ liệu thành công",
//       EC: 0,
//       DT: data,
//     };
//   } catch (error) {
//     console.log(">>> error", error);
//     return {
//       EM: "Lỗi server",
//       EC: -5,
//       DT: [],
//     };
//   }
// };

const read = async (rawData) => {
  const { IdUser, type, sort } = rawData;

  const sorter = {};
  if (sort?.startsWith("-")) {
    sorter[sort.substring(1)] = -1;
  } else {
    sorter[sort] = 1;
  }

  try {
    const UserOrder = await db.Order.find({
      IdUser: IdUser,
      Status: type,
    })
      .sort(sorter)
      .lean();

    const result = UserOrder.map(async (item) => {
      let detail = await db.OrderDetail.find({ IdOrder: item.id })
        .populate("IdBook")
        .lean();

      return {
        ...item,
        OrderDetail: detail,
      };
    });

    const data = await Promise.all(result);

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

const readPagination = async (rawData) => {
  const { page, limit, type, sort } = rawData;

  try {
    let offset = (page - 1) * limit;

    const sorter = {};
    if (sort?.startsWith("-")) {
      sorter[sort.substring(1)] = -1;
    } else {
      sorter[sort] = 1;
    }

    const order = await db.Order.find({ Status: type })
      .skip(offset)
      .limit(limit)
      .sort(sorter)
      .populate("IdUser")
      .lean();

    const result = order.map(async (item) => {
      let detail = await db.OrderDetail.find({ IdOrder: item.id })

        .populate("IdBook")
        .lean();
      console.log(detail);
      return {
        ...item,
        OrderDetail: detail,
      };
    });

    const pagination = await Promise.all(result);

    const totalRecords = await db.Order.countDocuments({ Status: type });
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

const update = async (rawData) => {
  try {
    const existOrder = await db.Order.findById({ _id: rawData.IdOrder });

    if (!existOrder) {
      return {
        EM: "Đơn sách không tồn tại !!! ",
        EC: -2,
        DT: [],
      };
    }

    const data = await db.Order.findByIdAndUpdate(
      { _id: rawData.IdOrder },
      {
        Status: rawData.Status,
        DayRefund: rawData.DayRefund,
      },
      { new: true }
    );

    if (data) {
      return {
        EM: "Update đơn sách thành công ",
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

const deleted = async (rawData) => {
  try {
    const exitProduct = await db.Order.findById(rawData.IdOrder);
    if (!exitProduct) {
      return {
        EM: "Không tồn tại đơn hàng !!!",
        EC: -3,
        DT: [],
      };
    }

    // Xóa trong bảng Đặt hàng chi tiết trước
    const deleteCondition = {
      IdOrder: { $in: rawData.IdOrder },
    };
    const deleteItemCart = await db.OrderDetail.deleteMany(deleteCondition);

    // Xóa trong bảng đơn hàng

    const deleted = await db.Order.findByIdAndDelete({
      _id: rawData?.IdOrder,
    });

    if (deleted) {
      return {
        EM: "Xóa đơn hàng thành công",
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

const revenueProduct = async () => {
  try {
    const books = await db.Book.find().lean();

    const resultPromise = books.map(async (book) => {
      const orderDetails = await db.OrderDetail.find().populate({
        path: "IdBook",
        match: { _id: book._id },
      });

      return {
        ...book,
        orderDetails,
      };
    });

    const resultRaw = await Promise.all(resultPromise);
    const result = resultRaw.map((item) => {
      const detail = item.orderDetails.filter((item) => item.IdBook != null);
      const result = detail.reduce((total, item) => {
        return total + item.Quantity * item.Price;
      }, 0);

      return {
        TenSach: item.TenSach,
        AnhSach: item.AnhSach,
        totalMoney: result,
      };
    });

    return {
      EM: "Doanh thu mỗi sản phẩm mỗi tháng",
      EC: 0,
      DT: result,
    };
  } catch (error) {
    console.error("Lỗi:", error);
    return {
      EM: "Lỗi server",
      EC: -5,
      DT: [],
    };
  }
};

const dashboardAll = async (rawData) => {
  try {
    const user = await db.Reader.countDocuments({});
    const book = await db.Book.countDocuments({});
    const order = await db.Order.countDocuments({});
    const data = {
      user,
      book,
      order,
    };
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

export default {
  create,
  read,
  update,
  deleted,
  revenueProduct,
  dashboardAll,
  readPagination,
};
