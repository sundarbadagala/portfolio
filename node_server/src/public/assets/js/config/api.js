const API = {
  get(url) {
    return $.ajax({ url, type: "GET" });
  },
  post(url, data) {
    return $.ajax({
      url,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(data)
    });
  },
  del(url) {
    return $.ajax({ url, type: "DELETE" });
  }
};
