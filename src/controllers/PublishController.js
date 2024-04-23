import PublishService from "../services/PublishService";
class PublishController {
  //[GET] /api/publish/getallpublish
  getAllPublish = async (req, res) => {
    const publishs = await PublishService.getAllPublish();
    return res.json({
      EM: "Lấy tất cả nhà xuất bản thành công",
      EC: 1,
      DT: publishs,
    });
  };

  // [POST] /api/publish/create
  create = async (req, res) => {
    const { TenNXB, DiaChi } = req.body;
    const dataBody = {
      TenNXB: TenNXB,
      DiaChi: DiaChi,
    };

    if (!TenNXB || !DiaChi) {
      return res.json({
        EM: "Nhập thiếu trường dữ liệu !!! ",
        EC: -2,
        DT: [],
      });
    }
    try {
      const data = await PublishService.create(dataBody);
      return res.json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      console.log(">>> error", error);
    }
  };

  // [PUT] /api/publish/update
  update = async (req, res) => {
    const { id, TenNXB, DiaChi } = req.body;
    console.log("------------", req.body);
    if (!id || !TenNXB || !DiaChi) {
      return res.json({
        EM: "Nhập thiếu trường dữ liệu !!! ",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await PublishService.update(req.body);
      return res.json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      console.log(">>> error", error);
    }
  };

  // [DELETE] /api/publish/delete
  delete = async (req, res) => {
    const { id } = req.body;
    if (!id) {
      return res.json({
        EM: "Không tìm thấy nhà xuất bản!!! ",
        EC: -2,
        DT: [],
      });
    }
    try {
      const data = await PublishService.deleted(req.body);
      return res.json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      console.log(">>> error", error);
    }
  };

  //[GET] /api/publish/read
  read = async (req, res) => {
    const { IdPublish } = req.query;
    if (!IdPublish) {
      return res.json({
        EM: "Không tìm thấy nhà xuất bản!!!!",
        EC: -1,
        DT: [],
      });
    }

    try {
      const data = await PublishService.read(req.query);
      return res.json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      console.log(">>> error", error);
    }
  };
  // [GET] /api/publish/readPanigate
  readPanigate = async (req, res) => {
    try {
      let page = +req.query.page;
      let limit = +req.query.limit;
      let sort = req.query.sort;

      let data = await PublishService.getPublishWithPagination(req.query);

      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (err) {
      console.log("err <<< ", err);
      return res.status(500).json({
        EM: "error server", // error message
        EC: "-1", // error code
        DT: "", // data
      });
    }
    // }
  };
}

export default new PublishController();
