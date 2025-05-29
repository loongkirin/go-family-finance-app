"use client"

import React, { CSSProperties, useState } from "react"
import { ArrowUpDown, ArrowUpAZ, ArrowDownAZ, GripVertical, GripHorizontal, ListFilter, Pin } from "lucide-react";
import {
  Cell,
  Row,
  ColumnDef,
  Header,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

// needed for table body level scope DnD setup
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,  //column horizontal dragg
} from '@dnd-kit/sortable'

// needed for row & cell level scope DnD setup
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Label } from "./label";
import { cn } from "@/lib/utils";

function DraggableTableHeader({
  header,
}: {
  header: Header<any, unknown>
}) {
  const { attributes, isDragging, listeners, setNodeRef, transform } =  useSortable({
    id: header.column.id
  })

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: 'width transform 0.5s ease-in-out',
    whiteSpace: 'nowrap',
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <TableHead colSpan={header.colSpan} style={style} ref={setNodeRef}>
      <div className="flex items-center justify-between">
        { header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext()) }
        <div className="flex gap-0.5 items-center">
        <ToolTipButton content="Sort">
          <ArrowUpDown/>
        </ToolTipButton>  
        <ToolTipButton content="Filter">
          <ListFilter/>
        </ToolTipButton>
        <ToolTipButton content="Pin">
          <Pin/>
        </ToolTipButton>
        <ToolTipButton content="ReOrder" {...attributes} {...listeners}>
          <GripVertical/>
        </ToolTipButton>
        </div>
      </div>
      
      {/* <button {...attributes} {...listeners} >
        🟰
      </button> */}
    </TableHead>
  )
}

function DraggableCell ({ cell }: { cell: Cell<any, unknown> }) {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  })

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: 'width transform 0.5s ease-in-out',
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <TableCell style={style} ref={setNodeRef}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  )
}

function ToolTipButton({
  children,
  content,
  ...props
} : { content?: string } & React.ComponentProps<typeof Button>) {
  return(
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant={'ghost'} className="size-4" {...props} >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <Label className="text-sm">{content}</Label>
      </TooltipContent>
    </Tooltip>
  )
}

function RowDragHandleCell ({ rowId }: { rowId: string }) {
  const { attributes, listeners } = useSortable({
    id: rowId,
  })
  return (
    // Alternatively, you could set these attributes on the rows themselves
    <Button variant={"ghost"} className="size-4" {...attributes} {...listeners}>
      <GripHorizontal/>
    </Button>
  )
}

function DraggableRow({ row }: { row: Row<any> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform), //let dnd-kit do its thing
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  }
  return (
    // connect row ref to dnd-kit, apply important styles
    <TableRow ref={setNodeRef} style={style}>
      {row.getVisibleCells().map(cell => (
        <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  disabled?: boolean
}

function DataTable<TData, TValue>({
  columns,
  data,
  disabled,
}: DataTableProps<TData, TValue>) {
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() =>
    columns.map(c => c.id!)
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    
    state: {
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  // reorder columns after drag & drop
  function handleColumnDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setColumnOrder(columnOrder => {
        const oldIndex = columnOrder.indexOf(active.id as string)
        const newIndex = columnOrder.indexOf(over.id as string)
        return arrayMove(columnOrder, oldIndex, newIndex) //this is just a splice util
      })
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  return (
    // NOTE: This provider creates div elements, so don't nest inside of <table> elements
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleColumnDragEnd}
      sensors={sensors}
    >
      <div className="p-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {headerGroup.headers.map(header => (
                    <DraggableTableHeader key={header.id} header={header} />
                  ))}
                </SortableContext>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <SortableContext
                    key={cell.id}
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    <DraggableCell key={cell.id} cell={cell} />
                  </SortableContext>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </DndContext>
  )
}

export { ToolTipButton, DataTable, RowDragHandleCell }