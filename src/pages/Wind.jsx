import React, { useEffect, useState } from "react"
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from "!mapbox-gl"
import WindGL from "../utils/WindGL"
import { DatePicker, TimePicker } from 'antd'
import { style } from "d3-selection";

export default function MyMap() {
  var predate = "20220522"
  var pretime = "00"

  const timeChange = (time, timeString) => {
    pretime = timeString
    console.log(predate+pretime)
    init(predate+pretime)
  };

  const dateChange = (date, dateString) => {
    predate = dateString.replace(/-/g, '')
    console.log(predate+pretime)
    init(predate+pretime)
  };

  const disabledDate = (time) => {
    return time < new Date('2022-05-22').getTime() || time > new Date(new Date().setDate(new Date().getDate() - 1)).getTime()
  }

  var mapContainer = null
  const [initCount, setInitCount] = useState(0)

  const init = (name) => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiemhhbmdqaW5neXVhbiIsImEiOiJja2R5cHhoNXYycGVtMnlteXkwZGViZDc2In0.UhckH-74AgPwMsDhPjparQ"

    var map = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [116, 40],
      zoom: 1,
      scrollZoom: true,
      renderWorldCopies: false,
      antialias: true,
    })

    var nav = new mapboxgl.NavigationControl()
    map.addControl(nav, "top-left")

    var wind = null
    var windLayer = {
      id: "wind",
      type: "custom",
      onAdd: function (map, gl) {
        wind = new WindGL(gl)
        wind.numParticles = 32768
        console.log(name)
        if(name == undefined){
          name = "2022052200"
        }
        updateWind(name)
        new MouseEvent('click', { bubbles: true })
      },
      render: function (gl, matrix) {
        if (wind.windData) {
          gl.enable(gl.BLEND)
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
          wind.draw(matrix)
          map.triggerRepaint()
          return true
        }
      },
    }

    function updateWind(name) {
      fetch(`data/wind/${name}.json`)
        .then((response) => response.json())
        .then((data) => {
          const windImage = new Image()
          data.image = windImage
          windImage.src = "data/wind/" + name + ".png"
          windImage.onload = function () {
            wind.setWind(data)
          }
        })
    }

    map.on("load", function () {
      map.addLayer(windLayer)
    })

    map.on("move", function () {
      if (wind) wind.resize()
    })
  }

  useEffect(() => {
    if (mapContainer !== null && initCount < 2) {
      setInitCount(initCount + 1)
      init()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapContainer, initCount])

  return (
    <div>
      <div
        ref={(el) => (mapContainer = el)}
        style={{ height: "100%", width: "100%", position: "absolute" }}
      />
      <DatePicker style={{position: "absolute",top: "8px",right: "16px",fontSize: "30px"}} onChange={dateChange} disabledDate={disabledDate}/>
      <TimePicker style={{position: "absolute",top: "60px",right: "16px",fontSize: "30px"}} onChange={timeChange} format={"HH"} hourStep={6} showNow={false}/>
    </div>
  )
}
