import Database from "better-sqlite3";
const db = new Database("Database.db");

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS flowmeters (
    fm_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_code TEXT UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    upper_limit REAL NOT NULL DEFAULT (-1),
    lower_limit REAL NOT NULL DEFAULT (-1),
    ssid TEXT DEFAULT '',
    purchase_date TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
  )
`
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS flowdata (
  data_id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_code TEXT NOT NULL,
  flowrate REAL NOT NULL,
  temperature REAL NOT NULL,
  upper_limit REAL NOT NULL,
  lower_limit REAL NOT NULL,
  timestamp INTEGER NOT NULL
);
`
).run();

// db.prepare(
//   `
//   INSERT INTO users (email, password, name) VALUES
//   ('sad', 'deneth', 'Deneth'),
//   ('sadp', 'deneth', 'Deneth');
// `
// ).run();

// db.prepare(
//   `INSERT INTO flowmeters (product_code, user_id) VALUES
//   ('FL0001', 1),
//   ('FL0002', 1),
//   ('FL0003', 1),
//   ('FL0004', 1),
//   ('FL0005', 2),
//   ('FL0006', 2),
//   ('FL0007', 2),
//   ('FL0008', 2);
// `
// ).run();

// db.prepare(`DROP TABLE IF EXISTS flowmeters;`).run();
// db.prepare(`DROP TABLE IF EXISTS flowdata;`).run();

const insertUser = db.prepare(`
  INSERT INTO users (email, password, name)
  VALUES (?, ?, ?)
`);

const insertFlowmeter = db.prepare(`
  INSERT INTO flowmeters (product_code, user_id)
  VALUES (?, ?)
`);

const checkEmail = db.prepare(`
  SELECT 1 FROM users WHERE email = ?
`);

const checkUserid = db.prepare(`
  SELECT 1 FROM users WHERE user_id = ?
`);

const fetchUserid = db.prepare(`
  SELECT * FROM users WHERE user_id = ?
`);

const getUserDataFromEmail = db.prepare(`
  SELECT * FROM users WHERE email = ?
`);

const getFlowMetersFromUserid = db.prepare(`
  SELECT * FROM flowmeters WHERE user_id = ?
`);

const getProductCodesFromUserid = db.prepare(`
  SELECT product_code FROM flowmeters WHERE user_id = ?
`);

const getFlowMeterFromProductCode = db.prepare(`
  SELECT * FROM flowmeters WHERE product_code = ?
`);

const updateLimits = db.prepare(`UPDATE flowmeters
SET upper_limit = ?, lower_limit = ?
WHERE product_code = ?;`);

const updateFlowmeterQuery = db.prepare(`UPDATE flowmeters
SET ssid = ?, upper_limit = ?, lower_limit = ?
WHERE product_code = ?;`);

const getFlowmetersBySameUser = db.prepare(`
  SELECT product_code
  FROM flowmeters
  WHERE user_id = (
    SELECT user_id
    FROM flowmeters
    WHERE product_code = ?
  );
`);

const insertFlowData = db.prepare(`
  INSERT INTO flowdata (
    product_code,
    flowrate,
    temperature,
    upper_limit,
    lower_limit,
    timestamp
  )
  SELECT
    ?, ?, ?, f.upper_limit, f.lower_limit, ?
  FROM flowmeters f
  WHERE f.product_code = ?;
`);

export {
  db,
  insertUser,
  checkEmail,
  checkUserid,
  updateFlowmeterQuery,
  getUserDataFromEmail,
  getFlowMetersFromUserid,
  getFlowMeterFromProductCode,
  insertFlowmeter,
  fetchUserid,
  updateLimits,
  getFlowmetersBySameUser,
  getProductCodesFromUserid,
  insertFlowData,
};
