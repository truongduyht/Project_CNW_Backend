import ReaderService from "../services/ReaderService";

class ReaderController {
  // [POST] /api/reader/update
  async update(req, res) {
    const { HoTen, SoDienThoai, DiaChi } = req.body;
    if (!HoTen || !SoDienThoai || !DiaChi) {
      return res.json({
        EM: "Nhập thiếu trường dữ liệu !!! ",
        EC: -2,
        DT: [],
      });
    }
    try {
      const data = await ReaderService.update(req.body);
      return res.json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      console.log(">>> error", error);
    }
  }

  // [GET] /api/reader/readPanigation
  async readPanigation(req, res) {
    try {
      let page = +req.query.page;
      let limit = +req.query.limit;
      let sort = req.query.sort;

      let data = await ReaderService.readPanigation(req.query);

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
}

export default new ReaderController();
