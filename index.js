import express from "express";
import router from "./routes/routes.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use('/', router);

app.listen(PORT, ()=>{
    console.log(`puerto corriendo en http://localhost:${PORT}`)
});