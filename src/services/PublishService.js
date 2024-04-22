import db from "../models/index.js";

const existPublishByName = async (name) => {
  const publish = await db.Publish.findOne({
    TenNXB: name,
  });
  if (publish) {
    return true;
  } else {
    return false;
  }
};

const existPublishById = async (id) => {
  const publish = await db.Publish.findById(id);
  if (publish) {
    return true;
  } else {
    return false;
  }
};

const getPublishById = async (id) => {
  const publish = await db.Publish.findOne({
    _id: id,
  });
  return publish;
};

const create = async (rawData) => {
  try {
    const existPublish = await existPublishById(rawData?._id);
    if (existPublish) {
      return {
        EM: "Tên NXB đã tồn tại !!! ",
        EC: -2,
        DT: [],
      };
    }

    const data = await db.Publish.create({
      TenNXB: rawData.TenNXB,
      DiaChi: rawData.DiaChi,
    });

    if (data) {
      return {
        EM: "Thêm NXB thành công ",
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
    const existPublish = await existPublishById(rawData?._id);
    if (!existPublish) {
      return {
        EM: "NXB không tồn tại !!! ",
        EC: -2,
        DT: [],
      };
    }

    const data = await db.Publish.findByIdAndUpdate(
      rawData._id,
      {
        TenNXB: rawData.TenNXB,
        DiaChi: rawData.DiaChi,
      },
      { new: true }
    );

    if (data) {
      return {
        EM: "Cập nhật NXB thành công ",
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

const getPublishWithPagination = async (rawData) => {
  const { page, limit, sort } = rawData;

  try {
    if (!page && !limit && !sort) {
      const data = await db.Publish.find({});
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

    console.log("Kiem tra >>>>>>>>>>>", offset, limit);

    const pagination = await db.Publish.find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sorter)
      .exec();

    const totalRecords = await db.Publish.countDocuments(filter);
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
    const exitsPublish = await existPublishById(rawData.IdPublish);
    if (!exitsPublish) {
      return {
        EM: "Không tồn tại sản phẩm !!!",
        EC: -3,
        DT: [],
      };
    }
    const publish = await getPublishById(rawData.IdPublish);
    if (publish) {
      return {
        EM: "Lấy sản phẩm thành công",
        EC: 0,
        DT: publish,
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
    const exitsPublish = await existPublishById(rawData._id);
    if (!exitsPublish) {
      return {
        EM: "Không tồn tại sản phẩm !!!",
        EC: -3,
        DT: [],
      };
    }

    const deleted = await db.Publish.findByIdAndDelete({
      _id: rawData?._id,
    });

    if (deleted) {
      return {
        EM: "Xóa NXB thành công",
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

export default { create, update, deleted, read, getPublishWithPagination };
