<template>
    <div>
    <div class="form-marco listar">
      <h2>
        {{ edit ? "Editar Perfil del Profesor" : "Registro de Profesor" }}
      </h2>
      <form @submit.prevent="guardarProfesor()">
        <div class="grupInput">
          <div>
            <label for="ci">Número de Documento (*) </label><br />
            <input
              type="text"
              v-model="teacher.ci"
              placeholder="Ingrese nro de identificación"
            />
          </div>
          <div>
            <label for="nombre">Nombres (*)</label>
            <input
              type="text"
              v-model="teacher.nombre"
              placeholder="Ingrese nombres"
            />
          </div>
          <div>
            <label for="Apellidos">Apellidos (*)</label>
            <input
              type="text"
              v-model="teacher.apellido"
              placeholder="Ingrese apellidos"
            />
          </div>
        </div>
        <div>
          <label for="direccion">Dirección de Habitación (*) </label>
          <textarea
            id="direccion"
            v-model="teacher.direccion"
            rows="2"
            placeholder="Ingrese dirección completa"
          >
          </textarea>
        </div>
        <div class="grupInput">
          <div>
            <label for="email">Correo Electrónico (*)</label>
            <input
              type="text"
              v-model="teacher.email"
              placeholder="Ingrese email"
            />
          </div>
        </div>
          <div>
            <label for="telefono">Teléfono (*)</label>
            <input
              type="text"
              v-model="teacher.telefono"
              placeholder="Ingrese núm. de celular"
            />
        </div>
        <div class="grupSelect">
          <input type="checkbox" v-model="teacher.status" class="checkbox" />
          <label for="status">
            Seleccionar para indicar estado activo del profesor en la actualidad con la institución</label>
        </div>
        <Message
          v-if="show"
          :message="message"
          :status="processStatus"
          @blockShow="showStatus"
        />
        <div class="botones">
          <button type="submit">{{ edit ? "Actualizar" : "Registrar" }}</button>
          <button type="button" @click="handlerLimpiar()">Limpiar</button>
        </div>
      </form>
    </div>
  </div>
  </template>
  
  <script setup>
  import { ref , computed} from 'vue'
  import Message from "../servicios/Mensaje.vue";
  import { useRouter } from "vue-router";
  import Swal from "sweetalert2";

  const router = useRouter()
  
  const url = "http://localhost:5000/api";
  let edit = false;
  let message = ref("");
  let show = ref(false);
  let processStatus = ref("");
  let teacher = ref({
    ci: "",
    nombre: "",
    apellido: "",
    direccion: "",
    email: "",
    telefono: "",
    status: false,
  });
  
  const handlerLimpiar = () => {
    teacher.value.ci = "",
    teacher.value.nombre = "",
    teacher.value.apellido = "",
    teacher.value.direccion = "",
    teacher.value.email = "",
    teacher.value.telefono = "",
    teacher.value.status = false,
    edit = false;
  };
  
  const showStatus = (valor) => {
    show.value = valor;
  };
  
  const guardarProfesor = () => {
  if (camposObligatoriosIncompletos.value) {
      mostrarError("Los campos con (*) son requeridos", "warning");
    } else {
      if (emailNoValido.value) {
        mostrarError("El correo electrónico no es válido", "warning");
      } else {
        enviarDatosProfesor();
      }
    }
  };
  
  const camposObligatoriosIncompletos = computed(() => {
    const camposObligatorios = [
      "ci",
      "nombre",
      "apellido",
      "direccion",
      "email",
      "telefono",
    ];
    return camposObligatorios.some((campo) => !teacher.value[campo]);
  });
  
  const emailNoValido = computed(() => {
    return !/^\S+@\S+\.\S+$/.test(teacher.value.email);
  });
  
  const enviarDatosProfesor = async () => {
    const data = {
      id: teacher.value.id,
      ci: teacher.value.ci,
      nombre: teacher.value.nombre.trim(),
      apellido: teacher.value.apellido.trim(),
      direccion: teacher.value.direccion.trim(),
      email: teacher.value.email.trim(),
      telefono: teacher.value.telefono.trim(),
      status: teacher.value.status,
    };
  
    let sendMethod = "POST";
    let api = `${url}/teacher`;
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
                text: error.message,
                icon: "error",
              });
      });
  };
   
  function mostrarError(mensaje, status) {
    message.value = mensaje;
    processStatus.value = status;
    showStatus(true);
  }
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
  