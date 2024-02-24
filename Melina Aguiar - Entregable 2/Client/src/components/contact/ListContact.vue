<template>
  <div class="listar form-marco">
    <h2>Listado de Contactos</h2>
    <div class="table-wrapper">
    <table>
      <tr class="titulo">
        <th width="25%_">Correo Electrónico</th>
        <th width="15%">Nombre</th>
        <th width="40%">Comentario</th>
        <th width="10%">Teléfono</th>
        <th colspan="2" width="10%">Acción</th>
      </tr>
      <tbody>
        <tr v-for="(contacto, index) in Contactos" :key="contacto.email">
          <DetalleListaContact
            :fila="index"
            :id="contacto.id"
            :email="contacto.email"
            :nombre="contacto.nombre"
            :comentario="contacto.comentario"
            :telefono="contacto.telefono"
            @Handleredit="editProd"
            @Handlerborrar="borrarProd"
          />
        </tr>
      </tbody>
    </table>
  </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import DetalleListaContact from "./DetailListaContact.vue";
import Swal from "sweetalert2";

const url = "http://localhost:5000/api";
let datosProds = ref([]);
let Contactos = ref([]);

onBeforeMount(async () => {
  cargarContacts();
});

const editProd = async (contacto) => {
  let sendMethod = "PUT";
  let api = `${url}/contact/${contacto.id}`;
  await fetch(api, {
    method: sendMethod,
    headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contacto),
  })
    .then((response) => response.json())
    .then((data) => {
      
          if (data.exito) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: data.message,
                showConfirmButton: false,
                timer: 1000
              });
              cargarContacts();
            } else {
              Swal.fire({
                position: "center",
                icon: "fail",
                title: data.message,
                showConfirmButton: false,
                timer: 1000
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

const borrarProd = async (id) => {
  Swal.fire({
      title: "Eliminar Comentario",
      text: `¿Confirmar la eliminación?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
          let api = `${url}/contact/${id}`;
          fetch(api, {
            method: "DELETE",
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.exito) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: data.message,
                showConfirmButton: false,
                timer: 1000
              });
              cargarContacts();
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
const cargarContacts = async () => {
  let api = `${url}/contact`;
  await fetch(api)
    .then((response) => response.json())
    .then((data) => {
      Contactos.value = data;
      datosProds.value = data;
    })
    .catch((error) => console.error("Error al cargar registros:", error));
};


</script>

<style scoped>

table {
  min-width: 510px;
}

.table-wrapper{
  display: flex;
    flex-direction: row;
}

@media (max-width: 500px) {
  .table-wrapper{
    flex-direction: column;
}
  
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
</style>
