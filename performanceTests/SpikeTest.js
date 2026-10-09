import http from "k6/http";
import { check, sleep } from "k6"; // for assertions
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/latest/dist/bundle.js";

const BASE_API = "https://gorest.co.in/public/v2/users";
const TOKEN =
  "79813c3137";

const params = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export const options = {
  stages: [
    { duration: "8s", target: 60 }, //ramp-up vUsers -> 10 users should hit in 8s
    { duration: "8s", target: 50 }, //ramp-down vUsers
  ],
   thresholds: {
    http_req_duration: ["avg<300"], //average reponse time for all vUsers has to be < 300ms
    //http_req_duration: ["p(90)<350"], // 90% of vUsers should receive response in 350ms
    // http_req_duration: ["p(95)<360"], // 95% of vUsers should receive response in 360ms
    http_req_failed: ["rate<0.01"], // Error should be < 1%
    //http_reqs: ["rate>100"], //throughput - 100% of request(s) should be sent to server
    checks: ["rate>0.9"], //checks pass > 90%
  },
};

export default function spikeTest() {
  const listUsersReponse = http.get(`${BASE_API}`, params);

  // k6 CHECKS
  check(listUsersReponse, {
    "Verify if Response is 200 OK": (listUsersReponse) =>
      listUsersReponse.status_text == "200 OK",
  });

  sleep(Math.random() * 9); //think time
}

export function handleSummary(data) {
  return {
    loadTestReporthtml: htmlReport(data),
  };
}
