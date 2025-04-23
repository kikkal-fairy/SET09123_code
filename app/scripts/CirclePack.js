'use strict';

export class CirclePack {
  constructor(container, width, height) {
    this.width = width;
    this.height = height;
    this.container = container;

    this.svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  }

  render(hierarchyData) {
    const pack = d3.pack()
      .size([this.width, this.height])
      .padding(3);

    const root = pack(hierarchyData);

    this.svg.selectAll('circle')
      .data(root.descendants())
      .join('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.r)
      .attr('fill', d => d.children ? '#ccc' : 'tomato')
      .attr('stroke', '#333');
  }
}
