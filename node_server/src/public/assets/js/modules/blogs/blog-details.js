$(function () {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    window.location.replace("./blogs.html");
    return;
  }

  const contentEl = $("#blog_content");
  contentEl.html("<p class='blog_detail-status'>Loading...</p>");

  API.get(ENDPOINTS.content.getById(id))
    .done((res) => {
      const post = res.data;
      document.title = post.title;

      const tags = post.tags.map(t => `<blog-tag value="${t}"></blog-tag>`).join("");

      contentEl.html(`
        <a class="blog_detail-back" href="./blogs.html">← Back</a>
        <h1 class="blog_detail-title">${post.title}</h1>
        <p class="blog_detail-headline">${post.headlines}</p>
        <div class="blog_detail-meta">
          <span>@${post.username}</span>
          <span>${Formatter.date(post.date)}</span>
        </div>
        <div class="blog_detail-tags">${tags}</div>
        <div class="blog_detail-content">${post.content}</div>
      `);
    })
    .fail(() => {
      contentEl.html("<p class='blog_detail-error'>Failed to load blog.</p>");
    });

  $(document).on("tag-filter", function (e, tag) {
    window.location.href = "./blogs.html?tags=" + encodeURIComponent(tag);
  });
});
