const { Category } = require("../../model/Category");
const { Name } = require("../../model/NamePayment");
const { TaskCode } = require("../../model/TaskCode");
const { initialCategories } = require("../category/helpers.category");
const { api, TOKEN, USER_ID } = require("../helpers.index");
const { initialTaskCodes } = require("../taskCode/helpers.taskcode");

const getAllNames = async () => {
  const response = await api
    .get("/api/names/getAll")
    .set("Accept", "application/json")
    .set("x-auth-token", TOKEN);

  return {
    names: response.body.map((name) => name.name),
    response,
  };
};

const createOneName = async (categoryId, taskcodeId) => {
  const newName = {
    name: "Seguro Tres Provincias",
    categoryId: categoryId,
    defaultTasks: [taskcodeId],
    user: USER_ID,
  };

  await api
    .post("/api/names/add")
    .set("Accept", "application/json")
    .set("x-auth-token", TOKEN)
    .send(newName);

  const response = await Name.findOne({ name: newName.name });

  return response;
};

const createCategoryCodeName = async () => {
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
    .send(newName);

  const name = await Name.findOne({ name: newName.name });

  return { category, taskcode, name };
};

module.exports = { getAllNames, createOneName, createCategoryCodeName };
