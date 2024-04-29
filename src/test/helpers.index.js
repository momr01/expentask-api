const supertest = require("supertest");
const { app } = require("../index");
const mongoose = require("mongoose");
const { server } = require("../index");

const api = supertest(app);

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NDJiNmE5Y2QxYjc3ZTYzMTM4OTcxMCIsImlhdCI6MTcwODYzMzM2NH0._ooGVUvjuQmMFc0nD4aVK3EXM6oyA0fGGwilvR7bZGE";
const USER_ID = "6542b6a9cd1b77e631389710";

const closeServer = () => {
  mongoose.connection.close();
  server.close();
}
// const initialCategories = [
//   {
//     // _id: "657f95bfeb2568e61cf51b27",
//     name: "tarjetas de crédito",
//     // isActive: true,
//     // dataEntry: "Sun Dec 17 2023 21:43:42 GMT-0300 (hora estándar de Argentina)",
//     user: "6542b6a9cd1b77e631389710",
//   },
//   {
//     // _id: "6595cabe8e9ea37787925079",
//     name: "obra social",
//     // isActive: true,
//     // dataEntry: "Wed Jan 03 2024 17:58:22 GMT-0300 (hora estándar de Argentina)",
//     user: "6542b6a9cd1b77e631389710",
//   },
// ];

// const getAllCategories = async () => {
//   const response = await api
//     .get("/api/categories/getAll")
//     .set("Accept", "application/json")
//     .set("x-auth-token", TOKEN);

//   return {
//     names: response.body.map((category) => category.name),
//     response,
//   };
// };

module.exports = {
  api,
  TOKEN,
  USER_ID,
  closeServer
  //initialCategories,
  //getAllCategories,
};
