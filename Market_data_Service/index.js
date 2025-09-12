import express from 'express';
import dotenv from "dotenv"
import UpstoxClient from "upstox-js-sdk";
import cors from 'cors'

dotenv.config();
const app = express();
const port = 4000;
app.use(cors())
app.get('/', async (req, res) => {
   res.json({ message: "HHLD Stock Broker Order Executioner Service" });
});

app.get('/getDataFromUpstox', (req, res) => {
   loginToUpstox();
   res.json({ message: "Succeeded" });
});

const loginToUpstox = () => {
   const apiInstance = new UpstoxClient.LoginApi();
   const apiVersion = "2.0";
   const opts = {
       code:process.env.AUTH_CODE,
       clientId: process.env.CLIENT_ID,
       clientSecret: process.env.API_SECRET,
       redirectUri: process.env.REDIRECT_URL,
       grantType: "authorization_code",
   };
   console.log("api hit!")
   apiInstance.token(apiVersion, opts, (error, data, response) => {
       if (error) {
           console.log("Error occurred: ", error.message);
       } else {
              console.log("Access Token:", data.access_token);
      console.log("Refresh Token:", data.refresh_token);
       }
   });
};

app.get("/getOHLCData", (req, res) => {
   console.log("Getting OHLC route");
   const symbol = req.query.symbol;
   getMarketQuoteOHLC(symbol, (err, data) => {
       if (err) {
           res.status(500).json("failed")
       } else {
           res.status(200).json(data)
       }
   });
});

const getMarketQuoteOHLC = (symbol, callback) => {
   let defaultClient = UpstoxClient.ApiClient.instance;
   var OAUTH2 = defaultClient.authentications["OAUTH2"];
   OAUTH2.accessToken = process.env.ACCESS_TOKEN;
   let apiInstance = new UpstoxClient.MarketQuoteApi();
   let apiVersion = "2.0";

   let interval = "1d";
   apiInstance.getMarketQuoteOHLC(
       symbol,
       interval,
       apiVersion,
       (error, data, response) => {
           if (error) {
               console.error(error);
               callback(err, null)
           } else {
               console.log(
                   "API called successfully. Returned data: " + JSON.stringify(data)
               );
               callback(null, data)
           }
       }
   );
};


app.listen(port, () => {
   console.log(`Server is listening at http://localhost:${port}`);
})
