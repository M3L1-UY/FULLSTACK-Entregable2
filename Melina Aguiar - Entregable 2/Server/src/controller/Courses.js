import { promises as fs } from "fs";
import {
  coursesFile,
  teachersFile,
  courseTeachersFile,
  courseTransactionsFile,
  getNextId,
  isUnique,
  validarProfesor,
  validarCurso,
  validarAlumno,
  validarProfesorAsignadoACurso,
  validarEstudianteEnCurso,
  validarDependenciaCursoAlumno,
  validarDependenciaCursoProfesor
} from './utils.js';

const getAllCoursesByTeacher = async (req, res) => {
  try {
    const coursesData = JSON.parse(await fs.readFile(coursesFile, 'utf-8'));
    const teachersData = JSON.parse(await fs.readFile(teachersFile, 'utf-8'));
    const courseTeachersData = JSON.parse(await fs.readFile(courseTeachersFile, 'utf-8'));

    if (!courseTeachersData || courseTeachersData.length === 0) {
      return res.status(404).send({ message: "No hay registros de cursos y profesores.", exito: false });
    }

    const currentDate = new Date();
    const coursesWithTeacher = [];

    for (const courseTeacher of courseTeachersData) {
      const course = coursesData.find(course => course.codigo === courseTeacher.idCourse);

      if (course && new Date(courseTeacher.fechaFin) > currentDate) {
        const teacher = teachersData.find(teacher => teacher.ci === courseTeacher.ciTeacher);

        const courseWithTeacher = {
          idCourse: course.codigo,
          nameCourse: course.nombre,
          ciTeacher: teacher.ci,
          nameTeacher: teacher.nombre, 
          surnameTeacher: teacher.apellido,
          costoHora: courseTeacher.costoHora,
          fechaInicio: courseTeacher.fechaInicio,
          fechaFin: courseTeacher.fechaFin,
 
        };

        coursesWithTeacher.push(courseWithTeacher);
      }
    }
    res.send(coursesWithTeacher).status(200);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send({ message: "Error al obtener los cursos vigentes", exito: false });
  }
};

const getCourses = async (req, res) => {
  try {
    const datos = await fs.readFile(coursesFile, "utf-8"); 
    const courses = JSON.parse(datos);
    res.send(courses).status(200);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send({ message: "Error al obtener los cursos" , exito: false });
  }
};



const getCourse = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
    const datos = await fs.readFile(coursesFile, "utf-8");
    const courses = JSON.parse(datos);
    const item = courses.find((course) => course.id === id);
    if (!item) {
        res.status(404).json({ message: "Curso no encontrado", exito: false });
    } else {
        res.status(200).json({ course: item, message: "Consulta Exitosa", exito: true });
    }
    } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error al obtener el curso" });
  }
};

const addCourse = async (req, res) => {
  const { codigo , nombre } = req.body;
  try {
    const isCodigoUnique = await isUnique('codigo', codigo, coursesFile);
    const isNombreUnique = await isUnique('nombre', nombre, coursesFile);
    
    if (!isCodigoUnique) {
      return res.status(400).json({ message: "El código ya está en uso", exito: false });
    }
    if (!isNombreUnique) {
      return res.status(400).json({ message: "El nombre del curso ya está en uso", exito: false });
    }

    let newCourse = {
      id: parseInt(req.body.id),
      codigo: req.body.codigo,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      costo: req.body.costo,
      status: req.body.status
    };

    const datos = await fs.readFile(coursesFile, "utf-8");
    const courses = JSON.parse(datos);
    const id = getNextId(courses);

    newCourse.id = id;
    courses.push(newCourse);
    await fs.writeFile(coursesFile, JSON.stringify(courses));
    console.log("Registro agregado:", newCourse);
    return res.status(201).send({ message: "Registro agregado con éxito", exito: true });
  } catch (error) {
    console.log("Error al agregar el curso:", error);
    return res.status(500).send({ message: "Error al agregar el curso", exito: false });
  }
};

const addTeacherToCourse = async (req, res) => {
  try {
      const { idCourse, ciTeacher, costoHora, fechaInicio, fechaFin} = req.body;

      if (!await validarProfesor(ciTeacher)) {
        return res.status(400).json({ message: "El profesor no está registrado.", exito: false });
      };
      
      if (!await validarCurso(idCourse)) {
        return res.status(400).json({ message: "El curso no está registrado.", exito: false });
      }
    
      if (await validarProfesorAsignadoACurso(idCourse, ciTeacher)) {
        return res.status(400).json({ message: "El profesor ya está asignado a este curso." , exito: false });
      }

      const asignaciones = JSON.parse(await fs.readFile(courseTeachersFile, 'utf8'));
      const nuevaAsignacion = { idCourse, ciTeacher, costoHora, fechaInicio, fechaFin };
      asignaciones.push(nuevaAsignacion);
      
      await fs.writeFile(courseTeachersFile, JSON.stringify(asignaciones, null, 2));
      res
      .status(200)
      .json({asignacion: nuevaAsignacion, message: "Profesor asignado al curso correctamente.", exito: true });
  } catch (error) {
      console.error("Error al agregar profesor al curso:", error);
      res.status(500).json({ message: "Hubo un error al procesar la solicitud." });
  }
};

const getTagCoursesByTeacher = async (req, res) => {
  try {
    const coursesData = JSON.parse(await fs.readFile(coursesFile, 'utf8'));
    const coursesTeacherData = JSON.parse(await fs.readFile(courseTeachersFile, 'utf8'));
    const teacherData = JSON.parse(await fs.readFile(teachersFile, 'utf8'));
    const resultado = [];
    let contador = 0;

    for (const courseTeacher of coursesTeacherData) {     
      const teacher = teacherData.find(teacher => teacher.ci === courseTeacher.ciTeacher);
      const course = coursesData.find(course => course.codigo === courseTeacher.idCourse);

      const courseAndTeacher = {
      courseCod: course.codigo,
      courseName: course.nombre,
      teacherCI: teacher.ci,
      teacherName: teacher.nombre,
      teacherSurname: teacher.apellido,
      }
      courseAndTeacher.id = contador;
      contador++
      console.log(courseAndTeacher)
      resultado.push(courseAndTeacher);
    } 
    res.send(resultado).status(200);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send({ message: "Error al obtener los cursos" , exito: false }); 
}
}
const addStudentToCourse = async (req, res) => {

  try {
    const { idCourse, ciTeacher, ciStudent} = req.body;

    if (!await validarProfesor(ciTeacher)) {
        return res.status(400).json({ message: "El profesor no está registrado.", exito: false });
    };
    
    if (!await validarCurso(idCourse)) {
        return res.status(400).json({ message: "El curso no está registrado.", exito: false });
    }
    
    if (!await validarAlumno(ciStudent)) {
        return res.status(400).json({ message: "El alumno no está registrado.", exito: false });
    }

    if (!await validarProfesorAsignadoACurso(idCourse, ciTeacher)) {
      return res.status(400).json({ message: "Error: El profesor no está asignado a ese curso.", exito: false });
    }

    if (await validarEstudianteEnCurso(idCourse, ciStudent)) {
      return res.status(400).json({ message: "Error: El alumno ya se encuentra asignado al curso.", exito: false });
    }

    const newTransaction = {
        idCourse,
        ciTeacher,
        ciStudent,
    };

    const datos = await fs.readFile(courseTransactionsFile, "utf-8");
    const courseTeachers = JSON.parse(datos);
    const id = getNextId(courseTeachers);

    newTransaction.id = id;
    courseTeachers.push(newTransaction);
    await fs.writeFile(courseTransactionsFile, JSON.stringify(courseTeachers));
    console.log("Registro agregado:", newTransaction);
    return res.status(201).send({ message: "Registro agregado con éxito", exito: true });
  } catch (error) {
    console.log("Error al agregar la transaccion del curso:", error);
    return res.status(500).send({ message: "Error al agregar la transaccion del curso", exito: false });
  }
}

const getCoursesByStudent = async (req, res) => {
  try 
  {
    const ciStudent = parseInt(req.params.id);

    if (!await validarAlumno(ciStudent)) {
      return res.status(400).json({ message: "El alumno no está registrado.", exito: false });
    }

    const transactions = JSON.parse(await fs.readFile(courseTransactionsFile, 'utf8'));
    const studentCourses = transactions.filter(transaction => transaction.ciStudent === ciStudent);

    const courses = [];
    for (const studentCourse of studentCourses) {
        const course = JSON.parse(await fs.readFile(`coursesFile/${studentCourse.idCourse}.json`, 'utf8'));
        courses.push(course);
    }
    res.send(courses).status(200);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send({ error: "Error al obtener los cursos" });
  }
};

const getCoursesByTeacher = async (req, res) => {
  try 
  {
    const ciTeacher = req.params.ci; 

    if (!await validarProfesor(ciTeacher)) {
      return res.status(400).json({ message: "El profesor no está registrado.", exito: false });
    };

    const transactions = JSON.parse(await fs.readFile(courseTeachersFile, 'utf8'));
    const teacherCourses = transactions.filter(transaction => transaction.ciTeacher === ciTeacher);

    const cursos = [];
    const datos = await fs.readFile(coursesFile, "utf-8"); 
    const coursesData = JSON.parse(datos);


    for (const teacherCourse of teacherCourses) {
      const course = coursesData.find(item => item.codigo === teacherCourse.idCourse);
      cursos.push(course);
      }
      console.log(cursos)
      
      res.send(cursos).status(200);
    } catch (error) {
      console.log("Error: ", error);
      res.status(500).send({ message: "Error al obtener los cursos" });
    }
};

const deleteCourse = async (req, res) => {
  let codigo = req.params.id;

  try {
    const datos = await fs.readFile(coursesFile, "utf-8");
    const courses = JSON.parse(datos);

    if (await validarDependenciaCursoAlumno(codigo)) {

        return res.status(400).json({ message: "El curso tiene alumnos inscriptos, no se puede eliminar.", exito: false });
    };
    validarProfesorAsignadoACurso
    if (await validarDependenciaCursoProfesor(codigo)) {

      return res.status(400).json({ message: "El curso tiene profesores asignados, no se puede eliminar.", exito: false });
  };

    const transaccionesData = await fs.readFile(courseTransactionsFile, "utf-8");
    let transacciones = JSON.parse(transaccionesData);

    transacciones = transacciones.filter(transaction => transaction.idCourse !== codigo);

    await fs.writeFile(courseTransactionsFile, JSON.stringify(transacciones));

    const index = courses.findIndex((item) => item.codigo === codigo);

    if (index >= 0) {
      courses.splice(index, 1);
      await fs.writeFile(coursesFile, JSON.stringify(courses));
      return res.status(200).send({ message: "Registro eliminado con éxito", exito: true });
    } else {
      return res.status(404).send({ message: "El curso no existe", exito: false });
    }
  } catch (error) {
    console.log("Error al eliminar el curso:", error);
    return res.status(500).send({ message: "Error al eliminar el curso", exito: false });
  }
};



const updateCourse = async (req, res) => {

  let id = Number(req.params.id);
  const { codigo , nombre } = req.body;
  console.log(id)
  if (isNaN(id)) {
    return res.status(400).json({ message: "El ID proporcionado no es válido", exito: false });
  }

  try {

    const datos = await fs.readFile(coursesFile, "utf-8");
    const courses = JSON.parse(datos);

    const isCodigoUnique = await isUnique('codigo', codigo, coursesFile, id);
    const isNombreUnique = await isUnique('nombre', nombre, coursesFile, id);

    if (!isCodigoUnique) {
      return res.status(400).json({ message: "El código ya está en uso", exito: false });
    }
    if (!isNombreUnique) {
      return res.status(400).json({ message: "El nombre del curso ya está en uso", exito: false });
    }
  
    let nuevoDato = {
      id: parseInt(req.body.id),
      codigo: req.body.codigo,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      costo: req.body.costo,
      status: req.body.status
    };

    const index = courses.findIndex((item) => item.id === id);

    if (index >= 0) {
      courses[index] = nuevoDato;
    await fs.writeFile(coursesFile, JSON.stringify(courses));
    return res.status(200).json({ message: "Registro actualizado con éxito", exito: true });
  } else {
    return res.status(404).json({ message: "El curso no existe", exito: false });
  }
  
} catch (error) {
  console.log("Error al actualizar el curso:", error);
  return res.status(500).json({ message: "Error al actualizar el curso", exito: false });
}
};

export {
    getCourses,
    getAllCoursesByTeacher,
    getCourse,
    addCourse,
    addStudentToCourse,
    addTeacherToCourse,
    getCoursesByStudent,
    getCoursesByTeacher,
    getTagCoursesByTeacher, 
    deleteCourse,
    updateCourse
  };