<template>
    <div class="listar table-wrapper form-marco"> 
      <template v-if=!onlyCurrents>
        <h2>Listado de Cursos - Asignar Profesor</h2>
        <div class="table-wrapper">
        <table v-if="ifResult" width="100%">
          <tr class="titulo">
            <th width="15%">Codigo</th>
            <th width="40%">Nombre</th>
            <th width="15%">Costo</th>
            <th width="15%">Status</th> 
            <th width="15%">Asignar</th>       
          </tr>
          <tbody>
            <tr v-for="(course, index) in courses" :key="course.id">
              <DetailListCourse
                :fila="index"
                :id="course.id"
                :codigo="course.codigo"
                :nombre="course.nombre"
                :descripcion="course.descripcion"
                :costo="course.costo"
                :status="course.status"
              />
            </tr>
          </tbody>
        </table>
      </div>
      </template>
      <template v-else>
        <h2>Inscripción de alumnos a cursos activos y vigentes</h2>
        <table v-if="ifResult" width="100%">
          <tr class="titulo">
            <th width="35%">Curso</th>
            <th width="20%">Profesor</th>
            <th width="15%">Fecha Inicio</th>
            <th width="15%">Fecha Fin</th>       
            <th width="15%">Inscribir</th>
          </tr>
          <tbody>
            <tr v-for="(course, index) in courses" :key="course.id">
              <DetailListCurrentCourse
                :fila="index"
                :idCourse="course.idCourse" 
                :nameCourse="course.nameCourse"
                :ciTeacher="course.ciTeacher"
                :nameTeacher="course.nameTeacher"
                :surnameTeacher="course.surnameTeacher"
                :fechaInicio="course.fechaInicio"
                :fechaFin="course.fechaFin"
              />
            </tr>
          </tbody>
        </table>
      </template>
      <p v-if=!ifResult>No hay cursos registrados</p>
    </div>
  </template>
  
  <script setup>
const router = useRouter();
  import { ref, onMounted, watch } from "vue";
  import DetailListCourse from "./DetailListCourse.vue";
  import DetailListCurrentCourse from "./DetailListCurrentCourse.vue";
  import { useRoute, useRouter } from "vue-router";
  
  const route = useRoute();

  const onlyCurrents = route.params.type == 1;

  const url = "http://localhost:5000/api";
  const courses = ref([]);
  const ifResult = ref(false);
  onMounted(async () => {
    ifResult.value = true;
    let api = (onlyCurrents) ? `${url}/coursesbyteachers` : `${url}/course`;
  
    await fetch(api)
      .then((response) => response.json())
      .then((data) => {
        courses.value = data;
        console.log(data);
        ifResult.value = data.length > 0;
      })
      .catch((error) =>
        console.error("Error al cargar la Tabla de Cursos:", error)
      );
  });

  watch(() => router.currentRoute.value.params, () => {
    window.location.reload();
});

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
  table > tbody > tr {
    height: 40px;
    background-color: rgb(220, 219, 219);
  }
  
  table > tbody > tr:hover {
    background-color: rgb(169, 165, 165);
  }
  .buscar {
    width: 100%;
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
  