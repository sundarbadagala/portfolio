function parseStringValue(raw) {
  if (Array.isArray(raw)) {
    return raw.map(item => (typeof item === "object" && item !== null ? item.value || item.label : item)).join(", ");
  }
  if (typeof raw === "object" && raw !== null) {
    return raw.value || raw.label || JSON.stringify(raw);
  }
  return raw;
}

class GenerateTestDto {
  constructor(body = {}) {
    this.subject = parseStringValue(body.subject)?.trim();
    
    const rawLevel = parseStringValue(body.level)?.trim().toLowerCase();
    this.level = rawLevel;

    const rawCount = body.number_questions ?? 
                     body.number_of_questions ?? 
                     body.num_questions ?? 
                     body.questions_count ?? 
                     body.count;

    this.number_questions = rawCount !== undefined ? Number(rawCount) : 5;
  }

  validate() {
    if (!this.subject) {
      throw Object.assign(new Error("Subject is required"), { status: 400 });
    }

    const validLevels = ["beginner", "medium", "advanced"];
    if (!this.level || !validLevels.includes(this.level)) {
      throw Object.assign(
        new Error(`Level must be one of: ${validLevels.join(", ")}`),
        { status: 400 }
      );
    }

    if (
      isNaN(this.number_questions) ||
      !Number.isInteger(this.number_questions) ||
      this.number_questions < 1 ||
      this.number_questions > 20
    ) {
      throw Object.assign(
        new Error("Number of questions must be an integer between 1 and 20"),
        { status: 400 }
      );
    }
  }
}

module.exports = {
  GenerateTestDto
};
