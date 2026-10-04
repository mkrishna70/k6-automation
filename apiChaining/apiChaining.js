import http from "k6/http";
import faker from "https://cdnjs.cloudflare.com/ajax/libs/Faker/3.0.1/faker.min.js";
import { check, sleep } from "k6";

const BASE_API = "https://gorest.co.in/public/v2/users";
const TOKEN =
  "79813c3137460d942bef8d7536435c8bdab5ba3e57b23e24c2b950f911074025";

const postPayLoad = JSON.stringify({
  name: faker.name.firstName(),
  gender: "male",
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
//Create a User > Update the created User > delete the created User

// CREATE THE CREATED USER
export default function userJourney1() {
  const createUserResponse = http.post(`${BASE_API}`, postPayLoad, params);
  console.log("CREATE USER RESPONSE:=", createUserResponse.body);
  //Extracting the fields from the response
  const extractedID = createUserResponse.json().id;
  console.log("ID:=", extractedID);
  const extractedName = createUserResponse.json().name;
  console.log("NAME:=" + extractedName);
  const extractedEmail = createUserResponse.json().email;
  console.log("email:=", extractedEmail);

  check(createUserResponse, {
    "Verify if Response is 201 Created": (createUserResponse) =>
      createUserResponse.status_text == "201 Created",
  });
  //sleep(10);

  // UPDATE THE CREATED USER
  const updatePayLoad = JSON.stringify({
    name: `${extractedName}`,
    email: `${extractedEmail}`,
    status: "inactive",
  });

  const updateUserResponse = http.patch(
    `https://gorest.co.in/public/v2/users/${extractedID}`,
    updatePayLoad,
    params,
  );
  console.log("UPDATE USER RESPONSE:=", updateUserResponse.body);
  console.log("User Id:=" + updateUserResponse.json().id);
  //sleep(10);

  //DELETE THE CREATED USER

  const deleteUserResponse = http.del(
    `https://gorest.co.in/public/v2/users/${extractedID}`,
    null,
    params,
  );
  console.log("DELETE:=" + deleteUserResponse.status_text);
}
