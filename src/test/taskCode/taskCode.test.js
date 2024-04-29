const { TaskCode } = require("../../model/TaskCode");
const { api, TOKEN, closeServer } = require("../helpers.index");
const { initialTaskCodes, getAllTaskcodes } = require("./helpers.taskcode");

beforeEach(async () => {
  await TaskCode.deleteMany({});

  //sequential
  for (const code of initialTaskCodes) {
    const codeObject = new TaskCode(code);
    await codeObject.save();
  }
});

describe("GET /api/task-codes/getAll", () => {
  test("should get all task codes", async () => {
    await api
      .get("/api/task-codes/getAll")
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

describe("POST /api/task-codes/add", () => {
  test("should create a new task code", async () => {
    const newTaskcode = {
      name: "enviar email",
      abbr: "email",
    };

    await api
      .post("/api/task-codes/add")
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .send(newTaskcode)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const { names, response } = await getAllTaskcodes();

    expect(response.body).toHaveLength(initialTaskCodes.length + 1);
    expect(names).toContain(newTaskcode.name);
  });

  test("should not create the task when the same name is in the body", async () => {
    const newTaskcode = {
      name: initialTaskCodes[0].name,
    };

    await api
      .post("/api/task-codes/add")
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .send(newTaskcode)
      .expect(409)
      .expect("Content-Type", /application\/json/);

    const { response } = await getAllTaskcodes();
    expect(response.body).toHaveLength(initialTaskCodes.length);
  });

  test("should get 500 http code when the name is not in the body", async () => {
    const newTaskcode = {
      abbr: "email",
    };

    await api
      .post("/api/task-codes/add")
      .set("Accept", "application/json")
      .set("x-auth-token", TOKEN)
      .send(newTaskcode)
      .expect(500)
      .expect("Content-Type", /application\/json/);

    const { response } = await getAllTaskcodes();
    expect(response.body).toHaveLength(initialTaskCodes.length);
  });
});

afterAll(async() => {
//  await TaskCode.deleteMany({});

  closeServer();
});
