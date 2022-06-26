import { shallowMount } from '@vue/test-utils'
import StationList from '../components/StationList.vue'
import { expect, test } from 'vitest'
import stations from './test-data/stations-combined.json'


describe('StationList', () => {

    test('mount component', async () => {
        const wrapper = shallowMount(StationList, {
            props: {stations: stations},
        })
        expect(wrapper.html()).toMatchSnapshot()
        expect(wrapper.findAllComponents({name: 'StationInfo'}).length).toBe(stations.length)
    })

    test('search should be case insensitive', async () => {
        const wrapper = shallowMount(StationList, {
            props: {stations: stations},
        })
        await wrapper.setProps({filterText: "Bekken"})
        expect(wrapper.findAllComponents({name: 'StationInfo'}).length).toBe(1)
        expect(wrapper.getComponent({name: 'StationInfo'}).props().station).toMatchObject({name: 'Tøyenbekken'})
    })

    test('search should also match address', async () => {
        const wrapper = shallowMount(StationList, {
            props: {stations: stations},
        })
        await wrapper.setProps({filterText: "gata"})
        expect(wrapper.findAllComponents({name: 'StationInfo'}).length).toBe(1)
        expect(wrapper.getComponent({name: 'StationInfo'}).props().station).toMatchObject({address: 'Ringgata 2A'})
    })
})
