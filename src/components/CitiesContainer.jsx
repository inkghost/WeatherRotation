import React from "react"
import styled from "styled-components"

export default function CitiesContainer() {
  const cities = [
    "BEIJING",
    "SHANGHAI",
    "URUMQI",
    "CHENGDU",
    "SHIJIAZHUANG",
    "HAIKOU",
    "JINAN",
    "LHASA",
    "SHENYANG",
    "CHANGSHA",
    "FUZHOU",
    "SHANGTOU",
  ]

  return (
    <Container>
      {cities.map((city, index) => {
        return (
          <>
            {index % 5 === 0 && <div className="empty"></div>}
            <div className="city">{city}</div>
            {index % 5 === 1 && <div className="empty"></div>}
          </>
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
  .city {
    width: 33.3%;
  }
  .empty {
    width: 16.7%;
  }
`
