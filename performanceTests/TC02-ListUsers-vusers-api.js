import http from "k6/http";
import { check } from "k6"; // for assertions
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/latest/dist/bundle.js";

const BASE_API = "https://gorest.co.in/public/v2/users";
const TOKEN =
  "79813c3137460d942bef8d7536435c8bdab5ba3e57b23e24c2b950f911074025";

//How to Initialize vUsers
export const options = {
  vus: 5,
  //duration: "5s",  => how long the users should run
  iterations: 10,
  //maxDuration: "20s", //not how long the users should run,should stop within the time
  //summaryTrendStats: ["avg", "p(90)", "p(95)", "p(99.99)", "count"],
  /**
   *  Shared iterations concept [default]:
   *       vus:5
   *       iterations: 10  => 5 users shared 10 iterations
   *
   *
   *  per vus iterations concept:
   *
   *       vus:5
   *       iterations:10 => 5*10 =50
   */
};

const params = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export default function getListUsersAPI() {
  const listUsersReponse = http.get(`${BASE_API}`, params);
  console.log(
    `Response code received from the server is:` + listUsersReponse.status,
  );
  console.log(
    `Response code and text received from the server is:` +
      listUsersReponse.status_text,
  );
  //console.log(listUsersReponse.timings);
  //console.log(listUsersReponse.body);
  //console.log("Headers Info:=", listUsersReponse.headers);
  console.log("-------------------------------------------------------");
  console.log("JSON Stringify", JSON.stringify(listUsersReponse.json()));

  // k6 CHECKS
  check(listUsersReponse, {
    "Verify if Response code is 200": (listUsersReponse) =>
      listUsersReponse.status == 200,

    "Verify if Response is 200 OK": (listUsersReponse) =>
      listUsersReponse.status_text == "200 OK",

    "Verify if Response time is < 1000ms": (listUsersReponse) =>
      listUsersReponse.timings.duration < 1000,

    "Verify if Response body is not empty": (listUsersReponse) =>
      listUsersReponse.body && listUsersReponse.body.length != 0,

    "Verify if Response body is in JSON format": (listUsersReponse) =>
      listUsersReponse.headers["Content-Type"].includes("application/json"),
    // listUsersReponse.headers["Content-Type"] ==
    // "application/json; charset=utf-8",

    "Verify if Response body contains the field id ": (listUsersReponse) =>
      listUsersReponse.body.includes("id"),
    "Verify if Response body contains the field name ": (listUsersReponse) =>
      listUsersReponse.body.includes("name"),
    "Verify if Response body contains the field email ": (listUsersReponse) =>
      listUsersReponse.body.includes("email"),
    "Verify if Response body contains the field gender ": (listUsersReponse) =>
      listUsersReponse.body.includes("gender"),
    "Verify if Response body contains the field status ": (listUsersReponse) =>
      listUsersReponse.body.includes("status"),
  });
}

export function handleSummary(data) {
  return {
    createUserPerformanceTestReporthtml: htmlReport(data),
  };
}
