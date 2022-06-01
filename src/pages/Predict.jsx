import React, { useEffect, useState } from "react"
import styled from "styled-components"
import HourlyWeather from "../components/HourlyWeather"
import DailyWeather from "../components/DailyWeather"
import { Button, Modal, Select } from "antd"
import { LeftOutlined, EditOutlined } from "@ant-design/icons"

export default function Predict() {
  const apiKey = "e42a6d2fc2fd4efba25d97b9e8ab200a"
  const [cityInfo, setCityInfo] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)
  const [hasSyncCityInfo, setHasSyncCityInfo] = useState(true)
  const [nowWeatherInfo, setNowWeatherInfo] = useState(null)
  const [hourlyWeatherInfo, setHourlyWeatherInfo] = useState(null)
  const [dailyWeatherInfo, setDailyWeatherInfo] = useState(null)

  const { Option } = Select

  let timeout = null

  const getCity = (value, callback) => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }

    timeout = setTimeout(() => {
      fetch(
        `https://geoapi.qweather.com/v2/city/lookup?location=${value}&key=${apiKey}&lang=en`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.code === "200") callback(data.location)
        })
    }, 300)
  }

  const SearchInput = (props) => {
    const [value, setValue] = useState(null)
    const [data, setData] = useState([])
    const handleSearch = (newValue) => {
      if (newValue) {
        getCity(newValue, setData)
      } else {
        setData([])
      }
    }

    const handleChange = (newValue) => {
      setValue(newValue)
      setSelectedCity(newValue)
    }

    const options = data.map((d) => (
      <Option key={d.id}>
        {d.name}
        {d.name === d.adm1 ? "" : `/${d.adm1}`}
        {d.adm1 === d.adm2 ? "" : `/${d.adm2}`}
      </Option>
    ))
    return (
      <Select
        labelInValue
        showSearch
        value={value}
        placeholder={props.placeholder}
        style={props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={null}
      >
        {options}
      </Select>
    )
  }

  const changeCity = () => {
    Modal.info({
      title: "Change the city",
      content: (
        <SearchInput
          placeholder="input search text"
          style={{
            width: "100%",
          }}
        />
      ),
      onOk() {
        setHasSyncCityInfo(false)
      },
    })
  }

  const getWeatherInfo = (id) => {
    fetch(
      `https://devapi.qweather.com/v7/weather/now?location=${id}&key=${apiKey}&lang=en`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.code === "200") {
          setNowWeatherInfo(data.now)
        }
      })
    fetch(
      `https://devapi.qweather.com/v7/weather/24h?location=${id}&key=${apiKey}&lang=en`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.code === "200") {
          setHourlyWeatherInfo(
            data.hourly.map((item) => {
              const fxTime = new Date(item.fxTime)
              return { ...item, time: `${fxTime.getHours()}:00`, temp: Number(item.temp) }
            })
          )
        }
      })
    fetch(
      `https://devapi.qweather.com/v7/weather/7d?location=${id}&key=${apiKey}&lang=en`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.code === "200") {
          setDailyWeatherInfo(data.daily)
        }
      })
  }

  useEffect(() => {
    setCityInfo({
      name: "Haidian",
      id: "101010200",
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (cityInfo) getWeatherInfo(cityInfo.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityInfo])

  useEffect(() => {
    if (!hasSyncCityInfo) {
      setCityInfo({
        name: selectedCity.label[0],
        id: selectedCity.value,
      })
      setHasSyncCityInfo(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSyncCityInfo])

  return (
    <Container>
      <Button
        shape="circle"
        icon={<LeftOutlined />}
        className="back-btn"
        onClick={() => {
          window.history.back()
        }}
      ></Button>
      <div className="title">
        <h1>{cityInfo && cityInfo.name}</h1>
        <Button
          shape="circle"
          icon={<EditOutlined />}
          onClick={changeCity}
        ></Button>
      </div>
      <div className="weather-info">
        <HourlyWeather
          nowWeather={nowWeatherInfo}
          hourlyWeather={hourlyWeatherInfo}
        />
        <DailyWeather weatherInfo={dailyWeatherInfo} />
      </div>
    </Container>
  )
}

const Container = styled.div`
  max-width: 100vw;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  height: 100vh;
  .back-btn {
    position: absolute;
    left: 2%;
    top: 2%;
  }
  .title {
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    text-align: center;
    h1 {
      margin: 0;
    }
  }
  .weather-info {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    flex: 1;
  }
`
