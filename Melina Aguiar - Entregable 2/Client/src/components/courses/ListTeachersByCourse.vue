<template>
  <div class="listar form-marco">
    <div>
      <h2>Listar Cursos de un profesor</h2>
      <Seach class="marco" :propData="datosTea" @filtrarDatos="cargarTeas" />
    </div>

    <div class="content">
      <div class="profesores">
        <h2>Profesores</h2>
        <div v-for="teacher in teachers" :key="teacher.id" class="teacher-item">   
          <div><b>{{ teacher.nombre }} {{ teacher.apellido }}</b> </div>
          <div>CI: {{ teacher.ci }} </div>
          <div>Tel: {{ teacher.telefono }} </div>
          <div>Mail: {{ teacher.email }}  </div>
          <div class="teacher-actions">
          <input type="radio" :id="'teacher' + teacher.id" :value="teacher.ci" v-model="selectedTeacher" style="display: none;">
          <label :for="'teacher' + teacher.id" class="radio-label">
            Ver cursos <font-awesome-icon icon="search" />
          </label>
        </div>
        </div>
      </div>

      <div class="cursos">
        <h2 style="margin-bottom: 20px;">Cursos</h2>
        <div v-if="ifResult" class="border" style="overflow-x: auto;">
        <table class="tabla">
          <thead>
            <tr>
              <th width= "30%">Código</th>
              <th width= "70%">Nombre</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in courses" :key="course.codigo">
              <td class="ajuste">{{ course.codigo }}</td>
              <td class="ajuste">{{ course.nombre }}</td>
            </tr>
          </tbody>
        </table>
      </div>
        <p v-else-if="!ifResult && !ifInit" style="margin-top: 20px;">No se encontraron cursos para el profesor seleccionado.</p>
      </div>
    </div>
    
    <Message
      v-if="show"
      :message="message"
      :status="processStatus"
      @blockShow="showStatus"
    />
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watchEffect } from "vue";
import Seach from "../servicios/Seach.vue";

const url = "http://localhost:5000/api";
let show = ref(false);
let datosTea = ref([]);
let datosTeas = ref([]);
let teachers = ref([]);
let selectedTeacher = ref(null);
let ifResult = ref(false);
let ifInit = ref(true);
let courses = ref([]);

const cargarProfesores = async () => {
  let api = `${url}/teacher`;
  await fetch(api)
    .then((response) => response.json())
    .then((data) => {
      teachers.value = data;
      datosTeas.value = data;
      datosTea = data.map((elem) => ({
        id: elem.id,
        ci: elem.ci,
        nombre: elem.nombre,
        apellido: elem.apellido,
        direccion: elem.direccion,
        telefono: elem.telefono,
        email: elem.email,
      }));
    })
    .catch((error) => console.error("Error al cargar registros:", error));
};

const obtenerCoursesByTeacher = async () => {
  try {
    ifInit.value = false;
    console.log("funciona watcher")
    console.log(selectedTeacher.value)
    const response = await fetch(`${url}/coursesbyteacher/${selectedTeacher.value}`);
    const data = await response.json();
    courses.value = data;
    console.log(courses.value)
    ifResult.value = data.length > 0;
    console.log(ifResult.value)
  } catch (error) {
    console.error("Error al cargar los cursos:", error);
  }
};

const showStatus = (valor) => {
  show.value = valor;
};

const cargarTeas = (datosFilter) => {
  if (datosFilter.length === 0) {
    teachers.value = datosTeas.value;
  } else {
    teachers.value = datosFilter;
  }
};

onBeforeMount(() => {
  cargarProfesores();
});

watchEffect(() => {
if (selectedTeacher.value !== null) {
  obtenerCoursesByTeacher();
}
});

</script>

<style scoped>


.container {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  font-size: large;
}

.content {
  display: flex;
  padding: 10px;
  min-width: auto;
  overflow-x: auto;
}

.profesores {  
  min-width: 100px;
  width: 50%;
  margin-right: 20px;
}
.cursos {
  min-width: 100px;
  width: 50%;
}
.teacher-item {
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  padding: 0.5rem;
  border-radius: 10px;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 10px;
}
.border{
  border: 1px solid black;
  border-radius: 10px;
}
.teacher-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.teacher-actions {
  display: flex;
  flex-direction: row;
  align-items: right;
  justify-content: right;
  margin-left: 1rem; 
}

.tabla {
    width: 100%; 
    max-width: 100%; 
}

.radio-label {
  cursor: pointer; 
  padding: 5px; 
}
.radio-label:hover {
  background-color: #f0f0f0;
}

table{
  min-width: 110px;
}
table > tbody > tr {
  height: 40px;
  background-color: rgb(220, 219, 219);
}

table > tbody > tr:hover {
  background-color: rgb(169, 165, 165);
}

@media (max-width: 400px) {
  .profesores {  
  margin-right: 10px;
  }
  .content{
    font-size: 0.6rem;
  }

.content h2 {
  padding: 5px;
}

}
</style>

