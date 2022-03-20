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
import stationSymbolLayer from '@/map-layers/station-symbol-layer.json'
import stationCircleLayer from '@/map-layers/station-circle-layer.json'

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
      this.fitMapToGeoJsonBounds(geoJson)
    },
    selectedStation(id) {
      const station = this.stationInfo?.data?.stations?.find(station => station.station_id === id)
      if (!station) return
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
        if (error) throw error
        map.addImage('symbol-background', image)
      })
      this.fitMapToGeoJsonBounds(this.geoJson)
    },
    fitMapToGeoJsonBounds(geoJson) {
      if (!this.panned && this.mapboxMap && geoJson?.features?.length) {
        this.panned = true
        const coordinates = geoJson.features.map(f => f.geometry.coordinates)
        const bounds = new this.mapbox.LngLatBounds(coordinates[0], coordinates[0])
        for (const coordinate of coordinates) {
          bounds.extend(coordinate)
        }
        this.mapboxMap?.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 350, right: 50 },
          duration: 1500,
        })
      }
    },
    stationToFeature(info, status = {}) {
      const { num_bikes_available: bikesAvailable, num_docks_available: docksAvailable } = status
      const { name, address, capacity, lon, lat } = info
      return {
        type: 'Feature',
        properties: {
          name,
          address,
          capacity,
          bikesAvailable,
          docksAvailable,
          label: `${bikesAvailable?.toString()?.padStart(2, '\u00A0')} ${docksAvailable?.toString()?.padStart(2, '\u00A0')}`
        },
        geometry: {
          type: 'Point',
          coordinates: [lon, lat]
        }
      }
    }
  }
}
</script>