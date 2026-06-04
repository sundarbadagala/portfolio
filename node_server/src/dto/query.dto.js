class PostQueryDto {
  constructor({ sender, mail, query }) {
    this.sender = sender;
    this.mail = mail;
    this.query = query;
  }

  validate() {
    if (!this.sender || !this.mail || !this.query) {
      throw Object.assign(new Error("Insufficient details"), { status: 400 });
    }
  }
}

module.exports = { PostQueryDto };
