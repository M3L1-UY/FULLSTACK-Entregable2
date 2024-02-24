import express from "express";
import cors from "cors";
import StudentRoutes from "./routes/StudentRoutes.js";
import ContactRoutes from "./routes/ContactRoutes.js";
import CourseRoutes from "./routes/CourseRoutes.js";
import TeacherRoutes from "./routes/TeacherRoutes.js";

const app = express();
const port = 5000;

//* *************************************************************** *//
//                         middleware                                //
//* *************************************************************** *//

app.use(cors());
app.use(express.json());

//* *************************************************************** *//
//                          manejo de rutas                          //
//* *************************************************************** *//

app.get("/", (req, res) => {
  res.status(200).sendFile(__dirname + "/public/html/welcome.html");
});

app.use("/api", StudentRoutes);
app.use("/api", ContactRoutes);
app.use("/api", CourseRoutes);
app.use("/api", TeacherRoutes);

app.use((red, res, next) => {
  res.status(404).sendFile(__dirname + "/public/html/404.html");
});

//* *************************************************************** *//
//                          inicia servidor                          //
//* *************************************************************** *//

app.listen(port, () => {
  console.log("Servidor disponible en http://localhost:" + port);
});
