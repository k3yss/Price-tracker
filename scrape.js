const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();
// console.log(process.env.SENSITIVE_INFO);
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
console.log(accountSid, authToken);
const url =
  "https://www.flipkart.com/apple-2020-macbook-pro-m1-8-gb-256-gb-ssd-mac-os-big-sur-myd82hn-a/p/itmef224bcc599dc?pid=COMFXEKMTGHAGSVX&lid=LSTCOMFXEKMTGHAGSVXHVO7KQ&marketplace=FLIPKART&q=macbook+pro&store=6bo%2Fb5g&srno=s_1_1&otracker=search&otracker1=search&fm=organic&iid=aac2da8f-c5d9-438f-bbbe-c50a3217d5e9.COMFXEKMTGHAGSVX.SEARCH&ppt=hp&ppn=homepage&ssid=yyzs6qdjg00000001656075428027&qH=9cf36a97583bd48f";

const product = { name: "", price: "", link: "" };

const handle = setInterval(scrape, 20000);

async function scrape() {
  const { data } = await axios.get(url);
  //   console.log(data);
  const $ = cheerio.load(data);
  //   console.log($);
  const item = $("div#container");
  product.name = $(item).find("h1 span.B_NuCI").text();
  product.link = url;
  //   console.log(product.name);
  const price = $(item)
    .find("._30jeq3._16Jk6d")
    .text()
    .replace(/[,.₹​]/g, "");
  //   console.log("Testing");
  console.log(price);
  const priceNum = parseInt(price);
  product.price = priceNum;
  console.log(product);
  //   Send an SMS
  if (priceNum < 200000) {
    client.messages
      .create({
        body: `The price of ${product.name} went below ${price}. Purchase it at ${product.link}`,
        from: "+14698334080",
        to: "+917480016255",
      })
      .then((message) => {
        console.log(message.sid);
        clearInterval(handle);
      });
  }
}

scrape();
