const db = require("../services/repo/database");
const { query, sendResponse } = require("./common");

module.exports = {
  /**
   * @method getConcepts => Gets a concepts list from db
   * @param {*} req
   * @param {*} res
   * @returns {array} of concept name and id.
   */
  async getConcepts(req, res) {
    const fn = db.getConcepts;
    const queryArg = [];
    const msg = { code: 204, message: "Not content" };

    console.log(`Getting concepts list - ${new Date()}\n`);
    const queryRes = await query(fn, queryArg);

    sendResponse(res, queryRes, msg);
  },
};
