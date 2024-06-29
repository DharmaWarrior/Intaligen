import React, { useState, useEffect } from 'react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from './../components/ui/tabs'
import {Button} from './../components/ui/button'
import {data4 , data5, data6} from './data/data';
import { DataTable } from './components/DataTable';
import { ArrowUpDown, MoreHorizontal,FileSpreadsheet, FileText , CloudUpload, FileUp, FilePlus} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './../components/ui/dropdown-menu';
import { Checkbox } from './../components/ui/checkbox';
import { DetailsDialog } from './cards/DetailsDialog';




const Inventory = () => {
  const [editModes, setEditModes] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [lookupData, setLookupData] = useState([]);
  const [recentData, setRecentData] = useState([]);

  const availableCategories = [
    [
        4,
        "RAW MATERIAL"
    ],
    [
        5,
        "PACKING MATERIAL"
    ],
    [
        3,
        "EXPORT"
    ],
    [
        7,
        "RAJASTHAN"
    ],
    [
        1,
        "QWERTY"
    ],
    [
        15,
        "ABC"
    ],
    [
        16,
        "WORKER-TYPE1"
    ],
    [
        2,
        "Worker -type-2"
    ],
    [
        6,
        "MACHINE-type-1"
    ],
    [
        17,
        "MACHINE TYPE 2"
    ]
];

  


const fetchLookup = async () => {
    try {
      let token = localStorage.getItem("usersdatatoken");
      if(!token) {
        console.log("Token not found");
      }
      
      const response = await fetch("/api/inventory_lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          "k": -1,
          "data_type": "ACTIVE"
      })
      });

      if (response.ok) {
        const result = await response.json();
        setLookupData(result);
      } else {
        console.error('Failed to fetch data');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

const fetchRecent = async () => {
    try {
      let token = localStorage.getItem("usersdatatoken");
      if(!token) {
        console.log("Token not found");
      }
      
      const response = await fetch("/api/inventory_ledger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          "k": -1
      })
      });

      if (response.ok) {
        const result = await response.json();
        
        setRecentData(result);
      } else {
        console.error('Failed to fetch data');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLookup();
    fetchRecent();
  }, []);


  const columns1 = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "item_code",
      heading: "ITEM CODE",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ITEM CODE <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("item_code")}</div>,
    },
    {
      accessorKey: "Item Name",
      heading : "NAME",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          NAME <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("Item Name")}</div>,
    },
    {
      accessorKey: "Item Unit",
      heading : "UNIT",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          UNIT <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("Item Unit")}</div>,
    },
    {
      accessorKey: "total_stock",
      heading : "READY STOCK",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          READY STOCK <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("total_stock")}</div>,
    },
    {
      accessorKey: "total_wip_stock",
      heading : "WIP STOCK",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          WIP STOCK <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("total_wip_stock")}</div>,
    },
    {
      accessorKey: "total_reject_stock",
      heading : "REJECT STOCK",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          REJECT STOCK <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("total_reject_stock")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
        
  
        return (
          <DetailsDialog 
            item_id={item.item_id} // Pass the item_id here
            Heading={item["Item Name"]}
            value={{
              active: item.total_stock,
              wip: item.total_wip_stock,
              reject: item.total_reject_stock,
            }}
        />
        );
      },
    },
  ];

  const columns2 = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      heading: "ITEM",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ITEM <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "qty",
      heading: "QTY",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          QTY <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("qty")}</div>,
    },
    {
      accessorKey: "item_unit",
      heading: "UNIT",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          UNIT <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("item_unit")}</div>,
    },
    {
      accessorKey: "note",
      heading: "NOTE",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          NOTE <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("note")}</div>,
    },
    {
      accessorKey: "regdate",
      heading: "DATE",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          DATE <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("regdate")}</div>,
    },
  ];

  const columns3 = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "item_code",
      heading: "ITEM CODE",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ITEM CODE <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("item_code")}</div>,
    },
    {
      accessorKey: "Item Name",
      heading : "NAME",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          NAME <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("Item Name")}</div>,
    },
    {
      accessorKey: "Item Unit",
      heading : "UNIT",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          UNIT <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("Item Unit")}</div>,
    },
    {
      accessorKey: "total_stock",
      heading : "SYSTEM STOCK",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SYSTEM STOCK <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("total_stock")}</div>,
    },
    {
      accessorKey: "total_stock",
      heading : "PHYSICAL STOCK",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PHYSICAL STOCK <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const [value, setValue] = useState(row.getValue("total_stock"));
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border p-1 rounded"
          />
        );
      },
    },
    {
      accessorKey: "narration",
      heading : "NARRATION",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          NARRATION <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const [value, setValue] = useState(row.getValue("narration") || "");
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border p-1 rounded"
          />
        );
      },
    },
  ];
  
  const buttons1 = React.useMemo(() => [
    { "Header": "ADD ADJUSTMENTS", "icon" : FilePlus},
    { "Header": "EXPORT STOCKLIST", "icon" : FileUp},
  ], [editModes]);

  const buttons2 = React.useMemo(() => [
    { "Header": "STOCK LIST EXCEL" , "icon" : FileSpreadsheet},
    { "Header": "STOCK LIST PDF" , "icon" : FileText}, 
    { "Header": "UPLOAD RECONCILIATION LIST" , "icon" : CloudUpload},
  ], [editModes]);

  return (
    <div className="w-full h-[120vh]  mt-0 flex flex-col">
      <div className=" w-full justify-center px-10 py-2">
        <h1 className='text-4xl font-sans'>INVENTORY</h1>
        <Tabs defaultValue="item_lookup" >
          <div className=" items-center pt-4 ">
            <TabsList className="ml-auto">
              <TabsTrigger
                value="item_lookup"
                className="text-zinc-600 dark:text-zinc-200"
              >
                ITEM LOOKUP
              </TabsTrigger>
              <TabsTrigger
                value="recent_activity"
                className="text-zinc-600 dark:text-zinc-200"
              >
                RECENT ACTIVITY
              </TabsTrigger>
              <TabsTrigger
                value="physical_reconciliation"
                className="text-zinc-600 dark:text-zinc-200"
              >
                PHYSICAL RECONCILATION
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="item_lookup" className="m-0 border border-x-y-emerald-50 card custom-scroll">
            <DataTable data={lookupData} columns={columns1} addbutton={buttons1} availableCategories={availableCategories}/>
          </TabsContent>
          <TabsContent value="recent_activity" className="m-0 border border-x-y-emerald-50 card custom-scroll">
            <DataTable data={recentData} columns={columns2} availableCategories={availableCategories}/>
          </TabsContent>
          <TabsContent value="physical_reconciliation" className="m-0 border border-x-y-emerald-50 card custom-scroll">
            <DataTable data={lookupData} columns={columns3} addbutton={buttons2} Savebutton={true} availableCategories={availableCategories}/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Inventory