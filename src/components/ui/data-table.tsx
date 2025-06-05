"use client"

import React, { CSSProperties } from "react"
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

  SortingFn,
  SortingState,
  getSortedRowModel,

  ColumnFiltersState,
  getFilteredRowModel,

  PaginationState,
  getPaginationRowModel,

  RowData,
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
import { Input } from "./input";

const SYSTEM_SELECT_COLUMN_ID = "__select"

declare module '@tanstack/react-table' {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'range' | 'select'
  }
}

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
    isPinned === "left" && header.column.getIsLastColumn("left")
  const isFirstRightPinnedColumn =
    isPinned === "right" && header.column.getIsFirstColumn("right")

  const style: CSSProperties = {
    boxShadow: isLastLeftPinnedColumn
      ? "-4px 0 4px -4px gray inset"
      : isFirstRightPinnedColumn
        ? "4px 0 4px -4px gray inset"
        : undefined,
    left: isPinned === "left" ? `${header.column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${header.column.getAfter("right")}px` : undefined,
    opacity: isDragging || isPinned ? 0.9 : 1,
    position: isPinned ? "sticky" : "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.5s ease-in-out",
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    minWidth: header.column.getSize(),
    zIndex: isDragging || isPinned ? 1 : 0,
  }

  return (
    <TableHead colSpan={header.colSpan} ref={setNodeRef} style={style} className={`${isPinned ? "bg-background" : ""}`}>
      <div className={cn("flex items-center", `${header.column.id === SYSTEM_SELECT_COLUMN_ID ? "justify-center" : "justify-between gap-1"}`)}>
        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
        {header.column.id !== SYSTEM_SELECT_COLUMN_ID &&  
        <>
          <div className="flex gap-0.5 items-center">
            {header.column.getCanSort() && 
            <ToolTipButton content="Sort" className="group" onClick={header.column.getToggleSortingHandler()}>
            {{
              asc: <ArrowUpAZ />,
              desc: <ArrowDownAZ />
            }[header.column.getIsSorted() as string] ?? <ArrowUpDown className="hidden group-hover:block transition ease-in-out duration-500"/>}
            </ToolTipButton>}
            {header.column.getCanFilter() &&  
            <ToolTipButton content="Filter" className="group">
              <ListFilter className="hidden group-hover:block transition ease-in-out duration-500"/>
            </ToolTipButton>}
            {header.column.getCanPin() &&
            <ToolTipButton content="Pin" className="group" onClick={() => {
              // console.log("isPinned:",isPinned)
              isPinned ? header.column.pin(false) : header.column.pin("left")
            }}>
            {header.column.getIsPinned() ? <PinOff/> : <Pin className="hidden group-hover:block transition ease-in-out duration-500"/>}
            </ToolTipButton>}
            {!header.column.getIsPinned() && 
            <ToolTipButton content="ReOrder" {...attributes} {...listeners} className="group" suppressHydrationWarning>
              <GripVertical className="hidden group-hover:block transition ease-in-out duration-500"/>
            </ToolTipButton>}
          </div> 
          <div 
            className={cn("absolute ml-1.5 top-0 h-full w-1 cursor-col-resize select-none touch-none right-0",
                `${header.column.getIsResizing() ? "bg-foreground/50" : ""}`,
            )}
            onDoubleClick={() =>header.column.resetSize()}
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
          />  
        </>}
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
    isPinned === "left" && cell.column.getIsLastColumn("left")
  const isFirstRightPinnedColumn =
    isPinned === "right" && cell.column.getIsFirstColumn("right")

  const style: CSSProperties = {
    boxShadow: isLastLeftPinnedColumn
      ? "-4px 0 4px -4px gray inset"
      : isFirstRightPinnedColumn
        ? "4px 0 4px -4px gray inset"
        : undefined,
    left: isPinned === "left" ? `${cell.column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${cell.column.getAfter("right")}px` : undefined,
    opacity: isDragging || isPinned ? 0.9 : 1,
    position: isPinned ? "sticky" : "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform ",
    width: cell.column.getSize(),
    minWidth: cell.column.getSize(),
    zIndex: isDragging || isPinned ? 1 : 0,
  }

  return (
    <TableCell ref={setNodeRef} style={style} className={`${isPinned ? "bg-background" : ""}`}>
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
    opacity: isDragging ? 0.9 : 1,
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

function IndeterminateCheckbox({
  indeterminate,
  className,
  ...props
}: { indeterminate?: boolean } & React.ComponentProps<"input">) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !props.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    <Input
      type="checkbox"
      ref={ref}
      className={cn("cursor-pointer size-4", className)}
      {...props}
    />
  )
}

function getSystemColumnDef<TData, TValue>() : ColumnDef<TData, TValue>[] {
  const columns : ColumnDef<TData, TValue>[] =[
    {
      id: SYSTEM_SELECT_COLUMN_ID,
      header: ({ table }) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllPageRowsSelected(),
            indeterminate: table.getIsSomePageRowsSelected(),
            onChange: table.getToggleAllPageRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
      size: 80,
    },
  ]
  return columns;
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
  const tableColumns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    const checkColums = getSystemColumnDef<TData, TValue>();
    return [...checkColums, ...columns];
  },[columns]);

  // console.log(tableColumns);

  //reorder
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() => {
    // columns.map(c => c.id!)
    // 先把 __select 放前面，再加上其他列
    const allIds = tableColumns.map(c => c.id!);
    // 确保 __select 在最前面
    const selectIndex = allIds.indexOf(SYSTEM_SELECT_COLUMN_ID);
    if (selectIndex > 0) {
      allIds.splice(selectIndex, 1);
      allIds.unshift(SYSTEM_SELECT_COLUMN_ID);
    }
    return allIds;
  })

  //resize
  const [columnResizeMode, setColumnResizeMode] = React.useState<ColumnResizeMode>("onChange")
  const [columnResizeDirection, setColumnResizeDirection] = React.useState<ColumnResizeDirection>("ltr")

  //selection
  const [rowSelection, setRowSelection] = React.useState({})

  //sorting
  const [sorting, setSorting] = React.useState<SortingState>([])

  //filtering
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  //pagination
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data,
    columns: tableColumns,
    columnResizeMode,
    columnResizeDirection,

    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,

    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row

    // manualSorting: true, //we're doing manual "server-side" sorting
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    onSortingChange: setSorting, //optionally control sorting state in your own scope for easy access
    // sortingFns: {
    //   sortStatusFn, //or provide our custom sorting function globally for all columns to be able to use
    // },

    manualFiltering: true, //we're doing manual "server-side" filtering
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(), //client side filtering

    // manualPagination: true, //we're doing manual "server-side" pagination
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(), //client-side pagination

    state: {
      columnOrder,
      rowSelection,
      sorting,
      columnFilters,
      pagination,
    },
    
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
        <Table className="table-fixed">
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
        <div className="h-2" />
        <div className="flex items-center gap-2 justify-end">
          <Button
            className="border rounded p-1" variant={"outline"} size={"sm"}
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </Button>
          <Button
            className="border rounded p-1" variant={"outline"} size={"sm"}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </Button>
          <Button
            className="border rounded p-1" variant={"outline"} size={"sm"}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </Button>
          <Button
            className="border rounded p-1" variant={"outline"} size={"sm"}
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </Button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount().toLocaleString()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                table.setPageIndex(page)
              }}
              className="border p-1 rounded w-16"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </DndContext>
  )
}

export { ToolTipButton, DataTable, RowDragHandleCell, IndeterminateCheckbox }