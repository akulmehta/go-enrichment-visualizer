async function drawVis() {

  let data = await d3.tsv("./data.txt");

  data = data.map((m, i) => {
    if (m.fold_enrichment.includes("> 100")) {
      m.fold_enrichment = 100;
    }
    m.go_code = m.go.split(' (')[1].trim().split(')')[0]

    m.go = m.go.split(' (')[0].trim()
    m.fold_enrichment = +m.fold_enrichment;
    m.gene_count = +m.gene_count;
    m["log_fdr"] = +m["log_fdr"]

    return m;
  })
  
  console.table(data);

  svgHeight = data.length * 55;

  // set the dimensions and margins of the graph
  const margin = { top: 40, right: 40, bottom: 100, left: 600 },
    width = 1200 - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select("#data-vis")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr('id', 'data-vis-svg')
    .attr('style', 'font-family:Arial')
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);



  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, d3.max(data.map(m => m.fold_enrichment))])
    .range([0, width]);

  let xAxis = svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(10));

  xAxis.attr("font-family", "Arial").attr('font-size', 14)

  let xGrid = svg.append("g")
    .attr('class', 'grid-x')
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(10).tickSize(-height).tickFormat(""));
  xGrid.selectAll(".tick line")
    .attr("stroke", "#ccc");

  xGrid.attr('font-family', "Arial")
  xGrid.select('path').remove();


  // Add X axis label:
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 40)
    .text("Fold Enriched")
    .attr("fill", "#333")
    .attr('font-size', '16');

  // Add Y axis
  const y = d3.scaleBand()
    .domain(data.map(d => d.go))
    .range([0, height])
    .padding(0.1);

  let yAxis = svg.append("g")
    .call(d3.axisLeft(y));

  yAxis.attr('font-family', "Arial").attr('font-size', 12)

  const yCode = d3.scaleBand()
    .domain(data.map(d => d.go_code))
    .range([0, height])
    .padding(0.1);

  let yCodeAxis = svg.append("g")
    .call(d3.axisLeft(yCode).tickSize(0))
    .attr('transform', 'translate(0,12)');

  yCodeAxis.selectAll('text').attr('x', -8);

  yCodeAxis.attr('font-family', "Arial").attr('font-size', 12)

  // Add Y axis label:
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", -200)
    .attr("y", 0)
    .text("GO Molecular Function")
    .attr("text-anchor", "start")
    .attr('font-size', '16')
    .attr("fill", "#333")

  let yGrid = svg.append("g")
    .attr('class', 'grid-y')
    .call(d3.axisLeft(y).tickSize(-width).tickFormat(""));

  yGrid.selectAll(".tick line")
    .attr("stroke", "#ccc");

  yGrid.attr('font-family', "Arial")

  svg.selectAll('.grid-x .domain').remove();
  svg.selectAll('.grid-y .domain').remove();


  // Add a scale for bubble size
  const z = d3.scaleLinear()
    .domain(d3.extent(data.map(d => d.gene_count)))
    .range([5, (y.bandwidth() / 2) - 3]);

  // Add a scale for bubble color
  const myColor = d3.scaleSequential(d3.interpolateSpectral)
    .domain([Math.ceil(d3.max(data, function (d) { return d.log_fdr; })), Math.floor(d3.min(data, function (d) { return d.log_fdr; }))])



  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .join("circle")
    .attr("class", "bubbles")
    .attr("cx", d => x(d.fold_enrichment))
    .attr("cy", d => y(d.go) + y.bandwidth() / 2)
    .attr("r", d => z(d.gene_count))
    .style("fill", d => myColor(d.log_fdr))
    .style("stroke", '#666')
    .on('mouseover', function (d) {
      console.log(myColor(this.__data__.log_fdr))
    })


  // Add legend: circles
  const valuesToShow = [
    d3.min(data.map(d => d.gene_count)),
    (d3.min(data.map(d => d.gene_count)) + Math.round((d3.max(data.map(d => d.gene_count)) - d3.min(data.map(d => d.gene_count))) / 2)),
    d3.max(data.map(d => d.gene_count))
  ]

  const xCircle = -550
  const xLabel = -520
  const legendCircleY = 320;
  let geneCountLegend = svg.append('g');
  geneCountLegend
    .selectAll("legend")
    .data(valuesToShow)
    .join("circle")
    .attr("cx", xCircle)
    .attr("cy", d => legendCircleY - z(d))
    .attr("r", d => z(d))
    .style("fill", "none")
    .attr("stroke", "#333")

  // Add legend: segments
  geneCountLegend
    .selectAll("legend")
    .data(valuesToShow)
    .join("line")
    .attr('x1', d => xCircle + z(d))
    .attr('x2', d => xLabel + z(d) * 2)
    .attr('y1', d => legendCircleY - z(d))
    .attr('y2', d => legendCircleY - z(d))
    .attr('stroke', '#333')
    .style('stroke-dasharray', ('2,2'))

  // Add legend: labels
  geneCountLegend
    .selectAll("legend")
    .data(valuesToShow)
    .join("text")
    .attr('x', d => xLabel + z(d) * 2)
    .attr('y', d => legendCircleY - z(d) + 6)
    .text(d => d)
    .style("font-size", "12px")
    .attr("fill", "#333")
    .attr('alignment-baseline', 'middle')

  // Legend title
  geneCountLegend.append("text")
    .attr('x', xCircle)
    .attr("y", legendCircleY + 30)
    .text("No. of Genes")
    .attr('font-size', '16')
    .attr("fill", "#333")
    .style('text-anchor', 'middle')

  // Add color legend
  //create a gradient def for the legend
  let range = myColor.domain().sort();
  legendData = []
  for (i = range[0]; i <= range[1]; i++) {
    legendData.push(i)
  }
  legendData = d3.sort(legendData);


  let legendGroup = svg
    .append('g')
    .attr('class', 'legends')
    .attr('transform', 'translate(-580,0)');

  let legendHeight = 140;

  //create a gradient def for the legend
  var gradient = svg.append("defs")
    .append("svg:linearGradient")
    .attr("id", "heatgradient")
    .attr("x1", "100%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%")
    .attr("spreadMethod", "pad");

  // add the stops for the gradient definition based on the legendData
  for (i = 0; i < legendData.length; i++) {
    gradient.append("stop")
      .attr("offset", (i / legendData.length) * 100 + '%')
      .attr("stop-color", myColor(legendData[i]))
      .attr("stop-opacity", 1);
  }

  // append the color-legend rectangle
  legendGroup.append("rect")
    .attr("width", 10)
    .attr("height", legendHeight)
    .style("fill", "url(#heatgradient)")
    .attr("transform", "translate(0,0)");


  // generate the scale next to the rectangle 
  const legendY = d3.scaleLinear()
    .domain([d3.min(legendData), d3.max(legendData)])
    .range([0, legendHeight]);


  let legend = legendGroup
    .append('g')
    .attr('transform', 'translate(10,0)')
    .call(d3.axisRight(legendY));

  legend.attr('font-family', "Arial")

  //  give the legend a label
  legendGroup.append('text')
    .text('-Log10(FDR)')
    .attr('x', '0')
    .attr('y', '-15')
    .attr('font-size', '16')
    .attr("fill", "#333")
    .style('text-anchor', 'start');
}

drawVis();