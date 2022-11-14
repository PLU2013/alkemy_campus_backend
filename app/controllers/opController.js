const db = require("../services/repo/database");
const { query, sendResponse } = require("./common");

module.exports = {
  /**
   * @method getUserOperations - Gets all user operations. Include the canceled opertions.
   * @param {string} jwt req.headers.jwt
   * @returns {array} array of operations.
   */
  async getUserOperations(req, res) {
    const fn = db.getAllOperationsForUser;
    const queryArg = [req.body.jwtPayload.id];
    const msg = {
      code: 204,
      message: "Not content",
    };
    console.log(
      `Getting ALL ops for => ${req.body.jwtPayload.email} - ${new Date()}\n`
    );
    const queryRes = await query(fn, queryArg);

    sendResponse(res, queryRes, msg);
  },

  /**
   * @method getLastTenUserOperations - Gets the last ten user operations. Not include the canceled opertions.
   * @param {string} jwt  req.headers.jwt
   * @returns {array}  array of operations.
   */
  async getLastTenUserOperations(req, res) {
    const fn = db.getLastTenOperationsForUser;
    const queryArg = [req.body.jwtPayload.id];
    const msg = {
      code: 204,
      message: "Not content",
    };
    console.log(
      `Getting last ops for => ${req.body.jwtPayload.email}  - ${new Date()}\n`
    );
    const queryRes = await query(fn, queryArg);

    sendResponse(res, queryRes, msg);
  },

  /**
   * @method newOperation - Creates a new operation to a user.
   * @param {string} jwt req.headers.jwt. Authentification and userId.
   * @param {int} concemptId req.body.conceptId.
   * @param {float} amount req.body.amount.
   * @returns {object}  MySQL respose.
   */
  async newOperation(req, res) {
    const fn = db.newOperation;
    const body = req.body;
    const type = body.conceptId == 1 ? "inp" : "out";
    const queryArg = [body.jwtPayload.id, body.conceptId, body.amount, type];
    const msg = {
      code: 400,
      message: "Bad request",
    };
    console.log(
      `New operation from => ${req.body.jwtPayload.email} - ${new Date()}\n`
    );

    const queryRes = await query(fn, queryArg);

    sendResponse(res, queryRes, msg, 201);
  },

  /**
   * @method cancelOperation - Cancels a operation to a user.
   * @param {string} jwt  req.headers.jwt. Authentification and userId.
   * @param {int} opId req.params.opId.
   * @returns {object}  MySQL respose.
   */
  async cancelOperation(req, res) {
    const fn = db.cancelOperation;
    const queryArg = [req.params.opId, req.body.jwtPayload.id];
    const msg = {
      code: 400,
      message: "Bad request",
    };
    console.log(
      `Canceling operation ${req.params.opId} - ${
        req.body.jwtPayload.email
      } - ${new Date()}\n`
    );
    const queryRes = await query(fn, queryArg);

    sendResponse(res, queryRes, msg);
  },

  /**
   * @method restoreOperation - Restores a canceled operation to a user.
   * @param {string} jwt req.headers.jwt. Authentification and userId.
   * @param {int} opId  req.params.opId.
   * @returns {object}  MySQL respose.
   */
  async restoreOperation(req, res) {
    const fn = db.restoreOperation;
    const queryArg = [req.params.opId, req.body.jwtPayload.id];
    const msg = {
      code: 400,
      message: "Bad request",
    };
    console.log(
      `Restoring operation ${req.params.opId} - ${
        req.body.jwtPayload.email
      } - ${new Date()}\n`
    );
    const queryRes = await query(fn, queryArg);

    sendResponse(res, queryRes, msg);
  },

  /**
   * @method updateOperation - Updates a operation to a user.
   * @param {string} jwt req.headers.jwt. Authentification and userId.
   * @param {int} opId  req.params.opId.
   * @returns {object}  MySQL respose.
   */
  async updateOperation(req, res) {
    const { jwtPayload, op } = req.body;
    const fn = db.updateOperation;
    const queryArg = [op.concept_id, op.amount, op.id, jwtPayload.id];
    const msg = {
      code: 400,
      message: "Bad request",
    };
    console.log(
      `Updating operation ${op.id} - ${jwtPayload.email} - ${new Date()}\n`
    );

    const queryRes = await query(fn, queryArg);

    sendResponse(res, queryRes, msg);
  },

  async updateAccountBalance() {},
};
