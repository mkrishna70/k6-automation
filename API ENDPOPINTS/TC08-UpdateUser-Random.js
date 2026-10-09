import http from "k6/http";
import { randomString } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

const BASE_API = "https://gorest.co.in/public/v2/users/8643368";
const TOKEN =
  "79813c3137460d942bef874025";

const payLoad = JSON.stringify({
  name: randomString(8),
  gender: "Male",
  email: `${randomString(8)}@test.com`,
  status: "inactive",
});

const params = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export default function patchUserUpdate() {
  const updateUserResponse = http.patch(`${BASE_API}`, payLoad, params);
  console.log("UPDATE USER RESPONSE:=", updateUserResponse.body);
}
