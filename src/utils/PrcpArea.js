import * as d3 from "d3"

export const defaultConfig = {
  viewBox: "0 0 800 500",
  width: "100%",
  height: "100%",
  chartWidth: 700,
  chartHeight: 430,
  // 原点
  origin: { x: 50, y: 450 },
  // 以年为单位还是以月为单位
  yearly: true,
  // 数据
  data: [],
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
  const scaleX = d3
    .scaleBand()
    .domain(
      config.yearly ? months : config.data[0].data.map((item) => item.DATE)
    )
    .range([0, config.chartWidth])
    .padding(0.15)

  // 纵坐标比例尺
  const scaleY = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(
        config.data.map((item) => {
          return d3.max(item.data.map((item) => item.PRCP))
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
    .attr('class', 'yAxis')
    .call(d3.axisLeft(scaleY))
    .attr("color", "#c9c9c9")
    .selectAll("text")

  // 绘制网格线
  d3.selectAll(".yAxis .tick").each(function (d, i) {
    if (d && d % 20 === 0 ) {
      d3.select(this)
        .append("line")
        .attr("stroke", "#c9c9c9")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", config.chartWidth)
        .attr("y2", 0)
    }
  })
}
