<template>
  <div>
  <div class="return">
    <button class="btn-back" @click="pageBack()">
      <font-awesome-icon icon="rotate-left" />
    </button>
  </div>
  <div class="form-marco listar">
    <h2 v-if="isEdit">Editar información del Estudiante</h2>
    <h2 v-else>Detalle Informativo del Estudiante</h2>

    <form @submit.prevent="isGrabar ? guardarstudent() : ''">
      <div class="grupInput">
        <div>
          <label for="ci">Número de Documento (*)</label><br />
          <input
            type="text"
            v-model="student.ci"
            :disabled="!isEditCi"
            placeholder="Ingrese nro de identificación"
            @input="handleInputChange"
            @keydown="handleEnterPress"
          />
        </div>
        <div>
          <label for="nombre">Nombres (*)</label>
          <input
            type="text"
            v-model="student.nombre"
            placeholder="Ingrese nombres"
            :disabled="!isEdit"
          />
        </div>
        <div>
          <label for="Apellidos">Apellidos (*)</label>
          <input
            type="text"
            :disabled="!isEdit"
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
          :disabled="!isEdit"
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
            :disabled="!isEdit"
            placeholder="Ingrese email de uso habitual"
          />
        </div>

        <div>
          <label for="telefono">Teléfono (*)</label>
          <input
            type="text"
            v-model="student.telefono"
            placeholder="Ingrese núm. de celular de Uso corriente"
            :disabled="!isEdit"
          />
        </div>
        <div>
          <label for="nacionalidad">Nacionalidad </label><br />
          <select v-model="student.nacionalidad">
            <option value="">Seleccione el país de procedencia</option>
            <option
              v-for="item in nationalities"
              :selected="item.nacionalidad === student.nacionalidad"
              :key="item.id"
              :value="item.nacionalidad"
              :disabled="!isEdit"
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
              :selected="nivel === student.nivelEducativo"
              :key="index"
              :value="nivel"
              :disabled="!isEdit"
            >
              {{ nivel }}
            </option>
          </select>
        </div>
        <div>
          <label for="estadoCivil">Estado Civil</label>
          <select v-model="student.estadoCivil">
            <option value="">Seleccione su estado civil</option>
            <option
              v-for="(item, ind) in estadoCivil"
              :selected="item === student.estadoCivil"
              :key="ind"
              :value="item"
              :disabled="!isEdit"
            >
              {{ item }}
            </option>
          </select>
        </div>
      </div>
      <div class="grupSelect">
        <input
          type="checkbox"
          :disabled="!isEdit"
          v-model="student.condTermino"
          class="checkbox"
        />
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
        <button v-if="isEdit" :disabled="!isEdit" type="submit" @keydown.enter.prevent>
          {{ isEdit ? "Actualizar" : "Volver" }}
        </button>
        <button  v-if="isEdit"  :disabled="!isEdit" type="button" @click="handlerLimpiar()">
          Limpiar
        </button>
      </div>
    </form>
  </div>
</div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from "vue";
import { nationalities, nivelEducativo, estadoCivil } from "./utilStudent";
import Message from "../servicios/Mensaje.vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const url = "http://localhost:5000/api";

// Busco parametros de la ruta
const route = useRoute();
let message = ref("");
let seatchStudents = ref(false);
let seatchStudent = "";
let studentID = ref(route.params.id);
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
let isEdit = ref(1);
let isGrabar = ref(false);
let isEditCi = ref(true);
let itemed = route.params.ed;
let show = ref(false);
let processStatus = ref("");

console.log(student)
onBeforeMount(async () => {
  if (itemed != 0) {
    isEdit.value = !isEdit.value;
  }
  if (studentID.value > 0) {
    await getStudent(studentID.value);
  }
  seatchStudents.value = !seatchStudents.value;
});

const getStudent = async (id) => {
  let sendMethod = "GET";
  let api = `${url}/student/${id}`;
  await fetch(api, {
    method: sendMethod,
  })
    .then((response) => response.json())
    .then((data) => {
      isEditCi.value = !isEditCi.value;
      isGrabar.value = true;
      student.value = data.student;
    })
    .catch((error) =>
      console.error("Error al editar info. del Estudiante:", error)
    );
};

const getStudentCi = async (ci) => {
  let sendMethod = "GET";
  let api = `${url}/studentci/${ci}`;
  await fetch(api, {
    method: sendMethod,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.exito) {
        isEditCi.value = false;
        processStatus.value = "success";
        student.value = data.student;
        isGrabar.value = true;
      } else {
        message.value = data.message;
        processStatus.value = "fail";
        showStatus(true); 
        handlerLimpiar();
      }
      ///  
    })
    .catch((error) =>
      console.error("Error al editar info. del Estudiante:", error)
    );
};

const handlerLimpiar = () => {
  (student.value.ci = ""),
    (student.value.nombre = ""),
    (student.value.apellido = ""),
    (student.value.direccion = ""),
    (student.value.email = ""),
    (student.value.telefono = ""),
    (student.value.nacionalidad = ""),
    (student.value.nivelEducativo = ""),
    (student.value.estadoCivil = ""),
    (student.value.condTermino = false);
    isEditCi.value = true;
};

const handleInputChange = (event) => {
  seatchStudent = event.target.value;
};

const handleEnterPress = (event) => {
  if (event.key === "Enter" && seatchStudent) {
    getStudentCi(seatchStudent);
    seatchStudent = "";
  }
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
    id: student.value.id ? student.value.id : 0,
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

  let sendMethod = "PUT";
  let api = `${url}/student/${student.value.id}`;
  await fetch(api, {
    method: sendMethod,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      message.value = data.message;
      if (data.exito) {
        processStatus.value = "success";
        isGrabar.value = false;
        handlerLimpiar();
          setTimeout(() => {
          router.push({ name: 'ListStudents' }); 
          }, 1500);
      } else {
        processStatus.value = "fail";
      }
      
      showStatus(true);
    })
    .catch((error) => { message.value = error.message;
        processStatus.value = "fail";
        showStatus(true);
    });
};

function mostrarError(mensaje, status) {
  message.value = mensaje;
  processStatus.value = status;
  showStatus(true);
}

const pageBack = () => {
  router.back();
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
