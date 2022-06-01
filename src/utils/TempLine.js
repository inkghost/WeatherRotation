import * as d3 from "d3"

export const defaultConfig = {
  viewBox: "0 0 850 370",
  width: "100%",
  height: "100%",
  chartWidth: 800,
  chartHeight: 300,
  // 原点
  origin: { x: 25, y: 320 },
  // 数据
  data: [],
}

export default function TempLine(container, name, config = defaultConfig) {
  // 清空容器内部
  d3.selectAll(`.${name} > *`).remove()

  const svg = container.append("svg")

  // 横坐标比例尺
  const scaleX = d3
    .scaleBand()
    .domain(config.data.map((item) => item.time))
    .range([0, config.chartWidth])

  const countScaleX = d3
    .scaleLinear()
    .domain([0, config.data.length - 1])
    .range([0, config.chartWidth])

  // 纵坐标比例尺
  const scaleY = d3
    .scaleLinear()
    .domain([0, d3.max(config.data.map((item) => item.temp))])
    .range([config.chartHeight, 0])

  // 基本属性设置
  svg
    .attr("viewBox", config.viewBox)
    .attr("width", config.width)
    .attr("height", config.height)

  // 渲染坐标轴
  svg
    .insert("g")
    .attr("transform", `translate(${config.origin.x},${config.origin.y})`)
    .attr("class", "xAxis")
    .call(d3.axisBottom(scaleX))
    .attr("color", "#c9c9c9")
    .selectAll("text")
    .attr("transform", "rotate(-45 10 30)")

  svg
    .insert("g")
    .attr(
      "transform",
      `translate(${config.origin.x},${config.origin.y - config.chartHeight})`
    )
    .attr("class", "yAxis")
    .call(d3.axisLeft(scaleY))
    .attr("color", "#c9c9c9")
    .selectAll("text")

  // 十字指示
  const line1 = svg
    .append("line")
    .attr("stroke", "#c9c9c9")
    .attr("stroke-width", 1)
    .style("opacity", 0)
    .attr("x1", config.origin.x)
    .attr("x2", config.origin.x + config.chartWidth)
    .attr("stroke-dasharray", 3)
  const line2 = svg
    .append("line")
    .attr("stroke", "#c9c9c9")
    .attr("stroke-width", 1)
    .style("opacity", 0)
    .attr("y1", config.origin.y - config.chartHeight)
    .attr("y2", config.origin.y)
    .attr("stroke-dasharray", 3)

  // 曲线绘制
  const color = d3.scaleSequential([-5, 30], d3.interpolateSpectral)
  svg
    .append("linearGradient")
    .attr("id", "line-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0)
    .attr("y1", scaleY(30))
    .attr("x2", 0)
    .attr("y2", scaleY(-5))
    .selectAll("stop")
    .data(d3.ticks(0, 1, 10))
    .join("stop")
    .attr("offset", (d) => d)
    .attr("stop-color", color.interpolator())

  svg
    .append("path")
    .attr("class", "temp-line")
    .datum(config.data)
    .attr(
      "d",
      d3
        .line()
        .curve(d3.curveMonotoneX)
        .x((item, index) => countScaleX(index) + config.origin.x)
        .y((item) => scaleY(item.temp) + config.origin.y - config.chartHeight)
    )
    .attr("fill", "none")
    .attr("stroke", "url(#line-gradient)")
    .attr("stroke-width", 3.5)

  // 温度显示
  const focus = svg.append("g").style("opacity", 0)
  const outerFocus = focus
    .append("circle")
    .attr("stroke", "black")
    .attr("fill", "black")
    .attr("r", 15)
  const innerFocus = focus
    .append("circle")
    .attr("stroke", "white")
    .attr("fill", "white")
    .attr("r", 10)
  const focusText = focus
    .append("text")
    .text("32")
    .attr("text-anchor", "middle")
    .attr("fill", "#797979")
    .attr("font-size", "1rem")

  const handleMouseEnter = () => {
    focus.style("opacity", 1)
    line1.style("opacity", 1)
    line2.style("opacity", 1)
  }
  const handleMouseMove = (event) => {
    const x0 = countScaleX.invert(d3.pointer(event)[0])
    const index = Math.round(x0)
    const target = config.data[index]

    outerFocus
      .attr("cx", countScaleX(x0) + config.origin.x)
      .attr("cy", scaleY(target.temp) + config.origin.y - config.chartHeight)
      .attr("stroke", "url(#line-gradient)")
      .attr("fill", "url(#line-gradient)")

    innerFocus
      .attr("cx", countScaleX(x0) + config.origin.x)
      .attr("cy", scaleY(target.temp) + config.origin.y - config.chartHeight)

    focusText
      .attr("x", countScaleX(x0) + config.origin.x)
      .attr("y", scaleY(target.temp) + config.origin.y - config.chartHeight + 5)
      .text(target.temp)

    line1
      .attr("y1", scaleY(target.temp) + config.origin.y - config.chartHeight)
      .attr("y2", scaleY(target.temp) + config.origin.y - config.chartHeight)

    line2
      .attr("x1", countScaleX(x0) + config.origin.x)
      .attr("x2", countScaleX(x0) + config.origin.x)
  }
  const handleMouseLeave = () => {
    focus.style("opacity", 0)
    line1.style("opacity", 0)
    line2.style("opacity", 0)
  }

  svg
    .append("rect")
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr("width", config.chartWidth)
    .attr("height", config.chartHeight)
    .attr(
      "transform",
      `translate(${config.origin.x},${config.origin.y - config.chartHeight})`
    )
    .on("mouseenter", handleMouseEnter)
    .on("mousemove", handleMouseMove)
    .on("mouseleave", handleMouseLeave)
}
