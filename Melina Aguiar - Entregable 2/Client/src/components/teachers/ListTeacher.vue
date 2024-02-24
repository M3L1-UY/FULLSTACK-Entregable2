<template>
    <div class="listar form-marco">
      <h2>Listado de Profesores</h2>
      <div v-if="ifTeacher">
        <h3>Cargando...</h3>
      </div>
      <div class="table-wrapper">
      <table v-if="!ifTeacher" >
        <tr class="titulo">
          <th width="15%">CI</th>
          <th width="20%">Nombre</th>
          <th width="25%">Email</th>
          <th width="15%">Teléfono</th>
          <th colspan="3" width="25%">Acción</th>
        </tr>
        <tbody>
          <tr v-for="(teacher, index) in teachers" :key="teacher.id">
            <DetalleTeacher
              :fila="index"
              :id="teacher.id"
              :ci="teacher.ci"
              :nombre="teacher.nombre"
              :apellido="teacher.apellido"
              :direccion="teacher.direccion"
              :email="teacher.email"
              :telefono="teacher.telefono"
              :status="teacher.status"
              @handleClick="eliminarTeacher"
            />
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import DetalleTeacher from "@/components/teachers/DetalleTeacher.vue";
  import Swal from "sweetalert2";
  const url = "http://localhost:5000/api";
  
  const teachers = ref([]);
  const ifTeacher = ref(false);

  const cargarTeachers = async() => {
    ifTeacher.value = true;
    let api = `${url}/teacher`;
    await fetch(api)
      .then((response) => response.json())
      .then((data) => {
        teachers.value = data;
        ifTeacher.value = false;
      })
      .catch((error) =>
        console.error("Error al cargar la Tabla de Profesores:", error)
      );
  }
  onMounted(async () => {
    cargarTeachers();
  });

  const eliminarTeacher = async (nombre, apellido, id) =>  {
  if (!id) {
     Swal.fire({
      title: "Oops",
      text: "Por favor, seleccione un profesor",
      icon: "error",
    });
  } else {
    Swal.fire({
      title: "Eliminar Profesor",
      text: `¿Confirmar la eliminación de ${nombre} ${apellido}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let api = `${url}/teacher/${id}`;
        fetch(api, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.exito) {
              Swal.fire({
                title: "Éxito",
                text: "Profesor eliminado exitosamente",
                icon: "success",
              });
              cargarTeachers();
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

table{
  min-width: 350px;
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
