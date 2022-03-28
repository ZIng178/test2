const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");
const path = require("path");
const { JWT_SECRET, MONGO_URI } = require("./config/keys");

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

dotenv.config();

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("DBConnection Successful"))
  .catch((err) => {
    console.log(err);
  });
app.use(express.static(path.join(__dirname, "./client/build")));
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

///Serve static assests if in production

//Set a static foler
// app.use(express.static(path.join(__dirname, "../client/build")));

// app.use(express.static("public"));

if (process.env.NODE_ENV == "production") {
  app.get("/", (req, res) => {
    app.use(express.static(path.resolve(__dirname, "client", "build")));
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running ");
});
