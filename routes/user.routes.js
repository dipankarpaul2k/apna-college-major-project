import Express from "express";
const router = Express.Router();

// imports
import Passport from "passport";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { saveRedirectUrl } from "../middleware/middlewareFns.js";
import * as userController from "../controllers/user.controllers.js";

// routes
router
  .route("/signup")
  // Get sign up form route
  .get(userController.getSignUpForm)
  // Post sign up route
  .post(asyncErrorHandler(userController.signUpUser));

router
  .route("/login")
  // Get log in form route
  .get(userController.getLogInForm)
  // Post log in user & authenticate route
  .post(
    saveRedirectUrl(),
    Passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.logInUser
  );

// log out user route
router.get("/logout", userController.logOutUser);

export default router;
