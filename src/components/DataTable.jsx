import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "./../../components/ui/scroll-area";
import { Button } from "./../../components/ui/button";
import { Checkbox } from "./../../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./../../components/ui/dropdown-menu";
import { Input } from "./../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./../../components/ui/table";
import Filter from "./Filter";
import { Tooltip, TooltipTrigger, TooltipContent } from "./../../components/ui/tooltip";

export function DataTable({ data, columns, addbutton, Savebutton, label, availableCategories, isfilter, kFilter, handleSaveFilters }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const getColumnHeaderLabel = (column) => {
    return column.heading;
  };

  const exportDataToCSV = () => {
    const headers = columns
      .filter((col) => col.id !== "select" && col.id !== "actions")
      .map((col) => getColumnHeaderLabel(col))
      .join(",");
    const rows = table.getRowModel().rows.map((row) =>
      row.getVisibleCells().map((cell) => cell.getValue()).slice(1).join(",")
    );
    const csvContent = [headers, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "data_table_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleButtonClick = (header) => {
    if (header.includes("EXPORT")) {
      exportDataToCSV();
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-5">
        {isfilter && <Filter label={label} availableCategories={availableCategories} kFilter={kFilter} handleSaveFilter={handleSaveFilters}/>}
        <Input
          placeholder="Filter names..."
          value={table.getColumn("Item Name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("Item Name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {addbutton
          ? addbutton.map((button) => (
              <Tooltip key={button.Header}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleButtonClick(button.Header)}
                  >
                    <button.icon className="h-5 w-5" />
                    <span className="sr-only">{button.Header}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{button.Header}</TooltipContent>
              </Tooltip>
            ))
          : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border shadow-md ">
        <Table>
          <ScrollArea className="h-[60vh]">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
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
                      <TableCell key={cell.id} className="text-center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
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
          </ScrollArea>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      {Savebutton ? (
        <div className="flex items-center justify-start space-x-2 ">
          <Button>
            SAVE
          </Button>
        </div>
      ) : null}
    </div>
  );
}
