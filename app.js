//Express
const express = require("express");
const bodyParser = require('body-parser')
const https = require("https");
//require mailchimp
const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: "725ec080410603e218ae2877813d8b50-us14",
  server: "us14",
})

//4255cb21a7 List ID
const app = express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({
  extended: true
})); //Parse URL-encoded bodies
//replaced app.use(bodyParser.urlencoded({extended:true}));

//HOME
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

//POST ROUTE
app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  console.log(firstName, lastName, email);

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  }

  const run = async () => {
    try {
      const response = await mailchimp.lists.addListMember("4255cb21a7", {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });
      // console.log(response.statusCode);
      console.log(response)
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log("====== ERROR ======");
      console.log(JSON.parse(err.response.text).title);
      console.log("====== ERROR ======");
      res.sendFile(__dirname + "/fail.html");
    }
  }; run();
});

//FAILURE ROUTE
app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("server is now running on port 3000");
});

// 4255cb21a7 list id