'use strict';

// Import your components
import { BarChart } from './BarChart.js';
import { BubbleChart } from './BubbleChart.js';
import { LineChart } from './LineChart.js';
import { DonutChart } from './DonutChart.js';
import { SalesDataManager } from './SalesDataManager.js';
import UKMap from './UKMap.js';
import { CirclePack } from './CirclePack.js';
import { Treemap } from './Treemap.js';


const margin = [30, 50, 50, 20];
const width = 800;
const height = 500;

// 1. Load Sales CSV and render 4 charts
const dataManager = new SalesDataManager();
dataManager.loadData('./data/sales.csv').then(manager => {
  const data = manager.getAllData();

  // Bubble chart
  const bubbleChart = new BubbleChart('#bubble1', width, height, margin);
  bubbleChart.render(data);

  // Bar chart - sales by location
  const locationSales = d3.rollups(data, v => d3.sum(v, d => d.sales), d => d.location)
    .map(([location, sales]) => ({ location, sales }));
  const barChart = new BarChart('#bar1', width, height, margin);
  barChart.render(locationSales);

  // Brushing callback
  function handleBrushedData(filteredData) {
    const updatedBarData = d3.rollups(filteredData, v => d3.sum(v, d => d.sales), d => d.location)
      .map(([location, sales]) => ({ location, sales }));
    barChart.render(updatedBarData);
  }

  // Zoom & Brush toggle buttons
  document.getElementById('enable-zoom').addEventListener('click', () => {
    bubbleChart.enableZoom();
  });
  document.getElementById('enable-brush').addEventListener('click', () => {
    bubbleChart.enableBrush(handleBrushedData);
  });

  // Line chart - simulated data
  const lineData = [
    { date: '2023-01-01', sales: 1200 },
    { date: '2023-02-01', sales: 1800 },
    { date: '2023-03-01', sales: 1500 },
    { date: '2023-04-01', sales: 2200 }
  ];
  const lineChart = new LineChart('#line1', 400, 300, margin);
  lineChart.render(lineData);

  // Donut chart - sales by client
  const donutData = d3.rollups(data, v => d3.sum(v, d => d.sales), d => d.client)
    .map(([k, v]) => ({ k, v }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 10);
  const donutChart = new DonutChart('#donut1', 400, 400, margin);
  donutChart.render(donutData);
});

// 2. UK Map
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


// 3. Tutorial 10: CirclePack & Treemap for french_districts.csv
d3.csv('./data/french_districts.csv').then(data => {
    console.log('✅ Loaded French data:', data.length);
  
    // Parse values
    data.forEach(d => {
      d.population = +d.population;
      d.n_cities = +d.n_cities;
    });
  
    // Group into nested structure
    const nested = d3.group(data, d => d.region, d => d.department);
  
    // Convert to hierarchy objects
    const rootForPop = {
      name: 'France',
      children: Array.from(nested, ([region, departments]) => ({
        name: region,
        children: Array.from(departments, ([dept, districts]) => ({
          name: dept,
          value: d3.sum(districts, d => d.population) // for circle pack
        }))
      }))
    };
  
    const rootForCities = {
      name: 'France',
      children: Array.from(nested, ([region, departments]) => ({
        name: region,
        children: Array.from(departments, ([dept, districts]) => ({
          name: dept,
          value: d3.sum(districts, d => d.n_cities) // for treemap
        }))
      }))
    };
  
    // Build D3 hierarchies
    const hierarchyPop = d3.hierarchy(rootForPop).sum(d => d.value);
    const hierarchyCity = d3.hierarchy(rootForCities).sum(d => d.value);
  
    // Render CirclePack
    const circlePackChart = new CirclePack('#circlepack', 600, 600);
    circlePackChart.render(hierarchyPop);
  
    // Render Treemap
    const treemapChart = new Treemap('#treemap', 600, 600);
    treemapChart.render(hierarchyCity);
  });
  
