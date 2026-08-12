function parseStringValue(raw) {
  if (Array.isArray(raw)) {
    return raw.map(item => (typeof item === "object" && item !== null ? item.value || item.label : item)).join(", ");
  }
  if (typeof raw === "object" && raw !== null) {
    return raw.value || raw.label || JSON.stringify(raw);
  }
  return raw;
}

class PostQandADto {
  constructor({ question, answer, category, sub_category, level }) {
    this.question = question;
    this.answer = answer;
    this.category = parseStringValue(category);
    this.sub_category = parseStringValue(sub_category);
    this.level = parseStringValue(level);
  }

  validate() {
    if (!this.question || !this.answer || !this.category || !this.sub_category || !this.level) {
      throw Object.assign(new Error("All fields are mandatory"), { status: 400 });
    }
    if (!["beginner", "medium", "high"].includes(this.level)) {
      throw Object.assign(new Error("Level must be beginner, medium, or high"), { status: 400 });
    }
  }
}

class UpdateQandADto {
  constructor({ question, answer, category, sub_category, level }) {
    this.question = question;
    this.answer = answer;
    if (category !== undefined) {
      this.category = parseStringValue(category);
    }
    if (sub_category !== undefined) {
      this.sub_category = parseStringValue(sub_category);
    }
    if (level !== undefined) {
      this.level = parseStringValue(level);
    }
  }

  validate() {
    if (this.question !== undefined && !this.question) {
      throw Object.assign(new Error("question cannot be empty"), { status: 400 });
    }
    if (this.answer !== undefined && !this.answer) {
      throw Object.assign(new Error("answer cannot be empty"), { status: 400 });
    }
    if (this.category !== undefined && !this.category) {
      throw Object.assign(new Error("category cannot be empty"), { status: 400 });
    }
    if (this.sub_category !== undefined && !this.sub_category) {
      throw Object.assign(new Error("sub_category cannot be empty"), { status: 400 });
    }
    if (this.level !== undefined && !["beginner", "medium", "high"].includes(this.level)) {
      throw Object.assign(new Error("Level must be beginner, medium, or high"), { status: 400 });
    }
  }
}

module.exports = { PostQandADto, UpdateQandADto };
