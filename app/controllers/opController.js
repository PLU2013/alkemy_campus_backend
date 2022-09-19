const { updateAccountBalance } = require("../config/queries");
const db = require("../services/repo/database");
const { query } = require("./common");

module.exports = {
  async getUserTransactions(req, res) {
    const fn = db.getAllOperationsForUser;
    const queryArg = [req.params.userId];
    const msg = {
      code: 204,
      message: "Not content",
    };
    return await query(fn, queryArg, msg, res);
  },

  async getLastTenUserTransactions(req, res) {
    const fn = db.getLastTenOperationsForUser;
    const queryArg = [req.params.userId];
    const msg = {
      code: 204,
      message: "Not content",
    };
    return await query(fn, queryArg, msg, res);
  },

  async putOperation(req, res) {
    const fn = db.putOperation;
    const b = req.body;
    const queryArg = [b.userId, b.conceptId, b.amount, b.type];
    const msg = {
      code: 400,
      message: "Bad request",
    };
    return await query(fn, queryArg, msg, res, 201);
  },

  async cancelOperation(req, res) {
    const fn = db.cancelOperation;
    const queryArg = [req.body.id, req.body.user_id];
    const msg = {
      code: 400,
      message: "Bad request",
    };
    return await query(fn, queryArg, msg, res);
  },

  async updateAccountBalance() {},
};
