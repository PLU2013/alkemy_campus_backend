module.exports = {
  /**
   * @type {string}
   * Get user from String [email] and String [pass].
   * Use ['email', 'pass'] as second param in the query.
   * @type {string} email.
   * @type {string} pass.
   */
  userLogin: `SELECT id, name, lastname, email, account_balance, created_at  
    FROM users WHERE pass = SHA(?) AND email = ? AND active = true`,

  /**
   * @type {string}
   * Get all of the operations for an defined user. Include canceled operations.
   * Use [user_id] as second param in the query.
   * @type {int} user_id.
   */
  getAllUserTransactions: `SELECT operations.*, concepts.name as concept FROM operations 
      INNER JOIN users ON operations.user_id = users.id
      INNER JOIN concepts ON operations.concept_id = concepts.id
      WHERE users.id = ?
      ORDER BY operations.id DESC`,

  /**
   * @type {string}
   * Get the last ten operations for an defined user. Exclude canceled operations.
   * Use [user_id] as second param in the query.
   * @type {int} user_id.
   */
  getLastTenUserTransactions: `SELECT operations.*, concepts.name as concept FROM operations 
      INNER JOIN users ON operations.user_id = users.id
      INNER JOIN concepts ON operations.concept_id = concepts.id
      WHERE users.id = ? AND operations.canceled = false
      ORDER BY operations.id DESC LIMIT 10`,

  /**
   * @type {string}
   * Put a new operation into operations table.
   * Use [user_id, concept_id, amount, type, date] as second param in the query.
   * @type {int} user_id.
   * @type {int} concept_id.
   * @type {number} amount.
   * @type {string(3)} type.
   * @type {DateTime} date.
   */
  putTransaction: `INSERT INTO operations (user_id, concept_id, amount, type, date)
      VALUES (?, ?, ?, ?, ?)`,

  /**
   * @type {string}
   * Set status of canceled field for row id
   * Use [canceled, canceled_date, id, user_id] as second param in the query.
   * @type {boolean} canceled.
   * @type {DateTime | null} canceled_date.
   * @type {int} id.
   * @type {int} user_id.
   */
  cancelTransaction: `UPDATE operations
      SET canceled = ?, canceled_date = ?
      WHERE id = ? AND user_id = ?`,

  /**
   * @type {string}
   * Create a new user into users table.
   * Use [name, lastname, email, pass, created_at] as second param in the query.
   * @type {string} name.
   * @type {string} lastname.
   * @type {string} email. <= This param is set a UNIQUE in the table
   * @type {string} pass.  <= Saved with SHA algoritm in the table
   * @type {DateTime} created_at.
   */
  newUser: `INSERT INTO users (name, lastname, email, pass, created_at)
      VALUES (?, ?, ?, SHA(?), ?)`,

  /**
   * @type {string}
   * Set active status to user by user_id.
   * Use [active, updated_at, user_id] as second param in the query.
   * @type {boolean} active.
   * @type {datetime} updated_at.
   * @type {int} user_id.
   */
  setUserActiveStatus: `UPDATE users
      SET active = ?, updated_at = ?
      WHERE id = ?`,

  /**
   * @type {string}
   * Update the acount balance to an user.
   * Use [updated_at, user_id] as second param in the query.
   * @type {datetime} updated_at.
   * @type {int} user_id.
   */
  updateAccountBalance: `UPDATE users u
    INNER JOIN (
    SELECT user_id, canceled, SUM(amount) a FROM operations
    GROUP BY user_id, canceled) op ON u.id = op.user_id
    SET u.account_balance = op.a, updated_at = ?
    WHERE u.id = ? AND canceled = false`,
};
