<template>
  <div class="card container" @click="$emit('click')">
    <div class="station-title">{{station.name}}</div>
    <div class="station-info">Addresse: {{station.address}}</div>
    <div class="station-info">Kapasitet: {{station.capacity}}</div>
  </div>
</template>

<script>
export default {
  name: "StationListItem",
  props: {
    station: Object
  },
  methods: {

  }
}
</script>

<style scoped>
.container {
  margin: 0 3px 6px 3px;
  padding: 8px;
}
.container:hover {
  background: #dfe8fd;
  cursor: pointer;
}
.station-info {
  font-size: 12px;
  color: #666;
}
</style>