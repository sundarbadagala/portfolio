class BlogTag extends HTMLElement {
  connectedCallback() {
    const value = this.getAttribute("value");
    $(this).text(value);
    $(this).on("click", function (e) {
      e.stopPropagation();
      window.location.href = "./blogs.html?tags=" + encodeURIComponent(value);
    });
  }
}

customElements.define("blog-tag", BlogTag);
