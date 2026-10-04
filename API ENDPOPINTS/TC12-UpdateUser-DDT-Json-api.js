import http from "k6/http";
import { check } from "k6";
import { SharedArray } from "k6/data";
import { scenario } from "k6/execution";

const TOKEN =
  "79813c3137460d942bef8d7536435c8bdab5ba3e57b23e24c2b950f911074025";

export const options = {
  vus: 5,
  iterations: 5, //shared iterations = default mode
};

// load external JSON test data file
const jsonData = new SharedArray("update User DDT", function () {
  return JSON.parse(open("./updateUserTestData.json"));
});

export default function patchUserUpdate() {
  const item = jsonData[scenario.iterationInTest];
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
