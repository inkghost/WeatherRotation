import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Overview from "./pages/Overview"
import Detail from "./pages/Detail"
import Wind from "./pages/Wind"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/overview" element={<Overview />} />
        <Route path="/wind" element={<Wind />} />
        <Route path="/detail/:name" element={<Detail />} />
        <Route path="/" element={<Index />} />
      </Routes>
    </BrowserRouter>
  )
}
