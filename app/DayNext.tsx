import Link from 'next/link'
import React from 'react'
import {HiArrowSmLeft, HiArrowSmRight} from 'react-icons/hi'

type  Props = {
  dayOffset: string
}

function DayNext(props: Props) {
  return (
    <div>
      <Link href={`/${props.dayOffset}`}>
        <HiArrowSmRight />
      </Link>
    </div>
  )
}

export default DayNext