import OrderService from "../services/OrderService";

class OrderController {
  // [POST ] /api/order/create
  async create(req, res) {
    const { DataUpdateReader, DataOrder } = req.body;

    if (
      !DataUpdateReader.IdUser ||
      !DataUpdateReader.HoTen ||
      !DataUpdateReader.SoDienThoai ||
      !DataUpdateReader.DiaChi
    ) {
      return res.json({
        EM: "Dữ liệu người dùng không đươc trống !!! ",
        EC: -2,
        DT: [],
      });
    }

    if (DataOrder.length <= 0) {
      return res.json({
        EM: "Không có dữ liệu trong giỏ hàng !!! ",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await OrderService.create(req.body);
      return res.json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      console.log(">>> error", error);
    }
  }

  async readPanigation(req, res) {
    try {
      let sort = req.query.sort;
      let type = req.query.type;

      let data = await OrderService.readPagination(req.query);

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

  // [GET ] /api/order/read

  async read(req, res) {
    let sort = req.query.sort;
    let type = req.query.type;
    let IdUser = req.query.IdUser;

    if (!IdUser) {
      return res.json({
        EM: "Không có người dùng!!! ",
        EC: -2,
        DT: [],
      });
    }

    const data = await OrderService.read(req.query);
    if (data) {
      return res.json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
  }

  async update(req, res) {
    try {
      const { IdOrder, Status, DayRefund } = req.body;

      if (!IdOrder || !Status || !DayRefund) {
        return res.status(200).json({
          EM: "Nhập thiếu trường dữ liệu !!!",
          EC: -2,
          DT: [],
        });
      }

      try {
        const data = await OrderService.update(req.body);
        return res.status(200).json({
          EM: data.EM,
          EC: data.EC,
          DT: data.DT,
        });
      } catch (error) {
        console.log(">>> error", error);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  // [DELETE] /api/order/delete
  async delete(req, res) {
    const { IdOrder } = req.body;
    if (!IdOrder) {
      return res.json({
        EM: "Nhập thiếu trường dữ liệu !!! ",
        EC: -2,
        DT: [],
      });
    }
    try {
      const data = await OrderService.deleted(req.body);
      return res.json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      console.log(">>> error", error);
    }
  }

  async revenue(req, res) {
    try {
      const data = await OrderService.revenueProduct();
      return res.json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      console.log(">>> error", error);
    }
  }

  // [GET] /api/order/dashboard
  async dashboard(req, res) {
    try {
      // check vaidate
      const data = await OrderService.dashboardAll();
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      console.log(">>> error", error);
    }
  }
}

export default new OrderController();
