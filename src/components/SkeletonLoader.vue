<template>
  <div >
    <li class="table-row skeleton" v-for="departure in 10" :key="departure">
      <div class="col col-1" data-label="Departure time"></div>
      <div class="col col-2" data-label="City Name"></div>
      <div class="col col-3" data-label="Code"></div>
      <div class="col col-4" data-label="Airline"></div>
      <div class="col col-5" data-label="Gate"></div>
      <div class="col col-6"></div>
    </li>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>