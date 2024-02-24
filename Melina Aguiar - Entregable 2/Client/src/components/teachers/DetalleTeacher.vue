  <script setup>
import { computed } from "vue";

const data = defineProps({
  fila: Number,
  id: Number,
  ci: String,
  nombre: String,
  apellido: String,
  direccion: String,
  email: String,
  telefono: String,
  status: Boolean,
});

const emit = defineEmits(["handleClick"]);

const eliminarProfesor = () => {
  emit("handleClick", data.nombre, data.apellido, data.id);
}

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
  <td v-bind:class="{ small: valor }">{{ data.ci }}</td>
  <td v-if="data.name != ''">
    {{ data.nombre }} {{ data.apellido }}
  </td>
  <td v-if="data.email != ''" >
    {{ data.email }}
  </td>
  <td v-if="data.telefono != ''" >
    {{ data.telefono }}
  </td>

  <td class="acction">
    <router-link
      :to="{
        name: 'ProfileTeacherEdit',
        params: { id: data.id, ed: 1 },
      }"
      class="btn"
      :class="classBgTr"
    >
      <font-awesome-icon icon="eye" />
    </router-link>
  </td>
  <td class="acction">
    <router-link
      :to="{
        name: 'ProfileTeacherUpdate',
        params: { id: data.id, ed: 0 },
      }"
      class="btn"
      :class="classBgTr"
    >
      <font-awesome-icon icon="pen-to-square" />
    </router-link>
  </td>
  <td class="acction">
    <a @click="eliminarProfesor()">
      <font-awesome-icon icon="trash-can" />
    </a>
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
