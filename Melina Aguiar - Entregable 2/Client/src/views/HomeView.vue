<template>
  <div class="background-container">
  <img src="../assets/images/Default.jpg" alt="Portada" class="image">
  <div class="welcome-text">
      Bienvenido a la Gestión de Academia IT
    </div>
</div>
</template>
<script setup></script>

<style scoped>

.background-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
}

.background-container img {
    min-width: 100%;
    min-height: 100%;
    object-fit: cover;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.welcome-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 4rem; 
  font-weight: bold;
  color: #000000;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>