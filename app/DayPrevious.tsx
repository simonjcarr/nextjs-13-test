import Link from 'next/link'
import React from 'react'
import {HiArrowSmLeft} from 'react-icons/hi'

type  Props = {
  dayOffset: string
}

function DayPrevious(props: Props) {
  return (
    <div>
      <Link href={`/${props.dayOffset}`}>
        <HiArrowSmLeft />
      </Link>
    </div>
  )
}

export default DayPrevious