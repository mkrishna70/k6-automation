import http from "k6/http";

const BASE_API = "https://gorest.co.in/public/v2/users";
const TOKEN =
  "79813c3137460d942bef8d7";

const payLoad = open("./post-api-payload.json");

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
