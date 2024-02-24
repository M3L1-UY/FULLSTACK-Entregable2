<template>
  <div>
    <div class="return">
    <button class="btn-back" @click="pageBack()">
      <font-awesome-icon icon="rotate-left" />
    </button>
    </div>
    <div class="listar form-marco">
    <h2>Agregar Profesor a Curso</h2>
    <div class="container marco">
      <div class="search-bar">
        <Search :propData="datosTea" @filtrarDatos="cargarTeas" />
      </div>
      <div class="listbox" ref="listbox" @click="handleListboxClick">
        <div
          v-for="teacher in teachers"
          :key="teacher.id"
          :class="{ 'listbox-item': true, 'active': teacher.id === selectedTeacherId }"
          @click="selectTeacher(teacher)"
        >
          {{ teacher.nombre }} {{ teacher.apellido }}
        </div>
      </div>
    </div>
    <div class="inputs marco">
      <div class="input">
        <label for="costoHora">Costo por hora:</label>
        <input type="number" id="costoHora" v-model="costoHora" min="0" step="0.01" />
      </div>
      <div class="input">
        <label for="fechaInicio">Fecha de inicio:</label>
        <input type="date" id="fechaInicio" v-model="fechaInicio" :min="today" />
      </div>
      <div class="input">
        <label for="fechaFin">Fecha de fin:</label>
        <input type="date" id="fechaFin" v-model="fechaFin" :min="fechaInicio" />
      </div>
    </div>
    <div class="btnCentrado">
    <button  @click="confirmAddTeacher">Agregar como Profesor</button>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Search from "../servicios/Seach.vue";
import Swal from "sweetalert2";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();

const url = "http://localhost:5000/api";

let datosTea = ref([]);
let datosTeas = ref([]);

const courseCod = ref(route.params.cod);
const teachers = ref([]);
const searchTerm = ref("");
const selectedTeacherId = ref(null);
const selectedTeacherCi = ref(null);
const costoHora = ref(0);
const fechaInicio = ref("");
const fechaFin = ref("");


const today = new Date().toISOString().split("T")[0];

const cargarProfesores = async () => {
  try {
    let api = `${url}/teacher`;
    const response = await fetch(api);
    const data = await response.json();
    if (data) {
      const teachersStatusTrue = data.filter((teacher) => teacher.status === true);
      console.log(teachersStatusTrue);
      teachers.value = teachersStatusTrue;
      datosTeas.value = teachersStatusTrue; 
      datosTea = teachersStatusTrue.map((elem) => ({
        id: elem.id,
        ci: elem.ci,
        nombre: elem.nombre,
        apellido: elem.apellido,
        email: elem.email,
        telefono: elem.telefono,
      }));
    } else {
      console.error("Error: El estado de la respuesta es falso.");
    }
  } catch (error) {
    console.error("Error al cargar registros:", error);
  }
};

const cargarTeas = (datosFilter) => {
  if (datosFilter.length === 0) {
    teachers.value = datosTeas.value;
  } else {
    teachers.value = datosFilter;
  }
};

const selectTeacher = (teacher) => {
  selectedTeacherId.value = teacher.id;
  selectedTeacherCi.value = teacher.ci;
};

const confirmAddTeacher = () => {
  if (!selectedTeacherId.value) {
    Swal.fire({
        title: "Oops",
        text: "Por favor, seleccione un profesor",
        icon: "error",
      });
  } else {
    const selectedTeacher = teachers.value.find(
      (teacher) => teacher.id === selectedTeacherId.value
    );
    if (!selectedTeacher) {
      Swal.fire({
        title: "Oops",
        text: "Profesor seleccionado no encontrado",
        icon: "error",
      });
    } else {
      Swal.fire({
        title: "Agregar como Profesor",
        text: `¿Desea agregar a ${selectedTeacher.nombre} como profesor?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          addTeacher();
        }
      });
    }
  }
};

const addTeacher = async () => {
  const data = {
    idCourse: courseCod.value,
    ciTeacher: selectedTeacherCi.value,
    costoHora: costoHora.value,
    fechaInicio: fechaInicio.value,
    fechaFin: fechaFin.value,
  };
  try {
    const response = await fetch(`${url}/courseAddTeacher`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (responseData.exito) {
      Swal.fire({
        title: "Éxito",
        text: "Profesor agregado exitosamente",
        icon: "success",
      });
      costoHora.value = 0;
      fechaInicio.value = "";
      fechaFin.value = "";
    } else {
      Swal.fire({
        title: "Error",
        text: responseData.message,
        icon: "error",
      });
    }
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: error.message,
      icon: "error",
    });
  }
};

const handleListboxClick = (event) => {
  event.stopPropagation();
};

watch(searchTerm, () => {
  selectedTeacherId.value = null; 
});

onMounted(cargarProfesores);

const pageBack = () => {
  router.back();
  };

</script>

<style>

table {
    min-width: 100px; 

}
.container {
  display: flex;
}

.listbox {
  max-height: 300px;
  width: 50%; 
  overflow-y: auto;
}

.search-bar {
  flex-grow: 1;
}

.inputs {
  margin-top: 1rem;
}

.inputs .input {
  display: inline-block;
  width: calc(33.33% - 1rem);
  margin-right: 1rem;
}

.inputs input[type="number"],
.inputs input[type="date"] {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

.listbox-item {
  padding: 0.4rem;
  cursor: pointer;
  font-size: 1.1rem;
}

.listbox-item.active {
  background-color: #f0f0f0;
}

.btnCentrado {
  display: flex;
  position: relative;
  justify-content: center;
  text-align: center;
  margin-bottom: 15px; 
}

@media (max-width: 1250px) {
  .listbox-item {font-size: 1.0rem;}
}

@media (max-width: 1150px) {
  .listbox-item {font-size: 0.9rem;}
}

@media (max-width: 950px) {
  .listbox-item {font-size: 0.8rem;}
}

@media (max-width: 750px) {
  .listbox-item {font-size: 0.7rem;}
}

@media (max-width: 550px) {
  .listbox-item {font-size: 0.6rem;}
}

.container.marco {
  display: flex;
  justify-content: space-between; 
  flex-wrap: wrap; 
}

.inputs.marco {
  display: flex;
  flex-wrap: wrap; 
}

.inputs.marco .input {
  width: calc(33.33% - 1rem);
  margin-right: 1rem;
}

.inputs.marco input[type="number"],
.inputs.marco input[type="date"] {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

@media (max-width: 750px) {
  .container.marco {
    flex-direction: column; 
  }

  .inputs.marco .input {
    width: 100%; 
    margin-right: 0; 
  }
}

</style>
