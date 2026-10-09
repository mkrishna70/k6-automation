import http from "k6/http";
import { check } from "k6";
import { SharedArray } from "k6/data";
import { scenario } from "k6/execution";
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";

const BASE_API = "https://gorest.co.in/public/v2/users";
const TOKEN =
  "79813c3137460d9";

export const options = {
  vus: 10,
  iterations: 10, //shared iterations = default mode
};

// load external csv test data file
const csvData = new SharedArray('create data name', function () {
  // Load CSV file and parse it using Papa Parse
  return papaparse.parse(open('./createUserTestData.csv'), { header: true }).data;
});

export default function postCreateUserAPI() {
  const item = csvData[scenario.iterationInTest];

  const payLoad = JSON.stringify({
    name: item.name,
    gender: item.gender,
    email: item.email,
    status: item.status,
  });

  const params = {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const createUserResponse = http.post(`${BASE_API}`, payLoad, params);
  console.log("CREATE USER RESPONSE:=", createUserResponse.body);

  // k6 CHECKS
  check(createUserResponse, {
    "Verify if Response is 201 Created": (createUserResponse) =>
      createUserResponse.status_text == "201 Created",
  });
}
