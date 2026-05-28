$(function () {
  const containerEl = $(".blogs_list-container");
  containerEl.html("<p class='blogs_status'>Loading...</p>");

  API.get(ENDPOINTS.content.getAll)
    .done((res) => {
      if (!res.data || !res.data.length) {
        containerEl.html("<p class='blogs_status'>No blogs found.</p>");
        return;
      }
      containerEl.empty();
      res.data.forEach(({ title, content_id }) => {
        const card = document.createElement("blog-card");
        card.setAttribute("title", title);
        card.setAttribute("content-id", content_id);
        containerEl.append(card);
      });
    })
    .fail(() => {
      containerEl.html("<p class='blogs_status blogs_status--error'>Failed to load blogs.</p>");
    });
});
