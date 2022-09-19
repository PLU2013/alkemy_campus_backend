const mysql = require("mysql2/promise");
const CONFIG = require("../../config/config.js");
const queries = require("../../config/queries.js");

let connection;

const db = {
  /**
   * @method connect - Manage the DB connection.
   * When the connection is succefully the property [connection]
   * has all props and methods of the db connection.
   */
  async connect() {
    try {
      connection = await mysql.createConnection(CONFIG.DB);
      console.log("DB connection succefull!!");
    } catch (err) {
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
        ? `User logged in as ${results[0].email}`
        : `Invalid user or pass for this ${email}`
    );
    return (results[0] ??= []);
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
   * @returns {object} mysql server response.
   */
  async cancelOperation(id, user_id) {
    return await query(queries.cancelTransaction, [
      true,
      new Date(),
      id,
      user_id,
    ]);
  },
  /**
   * @method putOperation - Write a new operation into the operations table.
   * @param {int} user_id - User id.
   * @param {int} concept_id  - Concept id.
   * @param {number} amount - Operation amount.
   * @param {string(3)} type - Type of operation.
   * @returns {object} mysql server response.
   */
  async putOperation(user_id, concept_id, amount, type) {
    return await query(queries.putTransaction, [
      user_id,
      concept_id,
      amount,
      type,
      new Date(),
    ]);
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

db.connect();

module.exports = db;
