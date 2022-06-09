<template>
  <div ref="mapContainer" />
</template>

<script setup>
import {computed, reactive, watch, ref, watchEffect} from "vue"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import {useMapbox} from "@/composables/mapbox"
import { stationAsFeatureCollection } from '@/utils/geojson'
import circleIcon from '@/assets/circle_24.png'
import availableBikesLayer from '@/map-layers/available-bikes.json'
import availableDocksLayer from '@/map-layers/available-docks.json'
import stationLayer from '@/map-layers/stations.json'

const mapContainer = ref(null)
const reactiveAvailableBikesLayer = reactive(availableBikesLayer)
const reactiveAvailableDocksLayer = reactive(availableDocksLayer)
const geoJson = computed(() => stationAsFeatureCollection(props.stationInfo, props.stationStatus))

const props = defineProps({
  stationInfo: { type: Object, default: () => ({}) },
  stationStatus: { type: Object, default: () => ({}) },
  selectedStation: { type: Object, default: null },
  showBikes: {type: Boolean, default: true}
})

const map = useMapbox({
  container: mapContainer,
  accessToken: 'pk.eyJ1IjoiYW5kZXJzcnllIiwiYSI6ImNsMHI1emE5aDAwNGMzaW5tOHZrdmt0azcifQ.VCTJiGvc-mef33wXhlqk7g',
  style: "mapbox://styles/mapbox/streets-v11",
  zoom: 5,
  center: [10.735834, 60.917947]
})


map.addImage('circle-icon', circleIcon, {sdf: true})

map.addGeoJsonSource('stations', geoJson)

map.addLayer(stationLayer)
map.addLayer(reactiveAvailableBikesLayer)
map.addLayer(reactiveAvailableDocksLayer)

function toggleLayers(showBikes) {
  console.log('toggleLayers', showBikes)
  reactiveAvailableBikesLayer.layout.visibility = showBikes ? 'visible' : 'none'
  reactiveAvailableDocksLayer.layout.visibility = showBikes ? 'none' : 'visible'
}

watchEffect(() => toggleLayers(props.showBikes))

watch(() => props.selectedStation, id => {
  const station = props.stationInfo?.data?.stations?.find(station => station.station_id === id)
  if (!station) return
  map.mapboxMap.value?.easeTo({
    center: [station.lon, station.lat],
    zoom: 16
  })
})

//fit map to geoJson once, then remove watch
const unwatch = watchEffect(() => {
  if (map.mapboxMap.value && geoJson.value?.features?.length) {
    const coordinates = geoJson.value.features.map(f => f.geometry.coordinates)
    const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
    for (const coordinate of coordinates) {
      bounds.extend(coordinate)
    }
    map.mapboxMap.value?.fitBounds(bounds, {
      padding: { top: 50, bottom: 50, left: 50, right: 50 },
      duration: 1000,
    })
    unwatch()
  }
})
</script>
