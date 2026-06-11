$(function () {
  const $container = $(".blogs_list-container");

  function renderCards(data) {
    $container.empty();
    $container.append(BlogSearch());
    data.forEach(({ title, content_id, headlines, tags, date }) => {
      $container.append(
        BlogCard({
          title,
          contentId: content_id,
          headlines: headlines || "",
          tags: tags || [],
          date: date || ""
        })
      );
    });
  }

  function loadFromUrl() {
    const params = new URLSearchParams(window.location.search);

    const title = params.get("title");
    const tag = params.get("tags");

    let url = ENDPOINTS.content.getAll;

    if (title) {
      url = `${ENDPOINTS.content.search}?title=${encodeURIComponent(title)}`;
    } else if (tag) {
      url = `${ENDPOINTS.content.search}?tags=${encodeURIComponent(tag)}`;
    }

    API.get(url)
      .done(({ data }) => (data?.length ? renderCards(data) : renderCards([])))
      .fail(() => {
        $container.html(
          "<p class='blogs_status blogs_status--error'>Failed to load blogs.</p>"
        );
      });
  }
  $(window).on("popstate", loadFromUrl);

  loadFromUrl();
});
