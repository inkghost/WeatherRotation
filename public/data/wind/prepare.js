const PNG = require("pngjs").PNG
const fs = require("fs")

const data = JSON.parse(fs.readFileSync("tmp.json"))
const name = "/home/huhuhu777/data" + process.argv[2]
const u = data.u.messages[0]
const v = data.v.messages[0]

var width = 0
var height = 0
var umax = 0
var umin = 0
var dataDate
var dataTime
var uvs
for (var i = 0; i < u.length; i++) {
  let jn = u[i]
  if (jn.key === "values") {
    uvs = jn.value
  }
  if (jn.key === "dataDate") {
    dataDate = jn.value
  }
  if (jn.key === "dataTime") {
    dataTime = jn.value
  }
  if (jn.key === "maximum") {
    umax = jn.value
  }
  if (jn.key === "minimum") {
    umin = jn.value
  }
  if (jn.key === "Ni") {
    width = jn.value
  }
  if (jn.key === "Nj") {
    height = jn.value - 1
  }
}
var vmax = 0
var vmin = 0
var vvs
for (var h = 0; h < v.length; h++) {
  let jv = v[h]
  if (jv.key === "values") {
    vvs = jv.value
  }
  if (jv.key === "maximum") {
    vmax = jv.value
  }
  if (jv.key === "minimum") {
    vmin = jv.value
  }
}

const png = new PNG({
  colorType: 2,
  filterType: 4,
  width: width,
  height: height,
})

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4
    const k = y * width + ((x + width / 2) % width)
    png.data[i + 0] = Math.floor((255 * (uvs[k] - umin)) / (umax - umin))
    png.data[i + 1] = Math.floor((255 * (vvs[k] - vmin)) / (vmax - vmin))
    png.data[i + 2] = 0
    png.data[i + 3] = 255
  }
}

png.pack().pipe(fs.createWriteStream(name + ".png"))

fs.writeFileSync(
  name + ".json",
  JSON.stringify(
    {
      source: "http://nomads.ncep.noaa.gov",
      date: formatDate(dataDate + "", dataTime),
      width: width,
      height: height,
      uMin: umin,
      uMax: umax,
      vMin: vmin,
      vMax: vmax,
    },
    null,
    2
  ) + "\n"
)

function formatDate(date, time) {
  return (
    date.substr(0, 4) +
    "-" +
    date.substr(4, 2) +
    "-" +
    date.substr(6, 2) +
    "T" +
    (time < 10 ? "0" + time : time) +
    ":00Z"
  )
}
