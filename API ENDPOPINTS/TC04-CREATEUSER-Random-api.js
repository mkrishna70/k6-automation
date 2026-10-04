import http from "k6/http";
import { randomString } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

const BASE_API = "https://gorest.co.in/public/v2/users";
const TOKEN =
  "79813c3137460d942bef8d7536435c8bdab5ba3e57b23e24c2b950f911074025";

const genders = ["male", "female"];
const gender = genders[Math.floor(Math.random() * genders.length)];

const status = ["active", "inactive"];
const st = status[Math.floor(Math.random() * status.length)];

const payLoad = JSON.stringify({
  name: randomString(8, `ABCDEFGHIJKLMNOPabcdefghijkl`),
  gender: gender,
  email: `${randomString(8)}@test.com`,
  status: st,
});

const params = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export default function postCreateUserAPI() {
  const createUserResponse = http.post(`${BASE_API}`, payLoad, params);
  console.log("CREATE USER RESPONSE:=", createUserResponse.body);
}
