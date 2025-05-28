"use client"

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import React from 'react'
import { useAuth } from '@/hooks/use-auth'
import { DatePicker } from '@/components/ui/date-picker'

const page = () => {
  const user = useAuth()
  console.log("user---", user)
  return (
    <div>
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
      <DatePicker captionLayout={"dropdown"}/>
    </div>
  )
}

export default page