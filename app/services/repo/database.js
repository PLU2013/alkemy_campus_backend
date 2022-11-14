const mysql = require("mysql2/promise");
const cfg = require("../../config/config.js");
const queries = require("./queries.js");
const { generateToken } = require("../../sec");

const db = {
  /**
   * @method connect - Manage the DB connection.
   * When the connection is succefully the property [connection]
   * has all props and methods of the db connection.
   */
  async connect() {
    try {
      connection = await mysql.createConnection(cfg.DB);
      console.log("DB connection succefull!!");
    } catch (err) {
      console.log("DATA BASE  ERROR **********************");
      console.log(err);
      process.exit(1);
    }
  },

  /**
   * @method chkUserPass - Aunthentificates the user login.
   * @param {string} email  - User email.
   * @param {string} pass - User password.
   * @returns {object} UserModel
   */
  async chkUserPass(email, pass) {
    const [results] = await connection.query(queries.userLogin, [pass, email]);
    console.log(
      results.length == 1
        ? `User logged in as ${results[0].email} - ${new Date()}\n`
        : `Invalid user or pass for this ${email} - ${new Date()}\n`
    );
    return results.length == 1 ? results[0] : null;
  },

  /**
   * @method newUser - Creates a new user.
   * @param {string} name  - User name.
   * @param {string} lastname  - User lastname.
   * @param {string} email  - User email.
   * @param {string} pass  - User pass.
   * @returns {object} mysql server response.
   */
  async newUser(name, lastname, email, pass) {
    return await query(queries.newUser, [
      name,
      lastname,
      email,
      pass,
      new Date(),
    ]);
  },

  /**
   * @method deleteUser - Delete an user by id.
   * @param {int} id  - User's id.
   * @returns {object} mysql server response.
   */
  async deleteUser(id) {
    return await query(queries.deleteUser, [id]);
  },

  /**
   * @method updatePass - Change user's password.
   * @param {string} pass  - New password.
   * @param {int} userId  - User's id.
   * @returns {object} mysql server response.
   */
  async updatePass(newPass, userId) {
    return await query(queries.changePass, [newPass, new Date(), userId]);
  },

  /**
   * @method cancelUser - Set user as no active.
   * @param {int} user_id  - User id.
   * @returns {object} mysql server response.
   */
  async cancelUser(user_id) {
    return await query(queries.setUserActiveStatus, [
      false,
      new Date(),
      user_id,
    ]);
  },

  /**
   * @method restoreUser - Set user as active.
   * @param {int} user_id  - User id.
   * @returns {object} mysql server response.
   */
  async restoreUser(user_id) {
    return await query(queries.setUserActiveStatus, [true, null, user_id]);
  },
  /**
   * @method deleteAllUserOps - Delete all operations to an user id.
   * @param {int} user_id  - User id.
   * @returns {object} mysql server response.
   */
  async deleteAllUserOps(user_id) {
    return await query(queries.deleteUserOps, [user_id]);
  },

  /**
   * @method getAllOperationsForUser - Get all operations for an user.
   * @param {int} user_id  - User id.
   * @returns {array<OperationModel>} List of all operations for the user.
   */
  async getAllOperationsForUser(user_id) {
    return await query(queries.getAllUserTransactions, [user_id]);
  },

  /**
   * @method getLastTenOperationsForUser - Get the last ten operations for an user.
   * @param {int} user_id  - User id.
   * @returns {array<OperationModel>} List of last ten operations for the user.
   */
  async getLastTenOperationsForUser(user_id) {
    return await query(queries.getLastTenUserTransactions, [user_id]);
  },

  /**
   * @method cancelOperation - Set cancel status to an id operation.
   * @param {int} id  - Operation id.
   * @param {int} user_id - User id.
   * @returns {object} new user account balance.
   */
  async cancelOperation(id, user_id) {
    await query(queries.cancelTransaction, [true, new Date(), id, user_id]);
    return await db.updateUserAcountBalance(user_id);
  },
  /**
   * @method restoreOperation - Set cancel status to an id operation.
   * @param {int} id  - Operation id.
   * @param {int} user_id - User id.
   * @returns {object} mysql server response.
   */
  async restoreOperation(id, user_id) {
    await query(queries.cancelTransaction, [false, new Date(), id, user_id]);
    return await db.updateUserAcountBalance(user_id);
  },
  /**
   * @method newOperation - Write a new operation into the operations table.
   * @param {int} user_id - User id.
   * @param {int} concept_id  - Concept id.
   * @param {number} amount - Operation amount.
   * @param {string(3)} type - Type of operation.
   * @returns {object} mysql server response.
   */
  async newOperation(user_id, concept_id, amount, type) {
    const res = await query(queries.newTransaction, [
      user_id,
      concept_id,
      amount,
      type,
      new Date(),
    ]);
    return res.insertId != 0 ? await db.updateUserAcountBalance(user_id) : res;
  },
  /**
   * @method updateOperation - Update an operation into the operations table.
   * @param {int} concept_id  - Concept id.
   * @param {number} amount - Operation amount.
   * @param {int} id - Operation id.
   * @param {int} user_id - User id.
   * @returns {object} mysql server response.
   */
  async updateOperation(concept_id, amount, id, user_id) {
    const res = await query(queries.updateTransaction, [
      concept_id,
      amount,
      new Date(),
      id,
      user_id,
    ]);
    return res.affectedRows == 1
      ? await db.updateUserAcountBalance(user_id)
      : res;
  },

  /**
   * @method updateUserAcountBalance - Update user account balance.
   * @param {int} user_id - User id.
   * @returns {object} Account balance {acount_balance: #####.##}.
   */
  async updateUserAcountBalance(user_id) {
    const res = await query(queries.updateAccountBalance, [
      new Date(),
      user_id,
    ]);
    return res.affectedRows === 1
      ? (await query(queries.getAccountBalance, [user_id]))[0]
      : res;
  },

  async getConcepts() {
    return await query(queries.getConcepts, []);
  },
};

/**
 * @method query - General function for db queries.
 * @param {string} query - Query-string.
 * @param {array} params - Escape params for the query.
 * @returns {any} results - Query response.
 */
async function query(query, params) {
  const [results] = await connection.query(query, params);
  return results;
}

let connection;

db.connect();

module.exports = db;
