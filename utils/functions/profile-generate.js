/* eslint-disable no-undef */
import path from 'path'
import url from 'url'
import puppeteer from 'puppeteer'
import { profileManager } from '../modules.js'

/**
 * Generates the profile and fires created event
 * @param {Object<string, string>} dataObj
 */

export async function profileGenerate(dataObj, client) {
  // launch browser
  const webPath = path.resolve('assets', 'web', 'main.html')
  const webUrl = url.pathToFileURL(webPath)
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  })

  // open page
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 1200 })
  await page.goto(webUrl, {
    timeout: 0,
    waitUntil: 'networkidle0',
  })

  // edit details
  await page.evaluate((data) => {
    const nope = ['color', 'pfp', 'grd', 'bg', 'intro', 'channel', 'ifProfile']
    for (const value in data) {
      if (nope.includes(value)) continue
      document.getElementById(value).innerHTML = data[value]
    }

    if (data.pfp) document.getElementById('userProfileImage').src = data.pfp
    if (data.grd) {
      document.getElementById('profile').style.backgroundImage = `linear-gradient(${data.grd})`
    }
    if (data.color) {
      document.getElementById('userName').style.color = data.color
      document.getElementById(
        'divider',
      ).style.backgroundImage = `linear-gradient(to right, ${data.color}, ${data.color}00)`
    }
    if (data.bg) {
      const element = document.getElementById('profile')
      element.style.backgroundImage = `url("${data.bg}")`
      element.style.backgroundSize = 'cover'
    }
  }, dataObj)

  setTimeout(async () => {
    const screenData = await page.screenshot({
      encoding: 'base64',
      type: 'webp',
      omitBackground: true,
      quality: 100,
    })
    const imgBufff = Buffer.from(screenData, 'base64')
    profileManager.emit('send', imgBufff, dataObj, client)
    await page.close()
    await browser.close()
  }, 7000)
}
