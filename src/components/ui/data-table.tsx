"use client"

import React, { CSSProperties } from "react"
import { 
  ArrowUpDown, 
  ArrowUpAZ, 
  ArrowDownAZ, 
  GripVertical, 
  GripHorizontal, 
  ListFilter, 
  Pin, 
  PinOff, 
  Settings } from "lucide-react";
import {
  Table as TanStackTable,
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

  ColumnPinningState,
  RowSelectionState,
  VisibilityState,
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
import { arrayMove, SortableContext,
  horizontalListSortingStrategy,  //column horizontal dragg
  useSortable, //needed for row & cell level scope DnD setup
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Label } from "./label";
import { Input } from "./input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./select";

import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./sheet";
import { Separator } from "./separator";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { Switch } from "./switch";

const SYSTEM_SELECT_COLUMN_ID = "__select"
const SYSTEM_SN_COLUMN_ID = "__sn"
const PAGE_SIZE_LIST = [10, 20, 50, 100, 200]

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
  const isLastLeftPinnedColumn = isPinned === "left" && header.column.getIsLastColumn("left")
  const isFirstRightPinnedColumn = isPinned === "right" && header.column.getIsFirstColumn("right")
  const isSystemColumn = header.column.id === SYSTEM_SELECT_COLUMN_ID || header.column.id === SYSTEM_SN_COLUMN_ID

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
      <div className={cn("flex items-center", `${ isSystemColumn ? "justify-center" : "justify-between gap-1"}`)}>
        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
        {!isSystemColumn &&  
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

function TableSettings<TData>({table} : { table: TanStackTable<TData>}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <ToolTipButton content="Data Table Settings" className="ml-auto">
          <Settings/>
        </ToolTipButton>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="pb-0">
          <SheetTitle className="text-base">Data Table Settings</SheetTitle>
        </SheetHeader>
        <Separator/>
        <div className="pt-1 px-6 flex flex-col gap-3">
          <Label className="font-semibold">Data Table Setting</Label>
          <div className="flex gap-4 items-center justify-between pt-3">
            <Label>Page Size:</Label>
            <ToggleGroup variant="outline" type="single" 
              defaultValue={table.getState().pagination.pageSize.toString()}
              onValueChange={(pageSize) => {table.setPageSize(Number(pageSize))}}>
                {PAGE_SIZE_LIST.map(pageSize => {
                  return(
                    <ToggleGroupItem key={pageSize} value={pageSize.toString()} aria-label={pageSize.toString()}>
                      <Label className="h-4 w-6 text-sm">{pageSize}</Label>
                    </ToggleGroupItem>
                  )
                })}
            </ToggleGroup>
          </div>
          <div className="flex items-center justify-between">
            <Label>Show SN:</Label>
            <Switch id="table-sn-checked" checked={table.getColumn(SYSTEM_SN_COLUMN_ID)?.getIsVisible()} 
              onCheckedChange={checked => table.getColumn(SYSTEM_SN_COLUMN_ID)?.toggleVisibility(checked)}/>
          </div>
        </div>
        <Separator/>
        <div className="pt-1 px-6 flex flex-col gap-3">
          <Label className="font-semibold">Data Column Setting</Label>
          <div className="flex items-center justify-between pt-3">
            <Label>Show All Columns</Label>
            <Switch checked={table.getIsAllColumnsVisible()} 
              onCheckedChange={checked => table.toggleAllColumnsVisible(checked)}/>
          </div>
          {table.getAllLeafColumns().map(column=> {
            if(column.id === SYSTEM_SELECT_COLUMN_ID || column.id === SYSTEM_SN_COLUMN_ID) {
              return null
            }
            return(
              <div className="flex items-center justify-between" key={column.id}>
                <Label>{column.id}</Label>
                <Switch id={column.id} checked={column.getIsVisible()} 
                  onCheckedChange={checked => column.toggleVisibility(checked)}/>
              </div>
            )
          })}          
        </div>
      </SheetContent>
    </Sheet>
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
      size: 60,
    },
    {
      id: SYSTEM_SN_COLUMN_ID,
      header: "#",
      cell: ({ row, table }) => (
        <div className="flex justify-center text-center">
          {row.index + 1 - table.getState().pagination.pageIndex * table.getState().pagination.pageSize}
        </div>
      ),
      size: 60,
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
    return columns.map(c => c.id!)
    // 先把 __select 放前面，再加上其他列
    // const allIds = tableColumns.map(c => c.id!);
    // // 确保 __select 在最前面
    // const selectIndex = allIds.indexOf(SYSTEM_SELECT_COLUMN_ID);
    // if (selectIndex > 0) {
    //   allIds.splice(selectIndex, 1);
    //   allIds.unshift(SYSTEM_SELECT_COLUMN_ID);
    // }
    // return allIds;
  })

  //pinning
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({left: [SYSTEM_SELECT_COLUMN_ID, SYSTEM_SN_COLUMN_ID],  right: [],})

  //resize
  const [columnResizeMode, setColumnResizeMode] = React.useState<ColumnResizeMode>("onChange")
  const [columnResizeDirection, setColumnResizeDirection] = React.useState<ColumnResizeDirection>("ltr")

  //selection
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  //sorting
  const [sorting, setSorting] = React.useState<SortingState>([])

  //filtering
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  //pagination
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  //column visibility
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns: tableColumns,
    columnResizeMode,
    columnResizeDirection,

    getCoreRowModel: getCoreRowModel(),
    onColumnPinningChange: setColumnPinning, //column pinning
    onRowSelectionChange: setRowSelection,  //row selection
    onColumnOrderChange: setColumnOrder,  //column order

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

    onColumnVisibilityChange: setColumnVisibility,  //column visibility

    state: {
      columnOrder,
      columnPinning,
      rowSelection,
      sorting,
      columnFilters,
      pagination,
      columnVisibility,
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
      <div className="p-2 flex flex-col gap-1">
        <TableSettings table={table}/>
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
            <Input
              type="number"
              min="1"
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                table.setPageIndex(page)
              }}
              className="border p-1 rounded w-16 h-8"
            />
          </span>
          {/* <select
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
          </select> */}
          <Select value={table.getState().pagination.pageSize?.toString()} onValueChange={(pageSize) => {table.setPageSize(Number(pageSize))}}>
            <SelectTrigger size="sm" className="w-auto py-0 rounded">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {PAGE_SIZE_LIST.map(pageSize => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    Show {pageSize}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </DndContext>
  )
}

export { ToolTipButton, DataTable, RowDragHandleCell, IndeterminateCheckbox }