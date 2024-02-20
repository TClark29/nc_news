const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../db/app/app.js");
const { readEndpointsFile } = require("../utils.js");
const { forEach } = require("../db/data/test-data/articles.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api", () => {
  describe("GET", () => {
    test("returns a 200 status code", () => {
      return request(app).get("/api").expect(200);
    });
    test("should return an object with a key of endpoints countaining objects. JSON should match endpoints.json file ", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          const result = response.body;
          const expectedResult = readEndpointsFile();
          return Promise.all([result, expectedResult]).then((response) => {
            expect(response[0]).toEqual(response[1]);
            expect(typeof response[0]).not.toBe("string");
          });
        });
    });
  });
});

describe("/api/topics", () => {
  describe("GET", () => {
    test("returns a 200 status on successful request", () => {
      return request(app).get("/api/topics").expect(200);
    });
    test("returns an object with a key of topics that contains an array of objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const topics = response.body.topics;
          expect(Array.isArray(topics)).toBe(true);
          expect(typeof topics[0]).toBe("object");
        });
    });
    test("each object in topics array has 2 keys, a slug and a description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const topics = response.body.topics;
          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            expect(Object.keys(topic)).toEqual(["slug", "description"]);
          });
        });
    });
  });
});

describe("/api/articles/:id", () => {
  describe("GET", () => {
    test("returns a 200 status and a body with the correct keys", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          const article = response.body.article;
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
        });
    });
    test("Returns a 400 bad request error when given an :id parameter which is not valid", () => {
      return request(app)
        .get("/api/articles/elephant")
        .expect(400)
        .then((response) => expect(response.body.msg).toBe("Bad Request"));
    });
    test("Returns a 404 not found error when given a valid Id that does not exist", () => {
      return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then((response) => expect(response.body.msg).toBe("Not Found"));
    });
  });
});

describe("api/articles", () => {
  describe("GET", () => {
    test("returns an object contaning an array of articles, which all have the correct properties, with the body property removed and comment_count added", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const articles = response.body.articles;
          expect(articles.length >= 1).toBe(true);
          articles.forEach((article) => {
            expect(article.body).toBe(undefined);

            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.votes).toBe("number");
          });
        });
    });
    test("returns every article, even those without comments", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const articles = response.body.articles;
          expect(articles.length).toBe(13);
        });
    });
    test("articles are sorted by date in descending order by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeSorted({
            key: "created_at",
            descending: true,
          });
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("Responds with 200 status code and an array of comments with the correct keys", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          const comments = response.body.comments;
          expect(comments.length).toBe(11);
          comments.forEach((comment) => {
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.created_at).toBe("string");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.body).toBe("string");
            expect(comment.article_id).toBe(1);
          });
        });
    });
    test("Comments are sorted by date from most recent by default", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          const comments = response.body.comments;
          expect(comments).toBeSorted({ key: "created_at", descending: true });
        });
    });
    test("Returns 400 Bad Request if given an article_id that is invalid", () => {
      return request(app)
        .get("/api/articles/potato/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("Returns 404 not found if given a valid article_id that does not exist", () => {
      return request(app)
        .get("/api/articles/9999/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not Found");
        });
    });
    test("Returns an empty array if given a valid, existing article_id which has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toEqual([]);
        });
    });
  });
  describe("POST", () => {
    test("Can post an article at valid id by sending body and username", () => {
      const postData = { body: "example body", username: "butter_bridge" };
      return request(app)
        .post("/api/articles/2/comments")
        .send(postData)
        .expect(201)
        .then((response) => {
          const comment = response.body.comment;
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.article_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.created_at).toBe("string");
        });
    });
    test("Returns 400 Bad Request if given an article_id that is invalid", () => {
      const postData = { body: "example body", username: "butter_bridge" }
      return request(app)
      .get("/api/articles/soap/comments")
      .send(postData)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("Returns 404 not found if given a valid article_id that does not exist", () => {
      const postData = { body: "example body", username: "butter_bridge" }
      return request(app)
        .post("/api/articles/12345/comments")
        .send(postData)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not Found");
        });
    });
    test("Returns a 401 when given an invalid username", ()=>{
      const postData = { body: "example body", username: "not_a_user" }
      return request(app)
      .post("/api/articles/2/comments")
        .send(postData)
        .expect(401)
        .then((response) =>{
          expect(response.body.msg).toBe('Unauthorised User')
        })

    })
  });
});

describe("General errors", () => {
  test("Path does not exist", () => {
    return request(app).get("/api/toast").expect(404);
  });
});
