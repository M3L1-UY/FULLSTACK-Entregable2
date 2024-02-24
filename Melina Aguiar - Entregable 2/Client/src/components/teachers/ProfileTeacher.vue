<template>
    <div>
    <div class="return">
      <button class="btn-back" @click="pageBack()">
        <font-awesome-icon icon="rotate-left" /> 
      </button>
    </div>
    <div class="form-marco listar">
      <h2 v-if="isEdit" >Editar información del Profesor</h2>
      <h2 v-else >Detalle Informativo del Profesor</h2>
  
      <form @submit.prevent="isGrabar ? guardarProfesor() : ''">
        <div class="grupInput">
          <div>
            <label for="ci">Número de Documento (*)</label><br />
            <input
              type="text"
              v-model="teacher.ci"
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
              v-model="teacher.nombre"
              placeholder="Ingrese nombres"
              :disabled="!isEdit"
            />
          </div>
          <div>
            <label for="Apellidos">Apellidos (*)</label>
            <input
              type="text"
              :disabled="!isEdit"
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
              v-model="teacher.email"
              :disabled="!isEdit"
              placeholder="Ingrese email de uso habitual"
            />
          </div>
        </div>

          <div>
            <label for="telefono">Teléfono (*)</label>
            <input
              type="text"
              v-model="teacher.telefono"
              placeholder="Ingrese núm. de celular de Uso corriente"
              :disabled="!isEdit"
            />
          </div>
        
        <div class="grupSelect">
          <input
            type="checkbox"
            :disabled="!isEdit"
            v-model="teacher.status"
            class="checkbox"
          />
          <label for="condiciones">
            Seleccionar para indicar estado activo del profesor en la actualidad con la institución</label
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
  import Message from "../servicios/Mensaje.vue";
  import { useRoute, useRouter } from "vue-router";

  const router = useRouter();
  const url = "http://localhost:5000/api";
  
  // Busco parametros de la ruta
  const route = useRoute();
  let message = ref("");
  let searchTeachers = ref(false);
  let searchTeacher = "";
  let teacherID = ref(route.params.id);
  let teacher = ref({
    ci: "",
    nombre: "",
    apellido: "",
    direccion: "",
    email: "",
    telefono: "",
    status: false,
  });
  let isEdit = ref(1);
  let isGrabar = ref(false);
  let isEditCi = ref(true);
  let itemid = route.params.ed;
  let show = ref(false);
  let processStatus = ref("");
  
  onBeforeMount(async () => {
    if (itemid != 0) {
      isEdit.value = !isEdit.value;
    }
    if (teacherID.value > 0) {
      await getTeacher(teacherID.value);
    }
    searchTeachers.value = !searchTeachers.value;
  });
  
  const getTeacher = async (id) => {
    let sendMethod = "GET";
    let api = `${url}/teacher/${id}`;
    await fetch(api, {
      method: sendMethod,
    })
      .then((response) => response.json())
      .then((data) => {
        isEditCi.value = !isEditCi.value;
        isGrabar.value = true;
        teacher.value = data.teacher;
        console.log(teacher.value)
      })
      .catch((error) =>
        console.error("Error al editar info. del Profesor:", error)
      );
  };
  
  const getTeacherCi = async (ci) => {
    let sendMethod = "GET";
    let api = `${url}/teacherci/${ci}`;
    await fetch(api, {
      method: sendMethod,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.exito) {
          isEditCi.value = false;
          processStatus.value = "success";
          teacher.value = data.teacher;
          isGrabar.value = true;
        } else {
          message.value = data.message;
          showStatus(true); 
          processStatus.value = "fail";
          handlerLimpiar();
        }
        ///  showStatus(true);
      })
      .catch((error) =>
        console.error("Error al editar info. del Profesor:", error)
      );
  };
  
  const handlerLimpiar = () => {
      (teacher.value.ci = ""),
      (teacher.value.nombre = ""),
      (teacher.value.apellido = ""),
      (teacher.value.direccion = ""),
      (teacher.value.email = ""),
      (teacher.value.telefono = ""),
      (teacher.value.status = false);
      isEditCi.value = true;
  };
  
  const handleInputChange = (event) => {
    searchTeacher = event.target.value;
  };
  
  const handleEnterPress = (event) => {
    if (event.key === "Enter" && searchTeacher) {
      getTeacherCi(searchTeacher);
      searchTeacher = "";
    }
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
      id: teacher.value.id ? teacher.value.id : 0,
      ci: teacher.value.ci,
      nombre: teacher.value.nombre.trim(),
      apellido: teacher.value.apellido.trim(),
      direccion: teacher.value.direccion.trim(),
      email: teacher.value.email.trim(),
      telefono: teacher.value.telefono.trim(),
      status: teacher.value.status
    };
  
    let sendMethod = "PUT";
    let api = `${url}/teacher/${teacher.value.id}`;
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
          router.push({ name: 'ListTeachers' }); 
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
  