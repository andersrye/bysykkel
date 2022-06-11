import {onMounted, onUnmounted, unref, watchEffect, shallowRef, ref, createApp, nextTick, watch} from 'vue'
import mapboxgl from "mapbox-gl";

/**
 *
 * @param {object} mapboxOptions - See https://docs.mapbox.com/mapbox-gl-js/api/map/#map-parameters for all available options
 * @param {string|HTMLElement|ref} mapboxOptions.container - The html element or element ID in which to render the map
 * @param {string} mapboxOptions.accessToken - The mapbox  access token to use.
 * @param {string|object} mapboxOptions.style - The style spec to use, or an url to the style spec
 * @returns {{addGeoJsonSource: Function, addLayer: Function, mapboxMap: shallowRef, addImage: Function, openPopup: Function, on: Function, off: Function}}
 */
export function useMapbox(mapboxOptions) {
    const map = shallowRef(null)
    const stopHandles = []

    onMounted(() => {
        mapboxOptions.container = unref(mapboxOptions.container)
        const newMap = new mapboxgl.Map(mapboxOptions)
        newMap.on('load', () => {
            map.value = newMap
        })
    })

    onUnmounted(() => {
        map.value?.remove()
        // clean up all the dynamically created watches
        stopHandles.forEach(stopHandle => stopHandle())
    })

    /**
     * Add a geoJson source to the map, updating it if it already exists.
     * If `geoJson` is reactive it will update the source automatically.
     *
     * @param {string} id - The id of the source
     * @param {object|ref} geoJson - The geoJson to add
     */
    function addGeoJsonSource(id, geoJson) {
        const stop = watchEffect(() => {
            const unrefedGeoJson = unref(geoJson)
            if (map.value) {
                const existingSource = map.value.getSource(id)
                if (existingSource) {
                    existingSource.setData(unrefedGeoJson)
                } else {
                    map.value.addSource('stations', {
                            type: 'geojson',
                            data: unrefedGeoJson
                        }
                    )
                }
            }
        })
        stopHandles.push(stop)
    }

    /**
     * Add a layer to the map, replacing it if already exists.
     * If `layer` is reactive it will update on change
     *
     * @param {object|ref} layer - The layer to add
     */
    function addLayer(layer) {
        const stop = watchEffect(() => {
            const unrefedLayer = unref(layer)
            const id = unrefedLayer.id
            if (map.value) {
                const existingLayer = map.value.getLayer(id)
                if (existingLayer) {
                    map.value.removeLayer(id)
                }
                map.value.addLayer(unrefedLayer)
            }
        })
        stopHandles.push(stop)
    }

    /**
     * Loads and adds an image to mapbox, updating it if it already exists.
     * If `imageUrl` is reactive, it will update automatically
     *
     * @param {string} id - The ID of the image
     * @param {string|ref} imageUrl - The URL of the image to add
     * @param {object} options - See https://docs.mapbox.com/mapbox-gl-js/api/map/#addimage-parameters
     */
    function addImage(id, imageUrl, options) {
        const stop = watchEffect(async () => {
            const unrefedImageUrl = unref(imageUrl)
            if (map.value) {
                const image = await new Promise(((resolve, reject) => {
                    map.value.loadImage(unrefedImageUrl, (error, image) => {
                        if (error) reject(error)
                        resolve(image)
                    })
                }))
                if (map.value.hasImage(id)) {
                    map.value.updateImage(id, image)
                } else {
                    map.value.addImage(id, image, options)
                }
            }
        })
        stopHandles.push(stop)
    }


    const popup = new mapboxgl.Popup({offset: 14})

    function openPopup(component, lngLat, injects = {}) {
        const popupContent = createApp(component)
        for (const [key, value] of Object.entries(injects)) {
            popupContent.provide(key, value)
        }
        popup.remove()
        popup.setHTML('<div id="popup-content"/>')
            .setLngLat(lngLat)
            .on('close', () => {
                popupContent.unmount()
            })
            .addTo(map.value)

        nextTick(() => {
            popupContent.mount('#popup-content')
        })
    }

    function runOnceWhenMapReady(fn) {
        const unwatch = watch(map, map =>  {
            if(map) {
                fn(map)
                unwatch()
            }
        })
    }

    function on(type, layerId, listener) {
        runOnceWhenMapReady(map => map.on(type, layerId, listener))
    }
    function off(type, layerId, listener) {
        runOnceWhenMapReady(map => map.off(type, layerId, listener))
    }

    return {
        mapboxMap: map,
        addGeoJsonSource,
        addLayer,
        addImage,
        openPopup,
        on,
        off
    }
}
