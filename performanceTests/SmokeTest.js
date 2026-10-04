import http from "k6/http";
import faker from "https://cdnjs.cloudflare.com/ajax/libs/Faker/3.0.1/faker.min.js";
import { check, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/latest/dist/bundle.js";

const BASE_API = "https://gorest.co.in/public/v2/users";
const TOKEN =
  "79813c3137460d942bef8d7536435c8bdab5ba3e57b23e24c2b950f911074025";

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
  vus: 5, // 5 vUsers will be created
  //duration: "10s", // the vUsers will execute the API for 10seconds duration
  //discardResponseBodies: true, //k6 will not store the response body & this optimizes memory consumption
  iterations: 6, //total of 6 iterations will be executed
  thresholds: {
    //http_req_duration: ["avg<300"], //average reponse time for all vUsers has to be < 300ms
    // http_req_duration: ["p(90)<350"], // 90% of vUsers should receive response in 350ms
    http_req_duration: ["p(95)<360"], // 95% of vUsers should receive response in 360ms
    http_req_failed: ["rate<0.3"], // Error should be < 30%
    //http_reqs: ["rate>100"], //throughput - 100% of request(s) should be sent to server
    checks: ["rate>0.95"], //checks pass > 95%
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
    smokeTestReporthtml: htmlReport(data),
  };
}
