<template>
  <div>
  <div class="form-marco listar">
    <h2>
      {{ edit ? "Editar Perfíl del Estudiante" : "Registro de Estudiante" }}
    </h2>
    <form @submit.prevent="guardarstudent()">
      <div class="grupInput">
        <div>
          <label for="ci">Número de Documento (*) </label><br />
          <input
            type="text"
            v-model="student.ci"
            placeholder="Ingrese nro de identificación"
          />
        </div> 
        <div>
          <label for="nombre">Nombres (*)</label>
          <input
            type="text"
            v-model="student.nombre"
            placeholder="Ingrese nombres"
          />
        </div>
        <div>
          <label for="apellido">Apellidos (*)</label>
          <input
            type="text"
            v-model="student.apellido"
            placeholder="Ingrese apellidos"
          />
        </div>
      </div>
      <div>
        <label for="direccion">Dirección de Habitación (*) </label>
        <textarea
          id="direccion"
          v-model="student.direccion"
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
            v-model="student.email"
            placeholder="Ingrese email"
          />
        </div>

        <div>
          <label for="telefono">Teléfono (*)</label>
          <input
            type="text"
            v-model="student.telefono"
            placeholder="Ingrese núm. de celular"
          />
        </div>
        <div>
          <label for="nacionalidad">Nacionalidad </label><br />
          <select v-model="student.nacionalidad">
            <option value="">Seleccione el país de procedencia</option>
            <option
              v-for="item in nationalities" :key="item.id" :value="item.nacionalidad"
            >
              {{ item.nacionalidad }}
            </option>
          </select>
        </div>
      </div>
      <div class="grupInput">
        <div>
          <label for="nivelEducativo">Nivel Educativo </label>
          <select v-model="student.nivelEducativo">
            <option value="">Seleccione su nivel educativo</option>
            <option
              v-for="(nivel, index) in nivelEducativo"
              :key="index"
              :value="nivel"
            >
              {{ nivel }}
            </option>
          </select>
        </div>
        <div>
          <label for="estadoCivil">Estado Civil</label>
          <select v-model="student.estadoCivil">
            <option value="">Seleccione su estado civil</option>
            <option v-for="(item, index) in estadoCivil" :key="index" :value="item">
              {{ item }}
            </option>
          </select>
        </div>
      </div>
      <div class="grupSelect">
        <input type="checkbox" v-model="student.condTermino" class="checkbox" />
        <label for="condiciones">
          Acepta las condiciones y terminos de la Empresa</label
        >
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
import { nationalities, nivelEducativo, estadoCivil } from './utilStudent'
import Message from "../servicios/Mensaje.vue";
import { useRouter } from "vue-router";
const router = useRouter()
import Swal from "sweetalert2";

const url = "http://localhost:5000/api";
let edit = false;
let message = ref("");
let show = ref(false);
let processStatus = ref("");
let student = ref({
  ci: "",
  nombre: "",
  apellido: "",
  direccion: "",
  email: "",
  telefono: "",
  nacionalidad: "",
  nivelEducativo: "",
  estadoCivil: "",
  condTermino: false,
});

const handlerLimpiar = () => {
    student.value.ci = "",
    student.value.nombre = "",
    student.value.apellido = "",
    student.value.direccion = "",
    student.value.email = "",
    student.value.telefono = "",
    student.value.nacionalidad = "",
    student.value.nivelEducativo = "",
    student.value.estadoCivil = "",
    student.value.condTermino = false,
    edit = false;
};

const showStatus = (valor) => {
  show.value = valor;
};

const guardarstudent = () => {
  if (camposObligatoriosIncompletos.value) {
    mostrarError("Los campos con (*) son requeridos", "warning");
  } else {
    if (emailNoValido.value) {
      mostrarError("El correo electrónico no es válido", "warning");
    } else {
      enviarDatosEstudiante();
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
  return camposObligatorios.some((campo) => !student.value[campo]);
});

const emailNoValido = computed(() => {
  return !/^\S+@\S+\.\S+$/.test(student.value.email);
});

const enviarDatosEstudiante = async () => {
  const data = {
    id: student.value.id,
    ci: student.value.ci,
    nombre: student.value.nombre.trim(),
    apellido: student.value.apellido.trim(),
    direccion: student.value.direccion.trim(),
    email: student.value.email.trim(),
    telefono: student.value.telefono.trim(),
    nacionalidad: student.value.nacionalidad,
    nivelEducativo: student.value.nivelEducativo,
    estadoCivil: student.value.estadoCivil,
    condTermino: student.value.condTermino
  };

  let sendMethod = "POST";
  let api = `${url}/student`;
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
