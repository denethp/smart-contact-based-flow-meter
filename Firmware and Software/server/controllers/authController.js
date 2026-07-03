import {
  insertUser,
  checkEmail,
  checkUserid,
  getUserDataFromEmail,
  fetchUserid,
} from "../utils/database.js";
import jwt from "jsonwebtoken";
import { response } from "../utils/functions.js";
import { Err } from "../utils/classes.js";

const userSignup = async (req, res, next) => {
  try {
    console.log("Received JSON:", req.body);
    //email validity
    //password validity

    // pass == repass
    if (req.body.pass != req.body.repass) {
      throw new Err("PASSWORD_MISMATCH");
    }

    // user exists?
    if (!!checkEmail.get(req.body.email)) {
      throw new Err("USER_ALREADY_EXISTS");
    }

    const result = insertUser.run(req.body.email, req.body.pass, req.body.name);
    res.json(
      response(true, "register", "INSERT_SUCCESS", {
        user_id: result.lastInsertRowid,
      })
    );
    console.log("USER_INSERT_SUCCESS");
  } catch (err) {
    if (err instanceof Err) {
      res.json(response(false, "register", err.message, {}));
    } else {
      res.json(response(false, "register", "UNEXPECTED_BACKEND_ERROR", {}));
    }
    console.log(err.message);
  }
};

const userSignin = async (req, res) => {
  try {
    console.log("Received JSON:", req.body);

    const user_data = getUserDataFromEmail.get(req.body.email);
    console.log(user_data);
    if (!user_data) {
      throw new Err("INVALID_USER");
    }

    if (req.body.pass != user_data.password) {
      throw new Err("INCORRECT_PASSWORD");
    }

    const token = jwt.sign(
      { user_id: user_data.user_id },
      process.env.JWT_SECRET_CODE,
      {
        expiresIn: 3600,
      }
    );

    res.json(
      response(true, "signin", "LOGIN_SUCCESS", {
        user_id: user_data.user_id,
        token,
      })
    );

    console.log("USER_LOGIN_SUCCESS");
  } catch (err) {
    if (err instanceof Err) {
      res.json(response(false, "signin", err.message, {}));
    } else {
      res.json(response(false, "signin", "UNEXPECTED_BACKEND_ERROR", {}));
    }
    console.log(err.message);
  }
};

const userVerify = async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw new Err("JWT_NOT_FOUND");
    const token = req.headers.authorization.split(" ")[1];
    console.log("Token: ", token);
    if (!token) throw new Err("JWT_NOT_FOUND");

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_CODE);
    console.log("decoded", decodedToken);
    const user_data = checkUserid.get(decodedToken.user_id);

    if (!user_data) {
      throw new Err("JWT_MALFORMED");
    }

    res.json(
      response(true, "verify", "VERIFY_SUCCESS", {
        user_id: user_data.user_id,
        email: user_data.email,
      })
    );
  } catch (err) {
    if (err instanceof Err) {
      res.json(response(false, "verify", err.message, {}));
    } else {
      if (err.message == "jwt expired")
        return res.json(response(false, "verify", "JWT_MALFORMED", {}));
      res.json(response(false, "verify", "UNEXPECTED_BACKEND_ERROR", {}));
    }
  }
};

const protectPath = async (req, res, next) => {
  try {
    console.log("prot path");
    if (!req.headers.authorization) throw new Err("JWT_NOT_FOUND");
    const token = req.headers.authorization.split(" ")[1];
    console.log("Token: ", token);
    if (!token) throw new Err("JWT_NOT_FOUND");

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_CODE);
    console.log("decoded", decodedToken);
    const user_data = fetchUserid.get(decodedToken.user_id);

    if (!user_data) {
      throw new Err("JWT_MALFORMED");
    }

    req.user = user_data;
    next();
  } catch (err) {
    if (err instanceof Err) {
      res.json(response(false, "protect", err.message, {}));
    } else {
      if (err.message == "jwt expired")
        return res.json(response(false, "protect", "JWT_MALFORMED", {}));
      console.log(err.message);
      res.json(response(false, "protect", "UNEXPECTED_BACKEND_ERROR", {}));
    }
  }
};

export { userSignup, userSignin, userVerify, protectPath };
