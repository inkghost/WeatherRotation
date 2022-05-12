import React, { useEffect } from "react"
import styled from "styled-components"
import WeatherRadial, { defaultConfig as config } from "../utils/WeatherRadial"
import * as d3 from "d3"

export default function City({ cityName }) {
  const init = async () => {
    // 清空容器内部
    d3.selectAll(`.${cityName} > *`).remove()
    // 生成 Weather Radial
    WeatherRadial(d3.select(`.${cityName}`), cityName, {
      ...config,
      name: cityName,
      data: await d3.csv(`/data/processed/${cityName}.csv`),
    })
  }

  useEffect(() => {
    init()
  })

  return <Container className={cityName}></Container>
}

const Container = styled.div`
  width: 33.3%;
`
