import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";
import { scenario } from "k6/execution";

// const TOKEN =
//   "79813c34025";
//load external JSON test data file using SharedArrays to improve performance
//SharedArray is more mempry-effiicent then standard JSON.parse because
//it shares the same memory address among all VUs instead of creaating a copy for each
const jsonData = new SharedArray("create User DDT", function () {
  return JSON.parse(open("./createUserTestData.json"));
});

//define perfomance testing goal
export const options = {
  scenarios: {
    sequential_test: {
      executor: "shared-iterations",
      vus: 1, //optional:Set VUs based on your concurrenct needs
      iterations: jsonData.length, //Run exactly as many times as there are data items
    },
  },
};

export default function postCreateUserAPI() {
  const BASE_API = "https://gorest.co.in/public/v2/users";
  const itemIndex = jsonData[scenario.iterationInTest];
  //const itemIndex = exec.scenario.iterationInTest
  //If you run more iterations than you have test data enties in JSON file,
  //the module operator will restart the sequence from the first item
  //cont itemIndex = exec.scenario.iterationInTest % data.length;
  //const itemIndex = jsonData[scenario.iterationInTest % data.length];

  const payLoad = JSON.stringify({
    name: itemIndex.name,
    gender: itemIndex.gender,
    email: itemIndex.email,
    status: itemIndex.status,
  });

  const params = {
    headers: {
      Authorization: `Bearer 79813c325`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const createUserResponse = http.post(`${BASE_API}`, payLoad, params);
  sleep(2);
  //printing response attributes
  //console.log(`vUser ${__VU} - Iteration ${scenario.iterationInTest}: Testing: ${itemIndex.name} with ResponseCode ${createUserResponse.status})
  console.log(
    "The reponse code & message received from server is:=",
    createUserResponse.status_text,
  );
  console.log(
    "The JSON response body received from server is",
    createUserResponse.body,
  );

  // k6 CHECKS
  check(createUserResponse, {
    [`Verify if Response is 201 Created for VU ${__VU} iteration ${scenario.iterationInTest}`]:
      (createUserResponse) => (createUserResponse.status_text = "201 Created"),
  });
}
