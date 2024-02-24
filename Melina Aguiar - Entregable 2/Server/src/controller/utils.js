import fs from 'fs/promises';

const studentsFile = "src/json/students.json";
const contactsFile = "src/json/contacts.json";
const teachersFile = "src/json/teachers.json";
const coursesFile = "src/json/courses.json";
const courseTeachersFile = "src/json/course_teachers.json";
const courseTransactionsFile = "src/json/course_transactions.json";

const getNextId = (data) => {
    if (data.length === 0) {
      return 1;
    }
    const maxId = Math.max(...data.map((item) => item.id));
    return maxId + 1;
};

const isUnique = async (attributeName, attributeValue, jsonFileRute, excludeId = null) => {
    try {
        const datos = await fs.readFile(jsonFileRute, "utf-8");
        const collection = JSON.parse(datos);
        const result = collection.find(item => item[attributeName] === attributeValue && item.id !== excludeId);
        return !result; // Devuelve true si el valor del atributo no existe previamente, false si ya existe
    } catch (error) {
        console.log(`Error al verificar la unicidad del atributo ${attributeName}:`, error);
        throw error;
    }
};

const validarProfesor = async (ciTeacher) => {
    const profesores = JSON.parse(await fs.readFile(teachersFile, 'utf8'));
    const profesor = profesores.find(prof => prof.ci === ciTeacher);
    console.log(profesor.ci)
    console.log(ciTeacher)
    return profesor !== undefined;
};

const validarCurso = async (codCourse) => {
    const cursos = JSON.parse(await fs.readFile(coursesFile, 'utf8'));
    const curso = cursos.find(curso => curso.codigo === codCourse);
    return curso !== undefined;
};

const validarAlumno = async (ciStudent) => {
    const alumnos = JSON.parse(await fs.readFile(studentsFile, 'utf8'));
    const alumno = alumnos.find(alumno => alumno.ci === ciStudent);
    return alumno !== undefined;
};

const validarProfesorAsignadoACurso = async (idCourse, ciTeacher) => {
    const asignaciones = JSON.parse(await fs.readFile(courseTeachersFile, 'utf8'));
    const asignacion = asignaciones.find(asignacion => asignacion.idCourse === idCourse && asignacion.ciTeacher === ciTeacher);
    return asignacion !== undefined;
};

const validarEstudianteEnCurso = async (idCourse, ciStudent) => {
    const transactions = JSON.parse(await fs.readFile(courseTransactionsFile, 'utf8'));
    return transactions.some(transaction => transaction.idCourse === idCourse && transaction.ciStudent === ciStudent);
};

const validarDependenciaEstudiante = async (ciStudent) => {
    const transactions = JSON.parse(await fs.readFile(courseTransactionsFile, 'utf8'));
    return transactions.some(transaction => transaction.ciStudent === ciStudent);
};

const validarDependenciaProfesor = async (ciTeacher) => {
    const transactions = JSON.parse(await fs.readFile(courseTeachersFile, 'utf8'));
    return transactions.some(transaction => transaction.ciTeacher === ciTeacher);
};

const validarDependenciaCursoAlumno = async (idCourse) => {
    const transactions = JSON.parse(await fs.readFile(courseTransactionsFile, 'utf8'));
    return transactions.some(transaction => transaction.idCourse === idCourse);
};

const validarDependenciaCursoProfesor = async (idCourse) => {
    const transactions = JSON.parse(await fs.readFile(courseTeachersFile, 'utf8'));
    return transactions.some(transaction => transaction.idCourse === idCourse);
};

export {
    coursesFile,
    teachersFile,
    studentsFile,
    contactsFile,
    courseTeachersFile,
    courseTransactionsFile,
    getNextId,
    isUnique,
    validarProfesor,
    validarCurso,
    validarAlumno,
    validarProfesorAsignadoACurso,
    validarEstudianteEnCurso,
    validarDependenciaEstudiante,
    validarDependenciaProfesor,
    validarDependenciaCursoAlumno,
    validarDependenciaCursoProfesor
};
