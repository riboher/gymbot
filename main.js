const puppeteer = require('puppeteer');
const axios = require('axios');
require('dotenv').config();

(async () => {
  const browser = await puppeteer.launch({ devtools: true })
  const page = await browser.newPage()

  await page.goto('https://www.vivagym.es/login', { waitUntil: 'networkidle2' }),
  await page.waitFor('.cc-dismiss')
  await page.click('.cc-dismiss')

  await page.focus('#emailInput')
  await page.keyboard.type('riboher@gmail.com')

  await page.focus('#passwordInput')
  await page.keyboard.type('30066877')

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation()
  ])

  await page.waitFor('#personalDetails')

  await page.click('.member-nav .navbar-toggle')
  await page.click('a[href="/bookClasses"]')

  await page.waitFor('.classespadding')

  await axios.post(`https://api.telegram.org/bot${process.env.TOKEN_ID}/sendMessage`, {
    chat_id: process.env.CHAT_ID,
    text: 'Gimnasio reservado'
  })

  await browser.close()
})()