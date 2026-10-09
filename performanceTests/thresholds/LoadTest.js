import http from "k6/http";
import { check, sleep } from "k6"; // for assertions
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/latest/dist/bundle.js";

const BASE_API = "https://gorest.co.in/public/v2/users";
const TOKEN =
  "79813c35";

const params = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export const options = {
  stages: [
    { duration: "5s", target: 10 }, //ramp-up vUsers -> 10 users should hit in 8s
    { duration: "15s", target: 10 }, //maintain the steady state of constant users hitting the server for the specified duration
    { duration: "5s", target: 0 }, //ramp-down vUsers
  ],

  thresholds: {
    http_req_duration: [{ thresholds: "avg<300", abortOnFail: true }], //average reponse time for all vUsers has to be < 300ms
    http_req_duration: [{ thresholds: "p(90)<400", abortOnFail: true }], // 90% of vUsers should receive response in 350ms
    http_req_duration: [{ thresholds: "p(95)<500", abortOnFail: false }], // 95% of vUsers should receive response in 360ms
    http_req_failed: [{ thresholds: "rate<0.01", abortOnFail: true }], // Error should be < 1%
    //http_reqs: ["rate>100"], //throughput - 100% of request(s) should be sent to server
    checks: [{ thresholds: "rate>0.9", abortOnFail: false }], //checks pass > 90%
  },
};

export default function loadTest() {
  const listUsersReponse = http.get(`${BASE_API}`, params);

  // k6 CHECKS
  check(listUsersReponse, {
    "Verify if Response is 200 OK": (listUsersReponse) =>
      listUsersReponse.status_text == "200 OK",
  });

  sleep(Math.random() * 5); //think time
}

export function handleSummary(data) {
  return {
    loadTestReporthtml: htmlReport(data),
  };
}
