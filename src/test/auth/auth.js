const { User } = require("../../model/User");
const { api, TOKEN, closeServer } = require("../helpers.index");
const { initialUsers } = require("./helpers.auth");

beforeEach(async () => {
  //await TaskCode.deleteMany({});

  //sequential
  for (const user of initialUsers) {
    const userObject = new User(user);
    await userObject.save();
  }
});

describe("POST /api/signin", () => {
  test("should login successfully", async () => {
    const user = {
      email: initialUsers[0].name,
      password: "12345678",
    };

    await api
      .post("/api/signin")
      .set("Accept", "application/json")
      .send(user)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

afterAll(() => {
  closeServer;
});
