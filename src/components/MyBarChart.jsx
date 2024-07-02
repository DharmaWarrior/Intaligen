import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components and elements
ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend);

// Custom plugin for vertical lines
const verticalLinePlugin = {
    id: 'verticalLinePlugin',
    afterDatasetsDraw(chart, args, options) {
        const { ctx, chartArea: { top, bottom, left, right }, scales: { x } } = chart;

        ctx.save();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'; // Light color for vertical lines
        ctx.lineWidth = 2;

        const verticalLinePositions = [1.5, 4.5]; // Positions for vertical lines

        verticalLinePositions.forEach((position) => {
            const xPos = x.getPixelForValue(position);
            ctx.beginPath();
            ctx.moveTo(xPos, top);
            ctx.lineTo(xPos, bottom);
            ctx.stroke();
        });

        ctx.restore();
    }
};

// Register the custom plugin
ChartJS.register(verticalLinePlugin);

const MyBarChart = ({ data, options, type = 'line' }) => (
    <div style={{ width: '550px', height: '300px' }}>
        {type === 'line' ? (
            <Line data={data} options={options} width={550} height={300} />
        ) : (
            <Bar data={data} options={options} width={550} height={300} />
        )}
    </div>
);

export default MyBarChart;
