<template>
  <div id="app">
    <StationMap
      class="bicycle-map"
      :station-info="stationInfo"
      :station-status="stationStatus"
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
        :station-status="stationStatus"
        :station-info="stationInfo"
        @close="showSearch = false"
        @selected-station="stationSelected"
      />
    </transition>
  </div>
</template>

<script setup>
import {shallowRef, ref} from "vue"
import StationMap from "./components/StationMap"
import StationSearch from "./components/StationSearch"
import Gbfs from './gbfs'
import sources from './gbfs-sources.json'

const systemInfo = shallowRef(null)
const stationInfo = shallowRef(null)
const stationStatus = shallowRef(null)
const selectedStation = ref(null)
const showBikes = ref(true)
const showSearch = ref(false)

function handleError(error) {
  console.error(error)
}

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

async function pollStationStatus() {
  for await (const status of gbfs.streamStationStatus()) {
    stationStatus.value = status
  }
}

function stationSelected(id) {
  showSearch.value = false
  selectedStation.value = id
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
