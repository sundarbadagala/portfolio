function BlogCard({ title, contentId, headlines, tags, date }) {
  const tagsHtml = tags.map(t => `<blog-tag value="${t}"></blog-tag>`).join("");

  return $(`
    <div class="blogs_card">
      <a class="blogs_card-link" href="./blog-details.html?id=${contentId}">
        <div class="blogs_card-title">${title}</div>
        ${headlines ? `<div class="blogs_card-headline">${headlines}</div>` : ""}
      </a>
      <div class="blogs_card-footer">
        <div class="blogs_card-tags">${tagsHtml}</div>
        ${date ? `<span class="blogs_card-date">${Formatter.date(date)}</span>` : ""}
      </div>
    </div>
  `);
}
