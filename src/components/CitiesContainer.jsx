import React from "react"
import styled from "styled-components"
import City from "./City"

export default function CitiesContainer() {
  const cities = [
    "BEIJING",
    "SHANGHAI",
    "URUMQI",
    "HANGZHOU",
    "SHIJIAZHUANG",
    "MOHE",
    "TURPAN",
    "JINAN",
    "LHASA",
    "SHENYANG",
    "CHANGSHA",
    "FUZHOU",
  ]

  return (
    <Container>
      {cities.map((city, index) => {
        return (
          <React.Fragment key={city}>
            {index % 5 === 0 && <div className="empty"></div>}
            <City cityName={city} />
            {index % 5 === 1 && <div className="empty"></div>}
          </React.Fragment>
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
  color: white;
  .empty {
    width: 16.7%;
  }
`
