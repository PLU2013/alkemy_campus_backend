const { generateToken } = require("../sec");
const db = require("../services/repo/database");
const { query, sendResponse } = require("./common");

module.exports = {
  /**
   * @method getUserLogin - Aunthentificates the user login.
   * @param {string} email on req.body.email.
   * @param {string} pass on req.body.pass.
   * @returns {object} If aunth is ok then return a JWT with the user's information.
   */
  async getUserLogin(req, res) {
    const fn = db.chkUserPass;
    const { email, pass } = req.body;
    const queryArg = [email, pass];
    const msg = {
      code: 401,
      message: "Invalid user or password",
    };
    const queryRes = await query(fn, queryArg);
    let token = [];
    if (queryRes) {
      token = await generateToken(queryRes);
    }
    sendResponse(res, token, msg);
  },

  /**
   * @method newUser - Creates a new user. (Path is not available)
   * @param {string}  name on req.body.name.
   * @param {string}  lastname on req.body.lastname.
   * @param {string}  email on req.body.email.
   * @param {string}  pass on req.body.pass.
   * @returns {object} MySQL response.
   */
  async newUser(req, res) {
    const fn = db.newUser;

    const queryArg = chkNewUserData(req.body);

    const msg = {
      code: 400,
      message: "Bad request",
    };
    console.log(`Creating a new user:`);
    console.log(req.body);
    let queryRes;
    if (queryArg.length != 0) {
      queryRes = await query(fn, queryArg);
      console.log(
        `A new user has been created => ${req.body.email} - ${new Date()}\n`
      );
    } else {
      console.log(`Error creating new user -  ${new Date()}\n`);
      queryRes = { error: msg.message, code: msg.code };
    }

    sendResponse(res, queryRes, msg);
  },

  /**
   * @method cancelUser - Cancels a user.(Path is not available)
   * @param {int}  userId on req.params.userId.
   * @returns {object} MySQL response.
   */
  async cancelUser(req, res) {
    const fn = db.cancelUser;
    const queryArg = [req.params.userId];
    const msg = {
      code: 400,
      message: "Bad request",
    };
    const queryRes = await query(fn, queryArg, null, res);
    sendResponse(res, queryRes, msg);
  },

  /**
   * @method cancelUser - Restore a canceled user.(Path is not available)
   * @param {int}  userId on req.params.userId.
   * @returns {object} MySQL response.
   */
  async restoreUser(req, res) {
    const fn = db.restoreUser;
    const queryArg = [req.params.userId];
    const msg = {
      code: 400,
      message: "Bad request",
    };
    const queryRes = await query(fn, queryArg, null, res);
    sendResponse(res, queryRes, msg);
  },

  /**
   * @method changePass - Change user's password
   * @param {int}  userId on req.body.jwtPayload
   * @param {string} email on req.body.jwtPayload
   * @param {string} oldPass on req.body.oldPass
   * @param {string} newPass on req.body.newPass
   * @returns {string} New token
   */
  async changePass(req, res) {
    let queryRes = { error: "Invalid password", code: 401 };
    let fn = db.chkUserPass;
    const { email, id } = req.body.jwtPayload;
    const { oldPass, newPass } = req.body;
    console.log(`Changing password => ${email}`);
    let queryArg = [email, oldPass];
    const auth = await query(fn, queryArg);
    const msg = {
      code: 401,
      message: "Invalid user or password",
    };
    let token = [];
    if (auth) {
      token = await generateToken(auth);
      fn = db.updatePass;
      queryArg = [newPass, id];
      queryRes = await query(fn, queryArg);
      if (queryRes.affectedRows === 1) {
        console.log(`Password updated OK - ${new Date()}\n`);
        queryRes = token;
      }
    } else {
      console.log(`Error updating password  - ${new Date()}\n`);
    }

    sendResponse(res, queryRes, msg);
  },

  async delete(req, res) {
    let queryRes = { error: "Invalid password", code: 401 };
    const { pass } = req.body;
    const { email, id: user_id } = req.body.jwtPayload;
    let fn = db.chkUserPass;
    let queryArg = [email, pass];
    const msg = {
      code: 401,
      message: "Invalid user or password",
    };
    const auth = await query(fn, queryArg);
    if (auth) {
      fn = db.deleteAllUserOps;
      queryArg = [user_id];
      queryRes = await query(fn, queryArg);
      if (!queryRes.hasOwnProperty("error")) {
        fn = db.deleteUser;
        await query(fn, queryArg);
        queryRes = "OK";
      }
    }
    sendResponse(res, queryRes, msg);
  },
};

/**
 * @method chkNewUserData - Check that the submitted user information is in the correct format.
 * @param {string} name of user
 * @param {string} lastname of user
 * @param {string} email of user
 * @param {string} pass password of user
 * @returns {array}  If ok then return an array with the same input params, else returns an empty array.
 */
function chkNewUserData(body) {
  const { name, lastname, email, pass } = body;

  const emailChk =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  const chkResume =
    (name ?? "").length > 0 &&
    (name ?? "").length < 21 &&
    (lastname ?? "").length > 0 &&
    (lastname ?? "").length < 21 &&
    emailChk.test(email) &&
    (pass ?? "").length > 3 &&
    (pass ?? "").length < 30;

  return chkResume ? [name, lastname, email, pass] : [];
}
