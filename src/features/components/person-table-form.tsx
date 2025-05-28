"use client"
import React, { useEffect, useState } from 'react'

import {
  ColumnDef,
} from '@tanstack/react-table'

import { makeData, Person } from '@/features/accounts/makeData'
import { DataTable } from '@/components/ui/data-table'


const columns : ColumnDef<Person>[] =[
    {
      accessorKey: 'firstName',
      cell: info => info.getValue(),
    },
    {
      accessorFn: row => row.lastName,
      id: 'lastName',
      cell: info => info.getValue(),
      header: () => <span>Last Name</span>,
    },
    {
      accessorKey: 'age',
      header: () => 'Age',
      meta: {
        filterVariant: 'range',
      },
    },
    {
      accessorKey: 'visits',
      header: () => <span>Visits</span>,
      meta: {
        filterVariant: 'range',
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: {
        filterVariant: 'select',
      },
    },
    {
      accessorKey: 'progress',
      header: 'Profile Progress',
      meta: {
        filterVariant: 'range',
      },
    },
  ]



function PersonTableForm() {
  const [data, setData] = useState([] as Person[]);
  useEffect(() => {
    const tempData = makeData(100);
    setData(tempData)
  }, [])
  return (
    <div className="p-2">
      <DataTable columns={columns} data={data}/>
    </div>
  )
}

export { PersonTableForm };