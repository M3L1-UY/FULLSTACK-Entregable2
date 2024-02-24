<script setup>
import { computed } from "vue";

const data = defineProps({
  fila: Number,
  id: Number,
  codigo: String,
  nombre: String,
  descripcion: String,
  costo: Number,
  status: Boolean,
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
  <td v-bind:class="{ small: valor }">{{ data.codigo }}</td>
  <td v-if="data.nombre != ''" v-bind:class="{ meddiun: valor, classBgTr }">
    {{ data.nombre }}
  </td>
  <td v-if="data.costo != ''" class="centerText">
    {{ data.costo }}
  </td>
  <td v-if="data.status" class="centerText">
    <font-awesome-icon icon="fa-check " />
  </td>
  <td v-else class="centerText">
    <font-awesome-icon icon="fa-ban" />
  </td>
  <td v-if=data.id  class="acction">
    <router-link v-if="data.status"
      :to="{
        name: 'AddTeacherToCourse',
        params: { cod: data.codigo, name: data.nombre },
      }"
      class="btn"
      :class="classBgTr"
    >
    <font-awesome-icon icon="user-plus" />
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
