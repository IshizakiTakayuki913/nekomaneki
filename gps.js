
window.addEventListener('get_gps', ({detail}) => {
  const spotName = [
    '100号館',
    '坂の下',
    '5号館',
    '駐輪場',
    '美容室',
    '信号',
    '3号館',
  ]
  const spotCie = [
    [33.26560098942343, 130.53797468033696],
    [33.26611240927303, 130.53863822612087],
    [33.26548089292048, 130.5368999851698],
    [33.26672786012435, 130.53784680238874],
    [33.26692077467941, 130.53886659541007],
    [33.26770949205732, 130.5388662738286],
    [33.26600619252073, 130.53773898332867],
  ]
  const spotdist = []
  const order = []
  const radians = deg => (deg * Math.PI) / 180

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const a = 6378.14 * Math.acos(Math.cos(radians(lat1)) *
      Math.cos(radians(lat2)) *
      Math.cos(radians(lng2) - radians(lng1)) +
      Math.sin(radians(lat1)) *
      Math.sin(radians(lat2)))
    return Math.floor(a * 1000) / 1000
  }

  const test2 = (position) => {
    let text = ''
    for (let i = 0; i < spotCie.length; i++) {
      spotdist[i] = getDistance(position.coords.latitude, position.coords.longitude, spotCie[i][0], spotCie[i][1])
      order[i] = i
    }

    const dist = JSON.parse(JSON.stringify(spotdist))

    for (let i = 0; i < dist.length - 1; i++) {
      for (let s = i + 1; s < dist.length; s++) {
        if (dist[i] > dist[s]) {
          const box = dist[i]
          dist[i] = dist[s]
          dist[s] = box

          const box1 = order[i]
          order[i] = order[s]
          order[s] = box1
        }
      }
    }

    console.log(`誤差${position.coords.accuracy}`)
    text += `緯度 :${position.coords.latitude} 経度:${position.coords.longitude} 誤差${Math.floor(position.coords.accuracy)}m<br>\n`
    for (let i = 0; i < order.length; i++) {
      text += `${spotName[order[i]]}  :${spotdist[order[i]]}km<br>\n`
    }

    const display = document.getElementById('display')
    display.innerHTML += text
    console.log(text)
  }
  const errorFunc = (error) => {
    // エラーコードのメッセージを定義
    const errorMessage = {
      0: '原因不明のエラーが発生しました…。',
      1: '位置情報の取得が許可されませんでした…。',
      2: '電波状況などで位置情報が取得できませんでした…。',
      3: '位置情報の取得に時間がかかり過ぎてタイムアウトしました…。',
    }
    console.log(errorMessage[error.code])
  }

  navigator.geolocation.getCurrentPosition(test2, errorFunc)
  // XR8.XrController.configure({imageTargets: ['image-target1', 'image-target2', 'image-target3']})
})

function getgps() {
  const A = new CustomEvent('get_gps', {})
  window.dispatchEvent(A)
}
