/* global Html5QrcodeScanner, chrome, QRCode */

window.scan.onclick = doScan

const options = new URL(window.location.href).searchParams

const toSetqr = options.get('qr')
if (toSetqr) setQR(toSetqr)

if (options.has('scan')) setVisible(window.scan, true)

function setQR (url) {
  window.qrcode = new QRCode(window.qr, {
    text: url,
    width: 256,
    height: 256,
    colorDark: '#000000',
    colorLight: '#FFFFFF'
  })
  setVisible(window.qr, true)
}

function setVisible (element, state = true) {
  element.classList.toggle('hidden', !state)
}

function doScan () {
  setVisible(window.scan, false)
  setVisible(window.reader, true)
  setVisible(window.qr, false)

  let lastSeen = ''

  const scanner = new Html5QrcodeScanner(
    'reader',
    { fps: 1, qrbox: { width: 250, height: 250 } },
    /* verbose= */ false)

  scanner.render(onScanSuccess, onScanFailure)

  function onScanSuccess (url) {
    console.log('Scanned', url)
    if (url === lastSeen) return
    lastSeen = url
    chrome.runtime.sendMessage({ url })
  }

  // Whatever, this happens when there's no result from the scan
  function onScanFailure () {}
}
