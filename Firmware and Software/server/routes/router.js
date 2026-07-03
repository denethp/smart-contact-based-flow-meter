import express from "express";
import {
  userSignup,
  userSignin,
  userVerify,
  protectPath,
} from "../controllers/authController.js";

import {
  addProduct,
  getRegisterProductPage,
  getFlowmeters,
  updateFlowmeter,
  getFlowData,
} from "../controllers/productController.js";

const router = express.Router();

router.route("/auth/signin").post(userSignin);
router.route("/auth/verify").get(userVerify);
router.route("/auth/signup").post(userSignup);

router.route("/fetch/flowmeters").get(protectPath, getFlowmeters);
router.route("/fetch/flowmeter/flowdata").get(getFlowData);
router.route("/update/flowmeter").post(protectPath, updateFlowmeter);

router.route("/register/product").post(addProduct);
router.route("/register/product").get(getRegisterProductPage);

export default router;
