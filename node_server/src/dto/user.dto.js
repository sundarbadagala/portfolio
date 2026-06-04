class RegisterUserDto {
  constructor({ username, email, password, confirmpassword }) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.confirmpassword = confirmpassword;
  }

  validate() {
    if (!this.username || !this.email || !this.password || !this.confirmpassword) {
      throw Object.assign(new Error("Insufficient details"), { status: 400 });
    }
    if (this.password !== this.confirmpassword) {
      throw Object.assign(new Error("Password does not match"), { status: 400 });
    }
  }
}

class LoginUserDto {
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }

  validate() {
    if (!this.email || !this.password) {
      throw Object.assign(new Error("Insufficient details"), { status: 400 });
    }
  }
}

class UpdateUserDto {
  constructor({ username, password, confirmpassword }) {
    this.username = username;
    this.password = password;
    this.confirmpassword = confirmpassword;
  }

  validate() {
    if (!this.username && !(this.password && this.confirmpassword)) {
      throw Object.assign(new Error("Insufficient details"), { status: 400 });
    }
    if (this.password && this.password !== this.confirmpassword) {
      throw Object.assign(new Error("Password does't match"), { status: 400 });
    }
  }
}

module.exports = { RegisterUserDto, LoginUserDto, UpdateUserDto };
