module.exports = class UserModel {
  id;
  name;
  lastname;
  email;
  active;
  accountBalance;
  createdAt;
  updatedAt;

  constructor(json) {
    this.id = json.id;
    this.name = json.name;
    this.lastname = json.lastname;
    this.email = json.email;
    this.active = json.active;
    this.accountBalance = json.account_balance;
    this.createdAt = json.created_at;
    this.updatedAt = json.updated_at;
  }
};
