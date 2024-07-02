import React from 'react';
import { Button } from './../../components/ui/button';
import MyBarChart from './MyBarChart';
import { ScrollArea } from './../../components/ui/scroll-area';

const Dashboard = () => {
    // Inventory Data
    const inventoryData = {
        labels: ['Active Stock', 'WIP Stock', 'Low Stock', 'High Stock', 'Optimum Stock', 'Negative Stock'],
        datasets: [
            {
                label: 'Stock Levels',
                data: [15, 10, 5, 20, 25, -5],
                backgroundColor: [
                    'rgba(225,225,242,255)',
                    'rgba(225,225,242,255)',
                    'rgba(225,225,242,255)',
                    'rgba(225,225,242,255)',
                    'rgba(225,225,242,255)',
                    'rgba(225,225,242,255)',
                ],
                borderColor: [
                    'rgba(211,70,177,255)',
                    'rgba(211,70,177,255)',
                    'rgba(211,70,177,255)',
                    'rgba(211,70,177,255)',
                    'rgba(211,70,177,255)',
                    'rgba(211,70,177,255)',
                ],
                borderWidth: 3
            }
        ]
    };

    const inventoryOptions = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // Production Data
    const productionData = {
      labels: ['12th Jun'],  // Update the label to match the image
      datasets: [
          {
              label: 'Workstation Productivity',  // Update the label to match the image
              data: [0],  // Data point from the image
              backgroundColor: 'rgba(31,142,241,255)',
              borderColor: 'rgba(31,142,241,255)',
              fill: false,
              tension: 0, // disable bezier curves
              pointBackgroundColor: 'rgba(31,142,241,255)',
              pointBorderColor: 'rgba(31,142,241,255)',
              pointRadius: 5
          }
      ]
  };
  
  const productionOptions = {
      scales: {
          y: {
              beginAtZero: true,
              min: -1,
              max: 1
          }
      },
      elements: {
          line: {
              tension: 0 // disable bezier curves
          }
      }
  };

    // Sales Data
    const salesData = {
        labels: ['Pending', 'Active', 'Dispatch'],
        datasets: [
            {
                label: 'Sales Status',
                data: [8, 15, 7],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(0,214,180,255)',
                    'rgba(0,214,180,255)',
                    'rgba(0,214,180,255)',
                ],
                borderWidth: 3
            }
        ]
    };

    const salesOptions = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // Purchase Data
    const purchaseData = {
        labels: ['Pending', 'Active', 'Received'],
        datasets: [
            {
                label: 'Purchase Status',
                data: [5, 12, 20],
                backgroundColor: [
                    'rgba(245,244,221,255)',
                    'rgba(245,244,221,255)',
                    'rgba(245,244,221,255)',
                ],
                borderColor: [
                    'rgba(246,206,10,255)',
                    'rgba(246,206,10,255)',
                    'rgba(246,206,10,255)',
                ],
                borderWidth: 3
            }
        ]
    };

    const purchaseOptions = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // Cost Data
    const costData = {
        labels: ['Fixed', 'Variable', 'Operational', 'Miscellaneous'],
        datasets: [
            {
                label: 'Cost Breakdown',
                data: [10, 20, 30, 40],
                backgroundColor: [
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    const costOptions = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div className="w-full h-[120vh] mt-0 flex flex-col">
            <div className="w-full justify-center px-10 py-2">
                <h1 className="text-4xl font-sans">Dashboard</h1>
                <div className="flex flex-col gap-4 mt-4">

                  <ScrollArea className='h-[660px] ml-auto w-full'>

                    <div className="flex flex-row gap-4 mt-4 justify-center items-center">
                        {/* INVENTORY */}
                        <div className="hero bg-white p-5 shadow-lg rounded-xl border border-gray-200 pt-2 w-[50%]">
                            <div className="hero-content">
                                <div className="space-y-auto mt-1">
                                    <div className="flex flex-row justify-between items-center">
                                        <h1 className="text-3xl font-small text-gray-800">INVENTORY</h1>
                                        <Button className='px-8'> View</Button>
                                    </div>
                                    <MyBarChart data={inventoryData} options={inventoryOptions} type="bar"/>
                                </div>
                            </div>
                        </div>

                        {/* PRODUCTION */}
                        <div className="hero bg-white p-5 shadow-lg rounded-xl border border-gray-200 pt-2 w-[50%]">
                            <div className="hero-content">
                                <div className="space-y-auto mt-1">
                                    <div className="flex flex-row justify-between items-center">
                                        <h1 className="text-3xl font-small text-gray-800">PRODUCTION</h1>
                                        <Button className='px-8'> View</Button>
                                    </div>
                                    <MyBarChart data={productionData} options={productionOptions} type="line" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row gap-4 mt-4 justify-center">
                        {/* SALES */}
                        <div className="hero bg-white p-5 shadow-lg rounded-xl border border-gray-200 pt-2 w-[50%]">
                            <div className="hero-content">
                                <div className="space-y-auto mt-1">
                                    <div className="flex flex-row justify-between items-center">
                                        <h1 className="text-3xl font-small text-gray-800">SALES</h1>
                                        <Button className='px-8'> View</Button>
                                    </div>
                                    <MyBarChart data={salesData} options={salesOptions} type="bar"/>
                                </div>
                            </div>
                        </div>

                        {/* PURCHASE */}
                        <div className="hero bg-white p-5 shadow-lg rounded-xl border border-gray-200 pt-2 w-[50%]">
                            <div className="hero-content">
                                <div className="space-y-auto mt-1">
                                    <div className="flex flex-row justify-between items-center">
                                        <h1 className="text-3xl font-small text-gray-800">PURCHASE</h1>
                                        <Button className='px-8'> View</Button>
                                    </div>
                                    <MyBarChart data={purchaseData} options={purchaseOptions} type="bar"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row gap-4 mt-4 justify-center">
                        {/* COST */}
                        <div className="hero bg-white p-5 shadow-lg rounded-xl border border-gray-200 pt-2 w-[50%]">
                            <div className="hero-content">
                                <div className="space-y-auto mt-1">
                                    <div className="flex flex-row justify-between items-center">
                                        <h1 className="text-3xl font-small text-gray-800">COST</h1>
                                        <Button className='px-8'> View</Button>
                                    </div>
                                    <MyBarChart data={costData} options={costOptions} type="bar"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
