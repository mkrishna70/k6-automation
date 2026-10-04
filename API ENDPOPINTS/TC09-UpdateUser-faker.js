import http from "k6/http";
import faker from "https://cdnjs.cloudflare.com/ajax/libs/Faker/3.0.1/faker.min.js";

const BASE_API = "https://gorest.co.in/public/v2/users/8642788";
const TOKEN =
  "79813c3137460d942bef8d7536435c8bdab5ba3e57b23e24c2b950f911074025";

const payLoad = JSON.stringify({
  name: faker.name.firstName() + " " + faker.name.lastName(),
  gender: "female",
  email: faker.internet.email(),
  status: "active",
});

const params = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export default function patchUserUpdate() {
  const updateUserResponse = http.patch(`${BASE_API}`, payLoad, params);
  console.log("UPDATE USER RESPONSE:=", updateUserResponse.body);
}
