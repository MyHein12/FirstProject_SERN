import express from "express";
import bodyParser from "body-parser";
import configViewEngine from './config/viewEngine';
import initWebRoutes from './route/web';
import connectDB from './config/connectDB';
import cors from 'cors';

require('dotenv').config();
let app = express();
app.use(cors({ origin: true, credentials: true }))
//config app
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

configViewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 1209;

app.listen(port, () => {
    console.log("Running on http://localhost:" + port)
})