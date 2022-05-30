/* global chrome */
chrome.contextMenus.create({
  id: 'qr',
  title: 'Generate QR Code',
  contexts: ['link', 'image', 'video', 'audio', 'page']
})

chrome.contextMenus.onClicked.addListener(({ frameURL, pageURL, linkURL, srcURL }, tab) => {
  const url = linkURL || srcURL || frameURL || pageURL
  openQRFor(url)
})

chrome.browserAction.onClicked.addListener(({ url }) => {
  openQRFor(url, true)
})

function openQRFor (url, shouldScan = false) {
  const popupURL = chrome.runtime.getURL('./popup/index.html')
  const toOpen = new URL(popupURL)
  toOpen.searchParams.set('qr', url)

  if (shouldScan) toOpen.searchParams.set('scan', true)

  chrome.tabs.create({
    url: toOpen.href,
    popup: true
  })
}

chrome.runtime.onMessage.addListener(({ url }) => {
  // Sent by the content script, open a link
  chrome.tabs.create({ url })
})
