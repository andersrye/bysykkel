<template>
  <div id="app">
    <StationMap
      class="bicycle-map"
      :stations="stations"
      :selected-station="selectedStation"
      :show-bikes="showBikes"
    />
    <button
      class="lower-left-button button is-light"
      v-if="showBikes"
      @click="showBikes = false"
    >
      <span class="icon">
        <FontAwesomeIcon icon="lock-open" />
      </span>
      <span>Vis ledige plasser</span>
    </button>
    <button
      class="lower-left-button button is-link"
      v-if="!showBikes"
      @click="showBikes = true"
    >
      <span class="icon">
        <FontAwesomeIcon icon="bicycle" />
      </span>
      <span>Vis ledige sykler</span>
    </button>

    <transition name="fade">
      <button
        class="lower-right-button button is-link"
        v-if="!showSearch"
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
        @close="showSearch = false"
        @selected-station="stationSelected"
      />
    </transition>
  </div>
  <span
    class="tag is-warning status"
    v-if="status === 'loading'"
  >
    <span class="icon"><FontAwesomeIcon
      icon="spinner"
      class="fa-spin"
    /></span>
    <span>Loading</span>
  </span>
  <span
    class="tag is-danger status"
    v-if="status === 'error'"
  >
    <span class="icon"><FontAwesomeIcon icon="spinner"/></span>
    <span>Loading</span>
  </span>
  <span
    class="tag is-success status"
    v-if="status === 'ok'"
  ><span class="icon"><FontAwesomeIcon icon="circle-check"/></span></span>
</template>

<script setup>
import {ref, computed, watchEffect} from "vue"
import StationMap from "./components/StationMap"
import StationSearch from "./components/StationSearch"
import Gbfs from './gbfs'
import sources from './gbfs-sources.json'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

const systemInfo = ref(null)
const stationInfo = ref(null)
const stationStatus = ref(null)
const selectedStation = ref(null)
const showBikes = ref(true)
const showSearch = ref(false)
const status = ref("loading")

const stations = computed(() => {
  //merge the station info and status to make it easier to handle
  const statusById = stationStatus.value?.data?.stations?.reduce((acc, status) => {
    acc[status.station_id] = status
    return acc
  }, {}) ?? {}
  return stationInfo.value?.data?.stations.map(info => ({...info, ...statusById[info.station_id]}))
})

const source = new URLSearchParams(window.location.search).get('source') ?? 'oslo'
const gbfs = new Gbfs(sources[source])

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
  height: calc(100vh - 40px);
  width: calc(100vw - 32px);
  max-width: 500px;
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

.status {
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
