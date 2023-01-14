import type { NextApiRequest, NextApiResponse } from 'next'
const { DateTime } = require('luxon')
const _ = require('lodash')

const MPAN = "1610020562792"
const SERIAL = "22J0035265"
const API_KEY_STRING = "sk_live_ZHx2WKH7JeYd9OQV8WFZw7OQ"
const API_KEY = Buffer.from(API_KEY_STRING).toString('base64')

type Data = {
  result: CostData[]
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

const populateCostData = async (data: any) => {

  // let dataWithCost: CostData[] = []
  return data.results.map(async (record: Record) => {
    let cost = await getCost(record.interval_start, record.interval_end, record.consumption)
    return { ...record, cost: cost.price, offPeak: cost.offPeak }
  })
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  
  
  let dayOffset: any = req.query.dayOffset
  
  const period_from = DateTime.now().setZone('Europe/London').minus({ days: dayOffset }).endOf('day').startOf('second').toISO().replace(/\.000\+00:00/, "Z")
  
  const period_to = DateTime.now().setZone('Europe/London').minus({ days: dayOffset - 1 }).endOf('day').startOf('second').toISO().replace(/\.000\+00:00/, "Z")

  const result = await fetch(`https://api.octopus.energy/v1/electricity-meter-points/${MPAN}/meters/${SERIAL}/consumption/?period_from=${period_from}&period_to=${period_to}`,
    {
      headers: new Headers({
        "Authorization": `Basic ${API_KEY}`
      })
    }
  )
  const data = await result.json()
  const dataWithCost = await populateCostData(data)
  const results = await Promise.all(dataWithCost)
  res.status(200).json({result: results})
}