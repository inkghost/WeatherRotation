import styled from "styled-components"

export default function App() {
  return (
    <AppContainer>
      <h1>Weather Radials / 2020</h1>
    </AppContainer>
  )
}

const AppContainer = styled.div`
  max-width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  background-color: black;

  h1 {
    color: white;
  }
`
