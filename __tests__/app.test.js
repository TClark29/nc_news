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

describe("/api/", () => {
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
  describe("POST", ()=>{
    test('Returns a 201 status code and returned topic on successful post', ()=>{
      const sentBody = {
        slug: "topic name here",
        description: "description here"
      }
      return request(app)
      .post('/api/topics')
      .send(sentBody)
      .expect(201)
      .then((response)=>{
        const topic = response.body.topic
        expect(topic.slug).toBe("topic name here")
        expect(topic.description).toBe("description here")
      })
    })
    test('Returns a 400 if given an incomplete body (description optional)', ()=>{
      const sentBody = { description: "description here"}
      return request(app)
      .post('/api/topics')
      .send(sentBody)
      .expect(400)
      .then((response)=>{
        expect(response.body.msg).toBe('Bad Request')
      })

    })
    test('Returns a 403 if given a slug that already exists', ()=>{
      const sentBody = { slug: "mitch"}
      return request(app)
      .post('/api/topics')
      .send(sentBody)
      .expect(403)
      .then((response)=>{
        expect(response.body.msg).toBe('Already Exists')
      })

    })
    })

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
    test("Returned article has a comment_count property with total number of comments", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          const article = response.body.article;
          expect(article.comment_count).toBe("11");
        });
    });
    test("Returned article has a comment_count property that works for articles with 0 comments", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then((response) => {
          const article = response.body.article;
          expect(article.comment_count).toBe("0");
        });
    });
  });
  describe("PATCH", () => {
    test("Returns 200 status and the correct update article when sent a body containing votes to update", () => {
      const patchUpdate = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(patchUpdate)
        .expect(200)
        .then((response) => {
          const article = response.body.article;
          expect(article.votes).toBe(101);
          expect(article.title).toBe("Living in the shadow of a great man");
          expect(article.topic).toBe("mitch");
          expect(article.body).toBe("I find this existence challenging");
          expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test("Works for negative votes", () => {
      const patchUpdate = { inc_votes: -50 };
      return request(app)
        .patch("/api/articles/1")
        .send(patchUpdate)
        .expect(200)
        .then((response) => {
          const article = response.body.article;
          expect(article.votes).toBe(50);
        });
    });
    test("Returns 404 when given article id that does not exist", () => {
      const patchUpdate = { inc_votes: -50 };
      return request(app)
        .patch("/api/articles/999")
        .send(patchUpdate)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not Found");
        });
    });
    test("Returns 400 when given invalid article id", () => {
      const patchUpdate = { inc_votes: -50 };
      return request(app)
        .patch("/api/articles/greenhouse")
        .send(patchUpdate)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("Returns 400 when given a body with an invalid inc_votes value", () => {
      const patchUpdate = { inc_votes: "One" };
      return request(app)
        .patch("/api/articles/1")
        .send(patchUpdate)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("Returns 400 when given a body with an invalid key", () => {
      const patchUpdate = { changed_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(patchUpdate)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
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
          expect(articles.length >=1).toBe(true);
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
    test("can accept a query to select by topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then((response) => {
          const articles = response.body.articles;
          expect(articles.length >=1).toBe(true);
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    test("returns an empty array when given a topic that does not exist", () => {
      return request(app)
        .get("/api/articles?topic=elephant")
        .expect(200)
        .then((response) => {
          const articles = response.body.articles;
          expect(articles.length).toBe(0);
        });
    });
    test("should accept a query to be sorted by any valid column in database, descending by default", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then((response) => {
          const articles = response.body.articles;
          expect(articles.length >=2).toBe(true)
          expect(response.body.articles).toBeSorted({
            key: "article_id",
            descending: true,
          });
        });
    });
    test("should throw a 400 error if given an invalid sort_by value", () => {
      return request(app)
        .get("/api/articles?sort_by=wordcount")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });

    test("should accept a query to be sorted in ascending or descending order", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then((response) => {
          const articles = response.body.articles;
          expect(articles.length >=2).toBe(true);
          expect(response.body.articles).toBeSorted({
            key: "created_at",
            descending: false,
          });
        });
    });
    test("should throw a 400 error if given an invalid order value", () => {
      return request(app)
        .get("/api/articles?order=random")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("should accept multiple queries", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=title&order=asc")
        .expect(200)
        .then((response) => {
          const articles = response.body.articles;
          expect(articles.length >=2).toBe(true);
          expect(response.body.articles).toBeSorted({
            key: "title",
            descending: false,
          });
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    test("should accept queries for limit", ()=>{
      return request(app)
      .get('/api/articles?limit=4')
      .expect(200)
      .then((response)=>{
        const articles = response.body.articles
        expect(articles.length).toBe(4)
      })

    })
    test("defaults to limit 10", ()=>{
      return request(app)
      .get('/api/articles')
      .expect(200)
      .then((response)=>{
        const articles = response.body.articles
        expect(articles.length).toBe(10)
      })
     })
     test("accepts a page query as p", ()=>{
      return request(app)
      .get('/api/articles?p=2')
      .expect(200)
      .then((response)=>{
        const articles = response.body.articles
        expect(articles.length).toBe(3)
      })
     })
     test("can accept both a page and limit query at the same time", ()=>{
      return request(app)
      .get('/api/articles?limit=6&p=3')
      .expect(200)
      .then((response)=>{
        const articles = response.body.articles
        expect(articles.length).toBe(1)
      })
     })
     test("returns an error if given an invalid value for limit", ()=>{
      return request(app)
      .get('/api/articles?limit=lamp')
      .expect(400)
      .then((response)=>{
       
        expect(response.body.msg).toBe('Bad Request')
      })
      
     })
     test("returns an error if given an invalid value for page", ()=>{
      return request(app)
      .get('/api/articles?p=one')
      .expect(400)
      .then((response)=>{
       
        expect(response.body.msg).toBe('Bad Request')
      })


    })
  });
  describe("POST", () => {
    test("accepts a body with valid keys and returns 201 and correct article", () => {
      const sentBody = {
        author: "lurker",
        title: "example title",
        topic: "cats",
        body: "example body",
        article_img_url: "example.com",
      };
      return request(app)
      .post('/api/articles')
      .send(sentBody)
      .expect(201)
      .then((response)=>{
        const article = response.body.article
        expect(article.author).toBe('lurker')
        expect(article.title).toBe('example title')
        expect(article.topic).toBe('cats')
        expect(article.votes).toBe(0)
        expect(typeof article.article_id).toBe('number')
        expect(typeof article.created_at).toBe('string')
        expect(article.comment_count).toBe("0")
        expect(article.article_img_url).toBe('example.com')
       })


    });
    test("assigns a default img_url if not entered in body", () => {
      const sentBody = {
        author: "lurker",
        title: "example title",
        topic: "cats",
        body: "example body",
      };
      return request(app)
      .post('/api/articles')
      .send(sentBody)
      .expect(201)
      .then((response)=>{
        const article = response.body.article
        expect(article.article_img_url).toBe("https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700")
      })
    })
    test("returns 400 bad request if missing properties in the body", ()=>{
      const sentBody = {
        author: "lurker",
        title: "example title"
      }
      return request(app)
      .post('/api/articles')
      .send(sentBody)
      .expect(400)
      .then((response)=>{
        expect(response.body.msg).toBe('Bad Request')
      })

    })
    test("returns 400 bad request if sent invalid values for author or topic", ()=>{
      const sentBody = {
        author: "invalid_user",
        title: "example title",
        topic: "invalid topic",
        body: "example body",
        article_img_url: "example.com"

      }
      return request(app)
      .post('/api/articles')
      .send(sentBody)
      .expect(400)
      .then((response)=>{
        expect(response.body.msg).toBe('Bad Request')
      })

    })

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
          expect(comments.length).toBe(10);
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
    test("Defaults to a limit of 10", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments.length).toBe(10);
        });
    });
    test("Limit can be given as query", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=5")
        .expect(200)
        .then((response) => {
          expect(response.body.comments.length).toBe(5);
        });
    });
    test("Page can be given as a query", () => {
      return request(app)
        .get("/api/articles/1/comments?p=2")
        .expect(200)
        .then((response) => {
          expect(response.body.comments.length).toBe(1);
        });
    });
    test("Page and limit queries work at the same time", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=4&p=3")
        .expect(200)
        .then((response) => {
          expect(response.body.comments.length).toBe(3);
        });
        
    });
    test("Returns 400 for invalid limit", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=cow")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('Bad Request');
        });
        
    });
    test("Returns 400 for invalid page", () => {
      return request(app)
        .get("/api/articles/1/comments?p=goose")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('Bad Request');
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
      const postData = { body: "example body", username: "butter_bridge" };
      return request(app)
        .get("/api/articles/soap/comments")
        .send(postData)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("Returns 404 not found if given a valid article_id that does not exist", () => {
      const postData = { body: "example body", username: "butter_bridge" };
      return request(app)
        .post("/api/articles/12345/comments")
        .send(postData)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not Found");
        });
    });
    test("Returns a 400 bad request when given an invalid username", () => {
      const postData = { body: "example body", username: "not_a_user" };
      return request(app)
        .post("/api/articles/2/comments")
        .send(postData)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("GET", () => {
    test("Selects a comment by given comment_id", () => {
      return request(app)
        .get("/api/comments/1")
        .expect(200)
        .then((response) => {
          const comment = response.body.comment;
          expect(comment.comment_id).toBe(1);
          expect(comment.body).toBe(
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
          );
          expect(comment.article_id).toBe(9);
          expect(comment.author).toBe("butter_bridge");
          expect(comment.votes).toBe(16);
          expect(comment.created_at).toBe("2020-04-06T12:17:00.000Z");
        });
    });
    test("Returns 404 when given valid comment_id that does not exist", () => {
      return request(app)
        .get("/api/comments/10000")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not Found");
        });
    });
    test("Returns 400 when given invalid comment_id", () => {
      return request(app)
        .get("/api/comments/gorilla")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
  });
  describe("DELETE", () => {
    test("Deletes comment at given comment_id and responds with 204 and empty response", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then((response) => {
          expect(response.body).toEqual({});
        });
    });
    test("Returns a 404 if given a comment_id that doesn't exist", () => {
      return request(app)
        .delete("/api/comments/1000")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toEqual("Not Found");
        });
    });
    test("Returns a 400 if given a comment_id that is invalid", () => {
      return request(app)
        .delete("/api/comments/hippo")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toEqual("Bad Request");
        });
    });
  });
  describe("PATCH", () => {
    test("Updates the votes on a comment by given comment_id", () => {
      const sentBody = { inc_votes: 2 };
      return request(app)
        .patch("/api/comments/1")
        .send(sentBody)
        .expect(200)
        .then((response) => {
          const comment = response.body.comment;
          expect(comment.comment_id).toBe(1);
          expect(comment.votes).toBe(18);
        });
    });
    test("responds with a 404 if given comment id that does not exist", () => {
      const sentBody = { inc_votes: 2 };
      return request(app)
        .patch("/api/comments/100000")
        .send(sentBody)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not Found");
        });
    });
    test("responds with 400 if sent an invalid body", () => {
      const sentBody = { example: 1 };
      return request(app)
        .patch("/api/comments/1")
        .send(sentBody)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
    test("responds with 400 if sent an invalid body", () => {
      const sentBody = { inc_votes: "goat" };
      return request(app)
        .patch("/api/comments/1")
        .send(sentBody)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("Responds with an object containing array of users with correct keys and 200 status code", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const users = response.body.users;
          expect(users.length).toBe(4);
          users.forEach((user) => {
            const expectedKeys = ["username", "name", "avatar_url"];
            expect(Object.keys(user)).toEqual(expectedKeys);
          });
        });
    });
  });
});

describe("/api/users/:username", () => {
  describe("GET", () => {
    test("Responds with 200 status and user matching username", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then((response) => {
          const user = response.body.user;
          expect(user.username).toBe("butter_bridge");
          expect(user.avatar_url).toBe(
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
          );
          expect(user.name).toBe("jonny");
          expect(Object.keys(user).length).toBe(3);
        });
    });
    test("Responds with a 404 when given an invalid username", () => {
      return request(app)
        .get("/api/users/not_a_user")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not Found");
        });
    });
  });
});

describe("General errors", () => {
  test("Path does not exist", () => {
    return request(app).get("/api/toast").expect(404);
  });
});
