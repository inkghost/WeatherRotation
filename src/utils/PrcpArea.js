import * as d3 from "d3"

export const defaultConfig = {
  viewBox: "0 0 800 500",
  width: "100%",
  height: "100%",
  chartWidth: 700,
  chartHeight: 430,
  // 原点
  origin: { x: 50, y: 450 },
  // 数据
  data: [],
  cities: [],
  // 柱形颜色
  colors: ["#80c6ea", "#74e5be", "#f3cf8a"],
  setPrcps: null,
  setPrcpDate: null,
}

const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEPT",
  "OCT",
  "NOV",
  "DEC",
]

export default function PrcpArea(container, name, config = defaultConfig) {
  // 清空容器内部
  d3.selectAll(`.${name} > *`).remove()

  const svg = container.append("svg")

  // 横坐标比例尺
  const scaleX = d3.scaleBand().domain(months).range([0, config.chartWidth])

  const dateScaleX = d3
    .scaleBand()
    .domain(config.data[0].map((item) => item.DATE))
    .range([0, config.chartWidth])
    .padding(0.1)

  // 纵坐标比例尺
  const scaleY = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(
        config.data.map((item) => {
          return d3.max(item.map((item) => item.PRCP))
        })
      ),
    ])
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
    .attr("transform", `translate(${config.origin.x},${config.origin.y})`)
    .attr("class", "xAxisDate")
    .call(d3.axisBottom(dateScaleX))
    .attr("color", "#c9c9c9")
    .attr("visibility", "hidden")
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

  // 绘制网格线
  d3.selectAll(".yAxis .tick").each(function (d, i) {
    if (d && d % 20 === 0) {
      d3.select(this)
        .append("line")
        .attr("stroke", "#c9c9c9")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", config.chartWidth)
        .attr("y2", 0)
    }
  })

  // 绘制柱形
  let cityGroup = svg
    .selectAll(".city-group")
    .data(config.data)
    .enter()
    .append("g")
    .attr("class", (item) => `city-group-${item[0].CITY}`)
    .attr("fill", (item, index) => config.colors[index])

  cityGroup
    .selectAll(".prcp-bar")
    .data((item) => item)
    .enter()
    .append("rect")
    .attr("class", (item, index) => `prcp-bar prcp-bar-${index}`)
    .attr("x", (item) => {
      return (
        dateScaleX(item.DATE) +
        (dateScaleX.bandwidth() / config.data.length) *
          config.cities.indexOf(item.CITY) +
        config.origin.x
      )
    })
    .attr("y", scaleY(0) + config.origin.y - config.chartHeight)
    .attr("width", dateScaleX.bandwidth() / config.data.length)
    .attr("height", 0)
    .transition()
    .duration(1000)
    .attr("height", (item) => config.chartHeight - scaleY(item.PRCP))
    .attr(
      "y",
      (item) => scaleY(item.PRCP) + config.origin.y - config.chartHeight
    )

  // 可交互背景
  let interactiveGroup = svg.append("g").attr("class", "interactive-group")
  interactiveGroup
    .selectAll(".prcp-bar-interactive")
    .data(
      config.data[0].map((item, index) => {
        return { DATE: item.DATE, INDEX: index }
      })
    )
    .enter()
    .append("rect")
    .attr(
      "class",
      (item, index) => `prcp-bar-interactive prcp-bar-interactive-${index}`
    )
    .attr("fill", "#c9c9c9c9")
    .attr("opacity", "0")
    .attr("x", (item) => {
      return dateScaleX(item.DATE) + config.origin.x
    })
    .attr("y", config.origin.y - config.chartHeight)
    .attr("width", dateScaleX.bandwidth())
    .attr("height", config.chartHeight)
    .on("mouseenter", (event, item) => {
      let { pageX, pageY } = event
      // 将浮层位置设置为鼠标位置
      let tooltip = d3
        .select(".tooltip")
        .style("left", pageX + 10 + "px")
        .style("top", pageY + 10 + "px")

      svg.select(`.prcp-bar-interactive-${item.INDEX}`).attr("opacity", "1")
      config.setPrcps(config.data.map((_item) => _item[item.INDEX].PRCP))
      config.setPrcpDate(item.DATE)

      tooltip.classed("hidden", false)
    })
    .on("mouseout", (event, item) => {
      svg.select(`.prcp-bar-interactive-${item.INDEX}`).attr("opacity", "0")
      d3.select(".tooltip").classed("hidden", true)
    })
    .on("mousemove", (event) => {
      let { pageX, pageY } = event
      d3.select(".tooltip")
        .style("left", pageX + 10 + "px")
        .style("top", pageY + 10 + "px")
    })

  const extent = [
    [0, 0],
    [config.chartWidth, config.chartHeight],
  ]

  const zoomed = (event) => {
    dateScaleX.range(
      [0, config.chartWidth].map((d) => event.transform.applyX(d))
    )
    scaleX.range([0, config.chartWidth].map((d) => event.transform.applyX(d)))
    if (event.transform.k < 8) {
      svg.selectAll(".xAxisDate").attr("visibility", "hidden")
      svg
        .selectAll(".xAxis")
        .call(d3.axisBottom(scaleX))
        .attr("visibility", "visible")
    } else {
      svg.selectAll(".xAxis").attr("visibility", "hidden")
      svg
        .selectAll(".xAxisDate")
        .call(d3.axisBottom(dateScaleX))
        .attr("visibility", "visible")
    }
    svg
      .selectAll(".prcp-bar-interactive")
      .attr("x", (item) => {
        return dateScaleX(item.DATE) + config.origin.x
      })
      .attr("width", dateScaleX.bandwidth())
    svg
      .selectAll(".prcp-bar")
      .attr("x", (item) => {
        return (
          dateScaleX(item.DATE) +
          (dateScaleX.bandwidth() / config.data.length) *
            config.cities.indexOf(item.CITY) +
          config.origin.x
        )
      })
      .attr("width", dateScaleX.bandwidth() / config.data.length)
  }

  svg.call(
    d3
      .zoom()
      .scaleExtent([1, 15])
      .translateExtent(extent)
      .extent(extent)
      .on("zoom", zoomed)
  )
}
