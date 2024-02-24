<template>
  <div
    class="menu-container"
    :class="{ collapsed: isCollapsed, vertical: isVertical }"
    @blur="closeMenu"
    @click="handleClickOutside"
    tabindex="0"
  >
    <button class="iconMenu" @click="toggleCollapse">
      <font-awesome-icon
      :icon="['fas', 'bars']"
      style="color: white; font-size: 22px; margin-top: -10px; margin-right: -5px;"
    />
    </button>
    <ul class="menu">
      <li
        v-for="(item, index) in menuItems"
        :key="index"
        @click.prevent="item.onClick(item)"
      >
        <font-awesome-icon v-if="item.icon" :icon="item.icon" /> {{ item.name }}
        <ul v-if="item.children && item.children.length">
          <li
            v-for="(childItem, childIndex) in item.children"
            :key="childIndex"
            @click.prevent="childItem.onClick(childItem)"
          >
            <font-awesome-icon v-if="childItem.icon" :icon="childItem.icon" />
            {{ childItem.name }}
          </li>
        </ul>
      </li>
    </ul>
  </div> 
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const profileStatus = ref("");
const isCollapsed = ref(false);
const isVertical = ref(false);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const handleItemClick = (item) => {
  const currentRoute = router.currentRoute.value;

  // Verificar si la ruta de destino es la misma que la ruta actual
  if (currentRoute.name === item.route) {
    // Verificar si los parámetros son diferentes
    if (JSON.stringify(currentRoute.params) !== JSON.stringify(item.params)) {
      router.push({ name: item.route, params: item.params });
    } else {
      // Si los parámetros son los mismos, forzar la recarga del componente
      window.location.reload();
    }
  } else {
    if (item.params) {
      router.push({ name: item.route, params: item.params });
    } else if (profileStatus.value === item.route) {
      router.push({ name: item.route, params: { id: 0, ed: 0 } });
    } else {
      router.push({ name: item.route });
    }
  }
  toggleCollapse();
};

const menuItems = [
  {
    name: "Inicio",
    icon: "home",
    route: "Inicio",
    onClick(item) {
      handleItemClick(item);
    },
  },
  {
    name: "Estudiante",
    icon: "user-pen",
    onClick() {},
    children: [
      {
        name: "Registrar",
        icon: "id-badge",
        route: "RegisterStudent",
        onClick(item) {
          handleItemClick(item);
        },
      },
      {
        name: "Perfil",
        icon: "id-badge",
        route: "ProfileStudentEdit",
        onClick(item) {
          profileStatus.value = "ProfileStudentEdit";
          handleItemClick(item);
        },
      },
      {
        name: "Listar Estudiantes",
        icon: "list",
        route: "ListStudents",
        onClick(item) {
          handleItemClick(item);
        },
      },
    ],
  },
  {
    name: "Cursos",
    icon: "book",
    onClick() {},
    children: [
      {
        name: "Registrar",
        route: "RegisterCourse",
        onClick(item) {
          handleItemClick(item);
        },
      },
      {
        name: "Cursos - Asignar Profesor",
        route: "ListCourse",
        params: { type: 0 },
        onClick(item) {
          handleItemClick(item);
        },
      },
      {
        name: "Cursos - Asignar Alumnos",
        route: "ListCourse",
        params: { type: 1 },
        onClick(item) {
          handleItemClick(item);
        },
      },
    ],
  },
  {
    name: "Profesores",
    icon: "fa-user-tie",
    onClick(item) {},
    children: [
      {
        name: "Registrar",
        route: "RegisterTeacher",
        onClick(item) {
          handleItemClick(item);
        },
      },
      {
        name: "Perfil",
        route: "ProfileTeacherEdit",
        onClick(item) {
          profileStatus.value = "ProfileTeacherEdit";
          handleItemClick(item);
        },
      },
      {
        name: "Listar Profesores",
        route: "ListTeachers",
        onClick(item) {
          handleItemClick(item);
        },
      },
    ],
  },
  {
    name: "Administración",
    icon: "building-circle-exclamation",
    onClick() {},
    children: [
      {
        name: "Listar Alumnos",
        route: "ListStudents",
        onClick(item) {
          handleItemClick(item);
        },
      },
      {
        name: "Listar Profesores",
        route: "ListTeachers",
        onClick(item) {
          handleItemClick(item);
        },
      },
      {
        name: "Listar Cursos",
        route: "ListCourses",
        onClick(item) {
          handleItemClick(item);
        },
      },
      {
        name: "Alumnos de Cursos",
        route: "ListStudentsByCourse",
        onClick(item) {
          handleItemClick(item);
        },
      },
      {
        name: "Profesores y sus Cursos",
        route: "ListTeachersByCourse",
        onClick(item) {
          handleItemClick(item);
        },
      },
      {
        name: "Listado de Contactos",
        route: "ListContact",
        onClick(item) {
          handleItemClick(item);
        },
      },
    ],
  },
  {
    name: "Contacto",
    icon: "address-card",
    route: "Contact",
    onClick(item) {
      handleItemClick(item);
    },
  },
  {
    name: "Salir",
    icon: "forward-step",
  },
];

const closeMenu = () => {
  isCollapsed.value = true; // Cerrar el menú
};

const handleClickOutside = (event) => {
  if (!event.target.closest('.menu-container')) {
    closeMenu(); // Cerrar el menú si el clic ocurre fuera del contenedor del menú
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.menu-container {
  font-family: Georgia, "Times New Roman", Times, serif;
  background-color: #f9f9f9;
  white-space: nowrap;
  height: 60px;
  font-size: 1.1rem;
  background-color: rgb(28, 104, 66);
  font-weight: 300;
  color: WHITE;
  border: 0;
  z-index: 1000; 
}
.menu {
  list-style: none;
  padding: 2px 0;
}

.menu > li {
  position: relative;
  cursor: pointer;
}

.menu > li > ul > li:hover {
  background-color: rgb(121, 124, 124);
  cursor: pointer;
}

button {
  position: absolute;
  margin-bottom: 10px;
  padding: 6px 10px;
  color: black;
  border: none;
  top: 20px;
  right: 15px;
  border-radius: 4px;
  cursor: pointer;
}

.vertical {
  width: 100%;
}

/* Menu Horizontal */
@media (min-width: 980px) {
  .iconMenu {
    display: none;
    color: white;
  }

  .menu-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border: 0px;
    outline: 0;
  }

  .menu {
    display: flex;
    flex-direction: row;
  }

  .menu > li {
    margin: 0 10px;
    padding: 5px;
  }

  .menu > li:hover > ul {
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
  }

  .menu > li > ul {
    display: none;
    list-style: none;
    padding: 0;
    background-color: #fafafa;
    border: 1px solid #ccc;
    color: black;
    border-radius: 5px;
  }

  .menu > li > ul > li {
    margin-top: 2px;
    padding: 5px 10px;
    cursor: pointer;
  }
  .collapsed .menu > ul {
    display: none;
  }
}

/* Menu Vertical */
@media (max-width: 980px) {
  .menu-container {
    border: 0px solid #ccc;
    width: 200px;
    padding: 2px 0;
    transition: width 0.3s ease-in-out;
  }

  .menu {
    position: absolute;
    display: flex;
    flex-direction: column;
    background-color: rgba(52, 57, 51, 0.9);
    top: 60px;
    border: 0px;
    font-size: 16px;
    right: 0px;
    z-index: 900;
    transition: width 20s;
  }

  .menu > ul {
    margin-bottom: 15px;
    padding: 3px 10px;
    background-color: rgba(52, 57, 51, 0.9);
  }

  .menu >  li {
    padding: 4px 15px;

  }

  .menu > li > ul {
    top: 60px;
    border: 0px;
    font-size: 14px;
    right: 0px;
    display: none;
    position: relative;
    list-style: none;
    top: 10px;
    opacity: 0;
    visibility: hidden;
    background-color: rgba(43, 41, 41, 0.9);
    transition: opacity 0.3s ease, visibility 0.3s ease;
    width: 200px;
    margin-bottom: 10px;
  }

  .menu > li:hover > ul {
    padding: 0;
    display: block;
    opacity: 1;
    visibility: visible;
    z-index: 999;
  }

  .menu > li > ul > li {
    margin: 2px 0;
    padding: 3px 10px;
  }

  .collapsed .menu {
    display: none;
  }
  .iconwidth {
    width: 20px;
  }
  .icontext {
    width: auto;
  }
}


</style>
