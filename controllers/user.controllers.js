// imports
import User from "../models/user.model.js";

// user controller functions
// get sign up form function
export function getSignUpForm(req, res) {
  return res.render("users/signup");
}

// post sign up function
export async function signUpUser(req, res, next) {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    // autometic login after sign up
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust!");
      return res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/signup");
  }
}

// get login form function
export function getLogInForm(req, res) {
  return res.render("users/login");
}

// log in user & authenticate function
export async function logInUser(req, res) {
  req.flash("success", "Welcome to WanderLust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  return res.redirect(redirectUrl);
}

// log out user function
export function logOutUser(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are Logged Out!");
    return res.redirect("/listings");
  });
}
