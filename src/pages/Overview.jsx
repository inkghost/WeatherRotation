import styled from "styled-components"
import CitiesContainer from "../components/CitiesContainer"
import { Button } from "antd"
import { LeftOutlined } from "@ant-design/icons"

export default function Overview() {
  return (
    <Container>
      <Button
        shape="circle"
        icon={<LeftOutlined />}
        className="back-btn"
        onClick={() => {
          window.history.back()
        }}
      >
      </Button>
      <div className="title">
        <h1>Weather / Rotation</h1>
      </div>
      <CitiesContainer />
    </Container>
  )
}

const Container = styled.div`
  max-width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  .back-btn {
    position: absolute;
    left: 2%;
    top: 2%;
  }
  .title {
    font-size: 1.5rem;
  }
`
