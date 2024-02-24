import express from "express";

const router = express.Router();


import {
    getTeacher,
    getTeacherCi,
    getTeachers,
    addTeacher,
    deleteTeacher,
    updateTeacher
  } from "../controller/Teachers.js";
  
   
  router.get("/teacher", getTeachers); 
  router.get("/teacher/:id", getTeacher);
  router.get("/teacherci/:ci", getTeacherCi);
  router.post("/teacher", validarDataTeacher, addTeacher); 
  router.put("/teacher/:id", validarDataTeacher, updateTeacher);
  router.delete("/teacher/:id", deleteTeacher);
  
  function validarDataTeacher(req, res, next) {
    console.log("Body....", req.body);
    const { ci, nombre, apellido, direccion, telefono, email } = req.body;

    if (!ci) {
      res.status(400).json({
        message: "Ingrese un documento de identidad válido.",
        exito: false,
      });
      return;
    }
    if (!nombre) {
      res.status(400).json({
        message: "El nombre no puede estar vacío.",
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
          message: "La dirección, no puede estar vacío.",
          exito: false,
        });
      }
      if (!telefono) {
        return res.status(400).json({
          message: "El telefono, no puede estar vacío.",
          exito: false,
        });
      }
      if (!email) {
        return res.status(400).json({
          message: "El email, no puede estar vacío.",
          exito: false,
        });
    }
    next();
  }

export default router;

