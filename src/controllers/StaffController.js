import StaffService from "../services/StaffService";
class StaffController {
  // [GET] /api/staff/read
  read = async (req, res) => {
    const { id } = req.query;

    if (!id) {
      return res.json({
        EM: "Không có id nhân viên !!!!",
        EC: -1,
        DT: [],
      });
    }

    try {
      const data = await StaffService.read(req.query);
      return res.json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      console.log(">>> error", error);
    }
  };

  // [GET] /api/staff/readPanigate
  async readPanigation(req, res) {
    try {
      let page = +req.query.page;
      let limit = +req.query.limit;
      let sort = req.query.sort;
      console.log("here");
      let data = await StaffService.readPanigation(req.query);

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
  }

  // [PUT] /api/staff/update
  update = async (req, res) => {
    const { HoTen, DiaChi, SoDienThoai } = req.body;
    console.log("----------------", HoTen);
    if (!HoTen || !DiaChi || !SoDienThoai) {
      return res.json({
        EM: "Nhập thiếu trường dữ liệu !!! ",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await StaffService.update(req.body);
      return res.json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      console.log(">>> error", error);
    }
  };

  // [DELETE] /api/staff/delete
  delete = async (req, res) => {
    const id = req.body;
    console.log("-------------", req.body);
    if (!id) {
      return res.json({
        EM: "Nhập thiếu trường dữ liệu !!! ",
        EC: -2,
        DT: [],
      });
    }
    try {
      const data = await StaffService.deleted(req.body);
      return res.json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      console.log(">>> error", error);
    }
  };

  // [POST] /api/book/create
  create = async (req, res) => {
    const { HoTen, DiaChi, SoDienThoai, Password } = req.body;

    console.log("--------------SSV", req.body);
    const dataBody = {
      HoTen: HoTen,
      DiaChi: DiaChi,
      SoDienThoai: SoDienThoai,
      Password: Password,
    };
    if (!HoTen || !DiaChi || !SoDienThoai || !Password) {
      return res.json({
        EM: "Nhập thiếu trường dữ liệu !!! ",
        EC: -2,
        DT: [],
      });
    }
    try {
      const data = await StaffService.create(dataBody);
      return res.json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      console.log(">>> error", error);
    }
  };
}

export default new StaffController();
