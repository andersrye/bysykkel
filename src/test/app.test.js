import {flushPromises, shallowMount} from '@vue/test-utils'
import App from '@/App.vue'
import { expect, test, vi } from 'vitest'
import Gbfs from "@/gbfs";

const mockGenerator = function*(yieldValue) { yield yieldValue }

vi.mock("@/gbfs", () => {
    const Gbfs = vi.fn()
    Object.assign(Gbfs.prototype, {
        getSystemInfo: vi.fn().mockResolvedValue({}),
        getStationInfo: vi.fn().mockResolvedValue({}),
        getStationStatus: vi.fn().mockResolvedValue({}),
        streamStationStatus: vi.fn(() => mockGenerator({}))
    })
    return { default: Gbfs }
})

describe('app', () => {
    let gbfs

    beforeEach(() => {
        gbfs = new Gbfs("")
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    test('mount component', async () => {
        const wrapper = shallowMount(App)
        expect(wrapper.html()).toMatchSnapshot()
    })

    test('update status on success', async () => {
        const wrapper = shallowMount(App)

        expect(wrapper.get('[data-test=status-indicator]').attributes('status')).toBe('loading')
        await flushPromises() //wait for data to "load"
        expect(wrapper.get('[data-test=status-indicator]').attributes('status')).toBe('ok')
    })

    test('update status on error', async () => {
        gbfs.getSystemInfo.mockRejectedValueOnce("Mock failure")
        const wrapper = shallowMount(App)

        expect(wrapper.get('[data-test=status-indicator]').attributes('status')).toBe('loading')
        await flushPromises()
        expect(wrapper.get('[data-test=status-indicator]').attributes('status')).toBe('error')
    })

    test('bike buttons should toggle between bikes and docks', async () => {
        const wrapper = shallowMount(App)

        expect(wrapper.find('[data-test=bikes-button]').exists()).toBe(false)
        expect(wrapper.find('[data-test=docks-button]').exists()).toBe(true)
        expect(wrapper.get('[data-test=map]').attributes('showbikes')).toBe('true')

        await wrapper.get('[data-test=docks-button]').trigger('click')

        expect(wrapper.find('[data-test=bikes-button]').exists()).toBe(true)
        expect(wrapper.find('[data-test=docks-button]').exists()).toBe(false)
        expect(wrapper.get('[data-test=map]').attributes('showbikes')).toBe('false')

    })

    test('search buttons should show search view', async () => {
        const wrapper = shallowMount(App)

        expect(wrapper.find('[data-test=search-view]').exists()).toBe(false)

        await wrapper.get('[data-test=search-button]').trigger('click')

        expect(wrapper.find('[data-test=search-view]').exists()).toBe(true)

    })

    //todo: test computed combined station info
})
