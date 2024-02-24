<template>
  <!-- <th :class="classBgTr">{{ fila }}</th> -->
  <th class="text-lf codigo" :class="classBgTr">{{ student.ci }}</th>
  <th class="text-lf nombre" :class="classBgTr">{{ student.nombre }}</th>
  <th class="text-lf apellido" :class="classBgTr">{{ student.apellido }}</th>
  <th class="text-rg email" :class="classBgTr">{{ student.email }}</th>
  <th class="text-rg telefono" :class="classBgTr">{{ student.telefono }}</th>
  <th class="accion-a" :class="classBgTr">
    <a @click="asignarStudent()">
    <font-awesome-icon icon="fa-pen-nib" />
    </a>
  </th>
</template>

<script setup>
import { computed } from "vue";
import Swal from "sweetalert2";

const student = defineProps({
  fila: Number,
  id: Number,
  ci: String,
  nombre: String,
  apellido: String,
  email: String,
  telefono: String,
  condTermino: Boolean,
  idCourse: String,
  ciTeacher: String
});

const emitStudent = defineEmits(["handleAsign"]);
const classBgTr = computed(() => {
  if (student.fila % 2 === 0) {
    return "BgDack";
  }
  return "BgLight";
});

const asignarStudent = () => {
  if(!student.condTermino)
  {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "El alumno no puede inscribirse al curso, debe primero aceptar las condiciones.",
      showConfirmButton: false,
      timer: 1000
    });
  }
  else 
  emitStudent("handleAsign", student.ci, student.idCourse, student.ciTeacher);
};
</script>

<style scoped>
.BgLight {
  background-color: rgb(192, 229, 238);
}
.BgDack {
  background-color: rgb(238, 239, 239);
}
.btn {
  padding: 0.2em 0.9em;
}

.accion-a {
  width: 3%;
  min-width: 2em;
}
.accion-b {
  width: 3%;
  min-width: 2em;
}

@media (max-width: 800px) {
  .btn {
    padding: 0.2em 0.5em;
    font-size: 1em;
  }
}
@media (max-width: 580px) {
  .btn {
    padding: 0.2em 0.3em;
    font-size: 0.9em;
  }
}
</style>
