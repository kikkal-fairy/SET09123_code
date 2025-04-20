'use strict';

export class BarChart {
    constructor(container, width, height, margin) {
        this.width = width;
        this.height = height;
        this.margin = margin;

        console.log('Initializing BarChart...');

        this.svg = d3.select(container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .classed('barchart', true);

        this.chart = this.svg.append('g')
            .attr('transform', `translate(${this.margin[2]},${this.margin[0]})`);

        this.scaleX = d3.scaleBand().padding(0.1);
        this.scaleY = d3.scaleLinear();
    }

    updateScales(data) {
        let chartWidth = this.width - this.margin[2] - this.margin[3];
        let chartHeight = this.height - this.margin[0] - this.margin[1];

        this.scaleX.domain(data.map(d => d.location)).range([0, chartWidth]);
        this.scaleY.domain([0, d3.max(data, d => d.sales)]).range([chartHeight, 0]).nice();
    }

    render(data) {
        console.log('Rendering BarChart...');
        this.updateScales(data);

        this.chart.selectAll('rect')
            .data(data)
            .join('rect')
            .classed('bar', true)
            .attr('x', d => this.scaleX(d.location))
            .attr('y', d => this.scaleY(d.sales))
            .attr('width', this.scaleX.bandwidth())
            .attr('height', d => this.height - this.margin[0] - this.margin[1] - this.scaleY(d.sales))
            .style('fill', 'steelblue');

        this.chart.append('g')
            .attr('transform', `translate(0, ${this.height - this.margin[0] - this.margin[1]})`)
            .call(d3.axisBottom(this.scaleX));

        this.chart.append('g')
            .call(d3.axisLeft(this.scaleY));

        console.log('BarChart rendered');
    }
}
