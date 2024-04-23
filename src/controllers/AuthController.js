import jwt from "jsonwebtoken";
import { TokenExpiredError } from "jsonwebtoken";
import AuthService from "../services/AuthService";

class AuthController {
  // [POST] /api/auth/register
  async register(req, res) {
    try {
      const { DiaChi, HoTen, SoDienThoai, Password } = req.body;

      // Validate
      if (!DiaChi || !HoTen || !SoDienThoai || !Password) {
        return res.status(200).json({
          EM: "Nhập thiếu dữ liệu!!!",
          EC: "-1",
          DT: [],
        });
      }

      // Create User
      let data = await AuthService.registerNewUser(req.body);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (err) {
      return res.status(500).json({
        EM: "Lỗi hệ thống.", // error message
        EC: "-5", // error code
        DT: [], // data
      });
    }
  }

  // [POST] /api/auth/login
  async login(req, res, next) {
    try {
      const { SoDienThoai, Password } = req.body;
      if (!SoDienThoai || !Password) {
        return res.status(200).json({
          EM: "Nhập thiếu dữ liệu!!!",
          EC: -1,
          DT: [],
        });
      }

      let data = await AuthService.handleUserLogin({
        SoDienThoai,
        Password,
      });

      if (data.EC === 0) {
        return res
          .cookie("token", data.DT.token, {
            sameSite: "none",
            secure: true,
            httpOnly: true,
          })
          .status(200)
          .json({ EC: 0, EM: "Login successfully!!", DT: data.DT });
      }

      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (err) {
      return res.status(500).json({
        EM: "error server", // error message
        EC: "-1", // error code
        DT: "", // data
      });
    }
  }

  // [GET] /api/auth/logout
  async logout(req, res, next) {
    try {
      res.cookie("token", "");
      return res
        .status(200)
        .json({ EM: "Đăng xuất thành công", EC: 0, DT: [] });
    } catch (err) {
      return res.status(500).json({ msg: "Error logout.", err: err.message });
    }
  }

  // [GET] /api/auth/profile
  async getProfile(req, res) {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(200).json({
          EM: "Người dùng chưa đăng nhập",
          EC: -1,
          DT: [],
        });
      }
      const dataUser = jwt.verify(token, process.env.JWT_KEY);
      return res.status(200).json({
        EM: "Người dùng đã đăng nhập",
        EC: 0,
        DT: dataUser,
      });
    } catch (err) {
      return res.status(500).json({ err: err });
    }
  }
}

export default new AuthController();
