import BookService from "../services/BookService";
class BookController {
  // [GET] /api/product/read
  read = async (req, res) => {
    const { id } = req.query;

    if (!id) {
      return res.json({
        EM: "Không có id sách !!!!",
        EC: -1,
        DT: [],
      });
    }

    try {
      const data = await BookService.read(req.query);
      return res.json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      console.log(">>> error", error);
    }
  };

  // [GET] /api/book/readPanigate
  readPanigate = async (req, res) => {
    try {
      let page = +req.query.page;
      let limit = +req.query.limit;
      let sort = req.query.sort;
      let type = req.query.type;
      let author = req.query.author;

      let data = await BookService.getBookWithPagination(req.query);

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

  // [PUT] /api/book/update
  update = async (req, res) => {
    console.log(req.body);
    const { id, TenSach, DonGia, SoQuyen, TheLoai, NamXB, TacGia, MaNXB } =
      req.body;

    if (
      !id ||
      !TenSach ||
      !DonGia ||
      !SoQuyen ||
      !TheLoai ||
      !NamXB ||
      !TacGia ||
      !MaNXB
    ) {
      return res.json({
        EM: "Nhập thiếu trường dữ liệu !!! ",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await BookService.update(req.body);
      return res.json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      console.log(">>> error", error);
    }
  };

  // [DELETE] /api/book/delete
  delete = async (req, res) => {
    const id = req.body;
    if (!id) {
      return res.json({
        EM: "Nhập thiếu trường dữ liệu !!! ",
        EC: -2,
        DT: [],
      });
    }
    try {
      const data = await BookService.deleted(req.body);
      return res.json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {}
  };

  // [POST] /api/book/create
  create = async (req, res) => {
    console.log(req.body);
    const { TenSach, DonGia, SoQuyen, TheLoai, NamXB, TacGia, MaNXB } =
      req.body;

    const dataBody = {
      TenSach: TenSach,
      DonGia: +DonGia,
      SoQuyen: +SoQuyen,
      TheLoai: TheLoai,
      NamXB: NamXB,
      TacGia: TacGia,
      MaNXB: MaNXB,
    };

    const AnhSach = req?.file?.path;

    if (!AnhSach) {
      return res.json({
        EM: "Upload hình lỗi , không có hình !!! ",
        EC: -2,
        DT: [],
      });
    }

    if (
      !TenSach ||
      !DonGia ||
      !SoQuyen ||
      !TheLoai ||
      !NamXB ||
      !TacGia ||
      !MaNXB
    ) {
      return res.json({
        EM: "Nhập thiếu trường dữ liệu !!! ",
        EC: -2,
        DT: [],
      });
    }
    try {
      const data = await BookService.create(dataBody, AnhSach);
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

export default new BookController();
