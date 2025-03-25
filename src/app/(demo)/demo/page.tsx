"use client"
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import useCaptcha from '@/hooks/use-captcha'
import React from 'react'
import Image from 'next/image'
const page = () => {
  const { captchaData, isLoading, errorMessage, fetchCaptcha } = useCaptcha()
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
      {captchaData.PicPath && captchaData.PicPath.length > 0 && (
        <Image alt="captcha" src={captchaData.PicPath} width={120} height={36} onClick={() => fetchCaptcha()} />
      )}
    </div>
  )
}

export default page