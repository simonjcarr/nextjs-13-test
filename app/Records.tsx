import React from 'react'
const { DateTime } = require('luxon')

type Props = {
  totalCost:{
    interval_start: string
    interval_end: string
    consumption: number
    cost: number
    offPeak: boolean
  }[]
}

function Records(props: Props) {
  return (
    <>
      {props.totalCost.reverse().map((record) => (
        <div key={record.interval_start} className='p-3 bg-pink-500 border-2 border-pink-600 mb-2 text-pink-200 rounded-md font-semibold'>
          <div className='flex space-x-5'>
            <div>Start: {DateTime.fromISO(record.interval_start).toFormat('HH:mm')} Hrs</div>
            <div>End: {DateTime.fromISO(record.interval_end).toFormat('HH:mm')} Hrs</div>
          </div>
          <p>Consumption: {record.consumption} Kwh</p>
          <p>Cost: £{record.cost.toFixed(2)}</p>
          <p className={`${record.offPeak ? 'bg-green-700 border-green-800' : 'bg-gray-600 border-gray-700'} text-white text-xs p-1 font-semibold rounded-lg border-2 inline-block`}>{record.offPeak ? 'Off Peak' : 'On Peak'}</p>
        </div>

      ))}
    </>
  )
}

export default Records