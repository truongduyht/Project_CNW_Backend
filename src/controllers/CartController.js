import CartService from "../services/CartService";

class CartController {
  // [POST] /api/cart/create
  async create(req, res) {
    const { IdUser, IdBook, Quantity } = req.body;
    console.log("---------------", req.body);
    if (!IdUser || !IdBook || !Quantity) {
      return res.json({
        EM: "Nhập thiếu trường dữ liệu !!! ",
        EC: -2,
        DT: [],
      });
    }

    try {
      const data = await CartService.create(req.body);
      return res.json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      console.log(">>> error", error);
    }
  }

  // [GET] /api/cart/readPanigation
  async readPanigation(req, res) {
    try {
      let page = +req.query.page;
      let limit = +req.query.limit;
      let sort = req.query.sort;
      let IdUser = req.query.IdUser;

      let data = await CartService.readPanigation(req.query);

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

  // [PUT] /api/cart/update
  async update(req, res) {
    const { IdCart, Quantity } = req.body;
    if (!IdCart || !Quantity) {
      return res.json({
        EM: "Thiếu dữ liệu  !!!!",
        EC: -1,
        DT: [],
      });
    }
    try {
      const data = await CartService.updateCart(req.body);
      return res.json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      console.log(">>> error", error);
    }
  }

  // [DELETE] /api/cart/delete
  async delete(req, res) {
    const { IdCart } = req.body;
    if (!IdCart) {
      return res.json({
        EM: "Thiếu dữ liệu  !!!!",
        EC: -1,
        DT: [],
      });
    }
    try {
      const data = await CartService.deletedCart(req.body);
      return res.json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      console.log(">>> error", error);
    }
  }
}

export default new CartController();
