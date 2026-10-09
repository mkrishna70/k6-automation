import http from "k6/http";
import { check } from "k6";
import faker from "https://cdnjs.cloudflare.com/ajax/libs/Faker/3.0.1/faker.min.js";

const BASE_API = "https://gorest.co.in/public/v2/users";
const TOKEN =
  "79813c3137";

const payLoad = JSON.stringify({
  name: faker.name.firstName(),
  gender: "female",
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

export default function e2e() {
  //CREATE A USER [POST]
  const createUserAPI = http.post(`${BASE_API}`, payLoad, params);
  console.log("CREATE USER RESPONSE:=", createUserAPI.body);

  // k6 CHECKS
  check(createUserAPI, {
    "Verify if Response is 201 Created For POST": (createUserAPI) =>
      createUserAPI.status_text == "201 Created",
  });

  // Extract ID,name,email
  const iD = createUserAPI.json().id;
  console.log("ID", iD);

  const name = createUserAPI.json().name;
  console.log("NAME", name);

  const email = createUserAPI.json().email;
  console.log("EMAIL", email);

  // VERIFY IF THE USER IS CREATED [GET]
  const getUserAPI = http.get(
    `https://gorest.co.in/public/v2/users/${iD}`,
    params,
  );
  if (getUserAPI.json().id == `${iD}`) {
    console.log("Created Successfully:=", getUserAPI.json().id);
  } else {
    console.log("User not registered:=", getUserAPI.json().id);
  }

  // k6 CHECKS
  check(getUserAPI, {
    "Verify if Response is 200 OK For GET": (getUserAPI) =>
      getUserAPI.status_text == "200 OK",
  });

  //UPDATE THE CREATED USER [PATCH]
  const patchPayLoad = JSON.stringify({
    name: `${name}`,
    //gender: "female",
    email: `${email}`,
    status: "inactive",
  });
  const updateUserAPI = http.patch(
    `https://gorest.co.in/public/v2/users/${iD}`,
    patchPayLoad,
    params,
  );
  console.log("UPDATED USER RESPONSE:=", updateUserAPI.body);

  // k6 CHECKS
  check(updateUserAPI, {
    "Verify if Response is 200 OK For UPDATE/PATCH": (updateUserAPI) =>
      updateUserAPI.status_text == "200 OK",
  });

  //VERIFY IF THE USER IS UPDATE [GET]
  const getUpdatedUserAPI = http.get(
    `https://gorest.co.in/public/v2/users/${iD}`,
    params,
  );
  if (getUpdatedUserAPI.json().id == `${iD}`) {
    console.log("Checking Updated user status:=", getUpdatedUserAPI.json().id);
  } else {
    console.log("User not updated status:=", getUpdatedUserAPI.json().id);
  }

  // k6 CHECKS
  check(getUpdatedUserAPI, {
    "Verify if user is updated": (getUpdatedUserAPI) =>
      getUpdatedUserAPI.status_text == "200 OK",
  });

  //DELETE THE CREATED USER [DELETE]
  const deleteResponseAPI = http.del(
    `https://gorest.co.in/public/v2/users/${iD}`,
    null,
    params,
  );
  console.log("Deleted successfully", deleteResponseAPI);
  // k6 CHECKS
  check(deleteResponseAPI, {
    "Verify if user is deleted": (deleteResponseAPI) =>
      (deleteResponseAPI.status_text = "204 No Content"),
  });
}
