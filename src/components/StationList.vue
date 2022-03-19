<template>
  <div>
    <StationListItem v-for="station of stationList" :station="station" :key="station.station_id" @click="$emit('item-click', station.station_id)"/>
  </div>
</template>

<script>
import StationListItem from "@/components/StationListItem";
export default {
  name: 'StationList',
  components: { StationListItem },
  props: {
    stationInfo: Object
  },
  computed: {
    stationList() {
      return [...this.stationInfo?.data?.stations ?? []]?.sort((a, b) => a.name.localeCompare(b.name))
    },
  },
}
</script>
