import React from 'react'

type Props = {
  kwh: number
}

function Kwh(props: Props) {
  return (
    <>
    <div className='text-xl font-bold text-white bg-pink-500 border-pink-800 border-4 inline-block p-3 rounded-full'>Total Kwh {props.kwh}</div>
  </>
  )
}

export default Kwh