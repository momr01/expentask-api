const { Category } = require("../../model/Category");
const { Name } = require("../../model/NamePayment");
const { TaskCode } = require("../../model/TaskCode");
const {
  createCategory,
  initialCategories,
} = require("../category/helpers.category");
const { api, TOKEN, USER_ID, closeServer, api500 } = require("../helpers.index");
const {
  createTaskcode,
  initialTaskCodes,
} = require("../taskCode/helpers.taskcode");
const {
  getAllNames,
  createOneName,
  createCategoryCodeName,
} = require("./helpers.name");

beforeEach(async () => {
  await Category.deleteMany({});
  await TaskCode.deleteMany({});
  await Name.deleteMany({});

  for (const category of initialCategories) {
    const categoryObject = new Category(category);
    await categoryObject.save();
  }

  for (const code of initialTaskCodes) {
    const codeObject = new TaskCode(code);
    await codeObject.save();
  }
});

describe("POST /api/names/add", () => {
  test("a valid name can be added", async () => {
    const category = await Category.findOne({
      name: initialCategories[0].name,
    });
    const taskcode = await TaskCode.findOne({ name: initialTaskCodes[0].name });

    const newName = {
      name: "Seguro Tres Provincias",
      categoryId: category._id,
      defaultTasks: [taskcode._id],
      user: USER_ID,
    };

    await api
      .post("/api/names/add")
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .send(newName)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const { names, response } = await getAllNames();

    expect(response.body).toHaveLength(1);
    expect(names).toContain(newName.name);
  });

  test("is not allowed to add a name with same data than an existing name", async () => {
    const { category, taskcode } = await createCategoryCodeName();

    const newName = {
      name: "Seguro Tres Provincias",
      categoryId: category._id,
      defaultTasks: [taskcode._id],
      user: USER_ID,
    };

    const response = await api
      .post("/api/names/add")
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .send(newName);

    expect(response.status).toBe(409);
    expect(response.body.message).not.toBeNull();
    expect(response.body.message).toBe("A name with same data already exists.");
    expect(response.headers["content-type"]).toContain("application/json");
  });

  test("user must provide an existing category id to create one name", async () => {
    const taskcode = await TaskCode.findOne({ name: initialTaskCodes[0].name });

    const newName = {
      name: "Seguro Tres Provincias",
      categoryId: USER_ID,
      defaultTasks: [taskcode._id],
      user: USER_ID,
    };

    const response = await api
      .post("/api/names/add")
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .send(newName);

    expect(response.status).toBe(400);
    expect(response.body.message).not.toBeNull();
    expect(response.body.message).toBe("The category doesn't exist.");
    expect(response.headers["content-type"]).toContain("application/json");
  });

  test("user must provide at least one taskcode id to create one name", async () => {
    const category = await Category.findOne({
      name: initialCategories[0].name,
    });

    const newName = {
      name: "Seguro Tres Provincias",
      categoryId: category._id,
      defaultTasks: [],
      user: USER_ID,
    };

    const response = await api
      .post("/api/names/add")
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .send(newName);

    expect(response.status).toBe(400);
    expect(response.body.message).not.toBeNull();
    expect(response.body.message).toBe(
      "There is a problem with the default tasks."
    );
    expect(response.headers["content-type"]).toContain("application/json");
  });

  test("the default tasks have to be unique", async () => {
    const category = await Category.findOne({
      name: initialCategories[0].name,
    });

    const taskcode = await TaskCode.findOne({ name: initialTaskCodes[0].name });

    const newName = {
      name: "Seguro Tres Provincias",
      categoryId: category._id,
      defaultTasks: [taskcode._id, taskcode._id],
      user: USER_ID,
    };

    const response = await api
      .post("/api/names/add")
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .send(newName);

    expect(response.status).toBe(400);
    expect(response.body.message).not.toBeNull();
    expect(response.body.message).toBe("You can not duplicate the tasks.");
    expect(response.headers["content-type"]).toContain("application/json");
  });

  test("the default tasks have to exist", async () => {
    const category = await Category.findOne({
      name: initialCategories[0].name,
    });

    const taskcode = await TaskCode.findOne({ name: initialTaskCodes[0].name });

    const newName = {
      name: "Seguro Tres Provincias",
      categoryId: category._id,
      defaultTasks: [taskcode._id, USER_ID],
      user: USER_ID,
    };

    const response = await api
      .post("/api/names/add")
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .send(newName);

    expect(response.status).toBe(400);
    expect(response.body.message).not.toBeNull();
    expect(response.body.message).toBe(
      "There is a problem with the default tasks."
    );
    expect(response.headers["content-type"]).toContain("application/json");
  });

  test("should return 500 http code when you do not give the required data", async () => {
    const category = await Category.findOne({
      name: initialCategories[0].name,
    });

    const taskcode = await TaskCode.findOne({ name: initialTaskCodes[0].name });

    const newName = {
      categoryId: category._id,
      defaultTasks: [taskcode._id],
      user: USER_ID,
    };

    const response = await api
      .post("/api/names/add")
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .send(newName);

    expect(response.status).toBe(500);
    expect(response.body.message).not.toBeNull();
    expect(response.headers["content-type"]).toContain("application/json");
  });
});

describe("GET /api/names/get/:id", () => {
  test("should return the data from one name", async () => {
    const category = await Category.findOne({
      name: initialCategories[0].name,
    });
    const taskcode = await TaskCode.findOne({ name: initialTaskCodes[0].name });
    const name = await createOneName(category._id, taskcode._id);

    await api
      .get(`/api/names/get/${name._id}`)
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("should return 500 http code when you do not give the name id", async () => {
    const response = await api
      .get(`/api/names/get/1`)
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN);

    expect(response.status).toBe(500);
    expect(response.body.message).not.toBeNull();
    expect(response.headers["content-type"]).toContain("application/json");
  });
});

describe("PUT /api/names/editName/:id", () => {
  test("an existing name can be edited", async () => {
    const { name } = await createCategoryCodeName();

    const newDataName = {
      name: "Seguro Tres Provincias modificado",
      category: name.category,
      defaultTasks: name.defaultTasks,
    };

    const result = await api
      .put(`/api/names/editName/${name._id}`)
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .send(newDataName);

    expect(result.status).toBe(201);
    expect(result.body.message).not.toBeNull();
    expect(result.body.message).toBe("Name updated successfully.");
    expect(result.headers["content-type"]).toContain("application/json");

    const { names, response } = await getAllNames();

    expect(response.body).toHaveLength(1);
    expect(names).toContain(newDataName.name);
    expect(names).not.toContain(name.name);
  });

  test("should return 400 http code because the name does not exist.", async () => {
    const response = await api
      .put(`/api/names/editName/${USER_ID}`)
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN);

    expect(response.status).toBe(400);
    expect(response.body.message).not.toBeNull();
    expect(response.body.message).toBe("The name does not exist.");
    expect(response.headers["content-type"]).toContain("application/json");
  });

  test("should return 400 http code because the category id does not exist.", async () => {
    const { name } = await createCategoryCodeName();

    const newDataName = {
      name: "Seguro Tres Provincias modificado",
      category: USER_ID,
      defaultTasks: name.defaultTasks,
    };

    const result = await api
      .put(`/api/names/editName/${name._id}`)
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .send(newDataName);

    expect(result.status).toBe(400);
    expect(result.body.message).not.toBeNull();
    expect(result.body.message).toBe("The category does not exist.");
    expect(result.headers["content-type"]).toContain("application/json");

    const { names, response } = await getAllNames();

    expect(response.body).toHaveLength(1);
    expect(names).toContain(name.name);
    expect(names).not.toContain(newDataName.name);
  });

  test("should return 400 http code because the default tasks array is empty.", async () => {
    const { name } = await createCategoryCodeName();

    const newDataName = {
      name: "Seguro Tres Provincias modificado",
      category: name.category,
      defaultTasks: [],
    };

    const result = await api
      .put(`/api/names/editName/${name._id}`)
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .send(newDataName);

    expect(result.status).toBe(400);
    expect(result.body.message).not.toBeNull();
    expect(result.body.message).toBe(
      "There is a problem with the default tasks."
    );
    expect(result.headers["content-type"]).toContain("application/json");

    const { names, response } = await getAllNames();

    expect(response.body).toHaveLength(1);
    expect(names).toContain(name.name);
    expect(names).not.toContain(newDataName.name);
  });

  test("should return 400 http code because at least one default task does not exist.", async () => {
    const { name } = await createCategoryCodeName();

    const newDataName = {
      name: "Seguro Tres Provincias modificado",
      category: name.category,
      defaultTasks: [name.category],
    };

    const result = await api
      .put(`/api/names/editName/${name._id}`)
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .send(newDataName);

    expect(result.status).toBe(400);
    expect(result.body.message).not.toBeNull();
    expect(result.body.message).toBe(
      "There is a problem with the default tasks."
    );
    expect(result.headers["content-type"]).toContain("application/json");

    const { names, response } = await getAllNames();

    expect(response.body).toHaveLength(1);
    expect(names).toContain(name.name);
    expect(names).not.toContain(newDataName.name);
  });

  test("should return 500 http code because the name id is not part of params", async () => {
    const { name } = await createCategoryCodeName();

    const newDataName = {
      name: "Seguro Tres Provincias modificado",
      category: name.category,
      defaultTasks: [name.category],
    };

    const result = await api
      .put(`/api/names/editName/1`)
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .send(newDataName);

    expect(result.status).toBe(500);
    expect(result.body.message).not.toBeNull();
    expect(result.headers["content-type"]).toContain("application/json");

    const { names, response } = await getAllNames();

    expect(response.body).toHaveLength(1);
    expect(names).toContain(name.name);
    expect(names).not.toContain(newDataName.name);
  });
});

describe("PUT /api/names/disableName/:id", () => {
  test("change isActive value of an existing name, turn to False", async () => {
    const { name } = await createCategoryCodeName();

    const result = await api
      .put(`/api/names/disableName/${name._id}`)
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN);

    expect(result.status).toBe(200);
    expect(result.body.message).not.toBeNull();
    expect(result.body.message).toBe("Name was disabled successfully!");
    expect(result.headers["content-type"]).toContain("application/json");

    const nameDisabled = await Name.findOne({ name: name.name });
    expect(nameDisabled.isActive).not.toBeTruthy();

    const { names, response } = await getAllNames();
    expect(response.body).toHaveLength(0);
    expect(names).not.toContain(name.name);
  });

  test("the name is already inactive, so it can not be disabled", async () => {
    const { name } = await createCategoryCodeName();

    await api
      .put(`/api/names/disableName/${name._id}`)
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN);

    const result = await api
      .put(`/api/names/disableName/${name._id}`)
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN);

    expect(result.status).toBe(400);
    expect(result.body.message).not.toBeNull();
    expect(result.body.message).toBe(
      "The name doesn't exist or is already inactive."
    );
    expect(result.headers["content-type"]).toContain("application/json");

    const nameDisabled = await Name.findOne({ name: name.name });
    expect(nameDisabled.isActive).not.toBeTruthy();

    const { names, response } = await getAllNames();
    expect(response.body).toHaveLength(0);
    expect(names).not.toContain(name.name);
  });

  test("the name does not exist, so it can not be disabled", async () => {
    const result = await api
      .put(`/api/names/disableName/${USER_ID}`)
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN);

    expect(result.status).toBe(400);
    expect(result.body.message).not.toBeNull();
    expect(result.body.message).toBe(
      "The name doesn't exist or is already inactive."
    );
    expect(result.headers["content-type"]).toContain("application/json");
  });

  test("should return 500 http code when the format of name id is not correct", async () => {
    const result = await api
      .put(`/api/names/disableName/1`)
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN);

    expect(result.status).toBe(500);
    expect(result.body.message).not.toBeNull();
    expect(result.headers["content-type"]).toContain("application/json");
  });
});

afterAll(() => {
  closeServer();
});
