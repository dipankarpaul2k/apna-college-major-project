// import dotenv
import "dotenv/config";

// imports
import Express from "express";
import ejsMate from "ejs-mate";

// import auths
import Passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.model.js";

// import functions
import { connectMongo } from "./mongo.connect.js";
import { ExpressError } from "./utils/expressError.js";
import { gracefulServerShutdown } from "./serverShutdown.js";

// import your middlewares
import * as middleware from "./middleware/middlewareFns.js";
import allMiddlewares from "./middleware/useMiddleware.js";

// imports routes
import listingRoutes from "./routes/listing.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import userRoutes from "./routes/user.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import searchRoute from "./routes/search.route.js";

// app instance
const app = Express();

// MongoDB connection
connectMongo();

// Connect the view engine
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

// Use your consolidated middlewares
app.use(allMiddlewares);

// use passport middleware
app.use(Passport.initialize());
app.use(Passport.session());

// use static authenticate method of model in LocalStrategy
Passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
Passport.serializeUser(User.serializeUser());
Passport.deserializeUser(User.deserializeUser());

// Flash message middleware function
app.use(middleware.storeFlashMsg());

// root path
app.get("/", (req, res) => {
  console.log(req.session);
  return res.redirect("/listings");
});

// All routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/", searchRoute);

// Anything other than valid routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error middleware function
app.use(middleware.errorMiddleware());

// Listening to port 4000
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`💻 Server is running on 👉 http://localhost:${PORT}`);
});

// Gracefully close the Express server
gracefulServerShutdown(server);
