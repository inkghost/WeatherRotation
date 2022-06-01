import React, { useEffect, useState } from "react"
import styled from "styled-components"
import PrcpArea, { defaultConfig as config } from "../utils/PrcpArea"
import { Select } from "antd"
import * as d3 from "d3"

export default function PrcpContainer({ cityName }) {
  const { Option } = Select
  const [citiesOption, setCitiesOption] = useState([])
  const [selectedCities, setSelectedCities] = useState([])
  const [canSelcetOpen, setCanSelcetOpen] = useState(false)
  const [prcps, setPrcps] = useState([])
  const [prcpDate, setPrcpDate] = useState('')

  const cities = [
    "BEIJING",
    "SHANGHAI",
    "URUMQI",
    "HANGZHOU",
    "SHIJIAZHUANG",
    "CHONGQING",
    "TURPAN",
    "JINAN",
    "LHASA",
    "SHENYANG",
    "CHANGSHA",
    "FUZHOU",
  ]

  const colors = ["#80c6ea", "#74e5be", "#f3cf8a"]

  const init = () => {
    let tmpCitiesOption = []
    cities.forEach((item) => {
      if (item !== cityName)
        tmpCitiesOption.push(<Option key={item}>{item}</Option>)
    })
    setCitiesOption(tmpCitiesOption)
    generateAreaChart()
  }

  const handleCityChange = (value) => {
    setSelectedCities(value)
    setCanSelcetOpen(true)
    if (value.length === 2) {
      setCanSelcetOpen(false)
    }
  }

  const generateAreaChart = async () => {
    const cities = [cityName, ...selectedCities]
    const data = []
    for (let index = 0; index < cities.length; index++) {
      const city = cities[index]
      data.push(
        (await d3.csv(`/data/processed/${city}.csv`)).map((item) => {
          const date = new Date(item.DATE)
          return {
            CITY: city,
            PRCP: +item.PRCP,
            DATE: `${date.getMonth() + 1}-${date.getDate()}`,
          }
        })
      )
    }
    PrcpArea(d3.select(".prcp"), "prcp", {
      ...config,
      data,
      cities,
      setPrcps,
      setPrcpDate,
    })
  }

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    generateAreaChart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCities])

  return (
    <Container>
      <div className="cities-select">
        <h2>{cityName}</h2>
        <Select
          mode="multiple"
          style={{
            width: "70%",
          }}
          placeholder="choose city"
          onChange={handleCityChange}
          onFocus={() => {
            handleCityChange(selectedCities)
          }}
          onBlur={() => {
            setCanSelcetOpen(false)
          }}
          open={canSelcetOpen}
        >
          {citiesOption}
        </Select>
      </div>
      <div className="prcp"></div>
      <div className="tooltip hidden">
        <p>
          <strong className="date">{prcpDate}</strong>
        </p>
        {[cityName, ...selectedCities].map((item, index) => {
          return (
            <div className="info" key={item}>
              <div
                className="circle"
                style={{ backgroundColor: colors[index] }}
              ></div>
              <span className="city">{item}</span>
              <strong className="case">{prcps[index]}mm</strong>
            </div>
          )
        })}
      </div>
    </Container>
  )
}

const Container = styled.div`
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .cities-select {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  .prcp {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .tooltip {
    position: absolute;
    min-width: 10rem;
    height: auto;
    padding: 0.5rem;
    box-sizing: border-box;
    background-color: white;
    border-radius: 5px;
    border: 1px solid #c9c9c9;
    pointer-events: none;
    color: gray;
    display: block;
    .info {
      display: flex;
      align-items: center;
    }

    .circle {
      height: 15px;
      width: 15px;
      border-radius: 50%;
      margin-right: 5px;
    }

    .case {
      display: inline-block;
      margin-left: auto;
    }
  }

  .hidden {
    display: none;
  }
`
