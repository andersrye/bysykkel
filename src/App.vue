<template>
  <div id="app">
    <StationMap class="bicycle-map"
                :station-info="stationInfo"
                :station-status="stationStatus"
                :selected-station="selectedStation"/>
    <div class="bicycle-list-container card">
      <h1 class="list-title">{{ title }}</h1>
      <span class="last-updated">Sist oppdatert {{ lastUpdated }}</span>
      <StationList :station-info="stationInfo"
                   :station-status="stationStatus"
                   class="bicycle-list"
                   @item-click="(id) => this.selectedStation = id"/>
    </div>
  </div>
</template>

<script>
import StationList from './components/StationList.vue'
import StationMap from "./components/StationMap.vue";
import Gbfs from './gbfs-generators'
import sources from './gbfs-sources.json'

export default {
  name: 'App',
  components: {
    StationList,
    StationMap
  },
  data() {
    return {
      systemInfo: null,
      stationInfo: null,
      stationStatus: null,
      selectedStation: null
    }
  },
  async created() {
    const source = new URLSearchParams(window.location.search).get('source') ?? 'oslo'
    this.gbfs = new Gbfs(sources[source])
    this.systemInfo = await this.gbfs.getSystemInfo()
    this.stationInfo = await this.gbfs.getStationInfo()
    this.live = true
    this.handleStationInfo().catch(console.error)
  },
  computed: {
    title() {
      return this.systemInfo?.data?.name
    },
    lastUpdated() {
      const timestamp = this.stationInfo?.last_updated
      if (timestamp) {
        return new Date(timestamp * 1000).toLocaleString()
      } else {
        return ""
      }
    }
  },
  methods: {
    onStationClick(station) {
      console.log('station', station)
    },
    async handleStationInfo() {
      while (this.live) {
        try {
          for await (const status of this.gbfs.streamStationStatus()) {
            this.stationStatus = status
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.bicycle-map {
  position: absolute;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
}

.bicycle-list-container {
  display: flex;
  flex-direction: column;
  height: 90vh;
  position: absolute;
  margin: 8px 0 0 8px;
  background: #f5f5f5;
}

.bicycle-list {
  height: 100%;
  width: 300px;
  overflow: auto;
  margin: 5px
}

.last-updated {
  padding: 8px;
}

.list-title {
  padding: 8px;
  font-size: 1.25rem;
  font-weight: bold;
}
</style>
