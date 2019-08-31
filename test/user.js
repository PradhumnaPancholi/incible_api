process.env.NODE_ENC = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
// eslint-disable-next-line no-unused-vars
const should = chai.should();
const server = require("../app");
// eslint-disable-next-line no-unused-vars
const User = require("../src/models/user");

/* chai config */
chai.use(chaiHttp);

/* To test register route */
// eslint-disable-next-line no-undef
describe("User Routes Test", () => {
  // eslint-disable-next-line no-undef
  it("Should register a new user", (done) => {
    const user = {
      firstName: "test",
      lastName: "two",
      email: "testTwo@gmail.com",
      password: "password",
      accountType: "Admin",
    };
    chai.request(server)
      .post("user/register/")
      .send(user)
      .end((err, response) => {
        response.should.have.status(200);
        done();
      });
  });
});
