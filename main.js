const puppeteer = require('puppeteer');
const axios = require('axios');
const getDay = require('date-fns/getDay');

require('dotenv').config();

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto('https://www.vivagym.es/login', { waitUntil: 'networkidle2' }),
  await page.waitFor('.cc-dismiss')
  await page.click('.cc-dismiss')

  await page.focus('#emailInput')
  await page.keyboard.type(process.env.USER_EMAIL)

  await page.focus('#passwordInput')
  await page.keyboard.type(process.env.USER_PASS)

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation()
  ])

  await page.waitFor('#personalDetails')

  await page.click('.member-nav .navbar-toggle')
  await page.click('a[href="/bookClasses"]')

  await page.waitFor('.classespadding')
  await page.click('.handcursor.pull-right')
  await page.waitFor(2000)

  const {
    classSlotSelector,
    buttonTargetID,
    className,
    classTime,
    isClassAvailable
  } = await page.evaluate(() => {
    const classSlotSelector = '.classespadding .panel-body > .row > div:nth-child(14) > .au-target'
    const node = document.querySelector(classSlotSelector)
    const className = node.childNodes[0].textContent
    const classTime = node.childNodes[1].textContent
    const bookClassBtn = node.lastChild.getElementsByTagName('button')[0]
    const isClassAvailable = !bookClassBtn.classList.contains('disabled')
    const buttonTargetID = bookClassBtn.getAttribute('au-target-id')
    return {
      classSlotSelector,
      buttonTargetID,
      className,
      classTime,
      isClassAvailable
    }
  })

  if (isClassAvailable) {
    page.click(`${classSlotSelector} button[au-target-id="${buttonTargetID}"]`)
    await axios.post(`https://api.telegram.org/bot${process.env.TOKEN_ID}/sendMessage`, {
      chat_id: process.env.CHAT_ID,
      text: `Has reservado una clase de ${className} en el horario de ${classTime}`
    })
  }


  await browser.close()
})()