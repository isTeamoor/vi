<template>
  <div class="navigat">
    <h1>Выберите тип источника данных</h1>
    <router-link to="/docx" class="nav-button">Docx</router-link>
    <router-link to="/xlsx" class="nav-button">Xlsx</router-link>
    <router-link to="/msgx" class="nav-button">Msgx</router-link>
  </div>
  <router-view class="display"/>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
.navigat {
  text-align: center;
}
.display {
  background-color: aqua;
}

.nav-button {
  display: inline-block;
  padding: 10px 20px;
  margin: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  text-decoration: none; /* Убирает подчеркивание */
}
.nav-button:hover {
  background-color: #0056b3;
}
</style>