import styled from "styled-components"
import CitiesContainer from "../components/CitiesContainer"

export default function Overview() {
  return (
    <Container>
      <div className="title">
        <h1>Weather / Radials</h1>
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
  .title {
    font-size: 1.5rem;
  }
`
