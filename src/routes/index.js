import AuthRouter from "./AuthRoute";
import PublishRouter from "./PublishRoute";
import BookRouter from "./BookRoute";
import CartRouter from "./CartRoute";
import ReaderRouter from "./ReaderRoute";
import StaffRouter from "./StaffRoute";
import OrderRouter from "./OrderRoute";

function route(app) {
  app.use("/api/auth", AuthRouter);
  app.use("/api/publish", PublishRouter);
  app.use("/api/book", BookRouter);
  app.use("/api/cart", CartRouter);
  app.use("/api/reader", ReaderRouter);
  app.use("/api/staff", StaffRouter);
  app.use("/api/order", OrderRouter);
}

export default route;
