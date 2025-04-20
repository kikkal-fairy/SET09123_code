'use strict';

export class DonutChart {
    constructor(container, width, height, margin) {
        this.width = width;
        this.height = height;
        this.margin = margin;

        console.log('Initializing DonutChart...');

        // Create SVG container
        this.svg = d3.select(container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // Create a group for the donut chart area
        this.chart = this.svg.append('g')
            .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

        console.log('DonutChart initialized');
    }

    // Render method to draw the donut chart
    render(data) {
        console.log('Render DonutChart...');
        this.data = data; // Save data reference

        // Create a pie generator
        let pieGen = d3.pie()
            .padAngle(0.02) // Add spacing between segments
            .sort(null) // Do not sort the data
            .value(d => d.v); // Use the 'v' property for values

        // Generate pie data
        let pieData = pieGen(this.data);

        // Create an arc generator
        let arcGen = d3.arc()
            .innerRadius(this.width / 4) // Inner radius (hole size)
            .outerRadius(this.width / 2 - 5); // Outer radius (chart size)

        // Create a color scale
        let colorScale = d3.scaleOrdinal()
            .domain(this.data.map(d => d.k))
            .range(d3.schemeCategory10);

        // Draw the arcs
        this.chart.selectAll('path')
            .data(pieData, d => d.data.k) // Bind data to paths
            .join('path')
            .attr('fill', d => colorScale(d.data.k)) // Use the color scale
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
        this.chart.selectAll('text')
            .data(pieData)
            .join('text')
            .attr('transform', d => `translate(${arcGen.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .text(d => d.data.k);

        console.log('DonutChart rendered');
    }
}