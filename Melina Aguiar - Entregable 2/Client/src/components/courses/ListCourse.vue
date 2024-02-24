<template>
  <div class="listar table-wrapper form-marco"> 
    <h2>Listado General de Cursos</h2>
    <div class="table-wrapper">
      <table v-if="ifResult" width="100%">
        <tr class="titulo">
          <th width="12%">Codigo</th>
          <th width="20%">Nombre</th>
          <th width="35%">Descripcion</th>
          <th width="10%">Costo</th> 
          <th width="10%">Status</th>       
          <th colspan="2" width="13%">Acciones</th> 
        </tr>
        <tbody>
          <tr v-for="(course, index) in courses" :key="course.codigo">
            <td>
              <span>{{ course.codigo }}</span>
            </td>
            <td>
              <span v-if="!course.editMode">{{ course.nombre }}</span>
              <input v-else v-model="editedCourses[index].nombre" />
            </td>
            <td>
              <span v-if="!course.editMode" >{{ course.descripcion }}</span>
              <textarea v-else v-model="editedCourses[index].descripcion"></textarea>
            </td>
            <td class="centerText">
              <span v-if="!course.editMode">{{ course.costo }}</span>
              <input v-else v-model="editedCourses[index].costo" />
            </td>
            <td class="centerText">
              <font-awesome-icon
                :icon="editedCourses[index].status ? 'toggle-on' : 'toggle-off'"
                @click="course.editMode ? toggleStatus(editedCourses[index]) : null"
                :class="{ 'toggle-on': editedCourses[index].status, 'toggle-off': !editedCourses[index].status }"
               
                />
            </td>
            <td class="centerText">
              <a v-if="course.editMode" @click="guardarEdicion(course, index)" class="btn">
                <font-awesome-icon icon="save" 
              />
              </a>
              <a v-else @click="toggleEditMode(course)" class="btn">
                <font-awesome-icon icon="pen-to-square" 
                />
              </a>
            </td>
            <td class="acction">
              <a @click="eliminarCurso(course.codigo)">
                <font-awesome-icon icon="trash-can" 
                />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>No hay cursos registrados</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";

const url = "http://localhost:5000/api";
const courses = ref([]);
const ifResult = ref(false);
const editedCourses = ref([]);

const cargarCursos = async () => {
  ifResult.value = true;
  let api = `${url}/course`;

  await fetch(api)
    .then((response) => response.json())
    .then((data) => {
      data.sort((a, b) => a.codigo.localeCompare(b.codigo));
      courses.value = data;
      editedCourses.value = data.map((course) => ({ ...course }));
      ifResult.value = data.length > 0;
    })
    .catch((error) =>
      console.error("Error al cargar la Tabla de Cursos:", error)
    );
};

const eliminarCurso = async (codigo) => {
  Swal.fire({
    title: "Eliminar Curso",
    text: `¿Confirmar la eliminación del curso?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  }).then(async (result) => {
    if (result.isConfirmed) {
      let api = `${url}/course/${codigo}`;
      fetch(api, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.exito) {
            Swal.fire({
              title: "Éxito",
              text: "Curso eliminado exitosamente",
              icon: "success",
            });
            cargarCursos();
          } else {
            Swal.fire({
              title: "Error",
              text: data.message,
              icon: "error",
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
          });
        });
    }
  });
};

const toggleEditMode = (course) => {
  const index = courses.value.findIndex((c) => c.id === course.id);
  if (index !== -1) {
    courses.value[index].editMode = !courses.value[index].editMode;
  }
};

const guardarEdicion = async (course, index) => {
  let sendMethod = "PUT";
  let api = `${url}/course/${course.id}`;
  await fetch(api, {
    method: sendMethod,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedCourses.value[index]),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.exito) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: data.message,
          showConfirmButton: false,
          timer: 1000,
        });
        cargarCursos();
        toggleEditMode(course); // Movido aquí para asegurarse de que se llame después de cargarCursos()
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: data.message,
          showConfirmButton: false,
          timer: 1000,
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    });
};

const toggleStatus = (course) => {
  course.status = !course.status;
};

cargarCursos();

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
table {
  min-width: 200px;
}
table > tbody > tr {
  height: 40px;
  background-color: rgb(220, 219, 219);
}

table > tbody > tr:hover {
  background-color: rgb(169, 165, 165);
}


textarea, input, input[type] {
    padding: 0.1em;
    font-size: 1em;
    justify-content: end;
    justify-items: end;
    border-radius: 5px;
    border: 2px solid rgba(157, 167, 68, 0.5);
    margin-top: 0em;
    margin-bottom: 0em;
    width: 100%;
}
.font-awesome-icon {
  font-size: 30px; 
}
.buscar {
  width: 100%;
}
.acction {
  width: 5%;
  text-align: center;
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

.toggle-on {
  color: #1fb161; 
}

.toggle-off {
  color: #ff0000; 
}
</style>


