<template>
  <MglMap
      :accessToken="accessToken"
      :mapStyle="mapStyle"
      @load="onMapLoaded">
    <MglNavigationControl position="top-right"/>
    <MglGeojsonLayer
        sourceId="stations"
        :source="source"
        layerId="station-circle-layer"
        :layer="stationCircleLayer"/>
    <MglGeojsonLayer
        sourceId="stations"
        :source="source"
        layerId="station-symbol-layer"
        :layer="stationSymbolLayer"/>
  </MglMap>
</template>
<script>
import Mapbox from "mapbox-gl";
import {MglMap, MglNavigationControl, MglGeojsonLayer} from "vue-mapbox"
import icon from '@/assets/symbol-background.png'

const stationSymbolLayer = {
  type: 'symbol',
  source: 'stations',
  paint: {
    'text-color': 'white'
  },
  layout: {
    'text-field': ['get', 'label'],
    'text-font': ['Roboto Mono Regular'],
    'text-size': 14,
    'icon-image': 'symbol-background',
    'icon-size': 0.16
  }
}

const stationCircleLayer = {
  type: 'circle',
  source: 'stations',
  paint: {
    'circle-radius': 4,
    'circle-color': '#555',
  }
}

export default {
  name: "StationMap",
  components: {
    MglMap,
    MglNavigationControl,
    MglGeojsonLayer
  },
  props: {
    stationInfo: Object,
    stationStatus: Object,
    selectedStation: String
  },
  data() {
    return {
      accessToken: 'pk.eyJ1IjoiYW5kZXJzcnllIiwiYSI6ImNsMHI1emE5aDAwNGMzaW5tOHZrdmt0azcifQ.VCTJiGvc-mef33wXhlqk7g',
      mapStyle: 'mapbox://styles/mapbox/streets-v11'
    }
  },
  computed: {
    geoJson() {
      const statusById = this.stationStatus?.data?.stations?.reduce((acc, status) => {
        acc[status.station_id] = status
        return acc
      }, {}) ?? {}
      return {
        type: 'FeatureCollection',
        features: this.stationInfo?.data?.stations?.map(info => {
          return this.stationToFeature(info, statusById[info.station_id])
        }) ?? []
      }
    },
    source() {
      return {
        type: 'geojson',
        data: this.geoJson
      }
    }
  },
  created() {
    this.mapbox = Mapbox
    this.panned = false
    this.stationSymbolLayer = stationSymbolLayer
    this.stationCircleLayer = stationCircleLayer
  },
  watch: {
    geoJson(geoJson) {
      this.fitMapToGeojsonBounds(geoJson)
    },
    selectedStation(id) {
      const station = this.stationInfo?.data?.stations?.find(station => station.station_id === id)
      if(!station) return
      this.mapboxMap.easeTo({
        center: [station.lon, station.lat],
        offset: [150, 0],
        zoom: 16
      })
    }
  },
  methods: {
    onMapLoaded({ map }) {
      this.mapboxMap = map
      map.loadImage(icon, (error, image) => {
        if(error) throw error
        map.addImage('symbol-background', image)
      })
      this.fitMapToGeojsonBounds(this.geoJson)
    },
    fitMapToGeojsonBounds(geoJson) {
      console.log('fitMapToGeojsonBounds' ,geoJson)
      if(!this.panned && this.mapboxMap && geoJson?.features?.length) {
        this.panned = true
        const coordinates = geoJson.features.map(f => f.geometry.coordinates)
        const bounds = new this.mapbox.LngLatBounds(coordinates[0], coordinates[0])
        for (const coordinate of coordinates) {
          bounds.extend(coordinate)
        }
        this.mapboxMap?.fitBounds(bounds, {
          padding: {top: 50, bottom:50, left: 350, right: 50},
          duration: 1500,
        })
      }
    },
    stationToFeature(info, status = {}) {
      return {
        type: 'Feature',
        properties: {
          name: info.name,
          address: info.address,
          capacity: info.capacity,
          bikesAvailable: status.num_bikes_available,
          docksAvailable: status.num_docks_available,
          label: `${status.num_bikes_available?.toString()?.padStart(2, '\u00A0')} ${status.num_docks_available?.toString()?.padStart(2, '\u00A0')}`
        },
        geometry: {
          type: 'Point',
          coordinates: [
            info.lon,
            info.lat
          ]
        }
      }
    }
  }
}
</script>

<style scoped>

</style>