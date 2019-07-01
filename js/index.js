const Holder = (data, baseTemp) => {
  const H = 500, W = 1500;
  const height = H - 125;
  const width = W - 200;
  const padLeft = W - width;
  const barHeight = height / 12;
  const barWidth = width / (data.length / 12);
  const extentYear = d3.extent(data, d => d.year);
  const legendWidth = 300;
  const legendBarWidth = legendWidth / 9;
  const Months = {
    1:'January', 2:'February', 3:'March', 4:'April',
    5:'May', 6:'June', 7:'July', 8:'August', 9:'September',
    10:'October', 11:'November', 12:'December'
  };
  
  const cols = [
    ["2.8", "#313695"], ["3.9", "#4575b4"], ["5.0", "#74add1"], 
    ["6.1", "#abd9e9"], ["7.2", "#e0f3f8"], ["8.3", "#ffffbf"], 
    ["9.5", "#fee090"], ["10.6", "#ffbc00"], ["11.7", "#ff9e00"],
    ["12.8", "#ff7000"], [undefined, '#ff4000']
  ];
  const fillColor = (val) => {
    val = Number(val.toFixed(1));
    if (val <= cols[0][0]) { return cols[0][1]}
    else if (val <= cols[1][0]) { return cols[1][1]}
    else if (val <= cols[2][0]) { return cols[2][1]}
    else if (val <= cols[3][0]) { return cols[3][1]}
    else if (val <= cols[4][0]) { return cols[4][1]}
    else if (val <= cols[5][0]) { return cols[5][1]}
    else if (val <= cols[6][0]) { return cols[6][1]}
    else if (val <= cols[7][0]) { return cols[7][1]}
    else if (val <= cols[8][0]) { return cols[8][1]}
    else if (val <= cols[9][0]) { return cols[9][1]}
    else { return cols[10][1] }
  }  
  
  const displayLabel = d3.select('#canvas')
      .append('div')
      .attr('id', 'tooltip');
  
  const svg = d3.select('#canvas')
      .append('svg')
      .attr('width', W)
      .attr('height', H);
  
  const svgContainer = svg.append('g')
      .attr('transform', `translate(${padLeft / 2}, ${0})`);
  
  const xScale = d3.scaleBand()
      .domain(data.map(d => d.year))
      .range([0, width]);

  const yScale = d3.scaleBand()
      .domain(data.map( d => d.month))
      .range([0, height]);

  const xAxis = d3.axisBottom(xScale)
      .tickValues(xScale.domain().filter(year => {
        return year % 10 === 0;
      }));

  const yAxis = d3.axisLeft(yScale)
      .tickFormat(month => Months[month]);
  
  const xColors = d3.scaleLinear()
      .domain([0, 9])
      .range([0, legendWidth]);
  
  const colorAxis = d3.axisBottom(xColors) 
      .tickFormat((d, i) => cols[i][0]);

  svgContainer.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', d => xScale(d.year))
      .attr('y', d => yScale(d.month))
      .attr('width', barWidth)
      .attr('height', barHeight)
      .attr('fill', d => fillColor(d.variance + baseTemp))
      .attr('data-year', d => d.year)
      .attr('data-month', d => d.month - 1)
      .attr('data-temp', d => d.variance)
      .on('mouseover', (d, i) => {
        displayLabel
            .html(`
              <p>
                  ${d.year} - ${Months[d.month]} </br>
                  ${(d.variance + baseTemp).toFixed(1)} </br>
                  ${d.variance < 0 ? d.variance: '+'+d.variance}
              </p>
            `)
            .style('opacity', .9)
            .style('top', yScale(d.month) - 90 + 'px')
            .style('left', xScale(d.year) - 50 + 'px')
            .style('transform', 'translateX(100px)')
            .attr('data-year', d.year);
            
      })
      .on('mouseout', (d, i) => {
        displayLabel
            .style('opacity', 0)
      })
  
  
  svgContainer.append('g').call(xAxis)
    .attr('id', "x-axis")
    .attr('transform', `translate(0, ${height})`)
    // text section
    .append('text')
    .text('YEARS')
    .attr('fill', 'black')
    .attr('font-weight', 'bolder')
    .attr('x', 500)
    .attr('y', 40);
  
  svgContainer.append('g').call(yAxis)
    .attr('id', "y-axis")
    // text section
    .append('text')
    .text('MONTHS')
    .attr('fill', 'black')
    .attr('font-weight', 'bolder')
    .attr('x', -150)
    .attr('y', -80)
    .attr('transform', 'rotate(-90)');
  
  
  // Legend Section Starts Here...
  const legend = svgContainer.append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(0, ${height+75})`);
 
  legend.selectAll('rect')
      .data(cols)
      .enter()
      .append('rect')
      .attr('x', (d, i) => .5 + xColors(i))
      .attr('y', -28)
      .attr('width', legendBarWidth)
      .attr('height', 28)
      .attr('fill', (d, i) => d[1])
      .attr('stroke', 'black')
      .attr('stroke-width', 1.5);
  
   legend.append('g').call(colorAxis)
    .attr('transform', `translate(${legendBarWidth}, 0)`);
  
  svg.selectAll('text')
    .attr('font-size', 14);
}


fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
  .then( d => d.json())
  .then( d => Holder(d.monthlyVariance, d.baseTemperature));