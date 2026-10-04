import http from "k6/http";
//importing definition of http methods from k6/http module

export default function getCall() {
  http.get("https://httpbin.org/json");
}
