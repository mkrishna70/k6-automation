import http from "k6/http";
import { check } from "k6";

const BASE_API = "https://gorest.co.in/public/v2/users";
const TOKEN =
  "79813c3137460d942bef8d7536435c8bdab5ba3e57b23e24c2b950f911074025";

const payLoad = JSON.stringify({
  name: "krishna",
  gender: "male",
  email: "sample110@test.com",
  status: "active",
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

  // k6 CHECKS
  check(createUserResponse, {
    "Verify if Response code is 201": (createUserResponse) =>
      createUserResponse.status == 201,

    "Verify if Response is 201 Created": (createUserResponse) =>
      createUserResponse.status_text == "201 Created",

    "Verify if Response time is < 1000ms": (createUserResponse) =>
      createUserResponse.timings.duration < 1000,

    "Verify if Response body is not empty": (createUserResponse) =>
      createUserResponse.body && createUserResponse.body.length != 0,

    "Verify if Response body is in JSON format": (createUserResponse) =>
      createUserResponse.headers["Content-Type"].includes("application/json"),
    // createUserResponse.headers["Content-Type"] ==
    // "application/json; charset=utf-8",

    "Verify if Response body contains the field id ": (createUserResponse) =>
      createUserResponse.body.includes("id"),
    "Verify if Response body contains the field name ": (createUserResponse) =>
      createUserResponse.body.includes("name"),
    "Verify if Response body contains the field email ": (createUserResponse) =>
      createUserResponse.body.includes("email"),
    "Verify if Response body contains the field gender ": (
      createUserResponse,
    ) => createUserResponse.body.includes("gender"),
    "Verify if Response body contains the field status ": (
      createUserResponse,
    ) => createUserResponse.body.includes("status"),

    "Verify if Gender=male in the response body": (createUserResponse) =>
      createUserResponse.json().gender == "male",

    "Verify if Status=active in the response body": (createUserResponse) =>
      createUserResponse.json().status == "active",
  });
}
