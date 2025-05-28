"use client"

import * as React from "react"
import { ArrowUpDown, ArrowUpAZ, ArrowDownAZ, Funnel, GripVertical } from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  Column,
  RowData,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Header,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { InputDebounced } from "./input-debounced";
import { Button } from "./button";

import {Tooltip,  TooltipTrigger, TooltipContent } from "./tooltip";

declare module '@tanstack/react-table' {
  //allows us to define custom properties for our columns
  export interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'range' | 'select',
    disableFilter?: boolean,
    disableSort?: boolean,
    disableGroup?: boolean,
    disablePin?: boolean,
    disableResize?: boolean,
    disableReorder?: boolean,
  }
}


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  disabled?: boolean;
}

function DataTable<TData, TValue>({
  columns,
  data,
  disabled,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    // <TableHead key={header.id}>
                    //   {header.isPlaceholder
                    //     ? null
                    //     : flexRender(
                    //         header.column.columnDef.header,
                    //         header.getContext()
                    //       )}
                    // </TableHead>
                    <TableHeadContent key={header.id} header={header} />
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function TableHeadContent({ header }: { header: Header<any, unknown> }) {
  return (
    
      <TableHead colSpan={header.colSpan}>
        <div className="flex items-center gap-1">

       
        {header.isPlaceholder
          ? null
          : flexRender(
              header.column.columnDef.header,
              header.getContext()
            )}

        <TableHeadAction column={header.column}/>    
        </div>
      </TableHead>


  )
}

function TableHeadAction({ column }: { column: Column<any, unknown> }) {
  const { filterVariant, disableFilter, disableSort, disableGroup, disablePin, disableResize, disableReorder } = column.columnDef.meta ?? {}

  return(
    <div >

      <TooltipButton column={column}/>
      <FilterButton column={column}/>
    </div>
  )
}

function TooltipButton({ column }: { column: Column<any, unknown> }) {
  return(
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant={'ghost'} size={"sm"}  onClick={(e) => {
          console.log(column)
          const handler = column.getToggleSortingHandler();
          if (handler) handler(e);
        }} className="group">
          {{
                                asc: <ArrowUpAZ />,
                                desc: <ArrowDownAZ />,
                              }[column.getIsSorted() as string] ?? <ArrowUpDown className="opacity-0 group-hover:opacity-100 transition"/>}
          </Button>
      </TooltipTrigger>
      <TooltipContent>
        Sort
      </TooltipContent>
    </Tooltip>
  )
}

function FilterButton({ column }: { column: Column<any, unknown> }) {
  return(
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant={'ghost'} size={"sm"}  onClick={(e) => {
          console.log(column)
    
          
        }} className="group">
          <GripVertical className="opacity-0 group-hover:opacity-100 transition"/>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Filter
      </TooltipContent>
    </Tooltip>
  )
}

export { DataTable, TableHeadAction };