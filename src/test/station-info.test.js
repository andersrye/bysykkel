import { mount } from '@vue/test-utils'
import StationInfo from '../components/StationInfo.vue'
import { expect, test } from 'vitest'
import station from './test-data/station-combined.json'

test('mount component', async () => {
    const wrapper = mount(StationInfo, {
        props: {station},
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.get('[data-test=title]').text()).toContain('Tøyen skole')
    expect(wrapper.get('[data-test=address]').text()).toContain('Ringgata 2A')
    expect(wrapper.get('[data-test=bikes-available]').text()).toContain('2')
    expect(wrapper.get('[data-test=docks-available]').text()).toContain('13')

})