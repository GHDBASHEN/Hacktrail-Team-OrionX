import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';

const VenueDropdown = ({ venues, booking, setBooking }) => {
  const selectedVenue = venues.find(v => v.venue_id === booking.venueId) || null;
  return (
    <div className="flex flex-col">
          <label htmlFor="venue_id" className="text-gray-700 text-sm mb-1">Venue</label>
          <Listbox
            value={selectedVenue}
            onChange={(venue) => setBooking(b => ({ ...b, venueId: venue?.venue_id || '' }))}
          >
            <div className="relative">
              <Listbox.Button className="w-full cursor-pointer rounded-xl bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
                <span className="block truncate">
                  {selectedVenue
                    ? `${selectedVenue.venue_name} (${selectedVenue.time_slot})`
                    : '-- Select Venue --'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
    
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {venues.map((venue) => (
                    <Listbox.Option
                      key={venue.venue_id}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
                        }`
                      }
                      value={venue}
                    >
                      {({ selected }) => (
                        <div className='border-b-2'>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {venue.venue_name}
                          </span>
                          <tr className=" text-xs text-gray-500 ml-5">
                            <td className='px-2'>{venue.venue_id}</td>
                            <td className='px-2'> {venue.time_slot.charAt(0).toUpperCase() + venue.time_slot.slice(1)}</td>
                            <td className='px-2'> {venue.Location}</td>
                          </tr>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          )}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
  )
}

export default VenueDropdown