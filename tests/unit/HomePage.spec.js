import { shallowMount, mount, flushPromises } from "@vue/test-utils";
import { departures } from "@/helpers/departures";
import HomePage from '@/views/HomePage.vue'

jest.useFakeTimers()

const departure = departures.data[0]

describe('Homepage.vue', () => {
 it('renders', () => {
  const wrapper = shallowMount(HomePage)
  expect(wrapper.get('.home-container').exists()).toBeTruthy()
 })

 it('does not show update status button initially', () => {
  const wrapper = shallowMount(HomePage)
  expect(wrapper.find('button').exists()).toBeFalsy()
 })

 it('shows skeleton loader only when loading ', async () => {
  const wrapper = shallowMount(HomePage)
  await wrapper.setData({ isLoading: true })
  expect(wrapper.get('.skeleton-container').exists()).toBeTruthy()
  await wrapper.setData({ isLoading: false })
  expect(wrapper.find('.skeleton-container').exists()).toBeFalsy()
 })

 it('shows departure data when loaded', async () => {
  const wrapper = shallowMount(HomePage)
  await wrapper.setData({ isLoading: true })
  expect(wrapper.find('.departure-status').exists()).toBeFalsy()

 })

 it('shows update status data when flight is clicked', async () => {
  const wrapper = shallowMount(HomePage)
  await wrapper.setData({ currentFlight: {
   "flightDirection": "departure",
   "scheduledDepartureDateTime": "2022-08-22T10:30:00",
   "scheduledArrivalDateTime": "2022-08-22T01:00:00",
   "estimatedDepartureDateTime": "2022-08-22T10:51:00",
   "actualDepartureDateTime": "2022-08-22T10:49:00",
   "arrivalAirport": {
    "name": "Charles de Gaulle Airport",
    "cityName": "Paris",
    "countryName": "France",
    "code": "CDG"
   },
   "departureAirport": {
    "name": "Manchester Airport",
    "cityName": "Manchester",
    "countryName": "United Kingdom",
    "code": "MAN"
   },
   "flightNumber": "AF1669",
   "airline": {
    "name": "Air France",
    "code": "AF"
   },
   "departureGate": {
    "name": "Gate A5",
    "number": "A5",
    "action": "Final Call"
   },
   "arrivalTerminal": null,
   "departureTerminal": "2",
   "status": "Departed 10:49"
  } })
  expect(wrapper.get('button').exists()).toBeTruthy()
 })

 it('shows a nessage when update status button is clicked', async () => {
  const wrapper = shallowMount(HomePage)
  await wrapper.setData({ currentFlight: {
   "flightDirection": "departure",
   "scheduledDepartureDateTime": "2022-08-22T10:30:00",
   "scheduledArrivalDateTime": "2022-08-22T01:00:00",
   "estimatedDepartureDateTime": "2022-08-22T10:51:00",
   "actualDepartureDateTime": "2022-08-22T10:49:00",
   "arrivalAirport": {
    "name": "Charles de Gaulle Airport",
    "cityName": "Paris",
    "countryName": "France",
    "code": "CDG"
   },
   "departureAirport": {
    "name": "Manchester Airport",
    "cityName": "Manchester",
    "countryName": "United Kingdom",
    "code": "MAN"
   },
   "flightNumber": "AF1669",
   "airline": {
    "name": "Air France",
    "code": "AF"
   },
   "departureGate": {
    "name": "Gate A5",
    "number": "A5",
    "action": "Final Call"
   },
   "arrivalTerminal": null,
   "departureTerminal": "2",
   "status": "Departed 10:49"
  } })
  const button = wrapper.find('button')
  await button.trigger('click')
  expect(wrapper.get('.msg-p').exists()).toBeTruthy()
 })
})