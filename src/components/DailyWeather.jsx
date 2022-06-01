import React from "react"
import styled from "styled-components"

export default function DailyWeather({ weatherInfo }) {
  return (
    <Container>
      {weatherInfo &&
        weatherInfo.map((item) => {
          return (
            <React.Fragment key={item.fxDate}>
              <div className="weather-info">
                <div>{item.fxDate}</div>
                <div className="weather-icon">
                  <i className={`qi-${item.iconDay}`}></i>
                  <span>{item.textDay}</span>
                </div>
                <div className="weather-icon">
                  <i className={`qi-${item.iconNight}`}></i>
                  <span>{item.textNight}</span>
                </div>
                <div>
                  <span style={{ color: "#80c6ea" }}>{item.tempMin}</span>~
                  <span style={{ color: "#f3cf8a" }}>{item.tempMax}</span>
                </div>
              </div>
              <hr />
            </React.Fragment>
          )
        })}
    </Container>
  )
}

const Container = styled.div`
  width: 35%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  hr {
    width: 100%;
  }
  .weather-info {
    justify-content: space-between !important;
    font-size: 1.3rem;
    .weather-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      font-size: 0.9rem;
    }
  }
`
