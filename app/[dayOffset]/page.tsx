import React from 'react'
import Cost from '../Cost'
import DayNext from '../DayNext'
import DayPrevious from '../DayPrevious'
import Kwh from '../Kwh'
import Records from '../Records'

const _ = require('lodash')
const { DateTime } = require('luxon')
const MPAN = "1610020562792"
const SERIAL = "22J0035265"
const API_KEY_STRING = "sk_live_ZHx2WKH7JeYd9OQV8WFZw7OQ"
const API_KEY = Buffer.from(API_KEY_STRING).toString('base64')
type PageProps = {
  params: {
    dayOffset: string
  }
}

type Record = {
  interval_start: string
  interval_end: string
  consumption: number
}

type CostData = {
  interval_start: string
  interval_end: string
  consumption: number
  cost: number
  offPeak: boolean
}


const getCost = async (interval_start: string, interval_end: string, consumption: number) => {
  const startObject = DateTime.fromISO(interval_start)
  const endObject = DateTime.fromISO(interval_end)
  const offPeakStart = DateTime.fromISO(startObject).setZone('Europe/London').set({ hour: 23, minute: 30, second: 0, millisecond: 0 })
  const offPeakEnd = DateTime.fromISO(startObject).setZone('Europe/London').set({ hour: 5, minute: 30, second: 0, millisecond: 0 })

  let kwhRate = 0.1033
  let offPeak = false

  if ((startObject <= offPeakEnd && endObject <= offPeakEnd) || (startObject >= offPeakStart && endObject >= offPeakEnd)) {
    kwhRate = 0.1033
    offPeak = true
  } else {
    kwhRate = 0.425
    offPeak = false
  }

  return ({ price: consumption * kwhRate, offPeak })
}

const getData = async (offset: number) => {
  const period_from = DateTime.now().setZone('Europe/London').minus({ days: offset }).endOf('day').startOf('second').toISO().replace(/\.000\+00:00/, "Z")
  const period_to = DateTime.now().setZone('Europe/London').minus({ days: offset - 1 }).endOf('day').startOf('second').toISO().replace(/\.000\+00:00/, "Z")

  const res = await fetch(`https://api.octopus.energy/v1/electricity-meter-points/${MPAN}/meters/${SERIAL}/consumption/?period_from=${period_from}&period_to=${period_to}`,
    {
      headers: new Headers({
        "Authorization": `Basic ${API_KEY}`
      })
    }
  )
  const data = await res.json()
  let dataWithCost: CostData[] = []
  data.results.forEach(async (record: Record) => {
    let cost = await getCost(record.interval_start, record.interval_end, record.consumption)
    dataWithCost.push({ ...record, cost: cost.price, offPeak: cost.offPeak })
  })

  return dataWithCost
}


async function DailyConsumption({params: { dayOffset } }: PageProps) {
  const res = await fetch(`http://localhost:3000/api/consumption/day/${dayOffset}`)
  const resultData = await res.json()
  
  const totalCost: CostData[] = resultData.result
 
  const dataDate = DateTime.fromISO(totalCost[0].interval_start)

  return (
    <>
      <div className='flex space-x-3'>
        <div className='text-3xl font-bold'>
          <DayPrevious dayOffset={(parseInt(dayOffset)+1).toString()} />
        </div>
        <div className='font-bold text-lg'>Record Date: {dataDate.toFormat('EEE dd MMM yyyy')}</div>
        <div className='text-3xl font-bold'>
          <DayNext dayOffset={parseInt(dayOffset)<=2?"2":(parseInt(dayOffset)-1).toString()} />
        </div>
      </div>
      <div className='space-x-3'>
        <Cost cost={_.sumBy(totalCost, 'cost').toFixed(2)} />
        <Kwh kwh={_.sumBy(totalCost, 'consumption').toFixed(2)} />
      </div>

      <div>30 Minute Recrods</div>
      <Records totalCost={totalCost} />
    </>
  )
}

export default DailyConsumption