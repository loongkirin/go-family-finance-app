import { FormDist } from '@/features/components/login-form-dist'
import { PersonTableForm } from '@/features/components/person-table-form'
import React from 'react'

const page = () => {
  return (
    <div className='select-none'>
      <FormDist />
      <PersonTableForm/>
    </div>
  )
}

export default page