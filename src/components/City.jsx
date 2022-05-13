import React, { useEffect } from "react"
import styled from "styled-components"
import WeatherRadial, { defaultConfig as config } from "../utils/WeatherRadial"
import * as d3 from "d3"

export default function City({ cityName }) {
  const init = async () => {
    // 生成 Weather Radial
    WeatherRadial(d3.select(`.${cityName}`), cityName, {
      ...config,
      data: (await d3.csv(`/data/processed/${cityName}.csv`)).map((item) => {
        return {
          TAVG: +item.TAVG,
          TMAX: +item.TMAX,
          TMIN: +item.TMIN,
          PRCP: +item.PRCP,
          DATE: new Date(item.DATE),
        }
      }),
      labels: [
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
      ],
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
