"use client"
import React, { useEffect, useState } from 'react'

import {
  ColumnDef,
} from '@tanstack/react-table'

import { makeData, Person } from '@/features/accounts/makeData'
import { DataTable, RowDragHandleCell } from '@/components/ui/data-table'


const columns : ColumnDef<Person>[] =[
  {
    accessorKey: 'firstName',
    id: 'firstName',
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
    id: "age",
    header: () => 'Age',
    meta: {
      filterVariant: 'range',
    },
  },
  {
    accessorKey: 'visits',
    id: 'visits',
    header: () => <span>Visits</span>,
    meta: {
      filterVariant: 'range',
    },
  },
  {
    accessorKey: 'status',
    id: "status",
    header: 'Status',
    meta: {
      filterVariant: 'select',
    },
  },
  {
    accessorKey: 'progress',
    id:'progress',
    header: 'Profile Progress',
    meta: {
      filterVariant: 'range',
    },
  },
]



function PersonTableForm() {
  const [data, setData] = useState([] as Person[]);
  useEffect(() => {
    const tempData = makeData(10);
    setData(tempData)
  }, [])
  // const columns = React.useMemo<ColumnDef<Person>[]>(
  //   () => [
  //     {
  //       accessorKey: 'firstName',
  //       cell: info => info.getValue(),
  //       id: 'firstName',
  //       size: 150,
  //     },
  //     {
  //       accessorFn: row => row.lastName,
  //       cell: info => info.getValue(),
  //       header: () => <span>Last Name</span>,
  //       id: 'lastName',
  //       size: 150,
  //     },
  //     {
  //       accessorKey: 'age',
  //       header: () => 'Age',
  //       id: 'age',
  //       size: 120,
  //     },
  //     {
  //       accessorKey: 'visits',
  //       header: () => <span>Visits</span>,
  //       id: 'visits',
  //       size: 120,
  //     },
  //     {
  //       accessorKey: 'status',
  //       header: 'Status',
  //       id: 'status',
  //       size: 150,
  //     },
  //     {
  //       accessorKey: 'progress',
  //       header: 'Profile Progress',
  //       id: 'progress',
  //       size: 180,
  //     },
  //   ],
  //   []
  // )

  
  return (
    <div className="p-2">
      <DataTable columns={columns} data={data}/>
    </div>
  )
}

export { PersonTableForm };