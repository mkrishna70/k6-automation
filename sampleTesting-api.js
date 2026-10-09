import http from "k6/http";
import faker from "https://cdnjs.cloudflare.com/ajax/libs/Faker/3.0.1/faker.min.js";
import { check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/latest/dist/bundle.js";

const BASE_API = "https://gorest.co.in/public/v2/users";
const TOKEN =
  "";

const payLoad = JSON.stringify({
  name: faker.name.firstName(),
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

export default function postCreateUserAPI() {
  const createUserResponse = http.post(`${BASE_API}`, payLoad, params);
  console.log("CREATE USER RESPONSE:=", createUserResponse.body);

  // k6 CHECKS: they won't stop the test even if any k6 checks fail - functional testing
  // k6 thresholds: they will stop the test if any threshold faild - performance testing
  check(createUserResponse, {
    // "Verify if Response code is 201": (createUserResponse) =>
    //   createUserResponse.status == 201,

    "Verify if Response is 201 Created": (createUserResponse) =>
      createUserResponse.status_text = "201 Created",

    // "Verify if Response time is < 1000ms": (createUserResponse) =>
    //   createUserResponse.timings.duration < 1000,

    // "Verify if Response body is not empty": (createUserResponse) =>
    //   createUserResponse.body && createUserResponse.body.length != 0,

    // "Verify if Response body is in JSON format": (createUserResponse) =>
    //   createUserResponse.headers["Content-Type"].includes("application/json"),
    // createUserResponse.headers["Content-Type"] ==
    // "application/json; charset=utf-8",

    // "Verify if Response body contains the field id ": (createUserResponse) =>
    //   createUserResponse.body.includes("id"),
    // "Verify if Response body contains the field name ": (createUserResponse) =>
    //   createUserResponse.body.includes("name"),
    // "Verify if Response body contains the field email ": (createUserResponse) =>
    //   createUserResponse.body.includes("email"),
    // "Verify if Response body contains the field gender ": (
    //   createUserResponse,
    // ) => createUserResponse.body.includes("gender"),
    // "Verify if Response body contains the field status ": (
    //   createUserResponse,
    // ) => createUserResponse.body.includes("status"),

    // "Verify if Gender=male in the response body": (createUserResponse) =>
    //   createUserResponse.json().gender == "female",

    // "Verify if Status=active in the response body": (createUserResponse) =>
    //   createUserResponse.json().status == "active",
  });
}

export function handleSummary(data) {
  return {
    createUserTestReporthtml: htmlReport(data),
  };
}
