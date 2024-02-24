<template>
  <div class="listar table-wrapper form-marco">
    <h2>Listado de Estudiantes</h2>
    <div v-if="ifStudent">
      <h3>Cargando...</h3>
    </div>
    <div class="table-wrapper">
    <table v-if="!ifStudent">
      <tr class="titulo">
        <th width="10%">CI</th>
        <th width="20%">Nombre</th>
        <th width="30%">Email</th>
        <th width="15%">Teléfono</th>
        <th colspan="3" width="25%">Acción</th>
      </tr>
      <tbody>
        <tr v-for="(student, index) in students" :key="student.id">
          <DetalleStudent
            :fila="index"
            :id="student.id"
            :ci="student.ci"
            :nombre="student.nombre"
            :apellido="student.apellido"
            :direccion="student.direccion"
            :email="student.email"
            :telefono="student.telefono"
            :nacionalidad="student.nacionalidad"
            :estadoCivil="student.estadoCivil"
            :condTermino="student.condTermino"
            @handleClick="eliminarStudent"
          />
        </tr>
      </tbody>
    </table>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DetalleStudent from "@/components/students/DetalleStudent.vue";
import Swal from "sweetalert2";
const url = "http://localhost:5000/api";

const students = ref([]);
const ifStudent = ref(false);

onMounted(async () => {
  cargarStudents();
});

const cargarStudents = async() => {
  ifStudent.value = true;
  let api = `${url}/student`;
  await fetch(api)
    .then((response) => response.json())
    .then((data) => {
      students.value = data;
      ifStudent.value = false;
    })
    .catch((error) =>
      console.error("Error al cargar la Tabla de Estudiantes:", error)
    );
}

const eliminarStudent = async(nombre, apellido, id) => {
  if (!id) {
     Swal.fire({
      title: "Oops",
      text: "Por favor, seleccione un alumno",
      icon: "error",
    });
  } else {
    Swal.fire({
      title: "Eliminar Alumno",
      text: `¿Confirmar la eliminación de ${nombre} ${apellido}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let api = `${url}/student/${id}`;
        fetch(api, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.exito) {
              Swal.fire({
                title: "Éxito",
                text: "Alumno eliminado exitosamente",
                icon: "success",
              });
              cargarStudents();
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
  }
}
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
