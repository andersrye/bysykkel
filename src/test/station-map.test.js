import { mount } from '@vue/test-utils'
import StationMap from '@/components/StationMap.vue'
import { expect, test, vi } from 'vitest'
import mapboxgl from "mapbox-gl";
import station from './test-data/station-combined.json'

//mapbox can't really work in jsdom, so we have to mock it
vi.mock("mapbox-gl", () => {
    const Map = vi.fn()
    Object.assign(Map.prototype, {
        once: vi.fn((type, callback) => {
            if(type === 'load') callback() //call the callback to trigger everything that depends on the map being loaded
        }),
        on: vi.fn(),
        off: vi.fn(),
        loadImage: vi.fn(),
        getSource: vi.fn(),
        addSource: vi.fn(),
        getLayer: vi.fn(),
        addLayer: vi.fn(),
        easeTo: vi.fn()
    })
    const Popup = vi.fn()
    Object.assign(Popup.prototype, {
        remove: vi.fn(),
        addTo: vi.fn(),
        setHTML: vi.fn().mockReturnThis(), //in order to be chainable these have to return ´this´
        setLngLat: vi.fn().mockReturnThis(),
        on: vi.fn().mockReturnThis()
    })
    return {
        default: {
            Map,
            Popup
        }
    }
})

describe('app', () => {

    afterEach(() => {
        vi.clearAllMocks()
    })

    test('mount component', async () => {
        const wrapper = mount(StationMap)
        expect(wrapper.html()).toMatchSnapshot()
    })

    test('selectedStation should pan the map and open a popup', async () => {
        const wrapper = mount(StationMap)
        await wrapper.setProps({selectedStation: station})

        const lngLat = [station.lon, station.lat]
        const mapboxInstance = mapboxgl.Map.mock.instances[0]
        const popupInstance = mapboxgl.Popup.mock.instances[0]

        expect(mapboxInstance.easeTo).toHaveBeenCalledWith(expect.objectContaining({center: lngLat}))
        expect(popupInstance.setLngLat).toHaveBeenCalledWith(lngLat)
        expect(popupInstance.addTo).toHaveBeenCalled()

        //todo: check that PopupContent has been mounted properly?
    })
})
