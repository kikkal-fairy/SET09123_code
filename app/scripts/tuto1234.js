'use strict';

//Define The barchart class
class BarChart {
        /*
         - container: DOM selector
         - width: vis width
         - height: vis height
         - margin: chart area margins
         */

         //Declare private fields at the top of the class
         #scaleX;
         #scaleY;
         #scaleC = () => 'lightgray'; // Default color scale

         constructor(container, width, height, margin) {
                this.width = width;
                this.height = height;
                this.margin = margin;

                console.log('Initializing BarChart...'); // Log initialization

                // Create SVG conatiner
                this.svg = d3.select(container)
                    .append('svg')
                    .attr('width', this.width)
                    .attr('height', this.height)
                    .classed('barchart', true);

                    // Append <g> element and position it according to margin values
        this.chart = this.svg.append('g')
        .attr('transform', `translate(${this.margin[2]},${this.margin[0]})`);

    // Initialize scales as properties 
    this.#scaleX = d3.scaleBand(); // Band scale for categorical data (x-axis)
    this.#scaleY = d3.scaleLinear(); // Linear scale for numerical data (y-axis)

    console.log('BarChart initialized'); // Log completion
}

// Private method to update scales based on data
#updateScales() {
        console.log('Updating scales...'); 

        // Calculate the available space for the chart
        let chartWidth = this.width - this.margin[2] - this.margin[3];
        let chartHeight = this.height - this.margin[0] - this.margin[1];

         // Define the domains for the scales based on the data
         let domainX = this.data.map(d => d.breed); // x-axis domain (breed names)
         let domainY = [0, d3.max(this.data, d => d.count)]; // y-axis domain (counts)
 

        this.#scaleX.domain(domainX).range([0, chartWidth]).padding(0.1);
        this.#scaleY.domain(domainY).range([chartHeight, 0]).nice();
     // Use .nice() for better tick values

                // Log the domains and ranges to verify they are correct
                console.log('X Scale Domain:', this.#scaleX.domain());
                console.log('X Scale Range:', this.#scaleX.range());
                console.log('Y Scale Domain:', this.#scaleY.domain());
                console.log('Y Scale Range:', this.#scaleY.range());
            }

            // Public method to update the color scale
          setColorScale(scale) {
        console.log('Setting color scale for BarChart...');
        this.#scaleC = scale;
        return this; // Enable method chaining
    }
        
            // Render method to draw the bars
            render(data) {
                console.log('Render Barchart...');
                this.data = data; // Save data reference
                this.#updateScales(); // Update scales before rendering
        
                // Bind data and draw rectangles (bars)
                this.chart.selectAll('rect.bar')
                    .data(this.data, d => d.breed)
                    .join('rect')
                    .classed('bar', true)
                    .attr('x', d => this.#scaleX(d.breed)) // Position horizontally (breed)
                    .attr('y', d => this.#scaleY(d.count)) // Position vertically (count)
                    .attr('width', this.#scaleX.bandwidth()) // Set bar width
                    .attr('height', d => this.height - this.margin[0] - this.margin[1] - this.#scaleY(d.count)) // Set bar height
                    .style('fill', d => this.#scaleC(d.c)); // use the color scale

                    // Add x-axis
        this.chart.append('g')
        .attr('transform', `translate(0, ${this.height - this.margin[0] - this.margin[1]})`)
        .call(d3.axisBottom(this.#scaleX));

         // Add y-axis
         this.chart.append('g')
        .call(d3.axisLeft(this.#scaleY));

           console.log('BarChart rendered'); 
  }
}
        
         

// Define the bubblechart first

class BubbleChart {
        /*
          - container: DOM selector
          - width: visualization width 
          - height: visualization height
          - margin: chart area margins [top, bottom, left, right]
        */

    // Declare private fields at the top of the class
    #scaleX;
    #scaleY;
    #scaleR;
    #scaleC = () => 'lightgray'; // Default color scale

        constructor(container, width, height, margin) {
                this.width = width;
                this.height = height;
                this.margin = margin;

        console.log('Imitializing BubbleChart...');

        
        // Create SVG container
        this.svg = d3.select(container)
             .append('svg')
             .attr('width', this.width)
             .attr('height', this.height)
             .classed('bubblechart', true);

        // Append <g> element and position it according to margin values
        this.chart = this.svg.append('g')
        .attr('transform', `translate(${this.margin[2]},${this.margin[0]})`);

        // Initialize scales as properties 
        this.#scaleX = d3.scaleLinear();
        this.#scaleY = d3.scaleLinear();
        this.#scaleR = d3.scaleSqrt();

        console.log('BubbleChart initialized'); 

  }


// Private method to update scales based on data
#updateScales() {
        console.log('Updating scales...');

        let chartWidth = this.width - this.margin[2] - this.margin[3];
        let chartHeight = this.height - this.margin[0] - this.margin[1];
        
        // Define the domains for the scales based on the data
        let domainX = [Math.min(0, d3.min(this.data, d => d.weight)), d3.max(this.data, d => d.weight)]; // x-axis domain (weight)
        let domainY = [Math.min(0, d3.min(this.data, d => d.height)), d3.max(this.data, d => d.height)]; // y-axis domain (height)
        let domainR = [0, d3.max(this.data, d => d.count)]; // Radius domain (count)


        this.#scaleX.domain(domainX).range([0, chartWidth]).nice();
        this.#scaleY.domain(domainY).range([chartHeight, 0]).nice();
        this.#scaleR.domain(domainR).range([2, 25]);

    // Log the domains and ranges to verify they are correct
    console.log('X Scale Domain:', this.#scaleX.domain());
    console.log('X Scale Range:', this.#scaleX.range());
    console.log('Y Scale Domain:', this.#scaleY.domain());
    console.log('Y Scale Range:', this.#scaleY.range());
    console.log('Radius Scale Domain:', this.#scaleR.domain());
    console.log('Radius Scale Range:', this.#scaleR.range());
   
}
     // Public method to update the color scale
     setColorScale(scale) {
        console.log('Setting colorr scale for BubbleChart...');
        this.#scaleC = scale;
        return this; // Enable method chaining
     }
    

    // Render method to draw the bubbles
    render(data) {
        console.log('Render chart...');
        this.data = data;  // Save data reference
        this.#updateScales();  // Update scales before rendering

        // Bind data and draw circles
        this.chart.selectAll('circle.bubble')
            .data(this.data, d => d.breed)
            .join('circle')
            .classed('bubble', true)
            .attr('cx', d => this.#scaleX(d.weight))
            .attr('cy', d => this.#scaleY(d.height))
            .attr('r', d => this.#scaleR(d.count))
            .style('fill', d => this.#scaleC(d.c)) // use the color scale
            .attr('stroke', 'black') // Stroke color

                    // Add x-axis
        this.chart.append('g')
        .attr('transform', `translate(0, ${this.height - this.margin[0] - this.margin[1]})`)
        .call(d3.axisBottom(this.#scaleX));

    // Add y-axis
    this.chart.append('g')
        .call(d3.axisLeft(this.#scaleY));

    console.log('BubbleChart rendered');
            
    }
 }

    let dogsBar = [
        { breed: 'Golden Retriever', count: 8653, weight: 39.5, height: 56, c: 'Golden Retriever' }, // CHANGED: Added `c` attribute
        { breed: 'Alaskan Malamute', count: 261, weight: 36, height: 61, c: 'Alaskan Malamute' }, // CHANGED: Added `c` attribute
        { breed: 'Newfoundland', count: 577, weight: 67.5, height: 68.5, c: 'Newfoundland' }, // CHANGED: Added `c` attribute
        { breed: 'Siberian Husky', count: 391, weight: 21.5, height: 55.5, c: 'Siberian Husky' }, // CHANGED: Added `c` attribute
        { breed: 'Shiba Inu', count: 434, weight: 9, height: 38, c: 'Shiba Inu' }, // CHANGED: Added `c` attribute
        { breed: 'Keeshond', count: 82, weight: 17.5, height: 44, c: 'Keeshond' }, // CHANGED: Added `c` attribute
        { breed: 'Australian Shepherd', count: 255, weight: 24, height: 52, c: 'Australian Shepherd' }, // CHANGED: Added `c` attribute
        { breed: 'Border Collie', count: 1718, weight: 16, height: 51, c: 'Border Collie' }, // CHANGED: Added `c` attribute
        { breed: 'German Shepherd', count: 7067, weight: 31, height: 60, c: 'German Shepherd' }, // CHANGED: Added `c` attribute
        { breed: 'Swiss Shepherd', count: 110, weight: 32.5, height: 60.5, c: 'Swiss Shepherd' } // CHANGED: Added `c` attribute
    ];

let dogsBubble = [
    { breed: 'Golden Retriever', count: 8653, weight: 39.5, height: 56, c: 'Golden Retriever' }, // CHANGED: Added `c` attribute
    { breed: 'Alaskan Malamute', count: 261, weight: 36, height: 61, c: 'Alaskan Malamute' }, // CHANGED: Added `c` attribute
    { breed: 'Newfoundland', count: 577, weight: 67.5, height: 68.5, c: 'Newfoundland' }, // CHANGED: Added `c` attribute
    { breed: 'Siberian Husky', count: 391, weight: 21.5, height: 55.5, c: 'Siberian Husky' }, // CHANGED: Added `c` attribute
    { breed: 'Shiba Inu', count: 434, weight: 9, height: 38, c: 'Shiba Inu' }, // CHANGED: Added `c` attribute
    { breed: 'Keeshond', count: 82, weight: 17.5, height: 44, c: 'Keeshond' }, // CHANGED: Added `c` attribute
    { breed: 'Australian Shepherd', count: 255, weight: 24, height: 52, c: 'Australian Shepherd' }, // CHANGED: Added `c` attribute
    { breed: 'Border Collie', count: 1718, weight: 16, height: 51, c: 'Border Collie' }, // CHANGED: Added `c` attribute
    { breed: 'German Shepherd', count: 7067, weight: 31, height: 60, c: 'German Shepherd' }, // CHANGED: Added `c` attribute
    { breed: 'Swiss Shepherd', count: 110, weight: 32.5, height: 60.5, c: 'Swiss Shepherd' } // CHANGED: Added `c` attribute
];

// Data for the line chart (Golden Retriever registrations over the years)
let grHistoric = [
    { y: 2011, c: 8081 }, { y: 2012, c: 7085 }, { y: 2013, c: 7117 },
    { y: 2014, c: 6977 }, { y: 2015, c: 6928 }, { y: 2016, c: 7232 },
    { y: 2017, c: 7846 }, { y: 2018, c: 7794 }, { y: 2019, c: 8422 },
    { y: 2020, c: 8653 }
];

// Sort the data by year
let sortedData = d3.sort(grHistoric, d => d.y);

// Create a category domain based on the 'c' attribute
let categories = [...new Set(dogsBar.map(d => d.c))];
console.log('Category Domain:', categories);


// Create an ordinal scale for colors
let colorScale = d3.scaleOrdinal()
    .domain(categories)
    .range(d3.schemeCategory10);

console.log('Color Scale:', colorScale.domain());

// Create the BarChart instance
let barChart = new BarChart("#bar1", 800, 500, [30, 50, 50, 20]);

// Render the bar chart with the dataset
barChart.setColorScale(colorScale).render(dogsBar);

        // 3. Create the BubbleChart instance
let bubbleChart = new BubbleChart("#bubble1", 800, 500, [30, 50, 50, 20]);

// 4. Render the chart with the dataset
bubbleChart.setColorScale(colorScale).render(dogsBubble);


// Set up SVG dimensions for the line chart
let lineWidth = 400;
let lineHeight = 300;
let lineMargin = { top: 20, right: 20, bottom: 30, left: 40 };

// Create SVG container for the line chart
let lineSvg = d3.select("#line1")
    .append("svg")
    .attr("width", lineWidth)
    .attr("height", lineHeight);

    // Create a group for the line chart area
    let lineChart = lineSvg.append("g")
        .attr("transform", `translate(${lineMargin.left},${lineMargin.top})`);
    
    // X scale (time-based)
let xScale = d3.scaleLinear()
.domain([d3.min(sortedData, d => d.y), d3.max(sortedData, d => d.y)]) // Domain: min and max years
.range([0, lineWidth - lineMargin.left - lineMargin.right]); // Range: 0 to chart width

// Y scale (linear)
let yScale = d3.scaleLinear()
    .domain([0, d3.max(sortedData, d => d.c)]) // Domain: 0 to max count
    .range([lineHeight - lineMargin.top - lineMargin.bottom, 0]); // Range: chart height to 0 (inverted for SVG)
    
    // Line generator
    let lineGen = d3.line()
        .curve(d3.curveLinear) // Smooth curve
        .x(d => xScale(d.y)) // Map x values to xScale
        .y(d => yScale(d.c)); // Map y values to yScale
    
    // Append a path for the line
    lineChart.append("path")
    .datum(sortedData) // Bind data to the path
    .attr("fill", "none") // No fill
    .attr("stroke", "coral") // Line color
    .attr("stroke-width", 3) // Line thickness
    .attr("d", lineGen); // Use the line generator to create the path

// Add x-axis
lineChart.append("g")
    .attr("transform", `translate(0,${lineHeight - lineMargin.top - lineMargin.bottom})`)
    .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")));

// Add y-axis
lineChart.append("g")
    .call(d3.axisLeft(yScale));


// Set up SVG dimensions for the donut chart
let donutWidth = 400;
let donutHeight = 400;
let donutMargin = { top: 20, right: 20, bottom: 20, left: 20 };

// Create SVG container for the donut chart
let donutSvg = d3.select("#donut1")
    .append("svg")
    .attr("width", donutWidth)
    .attr("height", donutHeight);

// Create a group for the donut chart area
let donutChart = donutSvg.append("g")
    .attr("transform", `translate(${donutWidth / 2},${donutHeight / 2})`);

    // Define donut data
let donutData = [
    { k: 'Golden Retriever', v: 8653 },
    { k: 'Alaskan Malamute', v: 261 },
    { k: 'Newfoundland', v: 577 },
    { k: 'Siberian Husky', v: 391 },
    { k: 'Shiba Inu', v: 434 },
    { k: 'Keeshond', v: 82 },
    { k: 'Australian Shepherd', v: 255 },
    { k: 'Border Collie', v: 1718 },
    { k: 'German Shepherd', v: 7067 },
    { k: 'Swiss Shepherd', v: 110 }
];

    // Create a pie generator
let pieGen = d3.pie()
.padAngle(0.02) // Add spacing between segments
.sort(null) // Do not sort the data
.value(d => d.v); // Use the 'v' property for values

// Generate pie data
let pieData = pieGen(donutData);

// Create an arc generator
let arcGen = d3.arc()
.innerRadius(donutWidth / 4) // Inner radius (hole size)
.outerRadius(donutWidth / 2 - 5); // Outer radius (chart size)

// Create a color scale
let donutcolorScale = d3.scaleOrdinal()
    .domain(donutData.map(d => d.k))
    .range(d3.schemeCategory10);


// Draw the arcs
let arcs = donutChart.selectAll('path')
.data(pieData, d => d.data.k) // Bind data to paths
.join('path')
.attr('fill', d => donutcolorScale(d.data.k)) // use the color scale
.attr('fill-opacity', 0.8) // Fill opacity
.attr('stroke', 'cadetblue') // Stroke color
.attr('stroke-width', 2) // Stroke width
.attr('d', arcGen) // Use the arc generator to create the paths
.on('mouseover', function () {
    d3.select(this).attr('fill-opacity', 1); // Highlight on hover
})
.on('mouseout', function () {
    d3.select(this).attr('fill-opacity', 0.8); // Reset on mouseout
});

// Add labels
donutChart.selectAll('text')
    .data(pieData)
    .join('text')
    .attr('transform', d => `translate(${arcGen.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .text(d => d.data.k);


    d3.csv('data/sales.csv', d => {
        return {
            location: d.location,
            client: d.client,
            salesrep: d.salesrep,
            paid: d.paid === 'Yes',
            reimbursed: d.reimbursed === 'Yes',
            sales: parseInt(d.sales),
            expenses: parseInt(d.expenses),
            profits: parseInt(d.sales) - parseInt(d.expenses)
        };
    })
    .then(salesData => {
        console.log('Sales Data Loaded:', salesData);
    


    // Find the lists of unique Sales Rep, Locations, and Clients
    let uniqueSalesReps = [...new Set(salesData.map(d => d.salesrep))];
console.log('Unique Sales Reps:', uniqueSalesReps);

let uniqueLocations = [...new Set(salesData.map(d => d.location))];
console.log('Unique Locations:', uniqueLocations);

let uniqueClients = [...new Set(salesData.map(d => d.client))];
console.log('Unique Clients:', uniqueClients);


    // Find the number of sales for which payment has been received
    let paidSalesCount = salesData.filter( d => d.paid).length;
    console.log('Number of paid sales:', paidSalesCount);

    // Group the dataset entries by Sales Rep and then Locations
    let groupedBySalesRepAndLocation = d3.groups(salesData, d => d.salesrep, d => d.location);
    console.log('Grouped by Sales Rep and Location:', groupedBySalesRepAndLocation);

    //  Group the dataset entries by Client and then Locations and get the number of entries in each group
    let groupedByClientAndLocation = d3.rollup(salesData, v => v.length, d => d.client, d => d.location);
    console.log('Grouped by Client and Location:', groupedByClientAndLocation);

    // Distribute the entries into 10 equally-sized categories based on the Expenses values
    let expensesExtent = d3.extent(salesData, d => d.expenses);
let expensesThresholds = d3.ticks(expensesExtent[0], expensesExtent[1], 10);

let categorizedByExpenses = salesData.map(d => {
    let category = expensesThresholds.findIndex(t => d.expenses <= t);
    return { ...d, expenseCategory: category };
});

console.log('Entries categorized by Expenses:', categorizedByExpenses);

//Get the average Sales value per Location
let averageSalesByLocation = d3.rollup(
    salesData,
    v => d3.mean(v, d => d.sales),
    d => d.location
);
console.log('Average Sales by Location:', averageSalesByLocation);

// Get the maximum Expenses value by Sales Rep and Location
let maxExpensesBySalesRepAndLocation = d3.rollup(
    salesData,
    v => d3.max(v, d => d.expenses),
    d => d.salesrep,
    d => d.location
);
console.log('Maximum Expenses by Sales Rep and Location:', maxExpensesBySalesRepAndLocation);

// Get the total reimbursed Expenses value by Sales Rep
let totalReimbursedBySalesRep = d3.rollup(
    salesData,
    v => d3.sum(v, d => d.reimbursed ? d.expenses : 0),
    d => d.salesrep
);
console.log('Total Reimbursed Expenses by Sales Rep:', totalReimbursedBySalesRep);

// Find the Client and Sales value of the entry with the highest Sales in Glasgow
let glasgowSales = salesData.filter(d => d.location === 'Glasgow');
let highestSaleInGlasgow = d3.max(glasgowSales, d => d.sales);
let entryWithHighestSale = glasgowSales.find(d => d.sales === highestSaleInGlasgow);

console.log('Client and Sales value of highest sale in Glasgow:', {
    client: entryWithHighestSale.client,
    sales: entryWithHighestSale.sales
});

//  Get a new array of entries, with the names of Sales Rep and their reimbursement percentage (reimbursed expenses / total expenses)
let reimbursementPercentageBySalesRep = salesData.map(d => {
    let totalExpenses = d.expenses;
    let reimbursedExpenses = d.reimbursed ? d.expenses : 0;
    let reimbursementPercentage = (reimbursedExpenses / totalExpenses) * 100;
    return {
        salesrep: d.salesrep,
        reimbursementPercentage: reimbursementPercentage
    };
});

console.log('Reimbursement Percentage by Sales Rep:', reimbursementPercentageBySalesRep);

// Get the entry with a Sales value closest to £3,456 in Aberdeen
let aberdeenSales = salesData.filter(d => d.location === 'Aberdeen');
let targetSalesValue = 3456;

let closestSaleEntry = aberdeenSales.reduce((closest, d) => {
    let currentDiff = Math.abs(d.sales - targetSalesValue);
    let closestDiff = Math.abs(closest.sales - targetSalesValue);
    return currentDiff < closestDiff ? d : closest;
});

console.log('Entry with Sales closest to £3,456 in Aberdeen:', closestSaleEntry);

// Get the entry that appears both in the top 10 sales done in Inverness and the top 10 sales done by James (by Sales value)
// Top 10 sales in Inverness
let invernessSales = salesData.filter(d => d.location === 'Inverness');
let top10Inverness = invernessSales.sort((a, b) => b.sales - a.sales).slice(0, 10);

// Top 10 sales by James
let jamesSales = salesData.filter(d => d.salesrep === 'James');
let top10James = jamesSales.sort((a, b) => b.sales - a.sales).slice(0, 10);

// Find common entry
let commonEntry = top10Inverness.find(entry => top10James.some(jamesEntry => jamesEntry === entry));

console.log('Common entry in top 10 sales in Inverness and top 10 sales by James:', commonEntry);

    })

.catch(error => {
    console.error('Error loading the sales.csv file:', error);
});




    

            

        

        

        
