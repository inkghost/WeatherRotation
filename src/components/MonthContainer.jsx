import React, { useEffect, useState } from "react"
import styled from "styled-components"
import Month from "./Month"
import * as d3 from "d3"

export default function CitiesContainer({ cityName }) {
  const [monthData, setMonthData] = useState(undefined)

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

  const init = async () => {
    const tmpMonthData = []
    for (let index = 0; index < months.length; index++) {
      tmpMonthData.push([])
    }
    ;(await d3.csv(`/data/processed/${cityName}.csv`)).forEach((item) => {
      let month = item.DATE.split("-")[1]
      tmpMonthData[month - 1].push({
        TAVG: +item.TAVG,
        TMAX: +item.TMAX,
        TMIN: +item.TMIN,
        PRCP: +item.PRCP,
        DATE: new Date(item.DATE),
      })
    })
    setMonthData(tmpMonthData)
  }

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container>
      {monthData &&
        months.map((month, index) => {
          return (
            <Month
              key={month}
              month={month}
              data={monthData[index]}
              cityName={cityName}
            />
          )
        })}
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
`
