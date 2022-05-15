import React, { useEffect } from "react"
import styled from "styled-components"
import WeatherRadial, { defaultConfig as config } from "../utils/WeatherRadial"
import * as d3 from "d3"

export default function Month({ month, data, cityName }) {
  const init = () => {
    const endDate = new Date(data[data.length - 1].DATE)
    endDate.setDate(endDate.getDate() + 1)
    WeatherRadial(d3.select(`.${month}`), month, {
      ...config,
      data: data,
      dateRange: [data[0].DATE, endDate],
      cityName: cityName,
    })
  }

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Container className={month}></Container>
}

const Container = styled.div`
  width: 25%;
  border-radius: 50%;
  animation: scale-in-center 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  @keyframes scale-in-center {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1;
    }
  }
`
