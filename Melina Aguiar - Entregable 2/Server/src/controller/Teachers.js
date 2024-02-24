import { promises as fs } from "fs";
import {
  teachersFile,
  getNextId,
  validarDependenciaProfesor,
  isUnique,
} from './utils.js';

const getTeachers = async (req, res) => {
  try {
    const datos = await fs.readFile(teachersFile, "utf-8"); 
    const teachers = JSON.parse(datos);
    setTimeout(() => {
      res.send(teachers).status(200);
    }, 1000);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send({ error: "Error al obtener los profesores" });
  }
};

const getTeacher = async (req, res) => {
    let id = parseInt(req.params.id);
    try {
    const datos = await fs.readFile(teachersFile, "utf-8");
    const teachers = JSON.parse(datos);
    const item = teachers.find((teacher) => teacher.id === id);
    if (!item) {
        res.status(404).json({ message: "Profesor no encontrado", exito: false });
    } else {
        res.status(200).json({ teacher: item, message: "Consulta Exitosa", exito: true });
    }
    } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error al obtener el profesor" });
  }
};

const getTeacherCi = async (req, res) => {
  let ci = parseInt(req.params.ci);
  try {
    const datos = await fs.readFile(teachersFile, "utf-8");
    const teachers = JSON.parse(datos);
    const teacher = teachers.find((teacher) => teacher.ci == ci);
    let messageResult = "";
    let status = false;
    if (teacher === undefined) {
      messageResult = "El Ci ingresado no existe";
      status = false;
    } else {
      messageResult = "Consulta Exitosa";
      status = true;
    }
    return res
      .status(200)
      .json({ teacher, message: messageResult, exito: status });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el profesor" });
  }
};


const addTeacher = async (req, res) => {
  const { ci, email} = req.body;
  try {
    const isEmailUnique = await isUnique('email', email, teachersFile);
    const isCINumberUnique = await isUnique('ci', ci, teachersFile);
    
    if (!isEmailUnique) {
      return res.status(400).json({ message: "El correo electrónico ya está en uso", exito: false });
    }
    if (!isCINumberUnique) {
      return res.status(400).json({ message: "El número de identificación ya está en uso", exito: false });
    }

    let newTeacher = {
      id: parseInt(req.body.id),
      ci: req.body.ci,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      direccion: req.body.direccion,
      email: req.body.email,
      telefono: req.body.telefono,
      status: req.body.status
    };

    const datos = await fs.readFile(teachersFile, "utf-8");
    const teachers = JSON.parse(datos);
    const id = getNextId(teachers);
    newTeacher.id = id;
    teachers.push(newTeacher);
    await fs.writeFile(teachersFile, JSON.stringify(teachers));
    console.log("Registro agregado:", newTeacher);
    return res.status(201).send({ message: "Registro agregado con éxito", exito: true });
  } catch (error) {
    console.log("Error al agregar el profesor:", error);
    return res.status(500).send({ message: "Error al agregar el profesor", exito: false });
  }
};

const deleteTeacher = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(teachersFile, "utf-8");
    const teachers = JSON.parse(datos);

    const item = teachers.find((item) => item.id === id);
    const index = teachers.findIndex((item) => item.id === id);
  
    if (await validarDependenciaProfesor(item.ci)) {
      console.log("enrta en if")
    return res.status(400).json({ message: "El profesor se encuentra inscripto a un curso, no se puede eliminar.", exito: false });
    };

    if (index >= 0) {
      teachers.splice(index, 1);
      await fs.writeFile(teachersFile, JSON.stringify(teachers));
      return res.status(200).send({ message: "Registro eliminado con éxito", exito: true });
      
    } else {
      return res.status(404).send({ message: "El profesor no existe", exito: false });
    }
  } catch (error) {
    console.log("Error al eliminar el profesor:", error);
    return res.status(500).send({ message: "Error al eliminar el profesor", exito: false });
  }
};


const updateTeacher = async (req, res) => {
  try {
    let id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "El ID proporcionado no es válido", exito: false });
    }
    const { ci, email} = req.body;
    
    const isEmailUnique = await isUnique('email', email, teachersFile, id);
    const isCINumberUnique = await isUnique('ci', ci, teachersFile, id);
    
    if (!isEmailUnique) {
      return res.status(400).json({ message: "El correo electrónico ya está en uso", exito: false });
    }
    if (!isCINumberUnique) {
      return res.status(400).json({ message: "El número de identificación ya está en uso", exito: false });
    }
    
    let nuevoDato = {
      id: parseInt(req.body.id),
      ci: req.body.ci,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      direccion: req.body.direccion,
      email: req.body.email,
      telefono: req.body.telefono,
      status: req.body.status
    };

    const datos = await fs.readFile(teachersFile, "utf-8");
    const teachers = JSON.parse(datos);
    const index = teachers.findIndex((item) => item.id === id);
    if (index >= 0) {
      teachers[index] = nuevoDato;
      await fs.writeFile(teachersFile, JSON.stringify(teachers));
      return res.status(200).json({ message: "Registro actualizado con éxito", exito: true });
    } else {
      return res.status(404).json({ message: "El profesor no existe", exito: false });
    }
    
  } catch (error) {
    console.log("Error al actualizar el profesor:", error);
    return res.status(500).json({ message: "Error al actualizar el profesor", exito: false });
  }
};

export {
    getTeacher,
    getTeacherCi,
    getTeachers,
    addTeacher,
    deleteTeacher,
    updateTeacher
  };