const { Category } = require("../../model/Category");
const { api, TOKEN, USER_ID } = require("../helpers.index");

const initialCategories = [
  {
    name: "tarjetas de crédito",
    user: USER_ID,
  },
  {
    name: "obra social",
    user: USER_ID,
  },
];

const getAllCategories = async () => {
  const response = await api
    .get("/api/categories/getAll")
    .set("Accept", "application/json")
    .set("x-auth-token", TOKEN);

  return {
    names: response.body.map((category) => category.name),
    response,
  };
};

const createCategory = async () => {
  const newCategory = {
    name: "alquileres",
    user: USER_ID,
  };

  await api
    .post("/api/categories/add")
    .set("Accept", "application/json")
    .set("x-auth-token", TOKEN)
    .send(newCategory);

  const category = await Category.findOne({ name: newCategory.name });
  return category;
}

module.exports = {
  initialCategories,
  getAllCategories,
  createCategory
};
