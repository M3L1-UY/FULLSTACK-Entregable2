import express from "express";

const router = express.Router();

import {
    getStudents,
    getStudent,
    getStudentCi,
    addStudent,
    deleteStudent,
    updateStudent,
    getStudentsByCourse
  } from "../controller/Students.js";
  
  /* *******************************************************  */
  /*             Ruta de acceso a archivos Products           */
  /* *******************************************************  */

  router.get("/student", getStudents); 
  router.get("/student/:id", getStudent);
  router.get("/studentci/:ci", getStudentCi);
  router.get("/students/:courseCod/:teacherCi", getStudentsByCourse);
  router.post("/student", validarDataStudent, addStudent); 
  router.put("/student/:id", validarDataStudent, updateStudent);
  router.delete("/student/:id", deleteStudent);
  
  function validarDataStudent(req, res, next) {
    console.log("Body....", req.body);
    const { ci, nombre, apellido, direccion, telefono, email } = req.body;

    if (!ci) {
      res.status(400).json({
        message: "Ingrese un documento de identidad válido..",
        exito: false,
      });
      return;
    }
    if (!nombre) {
      res.status(400).json({
        message: "El nombre, no puede estar vacío..",
        exito: false,
      });
      return;
    }
    if (!apellido) {
        return res.status(400).json({
          message: "El apellido no puede estar vacío.",
          exito: false,
        });
      }
      if (!direccion) {
        return res.status(400).json({
          message: "La dirección no puede estar vacía.",
          exito: false,
        });
      }
      if (!telefono) {
        return res.status(400).json({
          message: "El teléfono no puede estar vacío.",
          exito: false,
        });
      }
      if (!email) {
        return res.status(400).json({
          message: "El email no puede estar vacío.",
          exito: false,
        });
    }
    next();
  }

export default router;

