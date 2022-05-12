import styled from "styled-components"
import CitiesContainer from "./components/CitiesContainer"

export default function App() {
  return (
    <AppContainer>
      <div className="title">
        <h1>Weather Radials / 2020</h1>
      </div>
      <CitiesContainer />
    </AppContainer>
  )
}

const AppContainer = styled.div`
  max-width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;

  .title {
    color: white;
    font-size: 1.5rem;
  }
`
