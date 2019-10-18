const puppeteer = require('puppeteer');

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

  await page.click('a[href="/bookClasses"]')

  await browser.close()
})()