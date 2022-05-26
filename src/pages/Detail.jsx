import React from "react"
import { useParams } from "react-router-dom"
import styled from "styled-components"
import City from "../components/City"
import MonthContainer from "../components/MonthContainer"
import { Button } from "antd"
import { LeftOutlined } from "@ant-design/icons"

export default function Detail() {
  const city = useParams().name.toUpperCase()

  return (
    <Container>
      <Button
        type="primary"
        shape="circle"
        icon={<LeftOutlined />}
        className="back-btn"
        onClick={() => {
          window.history.back()
        }}
      >
      </Button>
      <City cityName={city} single={true} />
      <div className="details">
        <MonthContainer cityName={city} />
      </div>
    </Container>
  )
}

const Container = styled.div`
  max-width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 2rem;
  padding: 2rem;
  overflow: hidden;
  .back-btn {
    position: absolute;
    left: 2%;
    top: 2%;
  }
  .details {
    width: 60%;
    overflow: scroll;
  }
`
