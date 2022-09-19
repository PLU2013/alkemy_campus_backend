const UserModel = require("../models/userModel.js");
const db = require("../services/repo/database");
const { query } = require("./common");

module.exports = {
  async getUserLogin(req, res) {
    const fn = db.chkUserPass;
    const email = req.body.email;
    const pass = req.body.pass;
    const queryArg = [email, pass];
    const msg = {
      code: 401,
      message: "Invalid user or password",
    };
    return await query(fn, queryArg, msg, res);
  },

  async newUser(req, res) {
    const fn = db.newUser;

    const queryArg = chkNewUserData(req.body);

    const msg = {
      code: 400,
      message: "Bad request",
    };

    return queryArg.length
      ? await query(fn, queryArg, msg, res)
      : res.status(msg.code).json({ message: msg.message });
  },

  async cancelUser(req, res) {
    const fn = db.cancelUser;
    const queryArg = [req.params.userId];
    return await query(fn, queryArg, null, res);
  },

  async restoreUser(req, res) {
    const fn = db.restoreUser;
    const queryArg = [req.params.userId];
    return await query(fn, queryArg, null, res);
  },
};

function chkNewUserData(body) {
  const name = (body.name ??= "");
  const lastname = (body.lastname ??= "");
  const email = (body.email ??= "");
  const pass = (body.pass ??= "");

  const emailChk =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  const chkResume =
    name.length > 0 &&
    name.length < 21 &&
    lastname.length > 0 &&
    lastname.length < 21 &&
    emailChk.test(email) &&
    pass.length > 0 &&
    pass.length < 30;

  return chkResume ? [name, lastname, email, pass] : [];
}
