import { promises as fs } from "fs";
import {
  studentsFile,
  courseTransactionsFile,
  validarCurso,
  validarProfesor,
  validarEstudianteEnCurso,
  validarDependenciaEstudiante,
  getNextId,
  isUnique,
} from './utils.js';

const getStudents = async (req, res) => {
  try {
    const datos = await fs.readFile(studentsFile, "utf-8"); 
    const students = JSON.parse(datos);
    setTimeout(() => {
      res.send(students).status(200);
    }, 1000);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send({ error: "Error al obtener los estudiantes" });
  }
};

const getStudent = async (req, res) => {
    let id = parseInt(req.params.id);
    try {
    const datos = await fs.readFile(studentsFile, "utf-8");
    const students = JSON.parse(datos);
    const item = students.find((student) => student.id === id);
    if (!item) {
        res.status(404).json({ message: "Estudiante no encontrado", exito: false });
    } else {
        res.status(200).json({ student: item, message: "Consulta Exitosa", exito: true });
    }
    } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error al obtener el estudiante" });
  }
};

const getStudentCi = async (req, res) => {
  let ci = parseInt(req.params.ci);
  try {
    const datos = await fs.readFile(studentsFile, "utf-8");
    const students = JSON.parse(datos);
    const student = students.find((student) => student.ci == ci);
    let messageResult = "";
    let status = false;
    if (student === undefined) {
      messageResult = "El Ci ingresado no existe";
      status = false;
    } else {
      messageResult = "Consulta Exitosa";
      status = true;
    }
    return res
      .status(200)
      .json({ student, message: messageResult, exito: status });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el estudiante" });
  }
};

const addStudent = async (req, res) => {
  const { ci, email} = req.body;
  try {
    const isEmailUnique = await isUnique('email', email, studentsFile);
    const isCINumberUnique = await isUnique('ci', ci, studentsFile);
    
    if (!isEmailUnique) {
      return res.status(400).json({ message: "El correo electrónico ya está en uso", exito: false });
    }
    if (!isCINumberUnique) {
      return res.status(400).json({ message: "El número de identificación ya está en uso", exito: false });
    }

    let newStudent = {
    id: parseInt(req.body.id),
    ci: req.body.ci,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    direccion: req.body.direccion,
    email: req.body.email,
    telefono: req.body.telefono,
    nacionalidad: req.body.nacionalidad,
    nivelEducativo: req.body.nivelEducativo,
    estadoCivil: req.body.estadoCivil,
    condTermino: req.body.condTermino,
    };

    const datos = await fs.readFile(studentsFile, "utf-8");
    const students = JSON.parse(datos);
    const id = getNextId(students);
    newStudent.id = id;
    students.push(newStudent);
    await fs.writeFile(studentsFile, JSON.stringify(students));
    console.log("Registro agregado:", newStudent);
    return res.status(201).send({ message: "Registro agregado con éxito", exito: true });
  } catch (error) {
    console.log("Error al agregar el estudiante:", error);
    return res.status(500).send({ message: "Error al agregar el estudiante", exito: false });
  }
};

const deleteStudent = async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    const datos = await fs.readFile(studentsFile, "utf-8");
    const students = JSON.parse(datos);

    const item = students.find((item) => item.id === id);
    const index = students.findIndex((item) => item.id === id);

    if (await validarDependenciaEstudiante(item.ci)) {
    return res.status(400).json({ message: "El alumno se encuentra registrado a un curso, no se puede eliminar.", exito: false });
    };

    if (index >= 0) {
      students.splice(index, 1);
      await fs.writeFile(studentsFile, JSON.stringify(students));
      console.log("Registro eliminado:", id);
      return res.status(200).send({ message: "Registro eliminado con éxito", exito: true });
    } else {
      console.log("El estudiante no existe:", id);
      return res.status(404).send({ message: "El estudiante no existe", exito: false });
    }
  } catch (error) {
    console.log("Error al eliminar el estudiante:", error);
    return res.status(500).send({ message: "Error al eliminar el estudiante", exito: false });
  }
};

const updateStudent = async (req, res) => {
  try {
    let id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "El ID proporcionado no es válido", exito: false });
    }
    const { ci, email} = req.body;
    
    const isEmailUnique = await isUnique('email', email, studentsFile, id);
    const isCINumberUnique = await isUnique('ci', ci, studentsFile, id);
    
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
    nacionalidad: req.body.nacionalidad,
    nivelEducativo: req.body.nivelEducativo,
    estadoCivil: req.body.estadoCivil,
    condTermino: req.body.condTermino, 
    };

    const datos = await fs.readFile(studentsFile, "utf-8");
    const students = JSON.parse(datos);
    const index = students.findIndex((item) => item.id === id);
    if (index >= 0) {
      students[index] = nuevoDato;
      await fs.writeFile(studentsFile, JSON.stringify(students));
      return res.status(200).json({ message: "Registro actualizado con éxito", exito: true });
    } else {
      return res.status(404).json({ message: "El estudiante no existe", exito: false });
    }
    
  } catch (error) {
    console.log("Error al actualizar el estudiante:", error);
    return res.status(500).json({ message: "Error al actualizar el estudiante", exito: false });
  }
};

const getStudentsByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseCod;
    const teacherCi = req.params.teacherCi;

    if (!await validarCurso(courseId)) {
      return res.status(400).json({ message: "El curso no está registrado.", exito: false });
   }
  
    if (!await validarProfesor(teacherCi)) {
    return res.status(400).json({ message: "El profesor no está registrado.", exito: false });
    };
    
    const transactions = JSON.parse(await fs.readFile(courseTransactionsFile, 'utf8'));
    const courseStudents = transactions.filter(transaction => transaction.idCourse === courseId && transaction.ciTeacher === teacherCi);

    const students = [];
    const datos = await fs.readFile(studentsFile, "utf-8"); 
    const studentsData = JSON.parse(datos);
    
    for (const courseStudent of courseStudents) {
        const student = studentsData.find(student => student.ci === courseStudent.ciStudent);
        students.push(student);

    }
    res.status(200).send(students);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send({ error: "Error al obtener los alumnos del curso" });
  }
};

export {
    getStudents,
    getStudent,
    getStudentCi,
    addStudent,
    deleteStudent,
    updateStudent,
    getStudentsByCourse,
    validarEstudianteEnCurso
  };