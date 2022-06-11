<template>
  <div>
    <div class="station-title">
      {{ station?.name }}
    </div>
    <div class="station-info">
      {{ station?.address }}
    </div>
    <div class="station-info">
      <span class="station-count"><FontAwesomeIcon icon="bicycle" /> {{ station?.num_bikes_available }}</span>
      <span class="station-count"><FontAwesomeIcon icon="lock-open" /> {{ station?.num_docks_available }}</span>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineProps({
  station: { type: Object, default: () => ({}) }
})
</script>

<style scoped>

.station-title {
  font-size: 16px;
}
.station-info {
  font-size: 12px;
  color: #6f6f6f;
}
.station-count {
  display: inline-block;
  margin: .2em .9em .2em .1em;
}
</style>
