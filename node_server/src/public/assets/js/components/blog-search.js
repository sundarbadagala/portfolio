function BlogSearch() {
  const $el = $(`
    <div class='blog_search-container'>
      <input type="text" placeholder="Search..." id="blog_search" class='blog_search-input'/>
      <button id="search_btn" class='blog_search-btn'>Search</button>
    </div>
  `);

  $el.find("#search_btn").on("click", function (e) {
    e.stopPropagation();

    const value = $el.find("#blog_search").val();
    window.location.href = `./blogs.html?title=${encodeURIComponent(value)}`;
  });

  return $el;
}