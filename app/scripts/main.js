'use strict';

// Import your classes
import { BarChart } from './BarChart.js';
import { BubbleChart } from './BubbleChart.js';
import { LineChart } from './LineChart.js';
import { DonutChart } from './DonutChart.js';
import { SalesDataManager } from './SalesDataManager.js';
import UKMap from './UKMap.js';


const margin = [30, 50, 50, 20]; // top, bottom, left, right
const width = 800;
const height = 500;

// 1. Load CSV data using the data manager
const dataManager = new SalesDataManager();
dataManager.loadData('./data/sales.csv').then(manager => {
    const data = manager.getAllData();

    const bubbleChart = new BubbleChart('#bubble1', width, height, margin);
bubbleChart.render(data);

// 👉 Define locationSales first!
const locationSales = d3.rollups(data, v => d3.sum(v, d => d.sales), d => d.location)
    .map(([location, sales]) => ({ location, sales }));

// Create BarChart first (so we can update it from brush)
const barChart = new BarChart('#bar1', width, height, margin);
barChart.render(locationSales);

// Filter callback
function handleBrushedData(filteredData) {
    const updatedBarData = d3.rollups(filteredData, v => d3.sum(v, d => d.sales), d => d.location)
        .map(([location, sales]) => ({ location, sales }));

    barChart.render(updatedBarData);
}

// 👇 Toggle interaction buttons
document.getElementById('enable-zoom').addEventListener('click', () => {
    bubbleChart.enableZoom();
});

document.getElementById('enable-brush').addEventListener('click', () => {
    bubbleChart.enableBrush(handleBrushedData);
});


    // 4. Line Chart (e.g., sales over time — assuming you format dates)
    // Simulated line chart data (you’ll need actual date data from CSV)
    const lineData = [
        { date: '2023-01-01', sales: 1200 },
        { date: '2023-02-01', sales: 1800 },
        { date: '2023-03-01', sales: 1500 },
        { date: '2023-04-01', sales: 2200 }
    ];
    const lineChart = new LineChart('#line1', 400, 300, margin);
    lineChart.render(lineData);

    // 5. Donut Chart (e.g., total sales per client)
    const donutData = d3.rollups(data, v => d3.sum(v, d => d.sales), d => d.client)
        .map(([k, v]) => ({ k, v }))
        .sort((a, b) => b.v - a.v)
        .slice(0, 10); // top 10 clients

    const donutChart = new DonutChart('#donut1', 400, 400, margin);
    donutChart.render(donutData);

});

const attractions = [
    { name: 'Stonehenge', lat: 51.1788, lon: -1.8261, value: 64 },
    { name: 'Eden Project', lat: 50.3619, lon: -4.7447, value: 21 },
    { name: 'Canterbury Cathedral', lat: 51.2798, lon: 1.0828, value: 36 },
    { name: 'Loch Ness', lat: 57.3229, lon: -4.4244, value: 58 },
    { name: 'Lake District', lat: 54.5772, lon: -2.7975, value: 47 }
];

const map = new UKMap('#map', 600, 600);
map.render(attractions, (eventType, data) => {
    if (eventType === 'hover') {
        console.log('Hovered:', data.name);
    } else if (eventType === 'click') {
        console.log('Clicked:', data);
    }
});