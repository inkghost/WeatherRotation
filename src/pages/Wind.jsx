import React, { useEffect } from "react"
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from "!mapbox-gl"
import WindGL from "../utils/WindGL"

export default function MyMap() {
  var mapContainer = null

  const init = () => {
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

    const windFiles = {
      0: "2022051900",
      6: "2022051906",
      12: "2022051912",
      18: "2022051918",
      24: "2022052000",
      30: "2022052006",
      36: "2022052012",
      42: "2022052018",
    }

    var wind = null
    var windLayer = {
      id: "wind",
      type: "custom",
      onAdd: function (map, gl) {
        wind = new WindGL(gl)
        wind.numParticles = 32768
        updateWind(0)
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
      fetch(`data/wind/${windFiles[name]}.json`)
        .then((response) => response.json())
        .then((data) => {
          const windImage = new Image()
          data.image = windImage
          windImage.src = "data/wind/" + windFiles[name] + ".png"
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
    if (mapContainer !== null) {
      init()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapContainer])

  return (
    <div>
      <div
        ref={(el) => (mapContainer = el)}
        style={{ height: "100%", width: "100%", position: "absolute" }}
      />
    </div>
  )
}
