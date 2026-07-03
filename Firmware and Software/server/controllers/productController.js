import path from "path";
import { fileURLToPath } from "url";
import {
  insertFlowmeter,
  checkUserid,
  getFlowMetersFromUserid,
  db,
} from "../utils/database.js";
import { response } from "../utils/functions.js";
import { esp_clients, fms_users } from "../socket.js";
import { Err } from "../utils/classes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const addProduct = async (req, res, next) => {
  console.log(req.body);
  const user_id = req.body.owner_id;
  const product_code = req.body.product_code;

  console.log(user_id, product_code);

  const result = checkUserid.get(user_id);
  console.log(result);
  if (!result) {
    return res.redirect("/register/product?success=false");
  }

  insertFlowmeter.run(product_code, user_id);

  res.redirect("/register/product?success=true");
};

const getRegisterProductPage = async (req, res, next) => {
  res.sendFile(path.join(__dirname, "/addProduct.html"));
};

const getFlowmeters = async (req, res, next) => {
  try {
    let flowmeters = getFlowMetersFromUserid.all(req.user.user_id);
    console.log(flowmeters);
    if (!flowmeters) {
      flowmeters = [];
    }

    let activeCount = 0;
    for (let i = 0; i < flowmeters.length; i++) {
      if (flowmeters[i].product_code in esp_clients) {
        activeCount += 1;
      }
    }

    res.json(
      response(true, "/fetch/flowmeters", "GET_FLOWMETERS_SUCCESS", {
        flowmeters: flowmeters,
        active_count: activeCount,
        user: {
          user_id: req.user.user_id,
          name: req.user.name,
          email: req.user.email,
        },
      })
    );
  } catch (err) {
    res.json(
      response(false, "/fetch/flowmeters", "UNEXPECTED_BACKEND_ERROR", {})
    );
    console.log(err.message);
  }
};

function buildUpdateQuery({ ssid, upper_limit, lower_limit, product_code }) {
  const fields = [];
  const values = [];
  if (ssid === "default") {
    fields.push("ssid = ssid");
  } else {
    fields.push("ssid = ?");
    values.push(ssid);
  }
  if (upper_limit === "default") {
    fields.push("upper_limit = upper_limit");
  } else {
    fields.push("upper_limit = ?");
    values.push(upper_limit);
  }
  if (lower_limit === "default") {
    fields.push("lower_limit = lower_limit");
  } else {
    fields.push("lower_limit = ?");
    values.push(lower_limit);
  }
  const sql = `UPDATE flowmeters SET ${fields.join(
    ", "
  )} WHERE product_code = ?`;
  values.push(product_code);

  return { sql, values };
}

const updateFlowmeter = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log(esp_clients);
    console.log(req.body.product_code);

    if (!(req.body.product_code in esp_clients))
      throw new Err("FLOWMETER_OFFLINE");

    const ulRaw = req.body.upper_limit;
    const llRaw = req.body.lower_limit;

    if (ulRaw !== "default") {
      const ul = parseFloat(ulRaw);
      if (isNaN(ul) || (ul !== -1 && ul <= 0)) {
        throw new Err("INVALID_UPPER_LIMIT");
      }
    }

    if (llRaw !== "default") {
      const ll = parseFloat(llRaw);
      if (isNaN(ll) || (ll !== -1 && ll <= 0)) {
        throw new Err("INVALID_LOWER_LIMIT");
      }
    }

    if (ulRaw !== "default" && llRaw !== "default") {
      const ul = parseFloat(ulRaw);
      const ll = parseFloat(llRaw);
      if (ul !== -1 && ll !== -1 && ul <= ll) {
        throw new Err("UPPER_LOWER_LIMIT_MISMATCH");
      }
    }

    const filtered = Object.fromEntries(
      Object.entries(req.body).filter(([key, value]) => value !== "default")
    );

    esp_clients[req.body.product_code].send(JSON.stringify(filtered));

    const { sql, values } = buildUpdateQuery(req.body);
    console.log(sql);
    console.log(values);
    const stmt = db.prepare(sql);
    stmt.run(...values);

    res.json(
      response(true, "/update/flowmeter", "UPDATE_FLOWMETER_SUCCESS", {})
    );
  } catch (err) {
    if (err instanceof Err) {
      res.json(response(false, "/update/flowmeter", err.message, {}));
    } else {
      res.json(
        response(false, "/update/flowmeter", "UNEXPECTED_BACKEND_ERROR", {})
      );
      console.log(err.message);
    }
  }
};

const getFlowData = async (req, res, next) => {
  try {
    console.log(req.query);
    let trange = parseInt(req.query.trange);
    const product_code = req.query.product_code;

    const trangeMap = {
      0: 30, // 30 seconds
      1: 60, // 1 minute
      2: 300, // 5 minutes
      3: 600, // 10 minutes
      4: 1200, // 20 hours
    };

    let seconds = trangeMap[trange] ?? 30;

    const now = Date.now();
    const cutoff = now - seconds * 1000;

    let temperature_values = [];
    let flowrate_values = [];
    let times = [];

    const stmt = db.prepare(
      `SELECT temperature, flowrate, timestamp 
       FROM flowdata 
       WHERE timestamp >= ? AND product_code = ? 
       ORDER BY timestamp ASC`
    );
    const rows = stmt.all(cutoff, product_code);

    rows.forEach((row) => {
      times.push(row.timestamp);
      flowrate_values.push(row.flowrate);
      temperature_values.push(row.temperature);
    });

    console.log({ times, flowrate_values, temperature_values });

    const data = [];
    for (let t = now - seconds * 1000; t <= now; t += 1000) {
      const index = times.findIndex(
        (time) => time >= t - 500 && time <= t + 500
      );

      if (index !== -1) {
        data.push({
          timestamp: times[index],
          flowrate: flowrate_values[index],
          temperature: temperature_values[index],
        });
      } else {
        // Missing point: insert with 0s
        data.push({
          timestamp: t,
          flowrate: 0,
          temperature: 0,
        });
        console.log({
          timestamp: t,
          flowrate: 0,
          temperature: 0,
        });
      }
    }
    console.log("-------------------------------------==================");
    // Optional: sort in case out of order
    data.sort((a, b) => a.timestamp - b.timestamp);

    // Rebuild arrays
    const finalTimes = data.map((d) => d.timestamp);
    const finalFlowrates = data.map((d) => d.flowrate);
    const finalTemperatures = data.map((d) => d.temperature);

    console.log(finalTimes, finalFlowrates, finalTemperatures);

    res.json(
      response(true, "/fetch/flowmeter/flowdata", "FLOWDATA_FETCH_SUCCESSFUL", {
        times: finalTimes,
        flowrate_values: finalFlowrates,
        temperature_values: finalTemperatures,
      })
    );
  } catch (err) {
    if (err instanceof Err) {
      res.json(response(false, "/fetch/flowmeter/flowdata", err.message, {}));
    } else {
      res.json(
        response(
          false,
          "/fetch/flowmeter/flowdata",
          "UNEXPECTED_BACKEND_ERROR",
          {}
        )
      );
      console.log(err.message);
    }
  }
};

export {
  addProduct,
  getRegisterProductPage,
  getFlowmeters,
  updateFlowmeter,
  getFlowData,
};
