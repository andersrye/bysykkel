<template>
  <div>
    <StationListItem
      v-for="station in stationList"
      :station="station"
      :station-status="stationStatusById[station.station_id]"
      :key="station.station_id"
      @click="$emit('item-click', station.station_id)"
    />
  </div>
</template>

<script setup>
import {computed} from "vue";
import StationListItem from "@/components/StationListItem";

const props = defineProps({
  stationInfo: { type: Object, default: () => ({}) },
  stationStatus: { type: Object, default: () => ({}) },
  filterText: { type: String, default: "" }
})

defineEmits(['item-click'])

const stationStatusById = computed(() => {
  return props.stationStatus?.data?.stations?.reduce((acc, status) => {
    acc[status.station_id] = status
    return acc
  }, {}) ?? {}
})

const stationList = computed(() => {
  const stations = props.stationInfo?.data?.stations ?? []
  return stations
      .filter(station => {
        return !props.filterText
            || station.name?.toLowerCase()?.includes(props.filterText.toLowerCase())
            || station.address?.toLowerCase()?.includes(props.filterText.toLowerCase())
      })
      .sort((a, b) => a.name.localeCompare(b.name))
})
</script>
