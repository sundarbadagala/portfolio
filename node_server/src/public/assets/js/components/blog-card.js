class BlogCard extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title");
    const contentId = this.getAttribute("content-id");

    this.innerHTML = `
      <a class="blogs_card" href="./blog-details.html?id=${contentId}">
        ${title}
      </a>
    `;
  }
}

customElements.define("blog-card", BlogCard);
