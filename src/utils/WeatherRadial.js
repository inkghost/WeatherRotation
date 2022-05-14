import * as d3 from "d3"

export const defaultConfig = {
  viewBox: "0 0 1000 1000",
  width: "100%",
  height: "100%",
  // 原点
  origin: { x: 500, y: 500 },
  // 内外层圆半径
  innerRadius: 100,
  outerRadius: 400,
  // 温度范围
  tempRange: [-20, 40],
  // 时间范围
  dateRange: [new Date("2020-1-1"), new Date("2020-12-31")],
  // 降水量范围
  prcpRange: [0, 5],
  // 数据
  data: [],
  // 外层标签
  labels: [],
}

export default function WeatherRadial(container, name, config = defaultConfig) {
  // 清空容器内部
  d3.selectAll(`.${name} > *`).remove()

  // 标签比例尺
  const labelScale = d3
    .scaleLinear()
    .domain([0, config.labels.length])
    .range([0, 360])

  // 温度比例尺
  const tempScale = d3
    .scaleLinear()
    .domain(config.tempRange)
    .range([config.innerRadius, config.outerRadius])

  const tempScaleReverse = d3
    .scaleLinear()
    .domain(config.tempRange)
    .range([config.outerRadius, config.innerRadius])

  // 日期比例尺
  const dateScale = d3.scaleTime().domain(config.dateRange).range([0, 360])

  // 颜色比例尺
  const colorScale = d3
    .scaleSequential(d3.interpolateSpectral)
    .domain([tempScale.ticks(6)[5], tempScale.ticks(6)[1]])

  // 降水量比例尺
  const prcpScale = d3
    .scaleLinear()
    .domain(config.prcpRange)
    .range([0, config.outerRadius / 3])

  const svg = container.append("svg")

  // 基本属性设置
  svg
    .attr("viewBox", config.viewBox)
    .attr("width", config.width)
    .attr("height", config.height)

  // 绘制同心圆
  svg
    .selectAll(".circle")
    .data(tempScale.ticks(6))
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx", config.origin.x)
    .attr("cy", config.origin.y)
    .attr("r", (item) => tempScale(item))
    .attr("stroke", "#c9c9c9")
    .attr("stroke-width", "0.1rem")
    .attr("fill", "none")

  svg
    .select(".circle:nth-of-type(3)")
    .attr("stroke", "#9e9e9e")
    .attr("stroke-width", "0.13rem")

  // 绘制外层 label
  const labels = svg
    .selectAll(".label")
    .data(config.labels)
    .enter()
    .append("g")
    .attr("class", "label")
    .attr("transform", (item, index) => {
      return `rotate(${labelScale(index)},${config.origin.x},${
        config.origin.y
      }) translate(${config.origin.x},${
        config.origin.y - config.outerRadius - 50
      })`
    })

  // 绘制 label 对应标签
  labels
    .append("line")
    .attr("stroke", "#c9c9c9")
    .attr("stroke-width", "0.1rem")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", 30)

  labels
    .append("text")
    .text((item) => item)
    .attr("fill", "#c9c9c9")
    .attr("font-size", "1.2rem")
    .attr("x", 10)
    .attr("y", 15)

  // 隔断线
  labels
    .append("line")
    .attr("stroke", "white")
    .attr("x1", 0)
    .attr("y1", 30)
    .attr("x2", 0)
    .attr("y2", config.origin.y)
    .attr("stroke-width", "1rem")

  // 一月标识线
  const markLine = svg
    .append("g")
    .attr("transform", `translate(${config.origin.x},${config.origin.y})`)
  markLine
    .append("line")
    .attr("stroke", "#000000")
    .attr("stroke-width", "0.1rem")
    .attr("x1", 0)
    .attr("y1", -config.outerRadius - 65)
    .attr("x2", 0)
    .attr("y2", -config.outerRadius / 4)
  markLine
    .append("polygon")
    .attr(
      "points",
      `3,${-config.outerRadius - 65} 3,${-config.outerRadius - 55} 10,${
        -config.outerRadius - 60
      }`
    )
    .attr("fill", "black")
  markLine
    .append("text")
    .text("2020")
    .attr("transform", `translate(13,${-config.outerRadius - 55})`)
    .attr("text-anchor", "start")
    .attr("fill", "black")
    .attr("font-weight", "bold")

  // 绘制温度坐标轴
  const tempAxis = d3
    .axisLeft(tempScaleReverse)
    .ticks(6)
    .tickFormat((item) => `${item}℃`)
  svg
    .append("g")
    .attr("class", "tempAxis")
    .call(tempAxis)
    .attr("transform", `translate(${config.origin.x}, 0)`)
  svg.select(".domain").remove()
  svg.selectAll(".tick line").remove()
  svg
    .selectAll(".tick")
    .insert("rect", ":first-child")
    .attr("width", "50")
    .attr("height", "30")
    .attr("fill", "#ffffff")
    .attr("transform", "translate(-25,-15)")
  svg
    .selectAll(".tick text")
    .attr("text-anchor", "middle")
    .attr("font-size", "1rem")
    .attr("fill", "#c9c9c9")
    .attr("transform", "translate(10,0)")

  // 绘制降水量
  svg
    .selectAll(".prcp-circle")
    .data(config.data)
    .enter()
    .append("circle")
    .attr("r", (item) => prcpScale(item.PRCP))
    .attr("fill", "rgba(98, 143, 201, 0.3)")
    .attr("transform", (item) => {
      return `rotate(${dateScale(item.DATE)},${config.origin.x},${
        config.origin.y
      }) translate(${config.origin.x},${
        config.origin.y - tempScale(item.TAVG)
      })`
    })

  // 绘制温度条
  svg
    .selectAll(".temp-bar-back")
    .data(config.data)
    .enter()
    .append("path")
    .attr("d", () => {
      return d3
        .arc()
        .innerRadius(config.innerRadius)
        .outerRadius(config.outerRadius)
        .startAngle((-Math.PI / config.data.length) * 0.7)
        .endAngle((Math.PI / config.data.length) * 0.7)()
    })
    .attr("fill", "white")
    .attr("opacity", "0")
    .attr("transform", (item) => {
      return `rotate(${dateScale(item.DATE)},${config.origin.x},${
        config.origin.y
      }) translate(${config.origin.x},${config.origin.y})`
    })
  svg
    .selectAll(".temp-bar")
    .data(config.data)
    .enter()
    .append("path")
    .attr("d", (item) => {
      return d3
        .arc()
        .innerRadius(tempScale(item.TMIN))
        .outerRadius(tempScale(item.TMAX))
        .startAngle((-Math.PI / config.data.length) * 0.7)
        .endAngle((Math.PI / config.data.length) * 0.7)()
    })
    .attr("fill", (item) => colorScale(item.TAVG))
    .attr("transform", (item) => {
      return `rotate(${dateScale(item.DATE)},${config.origin.x},${
        config.origin.y
      }) translate(${config.origin.x},${config.origin.y})`
    })

  // 绘制 name
  svg
    .append("text")
    .text(name)
    .attr("fill", "#757575")
    .attr("transform", `translate(${config.origin.x}, ${config.origin.y})`)
    .attr("font-size", "5rem")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
}
