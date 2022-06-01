import React, { useEffect } from "react"
import styled from "styled-components"
import TempLine, { defaultConfig as config } from "../utils/TempLine"
import { Progress } from "antd"
import * as d3 from "d3"

export default function HourlyWeather({ nowWeather, hourlyWeather }) {
  const generateLineChart = () => {
    TempLine(d3.select(".temp-curve"), "temp-curve", {
      ...config,
      data: [
        { ...nowWeather, time: "Now", temp: Number(nowWeather.temp) },
        ...hourlyWeather,
      ],
    })
  }

  useEffect(() => {
    nowWeather && hourlyWeather && generateLineChart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowWeather, hourlyWeather])

  return (
    <Container>
      <div className="basic-info">
        <div className="weather">
          <i className={`qi-${nowWeather && nowWeather.icon}`}></i>
          <span>{nowWeather && nowWeather.text}</span>
        </div>
        <div className="temp">
          <div className="temp-left">{nowWeather && nowWeather.temp}</div>
          <div className="temp-right">
            <span style={{ fontSize: "1.5rem" }}>℃</span>
            <span>FeelsLike {nowWeather && nowWeather.feelsLike}℃</span>
          </div>
        </div>
        <Progress
          strokeColor={{
            "0%": "#80c6ea",
            "100%": "#74e5be",
          }}
          percent={nowWeather && nowWeather.humidity}
          format={(percent) => `Humidity ${percent}%`}
          type="circle"
          status="active"
        />
      </div>
      <div className="temp-curve"></div>
    </Container>
  )
}

const Container = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .basic-info {
    width: 100%;
    height: 30%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
    .temp {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      .temp-left {
        font-size: 4.5rem;
      }
      .temp-right {
        display: flex;
        justify-content: center;
        flex-direction: column;
      }
    }
    .weather {
      font-size: 4.5rem;
    }
  }
  .temp-curve {
    height: 60%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`
