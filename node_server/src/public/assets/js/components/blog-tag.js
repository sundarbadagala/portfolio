class BlogTag extends HTMLElement {
  connectedCallback() {
    const value = this.getAttribute("value");
    $(this).text(value);
    $(this).on("click", function (e) {
      e.stopPropagation();
      $(document).trigger("tag-filter", [value]);
    });
  }
}

customElements.define("blog-tag", BlogTag);
