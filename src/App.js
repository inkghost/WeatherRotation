import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Overview from "./pages/Overview"
import Detail from "./pages/Detail"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/overview" element={<Overview />} />
        <Route path="/detail/:name" element={<Detail />} />
        <Route path="/" element={<Index />} />
      </Routes>
    </BrowserRouter>
  )
}
