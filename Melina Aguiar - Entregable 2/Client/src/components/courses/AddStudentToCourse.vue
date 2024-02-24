<template>
      <div class="return">
    <button class="btn-back" @click="pageBack()">
      <font-awesome-icon icon="rotate-left" />
    </button>
    </div>
    <div>
      <div class="listar form-marco table-wrapper">
        
        <h2>Inscribir estudiantes</h2>
        <div class="marco">
        <h4 >Curso: {{ courseCod }} - {{ courseName }}</h4>
        <Seach :propData="datosStud" @filtrarDatos="cargarStuds" />
      <div class="table-wrapper">
        <table class="table-wrapper">
          <tr class="titulo">
            <th class="ci" width="10%">Cedula</th>
            <th class="nombre" width="10%">Nombre</th>
            <th class="apellido" width="10%">Apellido</th>
            <th class="email" width="20%">Email</th>
            <th class="telefono" width="10%">Telefono</th>
            <th class="accion" width="10%">Inscribir</th>
          </tr>
          <tr v-for="(student, index) in students" :key="student.codigo">
            <DetailListStudent
              :fila="index"
              :id="student.id"
              :ci="student.ci"
              :nombre="student.nombre"
              :apellido="student.apellido"
              :email="student.email"
              :telefono="student.telefono"
              :condTermino="student.condTermino"
              :idCourse= "courseCod"
              :ciTeacher= "ciTeacher"
              @handleAsign="asignarStudent"
            />
          </tr>
        </table>
      </div>
    </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import Seach from "../servicios/Seach.vue";
  import DetailListStudent from "./DetailListStudent.vue";
  import Swal from "sweetalert2";
  import { useRoute, useRouter } from "vue-router";
  const router = useRouter();
  const route = useRoute();

  const url = "http://localhost:5000/api";
  let datosStud = ref([]);
  let datosStuds = ref([]);
  let students = ref([]);

  let courseCod = ref(route.params.cod);
  let ciTeacher = ref(route.params.ci);
  let courseName = ref(route.params.name);

  const asignarStudent = async (student, course, teacher) => {

    
    const data = {
        idCourse: course,
        ciStudent: student,
        ciTeacher: teacher,
    };

    if (!data.ciStudent) {
    Swal.fire({
        title: "Oops",
        text: "Por favor, seleccione un profesor",
        icon: "error",
      });
    } else {
      Swal.fire({
      title: "Agregar Alumno a Curso",
      text: `¿Confirmar la inscripción?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then(async (result) => { 
    if (result.isConfirmed) {
        let sendMethod = "POST";
        let api = `${url}/courseAddStudent`;

        try {
            const response = await fetch(api, {
                method: sendMethod,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();

            if (responseData.exito) {
              Swal.fire({
                title: "Éxito",
                text: "Alumno agregado exitosamente",
                icon: "success",
              });
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
    }
});
    }
  }
  const cargarStudents = async () => {
    let api = `${url}/student`;
    await fetch(api)
      .then((response) => response.json())
      .then((data) => {
          data.sort((a, b) => a.ci.localeCompare(b.ci));
          students.value = data;
          datosStuds.value = data; 
          datosStud = data.map((elem) => ({
          id: elem.id,
          ci: elem.ci,
          nombre: elem.nombre,
          apellido: elem.apellido,
          email: elem.email,
          telefono: elem.telefono,
          condTermino: elem.condTermino,
        }));
      })
      .catch((error) => console.error("Error al cargar registros:", error));
  };
  
  const cargarStuds = (datosFilter) => {
  if (datosFilter.length === 0) {
    students.value = datosStuds.value;
  } else {
    students.value = datosFilter;
  }
};
  cargarStudents();

  const pageBack = () => {
  router.back();
  };
  </script>
  
  <style>


  table th {
    height: 2rem;
    min-width: 30px;
  }

  .titulo {
    background-color: rgb(165, 171, 176);
  }
  
  .btn-primary {
    background-color: rgb(75, 153, 243);
  }
  .btn-segundary {
    background-color: rgb(95, 147, 100);
  }

  th{
    font-weight:100;
  }

  </style>
  