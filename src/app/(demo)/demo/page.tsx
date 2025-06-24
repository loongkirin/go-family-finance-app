"use client"

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import React from 'react'
import { useAuth } from '@/hooks/use-auth'
import { DatePicker, DatePickerMultiple, DatePickerRange, DatePickerSingle } from '@/components/ui/date-picker'
import { Calendar } from '@/components/ui/calendar'

const page = () => {
  const user = useAuth()
  console.log("user---", user)
  const [date, setDate] = React.useState<Date | undefined>()
  return (
    <div onClick={() => alert(date)}>
      <TooltipProvider>
        <Tooltip disableHoverableContent>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* <DatePickerSingle captionLayout={"dropdown"}/>
      <DatePickerRange />
      <DatePickerMultiple /> */}
      <DatePicker mode='single' captionLayout={"dropdown"} value={date} onChange={(selected) => setDate(selected)}/>
      <DatePicker mode='range' captionLayout={"dropdown"}/>
      <DatePicker mode='multiple' captionLayout={"dropdown"}/>
    </div>
  )
}

export default page