const request = require("supertest");
const app = require("./index");

describe("names", () => {
  test.skip("should create a new name", async () => {
    const result = await request(app)
      .post("/api/names/add")
      .send({
        name: "Seguro rivadaviasss",
        categoryId: "654407a2e9735d637d449b6e",
      })
      .set("Accept", "application/json")
      .expect(201);

    expect(result.body).toEqual({
      name: "Seguro rivadaviasss",
      category: "654407a2e9735d637d449b6e",
    });
    expect(result.body.name).toEqual("Seguro rivadaviasss");
    expect(result.body.category).toEqual("654407a2e9735d637d449b6e");
  });

  it("should get all names", async () => {
    const result = await request(app).get("/api/names/getAll").expect(200);

    expect(result.body).toContainEqual({
      name: "Seguro rivadaviasss",
      category: "654407a2e9735d637d449b6e",
    });
  });
});

describe("categories", () => {
  test.skip("should create a new category", async () => {
    const result = await request(app)
      .post("/api/categories/add")
      .send({
        name: "tarjetas de crédito",
      })
      .set("Accept", "application/json")
      .expect(201);

    expect(result.body.name).toEqual("tarjetas de crédito");
    expect(result.body.isActive).toEqual(true);
  });
});

describe("payments", () => {
  it("should get all active and undone payments", async () => {
    const result = await request(app)
      .get("/api/payments/getUndonePayments")
      .expect(200);

      //los pagos listados esten incompletos
    for (let index = 0; index < result.body.length; index++) {
      expect(result.body[index].isCompleted).toEqual(false);
    }

    //los pagos listados solo muestren las tareas activas
    for (let index = 0; index < result.body.length; index++) {
      for (let index2 = 0; index2 < result.body[index].tasks.length; index2++) {
        expect(result.body[index].tasks[index2].isActive).toEqual(true);
      }
    }

    //los nombres de los pagos esten activos
    for (let index = 0; index < result.body.length; index++) {
      expect(result.body[index].name[0].isActive).toEqual(true);
    }
  });

  // it("should complete one task", async () => {
  //   const result = await request(app)
  //   .put("/api/payments/completeTask/")
  // })
});
