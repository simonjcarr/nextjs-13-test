import React from 'react'

type Props = {
  cost: number
}

function Cost(props: Props) {
  return (
    <>
      <div className='text-xl font-bold text-white bg-pink-500 border-4 border-pink-800 inline-block p-3 rounded-full'>Total Cost £{props.cost}</div>
    </>
  )
}

export default Cost