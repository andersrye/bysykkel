<template>
  <div>
    <div
      v-for="station in stationList"
      :key="station.station_id"
      class="box item-container"
      @click="$emit('station-click', station)"
    >
      <StationInfo
        :station="station"
      />
    </div>
  </div>
</template>

<script setup>
import {computed} from "vue";
import StationInfo from "@/components/StationInfo";

const props = defineProps({
  stations: {type: Array, default: () => ([])},
  filterText: {type: String, default: ""}
})

defineEmits(['station-click'])

const stationList = computed(() => {
  return props.stations
      .filter(station => {
        return !props.filterText
            || station.name?.toLowerCase()?.includes(props.filterText.toLowerCase())
            || station.address?.toLowerCase()?.includes(props.filterText.toLowerCase())
      })
      .sort((a, b) => a.name.localeCompare(b.name))
})
</script>
<style scoped>

.item-container {
  margin: 0 3px 6px 3px;
  padding: 8px;
}

.item-container:hover {
  background: #dfe8fd;
  cursor: pointer;
}

</style>