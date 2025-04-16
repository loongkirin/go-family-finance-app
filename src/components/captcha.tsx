"use client"

import React from "react";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CaptchaData } from "@/features/accounts/api/account";

const imageSizes = {
  sm: { width: 80, height: 24 },
  md: { width: 120, height: 36 },
  lg: { width: 160, height: 48 },
  xl: { width: 200, height: 60 },
  "2xl": { width: 240, height: 72 },
} as const;

const captchaVariants = cva("", {
  variants: {
    orientation: {  
      horizontal: "flex-row",
      vertical: "flex-col",
    },
    imageSize: imageSizes,
  },
});

function Captcha ({ 
  isLoading, 
  errorMessage, 
  captchaData, 
  fetchCaptcha,
  className,
  orientation = "horizontal",
  imageSize = "md",
  ...props
}: { 
  isLoading: boolean, 
  errorMessage: string, 
  captchaData: CaptchaData, 
  fetchCaptcha: () => void,
} & React.ComponentProps<"input"> & VariantProps<typeof captchaVariants>) {
  return (
    <div>
      {isLoading && <Spinner size="sm" />}
      {!isLoading && !errorMessage && (
        <div className={cn(captchaVariants({ orientation }), "flex mx-1 items-center justify-center gap-2")}>
          <Image 
            alt="captcha" 
            src={captchaData.pic_path} 
            width={imageSizes[imageSize || 'sm'].width} 
            height={imageSizes[imageSize || 'sm'].height} 
            onClick={() => fetchCaptcha()} 
            className="cursor-pointer bg-gray-200 rounded-sm"
          />
          <Input 
            id={captchaData.captcha_id} 
            placeholder='verify code'
            className={cn(className)}
            maxLength={captchaData.captcha_length}
            {...props}
          />
        </div>
      )}
      {errorMessage && <div className='cursor-pointer' onClick={() => fetchCaptcha()}>{errorMessage}, Click to Refresh</div>}
    </div>
  )
}

export { Captcha };