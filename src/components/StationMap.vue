<template>
  <div ref="mapContainer" />
</template>

<script setup>
import { computed, reactive, watch, ref, watchEffect } from "vue"
import mapboxgl from "mapbox-gl"
import StationPopupContent from '@/components/StationPopupContent'
import "mapbox-gl/dist/mapbox-gl.css"
import { useMapbox } from "@/composables/mapbox"
import { stationsAsFeatureCollection } from '@/utils/geojson'
import circleIcon from '@/assets/circle_24.png'
import availableBikesLayer from '@/map-layers/available-bikes.json'
import availableDocksLayer from '@/map-layers/available-docks.json'
import stationLayer from '@/map-layers/stations.json'

const mapContainer = ref(null)
const reactiveAvailableBikesLayer = reactive(availableBikesLayer)
const reactiveAvailableDocksLayer = reactive(availableDocksLayer)
const geoJson = computed(() => stationsAsFeatureCollection(props.stations))

const props = defineProps({
  stations: { type: Array, default: () => ([]) },
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

map.on('mouseenter', [availableBikesLayer.id, availableDocksLayer.id], () => {
  map.mapboxMap.value.getCanvas().style.cursor = 'pointer';
})

map.on('mouseleave', [availableBikesLayer.id, availableDocksLayer.id], () => {
  map.mapboxMap.value.getCanvas().style.cursor = '';
})

map.on('click', [availableBikesLayer.id, availableDocksLayer.id], (e) => {
  const feature = e.features[0]
  if(feature) {
    openPopup(feature.properties, e.lngLat)
  }
})

function toggleLayers(showBikes) {
  console.log('toggleLayers', showBikes)
  reactiveAvailableBikesLayer.layout.visibility = showBikes ? 'visible' : 'none'
  reactiveAvailableDocksLayer.layout.visibility = showBikes ? 'none' : 'visible'
}

function openPopup(station, lngLat) {
  map.openPopup(StationPopupContent, lngLat, {station})
}

watchEffect(() => toggleLayers(props.showBikes))

watch(() => props.selectedStation, station => {
  if (station) {
    const lngLat = [station.lon, station.lat]
    map.mapboxMap.value?.easeTo({
      center: lngLat,
      zoom: 16
    })
    openPopup(station, lngLat)
  }
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
