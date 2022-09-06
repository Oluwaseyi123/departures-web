import { shallowMount, mount, flushPromises } from "@vue/test-utils";
import HomePage from '@/views/HomePage.vue'

jest.useFakeTimers()

// const mockGet = jest.fn()
// jest.mock('axios',() => ({
//  get: () => mockGet()
// }))

describe('Homepage.vue', () => {
 it('renders', () => {
  const wrapper = shallowMount(HomePage)
  expect(wrapper.get('.home-container').exists()).toBeTruthy()
 })

 it('does not show update status button initially', () => {
  const wrapper = shallowMount(HomePage)
  expect(wrapper.find('button').exists()).toBeFalsy()
 })

 // it('makes an API call', async () => {
 //  const wrapper = shallowMount(HomePage)
 //  expect(mockGet).toHaveBeenCalled()
 // })


 // it('should render the departures when created', () => {
 //  const wrapper = mount(HomePage)
 //  const departures = wrapper.get('[data-test="departures]')
 //  expect(departures.text)
 // })


 // // it('renders a message when status is updated', () => {
 // //  const wrapper = mount(HomePage)
 // // })
})