function parseTags(raw) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== "string") return [];
  try {
    return JSON.parse(raw);
  } catch {
    try {
      return JSON.parse(raw.replace(/'/g, '"'));
    } catch {
      return [];
    }
  }
}

class PostContentDto {
  constructor({ content, tags: rawTags, title, headlines, groupby }) {
    this.content = content;
    this.title = title;
    this.headlines = headlines;
    this.groupby = groupby;
    this.tags = parseTags(rawTags);
  }

  validate() {
    if (!this.content || !this.title || !this.headlines || !this.tags) {
      throw Object.assign(new Error("All fields are mandatory"), { status: 400 });
    }
    if (!this.tags.length) {
      throw Object.assign(
        new Error("tags must be a non-empty array of { value, label } objects"),
        { status: 400 }
      );
    }
    const allTagsValid = this.tags.every(
      tag => tag && typeof tag === "object" && "value" in tag && "label" in tag
    );
    if (!allTagsValid) {
      throw Object.assign(
        new Error("each tag must have { value, label } properties"),
        { status: 400 }
      );
    }
  }
}

class SearchContentDto {
  constructor({ title, tags, groupby }) {
    this.title = title;
    this.tags = tags;
    this.groupby = groupby;
  }

  validate() {
    if (!this.title && !this.tags && !this.groupby) {
      throw Object.assign(new Error("Params are missing"), { status: 400 });
    }
  }

  toQuery() {
    const query = {};
    if (this.title) query.title = new RegExp(this.title, "i");
    if (this.tags) query["tags.value"] = new RegExp(this.tags, "i");
    if (this.groupby) query.groupby = new RegExp(this.groupby, "i");
    return query;
  }
}

class UpdateContentDto {
  constructor({ content, tags: rawTags, title, headlines, groupby }) {
    this.content = content;
    this.title = title;
    this.headlines = headlines;
    this.groupby = groupby;
    if (rawTags !== undefined) {
      this.tags = parseTags(rawTags);
    }
  }

  validate() {
    if (this.content !== undefined && !this.content) {
      throw Object.assign(new Error("content cannot be empty"), { status: 400 });
    }
    if (this.title !== undefined && !this.title) {
      throw Object.assign(new Error("title cannot be empty"), { status: 400 });
    }
    if (this.headlines !== undefined && !this.headlines) {
      throw Object.assign(new Error("headlines cannot be empty"), { status: 400 });
    }
    if (this.tags !== undefined) {
      if (!this.tags.length) {
        throw Object.assign(
          new Error("tags must be a non-empty array of { value, label } objects"),
          { status: 400 }
        );
      }
      const allTagsValid = this.tags.every(
        tag => tag && typeof tag === "object" && "value" in tag && "label" in tag
      );
      if (!allTagsValid) {
        throw Object.assign(
          new Error("each tag must have { value, label } properties"),
          { status: 400 }
        );
      }
    }
  }
}

module.exports = { PostContentDto, SearchContentDto, UpdateContentDto };
