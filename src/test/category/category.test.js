const { Category } = require("../../model/Category");
const { api, TOKEN, USER_ID, closeServer } = require("../helpers.index");
const { initialCategories, getAllCategories } = require("./helpers.category");

beforeEach(async () => {
  await Category.deleteMany({});

  //sequential
  for (const category of initialCategories) {
    const categoryObject = new Category(category);
    await categoryObject.save();
  }
});

describe("GET /api/categories/getAll", () => {
  test("should get all categories", async () => {
    await api
      .get("/api/categories/getAll")
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there are two categories", async () => {
    const { response } = await getAllCategories();
    expect(response.body).toHaveLength(initialCategories.length);
  });

  test("the first category is about tarjetas de credito", async () => {
    const { names } = await getAllCategories();
    expect(names).toContain("tarjetas de crédito");
  });

});

describe("POST /api/categories/add", () => {
  test("a valid category can be added", async () => {
    const newCategory = {
      name: "servicios",
      user: USER_ID,
    };

    await api
      .post("/api/categories/add")
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .send(newCategory)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const { names, response } = await getAllCategories();

    expect(response.body).toHaveLength(initialCategories.length + 1);
    expect(names).toContain(newCategory.name);
  });

  test("category without name is not added", async () => {
    const newCategory = {
      user: USER_ID,
    };

    await api
      .post("/api/categories/add")
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .send(newCategory)
      .expect(400);

    const { response } = await getAllCategories();

    expect(response.body).toHaveLength(initialCategories.length);
  });

  test("category that already exists is not added", async () => {
    await api
      .post("/api/categories/add")
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .send(initialCategories[0])
      .expect(409);

    const { response } = await getAllCategories();
    expect(response.body).toHaveLength(initialCategories.length);
  });
});

afterAll(async () => {
  // mongoose.connection.close();
  // server.close();
 // await Category.deleteMany({});
  closeServer();


});
