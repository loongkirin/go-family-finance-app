'use client'

import React from 'react'
import Image from 'next/image'

function SiteFooter() {
  return (
    <div className="flex flex-col items-center gap-2 mt-auto pb-6">
      <p className="text-sm">
        Copyright &copy; 2024-{new Date().getFullYear()} LoongKirin. All Rights Reserved.
      </p>      
      <div className="flex items-center gap-2 text-sm">
        <a href="https://beian.miit.gov.cn/" target="_blank">湘ICP备2024054017号-1</a>
        <a href="https://beian.mps.gov.cn/#/query/webSearch?code=43019002002239" rel="noreferrer" target="_blank">
          <div className="flex items-center gap-1">
            <Image src="/gongan.png" alt="湘公网安备43019002002239号" width={18} height={18}/>湘公网安备43019002002239号
          </div>
        </a>
      </div>
    </div>       
  )
}

export { SiteFooter }