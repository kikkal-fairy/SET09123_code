'use strict';

export class BubbleChart {
    constructor(container, width, height, margin) {
        this.width = width;
        this.height = height;
        this.margin = margin;
        this.behaviour = false;

        console.log('Initializing BubbleChart...');

        this.svg = d3.select(container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .classed('bubblechart', true);

        this.chart = this.svg.append('g')
            .attr('transform', `translate(${this.margin[2]},${this.margin[0]})`);

        this.bubbleGroup = this.chart.append('g'); // group for bubbles

        this.scaleX = d3.scaleLinear();
        this.scaleY = d3.scaleLinear();
        this.scaleR = d3.scaleSqrt();
    }

    updateScales(data) {
        let chartWidth = this.width - this.margin[2] - this.margin[3];
        let chartHeight = this.height - this.margin[0] - this.margin[1];

        this.scaleX.domain([0, d3.max(data, d => d.sales)]).range([0, chartWidth]);
        this.scaleY.domain([0, d3.max(data, d => d.expenses)]).range([chartHeight, 0]);
        this.scaleR.domain([0, d3.max(data, d => d.profits)]).range([5, 40]);
    }

    render(data) {
        this.data = data;
        this.updateScales(data);

        this.bubbleGroup.selectAll('circle')
            .data(data)
            .join('circle')
            .classed('bubble', true)
            .attr('cx', d => this.scaleX(d.sales))
            .attr('cy', d => this.scaleY(d.expenses))
            .attr('r', d => this.scaleR(d.profits))
            .style('fill', 'purple')
            .attr('stroke', 'black')
            .attr('fill-opacity', 1);
    }

    enableZoom() {
      // clear brush
      this.chart.selectAll('.brush').remove();
      this.behaviour = 'zoom';
      this.#setZoom();
    }

    #setZoom() {
        const zoom = d3.zoom()
            .translateExtent([[0, 0], [this.width, this.height]])
            .scaleExtent([1, 5])
            .on('zoom', ({ transform }) => {
                this.bubbleGroup.attr('transform', transform);
            });

        this.svg.call(zoom);
    }

    enableBrush(callback) {
      this.svg.on(".zoom", null);
      this.behaviour = 'brush';
      this.#setBrush(callback);
    }

    #setBrush(callback) {
        const brush = d3.brush()
            .extent([[0, 0], [this.width, this.height]])
            .on('brush end', (event) => {
                if (!event.selection) {
                    this.bubbleGroup.selectAll('circle')
                        .attr('stroke', null)
                        .attr('fill-opacity', 1);
                    return;
                }

                const [[x0, y0], [x1, y1]] = event.selection;

                this.bubbleGroup.selectAll('circle')
                    .attr('stroke', d => {
                        const cx = this.scaleX(d.sales);
                        const cy = this.scaleY(d.expenses);
                        return (x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1) ? 'red' : null;
                    })
                    .attr('fill-opacity', d => {
                        const cx = this.scaleX(d.sales);
                        const cy = this.scaleY(d.expenses);
                        return (x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1) ? 1 : 0.2;
                    });

                // Optional filtered dataset
                const xMin = this.scaleX.invert(x0);
                const xMax = this.scaleX.invert(x1);
                const yMin = this.scaleY.invert(y1); // invert for SVG
                const yMax = this.scaleY.invert(y0);

                const filtered = this.data.filter(d =>
                    d.sales >= xMin && d.sales <= xMax &&
                    d.expenses >= yMin && d.expenses <= yMax
                );

                if (typeof callback === 'function') {
                    callback(filtered);
                }
            });

        this.chart.append('g')
            .attr('class', 'brush')
            .call(brush);
    }
}
