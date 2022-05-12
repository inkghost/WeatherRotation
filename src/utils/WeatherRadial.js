import * as d3 from "d3"

export const defaultConfig = {
  viewBox: "0 0 1000 1000",
  width: "100%",
  height: "100%",
  data: [],
}

export default function WeatherRadial(container, name, config = defaultConfig) {
  console.log(config);
  const svg = container.append("svg")
  svg
    .attr("viewBox", config.viewBox)
    .attr("width", config.width)
    .attr("height", config.height)
}
