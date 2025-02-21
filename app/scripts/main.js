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

         constructor(container, width, height, margin) {
                this.width = width;
                this.height = height;
                this.margin = margin;

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

    console.log('BarChart initialized'); 
}

// Private method to update scales based on data
#updateScales() {
        console.log('Updating scales...');

        // Calculate the available space for the chart
        let chartWidth = this.width - this.margin[2] - this.margin[3];
        let chartHeight = this.height - this.margin[0] - this.margin[1];

        // Define ranges
        let rangeX = [0, chartWidth]; // Horizontal space
        let rangeY = [chartHeight, 0]; // Vertical space (inverted for SVG coordinate system)

        // Define the domains for the scales based on the data
        let domainX = this.data.map(d => d.breed); // x-axis domain (breed names)
        let domainY = [0, d3.max(this.data, d => d.count)]; // y-axis domain (counts)

        // Update scales with domains and ranges
        this.#scaleX.domain(domainX).range(rangeX).padding(0.1); // Add padding between bars
        this.#scaleY.domain(domainY).range(rangeY).nice(); // Use .nice() for better tick values

                // Log the domains and ranges to verify they are correct
                console.log('X Scale Domain:', this.#scaleX.domain());
                console.log('X Scale Range:', this.#scaleX.range());
                console.log('Y Scale Domain:', this.#scaleY.domain());
                console.log('Y Scale Range:', this.#scaleY.range());
            }
        
            // Render method to draw the bars
            render(data) {
                console.log('Render chart...');
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
                    .attr('fill', 'steelblue'); // Fill color

                    // Add x-axis
        this.chart.append('g')
        .attr('transform', `translate(0, ${this.height - this.margin[0] - this.margin[1]})`)
        .call(d3.axisBottom(this.#scaleX));

    // Add y-axis
    this.chart.append('g')
        .call(d3.axisLeft(this.#scaleY));
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

        constructor(container, width, height, margin) {
                this.width = width;
                this.height = height;
                this.margin = margin;

        
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


        // Define ranges
        let rangeX = [0, chartWidth]; // Horizontal Space
        let rangeY = [chartHeight, 0]; //Vertical (inverted for svg coordinate system)
        let rangeR = [2, 25]; //Bubble radius range

        // Define the domains for the scales based on the data
        let domainX = [Math.min(0, d3.min(this.data, d => d.weight)), d3.max(this.data, d => d.weight)]; // x-axis domain (weight)
        let domainY = [Math.min(0, d3.min(this.data, d => d.height)), d3.max(this.data, d => d.height)]; // y-axis domain (height)
        let domainR = [0, d3.max(this.data, d => d.count)]; // Radius domain (count)

        // Update scales with domains and ranges
        this.#scaleX.domain(domainX).range(rangeX).nice();
        this.#scaleY.domain(domainY).range(rangeY).nice();
        this.#scaleR.domain(domainR).range(rangeR);

          // Log the domains and ranges to verify they are correct
    console.log('X Scale Domain:', this.#scaleX.domain());
    console.log('X Scale Range:', this.#scaleX.range());
    console.log('Y Scale Domain:', this.#scaleY.domain());
    console.log('Y Scale Range:', this.#scaleY.range());
    console.log('Radius Scale Domain:', this.#scaleR.domain());
    console.log('Radius Scale Range:', this.#scaleR.range());
   
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
            .attr('fill', 'steelblue') // Fill color
            .attr('stroke', 'black') // Stroke color

                    // Add x-axis
        this.chart.append('g')
        .attr('transform', `translate(0, ${this.height - this.margin[0] - this.margin[1]})`)
        .call(d3.axisBottom(this.#scaleX));

    // Add y-axis
    this.chart.append('g')
        .call(d3.axisLeft(this.#scaleY));
            
    }
    }

let dogsBar = [
        {breed:'Golden Retriever', count:8653, weight: 39.5, height: 56},
        {breed:'Alaskan Malamute', count:261, weight: 36, height: 61},
        {breed:'Newfoundland', count:577, weight: 67.5, height: 68.5},
        {breed:'Siberian Husky', count:391, weight: 21.5, height: 55.5},
        {breed:'Shiba Inu', count:434, weight: 9, height: 38},
        {breed:'Keeshond', count:82, weight: 17.5, height: 44},
        {breed:'Australian Shepherd', count:255, weight: 24, height: 52},
        {breed:'Border Collie', count:1718, weight: 16, height: 51},
        {breed:'German Shepherd', count:7067, weight: 31, height: 60},
        {breed:'Swiss Shepherd', count:110, weight: 32.5, height: 60.5}
];

let dogsBubble = [
        {breed:'Golden Retriever', count:8653, weight: 39.5, height: 56},
        {breed:'Alaskan Malamute', count:261, weight: 36, height: 61},
        {breed:'Newfoundland', count:577, weight: 67.5, height: 68.5},
        {breed:'Siberian Husky', count:391, weight: 21.5, height: 55.5},
        {breed:'Shiba Inu', count:434, weight: 9, height: 38},
        {breed:'Keeshond', count:82, weight: 17.5, height: 44},
        {breed:'Australian Shepherd', count:255, weight: 24, height: 52},
        {breed:'Border Collie', count:1718, weight: 16, height: 51},
        {breed:'German Shepherd', count:7067, weight: 31, height: 60},
        {breed:'Swiss Shepherd', count:110, weight: 32.5, height: 60.5}
];

// Create the BarChart instance
let barChart = new BarChart("#bar1", 800, 500, [30, 50, 50, 20]);

// Render the bar chart with the dataset
barChart.render(dogsBar);

        // 3. Create the BubbleChart instance
let bubbleChart = new BubbleChart("#bubble1", 800, 500, [30, 50, 50, 20]);

// 4. Render the chart with the dataset
bubbleChart.render(dogsBubble);





    

            

        

        

        
