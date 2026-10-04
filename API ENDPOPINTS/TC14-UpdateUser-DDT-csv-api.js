import http from "k6/http";
import { check } from "k6";
import { SharedArray } from "k6/data";
import { scenario } from "k6/execution";
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";

const TOKEN =
  "79813c3137460d942bef8d7536435c8bdab5ba3e57b23e24c2b950f911074025";

export const options = {
  vus: 10,
  iterations: 10, //shared iterations = default mode
};

// load external JSON test data file
const csvData = new SharedArray("update User DDT", function () {
  return papaparse.parse(open("./updateUserTestData.csv"), { header: true })
    .data;
});

export default function patchUserUpdate() {
  const item = csvData[scenario.iterationInTest];
  const BASE_API = `https://gorest.co.in/public/v2/users/${item.id}`;

  const payLoad = JSON.stringify({
    name: item.name,
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
  const updateUserResponse = http.patch(`${BASE_API}`, payLoad, params);
  console.log("UPDATE USER RESPONSE:=", updateUserResponse.body);
}
