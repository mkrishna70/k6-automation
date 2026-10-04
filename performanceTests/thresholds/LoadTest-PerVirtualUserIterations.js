import http from "k6/http";
import { check, sleep } from "k6"; // for assertions
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/latest/dist/bundle.js";

const BASE_API = "https://gorest.co.in/public/v2/users";
const TOKEN =
  "79813c3137460d942bef8d7536435c8bdab5ba3e57b23e24c2b950f911074025";

const params = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export const options = {
  scenarios: {
    perVUIterationsScenario: {
      executor: "per-vu-iterations",
      vus: 5, //5 vUsers will be created
      iterations: 10, // total of 0 iterations wille be executed
      //maxDurations:'30s'  performance test should stop after 30seconds
    },
  },
  thresholds: {
    http_req_duration: [{ threshold: "avg<300", abortOnFail: true }], //average reponse time for all vUsers has to be < 300ms
    http_req_duration: [{ threshold: "p(90)<400", abortOnFail: true }], // 90% of vUsers should receive response in 350ms
    http_req_duration: [{ threshold: "p(95)<500", abortOnFail: false }], // 95% of vUsers should receive response in 360ms
    http_req_failed: [{ threshold: "rate<0.01", abortOnFail: true }], // Error should be < 1%
    //http_reqs: ["rate>100"], //throughput - 100% of request(s) should be sent to server
    checks: [{ threshold: "rate>0.9", abortOnFail: false }], //checks pass > 90%
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
    perVUIterationsTestReporthtml: htmlReport(data),
  };
}
