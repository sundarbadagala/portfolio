$(function () {
  const $container = $(".blogs_list-container");

  function renderCards(data) {
    $container.empty();
    data.forEach(({ title, content_id, headlines, tags, date }) => {
      $container.append(BlogCard({
        title,
        contentId: content_id,
        headlines: headlines || "",
        tags: tags || [],
        date: date || ""
      }));
    });
  }

  function loadAll() {
    $container.html("<p class='blogs_status'>Loading...</p>");
    API.get(ENDPOINTS.content.getAll)
      .done((res) => {
        if (!res.data || !res.data.length) {
          $container.html("<p class='blogs_status'>No blogs found.</p>");
          return;
        }
        renderCards(res.data);
      })
      .fail(() => {
        $container.html("<p class='blogs_status blogs_status--error'>Failed to load blogs.</p>");
      });
  }

  function loadByTag(tag) {
    $container.html("<p class='blogs_status'>Loading...</p>");
    API.get(ENDPOINTS.content.search + "?tags=" + encodeURIComponent(tag))
      .done((res) => {
        if (!res.data || !res.data.length) {
          $container.html("<p class='blogs_status'>No results for \"" + tag + "\".</p>");
          return;
        }
        renderCards(res.data);
      })
      .fail(() => {
        $container.html("<p class='blogs_status blogs_status--error'>Failed to filter blogs.</p>");
      });
  }

  function loadFromUrl() {
    const tag = new URLSearchParams(window.location.search).get("tags");
    tag ? loadByTag(tag) : loadAll();
  }

  $(window).on("popstate", loadFromUrl);

  loadFromUrl();
});
