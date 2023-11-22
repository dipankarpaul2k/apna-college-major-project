// imports models
import Listing from "../models/listings.model.js";
import Review from "../models/reviews.model.js";

// Loging middleware function
export function logMiddleware() {
  return (req, res, next) => {
    const startTime = Date.now(); // Record the start time

    res.on("finish", () => {
      const endTime = Date.now(); // Record the end time
      const responseTime = endTime - startTime;
      const statusCode = res.statusCode;

      console.log("-------------------------------------------------------");
      console.log(`Status Code: ${statusCode}`);
      console.log(`Response Time: ${responseTime}ms`);
      console.log(`Host: ${req.headers.host}`);
      console.log(`Method: ${req.method}`);
      console.log(`Path: ${req.path}`);
      console.log("-------------------------------------------------------");
    });

    // res.on("close", () => {
    //   // Handle premature request termination
    //   console.log("Request terminated prematurely");
    // });

    next();
  };
}

// Error middleware function
export function errorMiddleware() {
  return (err, req, res, next) => {
    const { statusCode = 500, message } = err;
    if (statusCode === 404) {
      req.flash("error", message);
      res.status(statusCode).render("errors/error404", { message });
    } else if (statusCode === 400) {
      req.flash("error", message);
      res.status(statusCode).render("errors/error400", { message });
    } else if (statusCode === 401) {
      req.flash("error", message);
      res.status(statusCode).render("errors/error401", { message });
    } else if (statusCode === 500) {
      req.flash("error", message);
      res.status(statusCode).render("errors/error500", { message });
    } else {
      res.status(statusCode).render("errors/error", { message });
    }
  };
}

// Middleware function to store values in res.locals
export function storeFlashMsg() {
  return (req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    if (res.locals.currUser) {
      console.log(res.locals.currUser);
    }
    next();
  };
}

// Check if the user is logged in or not
export function isLoggedIn() {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.redirectUrl = req.originalUrl;
      req.flash("error", "You must be logged in to create a new listing!");
      return res.redirect("/login");
    }
    next();
  };
}

// save session redirectUrl in res.locals
export function saveRedirectUrl() {
  return (req, res, next) => {
    if (req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
  };
}

// Check if the current user is listing's owner or not
export function isOwner() {
  return async (req, res, next) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the owner of the listing.");
      return res.redirect(`/listings/${id}`);
    }
    next();
  };
}

// Check if the current user is review's author or not
export function isReviewAuthor() {
  return async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of this review.");
      return res.redirect(`/listings/${id}`);
    }
    next();
  };
}
