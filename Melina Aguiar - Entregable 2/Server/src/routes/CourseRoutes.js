import express from "express";

const router = express.Router();

import {
    getCourse,
    getCourses,
    getAllCoursesByTeacher,
    getCoursesByStudent,
    getCoursesByTeacher,
    getTagCoursesByTeacher,
    addCourse,
    addStudentToCourse,
    addTeacherToCourse,
    deleteCourse,
    updateCourse
  } from "../controller/Courses.js";
  
  router.get("/course", getCourses);
  router.get("/coursesbyteachers", getAllCoursesByTeacher); 
  router.get("/coursestagsbyteachers", getTagCoursesByTeacher); 
  router.get("/course/:id", getCourse);
  router.get("/coursebystudent/:ci", getCoursesByStudent);
  router.get("/coursesbyteacher/:ci", getCoursesByTeacher);
  router.post("/course", validarDataCourse, addCourse); 
  router.post("/courseAddStudent", validarDataStudentToCourse, addStudentToCourse); 
  router.post("/courseAddTeacher", validarDataTeacherToCourse, addTeacherToCourse); 
  router.delete("/course/:id", deleteCourse);
  router.put("/course/:id", validarDataCourse, updateCourse);
  
    
  function validarDataCourse(req, res, next) {
    const { codigo, nombre, descripcion, costo } = req.body;

    if (!codigo) {
      res.status(400).json({
        message: "Ingrese un código válido.",
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
    if (!descripcion) {
        res.status(400).json({
          message: "La descripción no puede estar vacía.",
          exito: false,
        });
        return;
      }
    if (!costo) {
        res.status(400).json({
            message: "El costo no puede estar vacío.",
            exito: false,
        });
        return;
    }
    next();
  }

  function validarDataTeacherToCourse(req, res, next) {
    const { idCourse, ciTeacher, costoHora, fechaInicio, fechaFin} = req.body;

    if (!idCourse) {
      res.status(400).json({
        message: "El código del curso no puede estar vacío.",
        exito: false,
      });
      return;
    }
    if (!ciTeacher) {
      res.status(400).json({
        message: "La cédula del profesor no puede estar vacía.",
        exito: false,
      });
      return;
    }
    if (!costoHora) {
        res.status(400).json({
          message: "El costo por hora docente no puede estar vacío.",
          exito: false,
        });
        return;
      }
      if (!fechaInicio) {
        res.status(400).json({
          message: "La fecha de inicio no puede estar vacía.",
          exito: false,
        });
        return;
      }
      if (!fechaFin) {
        res.status(400).json({
          message: "La fecha de finalización no puede estar vacía.",
          exito: false,
        });
        return;
      }
      if (fechaFin<fechaInicio) {
        res.status(400).json({
          message: "Las fechas son incorrectas..",
          exito: false,
        });
        return;
      }
    next();
  }

  function validarDataStudentToCourse(req, res, next) {
    const { idCourse, ciStudent} = req.body;

    if (!idCourse) {
      res.status(400).json({
        message: "El código del curso no puede estar vacío.",
        exito: false,
      });
      return;
    }
    if (!ciStudent) {
        res.status(400).json({
          message: "La cédula del estudiante no puede estar vacía.",
          exito: false,
        });
        return;
      }
    next();
  }
export default router;

