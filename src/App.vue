<template>
  <div>
    <StationMap
      class="bicycle-map"
      data-test="map"
      :stations="stations"
      :selected-station="selectedStation"
      :show-bikes="showBikes"
      :bounds="bounds"
    />
    <button
      v-if="showBikes"
      class="lower-left-button button is-light"
      data-test="docks-button"
      @click="showBikes = false"
    >
      <span class="icon">
        <FontAwesomeIcon icon="lock-open" />
      </span>
      <span>Vis ledige plasser</span>
    </button>
    <button
      v-if="!showBikes"
      class="lower-left-button button is-link"
      data-test="bikes-button"
      @click="showBikes = true"
    >
      <span class="icon">
        <FontAwesomeIcon icon="bicycle" />
      </span>
      <span>Vis ledige sykler</span>
    </button>
    <StatusIndicator
      class="status-indicator"
      data-test="status-indicator"
      :status="status"
    />
    <transition name="fade">
      <button
        v-if="!showSearch"
        class="lower-right-button button is-link"
        data-test="search-button"
        @click="showSearch = true"
      >
        <span class="icon">
          <FontAwesomeIcon icon="search" />
        </span>
        <span>Søk</span>
      </button>
    </transition>
    <transition name="fade">
      <StationSearch
        v-if="showSearch"
        class="station-search"
        :stations="stations"
        data-test="search-view"
        @close="showSearch = false"
        @selected-station="stationSelected"
      />
    </transition>
  </div>
</template>

<script setup>
import {ref, computed, watchEffect, shallowRef} from "vue"
import StationMap from "@/components/StationMap.vue"
import StationSearch from "@/components/StationSearch.vue"
import Gbfs from '@/gbfs'
import sources from '@/gbfs-sources.json'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import StatusIndicator from "@/components/StatusIndicator.vue";

const systemInfo = shallowRef(null)
const stationInfo = shallowRef(null)
const stationStatus = shallowRef(null)
const selectedStation = shallowRef(null)
const showBikes = ref(true)
const showSearch = ref(false)
const status = ref("loading")
const sourceName = new URLSearchParams(window.location.search).get('source') ?? 'oslo'
const source = sources[sourceName]
const gbfs = new Gbfs(source?.url, {clientId: 'andersrye-bysykkeltest'})
const bounds = source?.bounds

const stations = computed(() => {
  //merge the station info and status to make it easier to handle
  const statusById = stationStatus.value?.data?.stations?.reduce((acc, status) => {
    acc[status.station_id] = status
    return acc
  }, {}) ?? {}
  return stationInfo.value?.data?.stations.map(info => ({...info, ...statusById[info.station_id]}))
})

gbfs.getSystemInfo()
    .then(res => systemInfo.value = res)
    .catch(handleError)

gbfs.getStationInfo()
    .then(res => stationInfo.value = res)
    .catch(handleError)

pollStationStatus()
    .catch(handleError)

watchEffect(() => {
  if(systemInfo.value && stationInfo.value && stationStatus.value) {
    status.value = 'ok'
  }
})

async function pollStationStatus() {
  for await (const status of gbfs.streamStationStatus()) {
    stationStatus.value = status
  }
}

function stationSelected(station) {
  showSearch.value = false
  selectedStation.value = station
}

function handleError(error) {
  console.error(error)
  //todo: this is not a great way to handle errors. automatically retry and update status
  status.value = 'error'
}
</script>

<style scoped>

.bicycle-map {
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.station-search {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  margin: 8px 8px 32px 8px;
  height: calc(100% - 40px);
  width: calc(100% - 16px);
  max-width: 450px;
  overflow: auto;
}

.lower-left-button {
  position: absolute;
  left: 0;
  bottom: 0;
  margin: 8px 8px 36px 8px;
}

.lower-right-button {
  position: absolute;
  right: 0;
  bottom: 0;
  margin: 8px 8px 36px 8px;
}

.status-indicator {
  position: absolute;
  top: 0;
  left: 0;
  margin: 8px
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
