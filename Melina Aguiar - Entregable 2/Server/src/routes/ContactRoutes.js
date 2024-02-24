import express from "express";

const router = express.Router();

import {
    getContacts,
    getContact,
    addContact,
    deleteContact,
    updateContact,
  } from "../controller/Contacts.js";
  
 
  router.get("/contact", getContacts);
  router.get("/contact/:id", getContact);
  router.post("/contact", validarData, addContact);
  router.put("/contact/:id", validarData, updateContact);
  router.delete("/contact/:id", deleteContact);
  

  function validarData(req, res, next) {
   
    const { email, nombre, comentario, telefono } = req.body;
  
    if (!email) {
      return res.status(400).json({
        message: "Ingrese un correo electrónico válido..",
        exito: false,
      });
    }
    if (!nombre) {
      return res.status(400).json({
        message: "El nombre, no puede estar vacío..",
        exito: false,
      });
    }
    if (!comentario) {
      return res.status(400).json({
        message: "El comentario, no puede estar vacío..",
        exito: false,
      });
    }
    if (!telefono) {
      return res.status(400).json({
        message: "El telefono, no puede estar vacío..",
        exito: false,
      });
    }
    next();
  }

export default router;
