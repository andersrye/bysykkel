<template>
  <div>
    <div
      class="station-title"
      data-test="title"
    >
      {{ station?.name }}
    </div>
    <div 
      class="station-info"
      data-test="address"
    >
      {{ station?.address }}
    </div>
    <div class="station-info">
      <span class="station-count">
        <FontAwesomeIcon icon="bicycle" />
        <span
          class="station-count-number"
          data-test="bikes-available"
        >{{ station?.num_bikes_available }}</span>
      </span>
      <span class="station-count">
        <FontAwesomeIcon icon="lock-open" />
        <span
          class="station-count-number"
          data-test="docks-available"
        >{{ station?.num_docks_available }}</span>
      </span>
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
.station-count-number {
  display: inline-block;
  width: 1.3em;
  margin-left: .4em;
}
</style>
