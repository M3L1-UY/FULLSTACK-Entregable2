<template>
    <div class="listar table-wrapper form-marco">
      <h2>Estudiantes por Curso</h2>
      <div class="filter-container ">
        <br/>
        <label for="curso" >Selecciona un Curso:</label>
        <select v-model="courseId" @change="obtenerStudents">
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.courseCod}} - {{course.courseName}} - Prof. {{ course.teacherName }} {{ course.teacherSurname }}
        </option>
        </select>
      </div>
      <h4 class="tabla" v-if="ifResult">Alumnos inscriptos al curso</h4>
      <div class="tabla">
      <table v-if="ifResult" class="form-marco" >
        <thead>
          <tr class="titulo">
            <th width="30%">CI</th>
            <th width="35%">Nombre</th>
            <th width="35%">Apellido</th>
          </tr>
        </thead>
        <tbody>

      <tr v-for="(student, index) in students" :key="student.ci" :class="index % 2 === 0 ? 'BgDack' : 'BgLight'">
        <td >{{ student.ci }}</td>
        <td >{{ student.nombre }}</td>
        <td >{{ student.apellido }}</td>
      </tr>
    </tbody>

      </table>
      <h4 v-else-if="!ifResult && isFirstCharge">No se encontraron estudiantes para el curso seleccionado.</h4>
    </div>
  </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const url = "http://localhost:5000/api";
  const courses = ref([]);
  const ifResult = ref(false);
  const isFirstCharge = ref(false);
  const courseId = ref("");
  const students = ref([]);
  
  const obtenerCursos = async () => {
    try {
      const response = await fetch(`${url}/coursestagsbyteachers`);
      const data = await response.json();
      console.log(data)
      const datosOrdenados = ordenarAZ(data, "courseCod"); 
      courses.value = datosOrdenados;
      
    } catch (error) {
      console.error("Error al cargar la Tabla de Cursos:", error);
    }
  };
  
  const obtenerStudents = async () => {
    try {
      isFirstCharge.value = true;
      const coursesArray = courses.value;
      const elem = coursesArray.find(item => item.id === courseId.value);
      const response = await fetch(`${url}/students/${elem.courseCod}/${elem.teacherCI}`);
      const data = await response.json();
      const datosOrdenados = ordenarAZ(data, "apellido"); 
      students.value = datosOrdenados;
      ifResult.value = data.length > 0;
    } catch (error) {
      console.error("Error al cargar la Tabla de Alumnos:", error);
    }
  };
  
  obtenerCursos();
  
  const ordenarAZ = (data, propiedad) => { 
  return data.sort((a, b) => {
    const elemA = a[propiedad].toLowerCase(); 
    const elemB = b[propiedad].toLowerCase();
    
    if (elemA < elemB) {
      return -1;
    }
    if (elemA > elemB) {
      return 1;
    }
    return 0;
  });
};
  </script>
  
  <style scoped>


  h3 {
    widows: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.6rem;
    margin-top: 3rem;
    animation: changeColor 2s linear infinite;
  }
  p {
    display: flex;
    justify-content: center;
    font-size: 1.2rem;
    
  }

  label{
    margin-left: 10px;
  }
  table > tbody > tr {
    height: 40px;
    background-color: rgb(220, 219, 219);
  }
  
  select {
        width: 97%;
        min-width: auto;
        margin-left: 5px;
        margin-bottom: 20px;
        z-index: 1;
    }

    option {
      z-index: 1;
    }

  .tabla {
  overflow-x: auto;
  display: flex; 
  justify-content: center; 
  margin-bottom: 10px;
}

  table > tbody > tr:hover {
    background-color: rgb(169, 165, 165);
  }

  table {
    min-width: 222px;
    margin: 1em 6em;
  }
  .buscar {
    width: 100%;
  }
    
  .marco {
    min-width: 375px;
        overflow: auto;
  }

  .curso{
    padding: 10px; 
  }

  @media (max-width: 750px) {
  option {
    width: 70%;
    padding: 5px; 
    font-size: 12px; 
  }
}
  
@media (max-width: 500px) {
  option {
    width: 60%;
    padding: 5px; 
    font-size: 11px; 
  }
}
  @keyframes changeColor {
    0% {
      color: #1fb161;
    }
    25% {
      color: #ff0000;
    }
    50% {
      color: #300fd4;
    }
    80% {
      color: #fef20d;
    }
  
}


  </style>
  