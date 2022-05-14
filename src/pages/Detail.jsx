import React, { useEffect } from "react"
import { useParams } from "react-router-dom"

export default function Detail() {
  const { name } = useParams()

  useEffect(() => {
    console.log(name)
  })
  return <div>Detail</div>
}
