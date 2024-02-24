<script setup>
import { RouterView } from "vue-router";
import MenuBar from "./components/menu/MenuBar.vue";
</script>

<template>
  <header>
    <div class="wrapper">
      <div class="logo">ACADEMIA IT</div>
      <MenuBar />
    </div>
  </header>
  <RouterView />
</template>

<style>
* {
  padding: 0;
  margin: 0 ;
  box-sizing: border-box;
  font-family:'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; 
}

body{
  min-width: 300px;
  margin-bottom: 3rem;
}


header {
  background-color: rgb(28, 104, 66);
  color: white;
  font-size: 1.5rem;
  border: 0px;
  margin: 0;
  padding: 0;
}

.logo {
  display: block;
  margin: 0 1rem;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  font-style: italic;
}

header .wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: rgb(28, 104, 66);
}

textarea,
select,
input,
input[type] {
  padding: 0.3em;
  font-size: 1.2em;
  border-radius: 5px;
  border: 2px solid rgba(126, 128, 130, 0.5);
  margin-top: 0.2em;
  margin-bottom: 0.5em;
  width: 100%;
}

textarea:focus,
select:focus,
input:focus,
input[type]:focus {
  border: 3px solid rgba(18, 108, 242, 0.5);
  outline: 0 none;
}

label {
  width: 100%;
  font-weight: 900;
  font-size: 1.1em;
}
button {
  border-radius: 10px;
  padding: 0.9em 4rem;
  border: 0.5px solid black;
  cursor: pointer;
  background-color: rgb(28, 104, 66);
  font-weight: 600;
  color: white;
}

button:hover {
  border: 0 solid black;
}
th {
  min-width: 80px;
  max-width: 300px;
}
textarea {
  margin-top: 5px;
}

table {
    overflow-x: auto;
    width: 100%; 
  }

  .checkbox{
    margin-right: 10px;
  }
.grupInput {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1em;
  margin-top: 5px;
}
.text-lf {
  text-align: left;
}
.text-rg {
  text-align: right;
}
.return {
  display: flex;
  justify-content: end;
  align-items: center;
}
.btn-back {
  margin: 10px 20px 0 0;
  padding: 5px 10px;
  background-color: white;
  font-weight: 500;
  color: blue;
  border: 0;
}

.form-titulo {
  background-color: black;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: left;
  color: white;
  border-radius: 10px 10px 0 0;
  font-size: 2.2rem;
  padding-left: 2.5rem;
}

.table-wrapper {
  overflow-x: auto;
}

.centerText{
  text-align: center;
}
.form-marco {
  margin: 3em 7em;
  border: 1px solid black;
  border-radius: 10px;
}

.form-marco > form {
  margin: 20px;
  border-radius: 0 0 10px 10px;
}

.form-marco h2 {
  position: relative;
  z-index: 1; 
  background-color: black; 
  width: 100%;
  color: white;
  padding: 10px;
}

.marco {
    padding: 1rem;
}

.listar {
  margin: 3rem;
  font-size: 1.4em;
  min-width: 300px;
}

.listar > h2 {
  border-radius: 10px 10px 0 0;
  background-color: black;
  color: white;
  height: 3rem;
  padding-left: 30px;
  display: flex;
  align-items: center;
}

.titulo {
  background-color: rgb(94, 92, 92);
  height: 2.5rem;
  color: white;
}

@media (max-width: 1650px) {
  .listar {
    font-size: 1.5em;
  }
}
@media (max-width: 1440px) {
  .listar {
    font-size: 1.4em;
  }
}

@media (max-width: 1300px) {
  .listar {
    font-size: 1.3em;
  }
}
@media (max-width: 1100px) {
  .listar {
    font-size: 1.2em;
  }
}
@media (max-width: 990px) {
  .listar {
    font-size: 1em;
  }
  .logo {
    font-size: 1.3rem;
  }
}

@media (max-width: 900px) {
  .listar {
    margin: 3rem 2rem;
    font-size: 0.95em;
  }

}

@media (max-width: 760px) {
  .listar {
    margin: 3rem 1rem;
    font-size: 0.9em;
  }
  .form-titulo {
    padding-left: 10;
    font-size: 1.4rem;
  }
  .titulo {
    padding-left: 10px;
    font-size: 0.9rem;
  }
  h2 {
    font-size: 1.2rem;
  }
}



@media (max-width: 700px) {
  .listar {
    font-size: 0.85em;
    margin: 3rem 0.5rem;
    overflow: hidden;
  }

  .titulo {
    padding-left: 10;
    font-size: 0.8rem;
  }
  h2 {
    font-size: 1.1rem;
  }
}

  
@media (max-width: 550px) {
  button {
    padding: 1em 1.1rem;
  }
  .listar {
    font-size: 0.75em;
  }
  .logo {
    font-size: 1.05rem;
    margin: 0 1rem;
  }
  .titulo {
    padding-left: 10px;
  }
  h2 {
    font-size: 1rem;
  }

}
@media (max-width: 376px) {
 
  button {
    padding: 0.9em 1rem;
  }
  .listar {
    font-size: 0.65em;
  }
  .form-titulo {
    padding-left: 10px;
    font-size: 1.4rem;
  }
  .titulo {
    padding-left: 10px;
  }
  h2 {
    font-size: 1rem;
  }
}
</style>
