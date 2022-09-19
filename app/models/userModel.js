module.exports = class UserModel {
  id;
  name;
  lastname;
  email;
  pass;
  timeStamp;
  active;
  account_balance;

  constructor(json) {
    Object.assign(this, json);
  }
};
