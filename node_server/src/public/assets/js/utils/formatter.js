const Formatter = {
  date(value) {
    return new Date(value).toLocaleDateString("en-IN", {
      year: "numeric", month: "short", day: "numeric"
    });
  }
};
