import React, { useEffect } from "react"
import styled from "styled-components"
import WeatherRadial, { defaultConfig as config } from "../utils/WeatherRadial"
import { useNavigate } from "react-router-dom"
import * as d3 from "d3"

export default function City({ cityName, single }) {
  const navigate = useNavigate()

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
      interactive: single,
      cityName: cityName,
    })
  }

  const toDetail = () => {
    navigate(`/detail/${cityName.toLowerCase()}`)
  }

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {single ? (
        <SingleContainer className={cityName}></SingleContainer>
      ) : (
        <OverviewContainer
          className={cityName}
          onClick={toDetail}
        ></OverviewContainer>
      )}
    </>
  )
}

const OverviewContainer = styled.div`
  width: 33.3%;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0 rgba(0, 0, 0, 0);
  transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation: scale-in-center 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  &:hover {
    box-shadow: 0 -12px 20px -12px rgba(0, 0, 0, 0.35),
      0 12px 20px -12px rgba(0, 0, 0, 0.35);
  }
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

const SingleContainer = styled.div`
  width: 50%;
  border-radius: 50%;
  box-shadow: 0 -12px 20px -12px rgba(0, 0, 0, 0.35),
    0 12px 20px -12px rgba(0, 0, 0, 0.35);
`
