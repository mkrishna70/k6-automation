import http from "k6/http";
import { check } from "k6";
import faker from "https://cdnjs.cloudflare.com/ajax/libs/Faker/3.0.1/faker.min.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/latest/dist/bundle.js";

const BASE_API = "https://gorest.co.in/public/v2/users";
const TOKEN =
  "79813c313746";

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
  scenarios: {
    constantArrivalRateScenario: {
      executor: "constant-arrival-rate",
      duration: "20s", // overalll load test duration
      rate: 2, //how many iterations per timeUnit specified
      timeUnit: "1s", //iterations per second to execute
      preAllocatedVUs: 2, //pre-allocate
      maxVUs: 10, //total vUsers to be created during the load test
    },
  },
  // thresholds: {
  //   http_req_duration: [{ threshold: "avg<300", abortOnFail: true }], //average reponse time for all vUsers has to be < 300ms
  //   http_req_duration: [{ threshold: "p(90)<400", abortOnFail: true }], // 90% of vUsers should receive response in 350ms
  //   http_req_duration: [{ threshold: "p(95)<500", abortOnFail: false }], // 95% of vUsers should receive response in 360ms
  //   http_req_failed: [{ threshold: "rate<0.01", abortOnFail: true }], // Error should be < 1%
  //   //http_reqs: ["rate>100"], //throughput - 100% of request(s) should be sent to server
  //   checks: [{ threshold: "rate>0.9", abortOnFail: false }], //checks pass > 90%
  // },
};

export default function smokeTestRampingVUS() {
  const createUserResponse = http.post(`${BASE_API}`, payLoad, params);
  console.log("CREATE USER RESPONSE:=", createUserResponse.body);

  // k6 CHECKS
  check(createUserResponse, {
    "Verify if Response code is 201": (createUserResponse) =>
      createUserResponse.status == 201,

    "Verify if Response is 201 Created": (createUserResponse) =>
      createUserResponse.status_text == "201 Created",
  });
}

export function handleSummary(data) {
  return {
    rampingVUsTestReporthtml: htmlReport(data),
  };
}
