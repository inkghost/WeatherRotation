import styled from "styled-components"
import CitiesContainer from "./components/CitiesContainer"

export default function App() {
  return (
    <AppContainer>
      <div className="title">
        <h1>Weather Radials</h1>
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
    font-size: 1.5rem;
    -webkit-animation: tracking-in-expand 2s cubic-bezier(0.215, 0.61, 0.355, 1)
      both;
    animation: tracking-in-expand 2s cubic-bezier(0.215, 0.61, 0.355, 1) both;

    @-webkit-keyframes tracking-in-expand {
      0% {
        letter-spacing: -0.5em;
        opacity: 0;
      }
      40% {
        opacity: 0.6;
      }
      100% {
        opacity: 1;
      }
    }
    
    @keyframes tracking-in-expand {
      0% {
        letter-spacing: -0.5em;
        opacity: 0;
      }
      40% {
        opacity: 0.6;
      }
      100% {
        opacity: 1;
      }
    }
  }
`
