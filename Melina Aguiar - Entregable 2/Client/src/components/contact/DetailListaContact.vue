<template>
  <td>
    <span v-if="!editMode">{{ contact.email }}</span>
    <input v-else v-model="editedContact.email" />
  </td>
  <td>
    <span v-if="!editMode">{{ contact.nombre }}</span>
    <input v-else v-model="editedContact.nombre" />
  </td>
  <td>
    <span v-if="!editMode">{{ contact.comentario }}</span>
    <textarea v-else v-model="editedContact.comentario"></textarea>
  </td>
  <td >
    <span v-if="!editMode">{{ contact.telefono }}</span>
    <input v-else v-model="editedContact.telefono" />
  </td>
  <td>
    <a v-if="!editMode" @click="toggleEditMode" class="btn">
      <font-awesome-icon icon="pen-to-square" />
    </a>
    <a v-else @click="guardarEdicion" class="btn">
      <font-awesome-icon icon="save" />
    </a>
  </td>
  <td>
    <a @click="borrarContact(contact.id)" class="btn">
      <font-awesome-icon icon="trash-can" />
    </a>
  </td>
</template>

<script setup>
import { ref } from "vue";
const contact = defineProps({
  fila: Number,
  id: Number,
  email: String,
  nombre: String,
  comentario: String,
  telefono: String,
});

const emitsContact = defineEmits(["handleredit", "handlerborrar"]);

const editMode = ref(false);
const editedContact = ref({ ...contact });

const toggleEditMode = () => {
  editMode.value = !editMode.value;
};

const guardarEdicion = () => {
  emitsContact("handleredit", editedContact.value);
  toggleEditMode();
};
const borrarContact = (id) => {
  emitsContact("handlerborrar", id);
};
</script>

<style scoped>
.BgLight {
  background-color: rgb(192, 229, 238);
}
.BgDack {
  background-color: rgb(238, 239, 239);
}
.btn {
  padding: 0.2em 0.9em;

}

.accion-a {
  width: 3%;
  min-width: 2em;
}
.accion-b {
  width: 3%;
  min-width: 2em;
}

@media (max-width: 800px) {
  .btn {
    font-size: 1em;
  }
}
@media (max-width: 580px) {
  .btn {
    font-size: 0.9em;
  }
}

textarea, input, input[type] {
    padding: 0.1em;
    font-size: 1em;
    justify-content: end;
    justify-items: end;
    border-radius: 5px;
    border: 2px solid rgba(157, 167, 68, 0.5);
    margin-top: 0em;
    margin-bottom: 0em;
    width: 100%;
}
</style>
