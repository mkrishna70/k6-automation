import http from "k6/http";

const BASE_API = "https://gorest.co.in/public/v2/users/8648527";
const TOKEN =
  "79813c3137460d942bef85";

const params = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

export default function deleteUser() {
  const deleteUserResponse = http.del(`${BASE_API}`, null, params);
  console.log("DELETE:=" + deleteUserResponse.status_text);
}
