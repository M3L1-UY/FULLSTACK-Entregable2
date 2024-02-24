<template>
    <div>
    <div class="form-marco listar" >
      <h2>Registro de Curso</h2>
      <form @submit.prevent="guardarCurso()">
        <div class="grupInput">
          <div>
            <label for="codigo">Código (*) </label><br />
            <input
              type="text"
              v-model="course.codigo"
              placeholder="Ingrese un código"
            />
          </div>
          <div>
            <label for="nombre">Nombre (*)</label>
            <input
              type="text"
              v-model="course.nombre"
              placeholder="Ingrese el nombre"
            />
          </div>
        </div>
        <div>
          <label for="descripcion">Descripción (*) </label>
          <textarea
            id="direccion"
            v-model="course.descripcion"
            rows="2"
            placeholder="Ingrese la descripción"
          >
          </textarea>
        </div>
        <div class="grupInput">
          <div>
            <label for="costo">Costo (*)</label>
            <input
              type="number"
              v-model="course.costo"
              placeholder="Ingrese el costo"
            />
          </div>
        </div>
    
        <div class="grupSelect">
          <input type="checkbox" v-model="course.status" class="checkbox" />
          <label for="status">
            Curso activo</label>
        </div>
        <Message
          v-if="show"
          :message="message"
          :status="processStatus"
          @blockShow="showStatus"
        />
        <div class="botones">
          <button type="submit"> Registrar </button>
          <button type="button" @click="handlerLimpiar()">Limpiar</button>
        </div>
      </form>
    </div>
  </div>
  </template>
  
  <script setup>
  import { ref , computed} from 'vue'
  import Swal from "sweetalert2";
  import { useRouter } from "vue-router";

  
  const url = "http://localhost:5000/api";
  let message = ref("");
   let course = ref({
    codigo: "",
    nombre: "",
    descripcion: "",
    costo: "",
    status: false,
  });
  
  const handlerLimpiar = () => {
    course.value.codigo = "",
    course.value.nombre = "",
    course.value.descripcion = "",
    course.value.costo = "",
    course.value.status = false
  };
  
  const guardarCurso = () => {
  if (camposObligatoriosIncompletos.value) {
    mostrarError("Los campos con (*) son requeridos", "warning");
     } else {
        if (numeroNoValido()) {
            mostrarError("El costo debe ser mayor a 0", "warning");
        } else {
             enviarDatosCurso();
        }
    }
  };
  
  const camposObligatoriosIncompletos = computed(() => {
    const camposObligatorios = [
      "codigo",
      "nombre",
      "descripcion",
      "costo",
    ];
    return camposObligatorios.some((campo) => !course.value[campo]);
  });
  
  const numeroNoValido = () => {
    return isNaN(course.value.costo) || course.value.costo <= 0;
  };
  
  const enviarDatosCurso = async () => {
    const data = {
    codigo: course.value.codigo ,
    nombre: course.value.nombre.trim(),
    descripcion: course.value.descripcion.trim(),
    costo: course.value.costo,
    status: course.value.status,
    };
  
    let sendMethod = "POST";
    let api = `${url}/course`;
    console.log(data)
    await fetch(api, {
      method: sendMethod,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.exito) {
              Swal.fire({
                title: "Éxito",
                text: data.message,
                icon: "success",
              });
              handlerLimpiar();
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
                text: data.message,
                icon: "error",
              });
      });
  };

  </script>
  
  <style scoped>
  table {
    max-width: 100%;
    font-size: 1.2em;
  }
  .titulo {
    background-color: rgb(165, 171, 176);
  }
  
  table tr {
    height: 45px;
  }
  
  .form-marco {
    border: 1px solid black;
    border-radius: 10px;
  }
  
  .form-marco > form {
    margin: 20px;  
    border-radius: 0 0 10px 10 px;
  }
  .grupSelect {
    display: flex;
    justify-content: start;
    margin-top: 10px;
  }
  .botones {
    margin: 0.6em 0;
    display: flex;
    justify-content: space-around;
    font-size: 1.3em;
    font-weight: 600;
  }
  
  .checkbox {
    width: auto;
  }

  </style>
  