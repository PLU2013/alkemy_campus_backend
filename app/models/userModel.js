module.exports = class UserModel {
  id;
  name;
  lastname;
  email;
  pass;
  active;
  accountBalance;
  created_at;
  updated_at;

  constructor(json) {
    Object.assign(this, json);
  }
};
