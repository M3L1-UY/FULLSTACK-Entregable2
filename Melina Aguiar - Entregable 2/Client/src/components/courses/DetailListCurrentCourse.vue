<script setup>
import { computed } from "vue";


const data = defineProps({
  fila: Number,
  idCourse: String,
  nameCourse: String,
  ciTeacher: String,
  nameTeacher: String,
  surnameTeacher: String,
  costoHora: Number,
  fechaInicio: String,
  fechaFin: String,
});

let valor = true;
const classBgTr = computed(() => {
  if (data.fila % 2 === 0) {
    return "BgDack";
  }
  return "BgLight";
});

</script>

<template>
  
  <!-- <p>{{ data }}</p> -->
  <td v-if="data.idCourse != '' && data.nameCourse != ''" v-bind:class="{ meddiun: valor, classBgTr }">
    {{ data.idCourse }} <br/> {{ data.nameCourse }}
  </td>
  <td v-if="data.nameTeacher != '' && data.surnameTeacher != ''" v-bind:class="{ meddiun: valor, classBgTr }">
    {{ data.nameTeacher }}  {{ data.surnameTeacher }}
  </td>
  <td v-if="data.fechaInicio != ''" v-bind:class="{ meddiun: valor, classBgTr }">
    {{ new Date(data.fechaInicio).toLocaleDateString() }}
  </td>
  <td v-if="data.fechaFin != ''" v-bind:class="{ meddiun: valor, classBgTr }">
    {{ new Date(data.fechaFin).toLocaleDateString() }}
  </td>
  <td v-if=data.idCourse class="acction">
  <router-link :to="{
      name: 'AddStudentToCourse',
      params: { cod: data.idCourse, name: data.nameCourse, ci: data.ciTeacher },
    }"
    class="btn"
    :class="classBgTr"
  >
  <font-awesome-icon icon="fa-arrow-right" />
  </router-link>
</td>
 </template>

<style scoped>
.detalle {
  display: flex;
  align-items: center;
  background-color: white;
  color: black;
  font-size: 1.1em;
  height: 40px;
}
p {
  margin: 0 0.5em;
}

.small {
  width: 2%;
}
.meddiun {
  width: 20%;
}
.big {
  width: 25%;
}
.btn {
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  color: black;
}

.btn-primary {
  background-color: rgb(25, 112, 184);
}
.btn-edit {
  background-color: rgb(21, 138, 79);
}
.btn-del {
  background-color: rgb(182, 60, 11);
}
.acction {
  width: 5%;
  text-align: center;
}
</style>
