const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../db/app/app.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
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

describe('General errors', ()=>{
    test('Path does not exist', ()=>{
        return request(app)
        .get("/api/toast")
        .expect(404)
      
        })

    })

