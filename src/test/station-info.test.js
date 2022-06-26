import { shallowMount } from '@vue/test-utils'
import StationInfo from '../components/StationInfo.vue'
import { expect, test } from 'vitest'
import stations from './test-data/stations-combined.json'


describe('StationInfo', () => {

    test('mount component', async () => {
        const wrapper = shallowMount(StationInfo, {
            props: {station: stations[0]},
        })

        expect(wrapper.html()).toMatchSnapshot()
        expect(wrapper.get('[data-test=title]').text()).toBe('Tøyen skole')
        expect(wrapper.get('[data-test=address]').text()).toBe('Ringgata 2A')
        expect(wrapper.get('[data-test=bikes-available]').text()).toBe('2')
        expect(wrapper.get('[data-test=docks-available]').text()).toBe('13')

    })

})
