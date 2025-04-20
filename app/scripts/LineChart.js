'use strict';

export class LineChart {
    constructor(container, width, height, margin) {
        this.width = width;
        this.height = height;
        this.margin = margin;

        console.log('Initializing LineChart...');

        this.svg = d3.select(container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        this.chart = this.svg.append('g')
            .attr('transform', `translate(${this.margin[2]},${this.margin[0]})`);

        this.scaleX = d3.scaleTime();
        this.scaleY = d3.scaleLinear();
    }

    updateScales(data) {
        this.scaleX.domain(d3.extent(data, d => new Date(d.date))).range([0, this.width]);
        this.scaleY.domain([0, d3.max(data, d => d.sales)]).range([this.height, 0]);
    }

    render(data) {
        console.log('Rendering LineChart...');
        this.updateScales(data);

        let line = d3.line()
            .x(d => this.scaleX(new Date(d.date)))
            .y(d => this.scaleY(d.sales));

        this.chart.append('path')
            .datum(data)
            .attr('d', line)
            .attr('stroke', 'blue')
            .attr('fill', 'none');

        console.log('LineChart rendered');
    }
}
