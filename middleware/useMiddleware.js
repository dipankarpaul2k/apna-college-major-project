import Express from "express";
const router = Express.Router();

// imports
import * as middlewareFns from "./middlewareFns.js";
import session from "express-session";
import flash from "connect-flash";
import MethodOverride from "method-override";

// call and use middlewares
// router.use(middleware1);

// middleware url and body parser
router.use(Express.urlencoded({ extended: true }));
router.use(Express.json());

// set public folder for the static files
router.use(Express.static("public"));

// Loging middleware function
router.use(middlewareFns.logMiddleware());

// Method Override middleware
router.use(MethodOverride("_method"));

// session options
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Session will expire after 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

// use session middleware
router.use(session(sessionOptions));
router.use(flash());

// export router
export default router;
