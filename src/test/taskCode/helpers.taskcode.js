const { TaskCode } = require("../../model/TaskCode");
const { api, TOKEN, USER_ID } = require("../helpers.index");

const initialTaskCodes = [
  {
    name: "pagar",
    abbr: "pagar",
    user: USER_ID,
    number: 1,
  },
  {
    name: "imprimir comprobante de pago",
    abbr: "compr. pago",
    user: USER_ID,
    number: 2,
  },
];

const getAllTaskcodes = async () => {
  const response = await api
    .get("/api/task-codes/getAll")
    .set("Accept", "application/json")
    .set("x-auth-token", TOKEN);

  return {
    names: response.body.map((code) => code.name),
    response,
  };
};

const createTaskcode = async () => {
  const newTaskcode = {
    name: "presentar declaracion jurada",
    abbr: "ddjj",
  };

  await api
    .post("/api/task-codes/add")
    .set("Accept", "application/json")
    .set("x-auth-token", TOKEN)
    .send(newTaskcode);

  const taskcode = await TaskCode.findOne({ name: newTaskcode.name });
  return taskcode;
};

module.exports = {
  initialTaskCodes,
  getAllTaskcodes,
  createTaskcode
};
