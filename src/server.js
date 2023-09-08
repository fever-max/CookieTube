import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";

import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

// FFmpeg
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

con;

app.use(logger);
/*HTML 폼을 js object 형식으로 번경해주는 미들웨어 플러그인 urlencoded는
videoRouter에서 사용하기 때문에 그 위에 적혀있어야 함.*/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/*session은 브라우저에 쿠키를 전송함,
해당 미들웨어는 라우터에서 사용하기 때문에 라우터 위에 적혀있어야 함*/
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

//localsMiddleware는 session middleware 다음에 있어야지만 session object에 접근 가능
app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
