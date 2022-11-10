/* eslint-disable no-undef */
import path from 'path'
import url from 'url'
import puppeteer from 'puppeteer'
import { introSender } from './intro.js'

export async function profileCardGenerator(introObject, client) {
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
    const variables = [
      'userID',
      'userTag',
      'userName',
      'age',
      'sex',
      'location',
      'quote',
      'sexuality',
      'dmStatus',
      'warriorStatus',
      'verificationStatus',
    ]

    for (const variable of variables) {
      const element = document.getElementById(variable)
      if (typeof element !== 'undefined' && element !== null) {
        element.innerHTML = data[variable]
      }
    }
    document.getElementById('userProfileImage').src = data.avatar
    document.getElementById('userName').style.color = data.color
    document.getElementById(
      'divider',
    ).style.backgroundImage = `linear-gradient(to right, ${data.color}, ${data.color}00)`
  }, introObject)

  setTimeout(async () => {
    const screenData = await page.screenshot({
      encoding: 'base64',
      type: 'webp',
      omitBackground: true,
      quality: 100,
    })
    const imgBuff = Buffer.from(screenData, 'base64')
    await page.close()
    await browser.close()
    // return imgBuff
    await introSender(client, introObject, imgBuff)
  }, 7000)
}
