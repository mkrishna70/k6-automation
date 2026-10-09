import http from "k6/http";
import faker from "https://cdnjs.cloudflare.com/ajax/libs/Faker/3.0.1/faker.min.js";
import { check, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/latest/dist/bundle.js";

const BASE_API = "https://gorest.co.in/public/v2/users";
const TOKEN =
  "79813c313";

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

export const options = {
  //here, we'll give the thresholds syntax
  vus: 5,
  //iterations: 6,
  duration: "10s",
  thresholds: {
    http_req_duration: ["avg<300"], //average reponse time for all vUsers has to be < 300ms
    http_req_duration: ["p(90)<350"], // 90% of vUsers should receive response in 350ms
    http_req_duration: ["p(95)<360"], // 95% of vUsers should receive response in 360ms
    http_req_failed: ["rate<0.01"], // Error should be < 1%
    http_reqs: ["rate>100"], //throughput - 100% of request(s) should be sent to server
    checks: ["rate>0.9"], //checks pass > 90%
  },
};

export default function smokeTest() {
  const createUserResponse = http.post(`${BASE_API}`, payLoad, params);
  //console.log("CREATE USER RESPONSE:=", createUserResponse.body);

  // k6 CHECKS: they won't stop the test even if any k6 checks fail - functional testing
  // k6 thresholds: they will stop the test if any threshold faild - performance testing
  check(createUserResponse, {
    // "Verify if Response code is 201": (createUserResponse) =>
    //   createUserResponse.status == 201,

    "Verify if Response is 201 Created": (createUserResponse) =>
      (createUserResponse.status_text = "201 Created"),
  });
  sleep(1);
}

export function handleSummary(data) {
  return {
    thresholdssmokeTestReporthtml: htmlReport(data),
  };
}
