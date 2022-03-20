<template>
  <div>
    <StationListItem v-for="station of stationList"
                     :station="station"
                     :station-status="stationStatusById[station.station_id]"
                     :key="station.station_id"
                     @click="$emit('item-click', station.station_id)"/>
  </div>
</template>

<script>
import StationListItem from "@/components/StationListItem";

export default {
  name: 'StationList',
  components: { StationListItem },
  props: {
    stationInfo: Object,
    stationStatus: Object,
    filterText: String
  },
  computed: {
    stationStatusById() {
      return this.stationStatus?.data?.stations?.reduce((acc, status) => {
        acc[status.station_id] = status
        return acc
      }, {}) ?? {}
    },
    stationList() {
      const stations = this.stationInfo?.data?.stations ?? []
      return [...stations]
          .filter(station => {
            return !this.filterText
            || station.name?.toLowerCase()?.includes(this.filterText.toLowerCase())
            || station.address?.toLowerCase()?.includes(this.filterText.toLowerCase())
          })
          .sort((a, b) => a.name.localeCompare(b.name))
    },
  },
}
</script>
