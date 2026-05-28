const ENDPOINTS = {
  content: {
    getAll:    "/api/v1/content",
    getById:   function (id) { return "/api/v1/content/" + id; },
    search:    "/api/v1/content/search"
  },
  user: {
    register:  "/api/v1/user/register",
    login:     "/api/v1/user/login",
    details:   "/api/v1/user/details"
  },
  tags: {
    getAll:    "/api/v1/tags"
  },
  query: {
    post:      "/api/v1/query"
  },
  news: {
    getAll:    "/api/v1/news"
  },
  upload: {
    signature: "/api/v1/upload/cloudinary/signature",
    upload:    "/api/v1/upload/cloudinary/upload"
  }
};
