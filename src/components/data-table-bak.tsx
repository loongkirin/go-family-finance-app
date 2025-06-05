"use client"

import React, { CSSProperties, useState } from "react"
import { ArrowUpDown, ArrowUpAZ, ArrowDownAZ, GripVertical, GripHorizontal, ListFilter, Pin, PinOff } from "lucide-react";
import {
  useReactTable,
  Cell,
  Row,
  ColumnDef,
  Header,
  flexRender,
  getCoreRowModel,
  ColumnResizeMode,
  ColumnResizeDirection,
} from "@tanstack/react-table"

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
} from "@dnd-kit/core"
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,  //column horizontal dragg
} from "@dnd-kit/sortable"

// needed for row & cell level scope DnD setup
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
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
  const isPinned = header.column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && header.column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && header.column.getIsFirstColumn('right')

  const style: CSSProperties = {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px gray inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px gray inset'
        : undefined,
    left: isPinned === 'left' ? `${header.column.getStart('left') + 20}px` : undefined,
    right: isPinned === 'right' ? `${header.column.getAfter('right') + 20}px` : undefined,
    opacity: isDragging || isPinned ? 0.8 : 1,
    position: isPinned ? 'sticky' : 'relative',
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.5s ease-in-out",
    whiteSpace: "nowrap",
    width: header.column.getSize() + 30,
    minWidth: header.column.getSize(),
    zIndex: isDragging || isPinned ? 1 : 0,
  }

  return (
    <TableHead colSpan={header.colSpan} style={style} ref={setNodeRef}>
      <div className="flex items-center justify-between gap-1">
        { header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext()) }
        <div className="flex gap-0.5 items-center">
        <ToolTipButton content="Sort" className="group">
        {{
           asc: <ArrowUpAZ />,
           desc: <ArrowDownAZ />
        }[header.column.getIsSorted() as string] ?? <ArrowUpDown className="hidden group-hover:block transition ease-in-out duration-500"/>}
        </ToolTipButton>  
        <ToolTipButton content="Filter" className="group">
          <ListFilter className="hidden group-hover:block transition ease-in-out duration-500"/>
        </ToolTipButton>
        <ToolTipButton content="Pin" className="group" onClick={() => {
          console.log("isPinned:",isPinned)
          isPinned ? header.column.pin(false) : header.column.pin("left")
        }}>
          {header.column.getIsPinned() ? <PinOff/> : <Pin className="hidden group-hover:block transition ease-in-out duration-500"/>}
        </ToolTipButton>
        {!header.column.getIsPinned() && <ToolTipButton content="ReOrder" {...attributes} {...listeners} className="group" suppressHydrationWarning>
          <GripVertical className="hidden group-hover:block transition ease-in-out duration-500"/>
        </ToolTipButton> }
        </div>
        <div 
          className={cn("absolute ml-1.5 top-0 h-full w-1 cursor-col-resize select-none touch-none right-0",
            header.column.getIsResizing() ? "bg-foreground/50" : "",
          )}
          onDoubleClick={() =>header.column.resetSize()}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
        />
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
  const isPinned = cell.column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && cell.column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && cell.column.getIsFirstColumn('right')

  const style: CSSProperties = {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px gray inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px gray inset'
        : undefined,
    left: isPinned === 'left' ? `${cell.column.getStart('left') + 20}px` : undefined,
    right: isPinned === 'right' ? `${cell.column.getAfter('right') + 20}px` : undefined,
    opacity: isDragging || isPinned ? 0.8 : 1,
    position: isPinned ? 'sticky' : 'relative',
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.5s ease-in-out",
    width: cell.column.getSize(),
    minWidth: cell.column.getSize(),
    zIndex: isDragging || isPinned ? 1 : 0,
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
        <Button variant={"ghost"} className="size-4" {...props} >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <Label className="text-xs">{content}</Label>
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
    position: "relative",
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
  //reorder
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() =>
    columns.map(c => c.id!)
  )

  //resize
  const [columnResizeMode, setColumnResizeMode] = React.useState<ColumnResizeMode>("onChange")
  const [columnResizeDirection, setColumnResizeDirection] = React.useState<ColumnResizeDirection>("ltr")

  const table = useReactTable({
    data,
    columns,
    columnResizeMode,
    columnResizeDirection,
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
    // NOTE: This provider creates div elements, so don"t nest inside of <table> elements
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleColumnDragEnd}
      sensors={sensors}
    >
      <div className="p-2">
        <Table>
          <TableHeader >
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {headerGroup.headers.map(header => (
                    <DraggableTableHeader key={header.id} header={header}/>
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