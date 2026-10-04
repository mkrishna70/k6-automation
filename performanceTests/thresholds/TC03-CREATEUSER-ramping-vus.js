import http from "k6/http";
import { check } from "k6";
import faker from "https://cdnjs.cloudflare.com/ajax/libs/Faker/3.0.1/faker.min.js";
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
  scenarios: {
    rampingVUScenario: {
      executor: "ramping-vus",
      startVUs: 0, //k6 is told to create 2 vUS as test starts
      stages: [
        { duration: "10s", target: 20 }, //ramp-up the vUsers from 0 to 50 in first 10seconds
        { duration: "50s", target: 40 }, //maintain the steady state of constant users hitting the server for the specified duration
        { duration: "10s", target: 0 }, //ramp-down vUsers from 50 to 0 in 10 seconds
      ],
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
