import { promises as fs } from "fs";

import {
  contactsFile,
  getNextId,
} from './utils.js';

const getContacts = async (req, res) => {
  try {
    const datos = await fs.readFile(contactsFile, "utf-8");
    const contacts = JSON.parse(datos);
    res.status(200).send(contacts);
    return;
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send({ error: "Error al obtener los contactos" });
  }
};

const getContact = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(contactsFile, "utf-8");
    const contacts = JSON.parse(datos);
    const item = contacts.find((contact) => contact.id === id);
    if (!item) {
        res.status(404).json({ message: "Contacto no encontrado", exito: false });
    } else {
        res.status(200).json({ contact: item, message: "Consulta Exitosa", exito: true });
    }
    } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Error al obtener el contacto" });
  }
};

const addContact = async (req, res) => {
  let nuevoContacto = {
      id: parseInt(req.body.id),
      email: req.body.email,
      nombre: req.body.nombre,
      comentario: req.body.comentario,
      telefono: req.body.telefono,
  };
  try {
      const datos = await fs.readFile(contactsFile, "utf-8");
      const contacts = JSON.parse(datos);
      const id = getNextId(contacts);
      nuevoContacto.id = id;
      contacts.push(nuevoContacto);
      console.log(contacts);
      await fs.writeFile(contactsFile, JSON.stringify(contacts));
      return res.status(201).send({ message: "Registro agregado con éxito", exito: true });
  } catch (error) {
    console.log("Error al agregar el contacto:", error);
    return res.status(500).send({ message: "Error al agregar el contacto", exito: false });
  }
};

const deleteContact = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(contactsFile, "utf-8");
    const contacts = JSON.parse(datos);
    const index = contacts.findIndex((item) => item.id === id);
    if (index >= 0) {
      contacts.splice(index, 1);
      await fs.writeFile(contactsFile, JSON.stringify(contacts));
      console.log("Registro eliminado:", id);
      return res.status(200).send({ message: "Registro eliminado con éxito", exito: true });
    } else {
      console.log("El contacto no existe:", id);
      return res.status(404).send({ message: "El contacto no existe", exito: false });
    }
  } catch (error) {
    console.log("Error al eliminar el contacto:", error);
    return res.status(500).send({ message: "Error al eliminar el contacto", exito: false });
  }
};


const updateContact = async (req, res) => {
    let id = Number(req.params.id);
    console.log(id)
    if (isNaN(id)) {
      return res.status(400).json({ message: "El ID proporcionado no es válido", exito: false });
    }
    let nuevoDato = {
      id: parseInt(req.body.id),
      email: req.body.email,
      nombre: req.body.nombre,
      comentario: req.body.comentario,
      telefono: req.body.telefono,
    };
   try {
    const datos = await fs.readFile(contactsFile, "utf-8");
    const contacts = JSON.parse(datos);
    const index = contacts.findIndex((item) => item.id === id);
    if (index >= 0) {
      contacts[index] = nuevoDato;
      await fs.writeFile(contactsFile, JSON.stringify(contacts));
      return res.status(200).json({ message: "Registro actualizado con éxito", exito: true });
    } else {
      return res.status(404).json({ message: "El contacto no existe", exito: false });
    }
    
  } catch (error) {
    console.log("Error al actualizar el contacto:", error);
    return res.status(500).json({ message: "Error al actualizar el contacto", exito: false });
  }
};

export {
    getContacts,
    getContact,
    addContact,
    deleteContact,
    updateContact,
};