#!/usr/bin/env node
// Smoke driver for squirrel-pi (allibuild.com)
// Usage:
//   node .claude/skills/run-squirrel-pi/driver.cjs                 # smoke prod
//   BASE_URL=http://localhost:3000 node driver.cjs                  # smoke local (sign-in only)
//   SS_DIR=/tmp/ss node driver.cjs                                   # custom screenshot dir

const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const BASE = process.env.BASE_URL || 'https://allibuild.com'
const OUT = process.env.SS_DIR || path.join(__dirname, 'screenshots')

fs.mkdirSync(OUT, { recursive: true })

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await ctx.newPage()
  page.setDefaultTimeout(20000)

  let passed = 0, failed = 0

  async function ss(name) {
    const p = path.join(OUT, `${name}.png`)
    await page.screenshot({ path: p, fullPage: false })
    console.log(`  📸  ${p}`)
  }

  async function check(label, fn) {
    process.stdout.write(`  ${label} … `)
    try {
      await fn()
      console.log('✓')
      passed++
    } catch (e) {
      console.log(`✗  ${e.message}`)
      failed++
    }
  }

  console.log(`\nSmoking ${BASE}\n`)

  // 1. Sign-in page loads and Clerk widget renders
  await check('sign-in page loads', async () => {
    await page.goto(BASE + '/sign-in')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    const form = await page.$('form, input[type="email"]')
    if (!form) throw new Error('No sign-in form found — Clerk may not have loaded')
  })
  await ss('01-sign-in')

  // 2. Unauthenticated routes redirect to sign-in
  await check('/dashboard redirects to /sign-in', async () => {
    await page.goto(BASE + '/dashboard')
    await page.waitForLoadState('networkidle')
    const url = page.url()
    if (!url.includes('/sign-in')) throw new Error(`Expected /sign-in redirect, got ${url}`)
  })

  await check('/builder redirects to /sign-in', async () => {
    await page.goto(BASE + '/builder')
    await page.waitForLoadState('networkidle')
    const url = page.url()
    if (!url.includes('/sign-in')) throw new Error(`Expected /sign-in redirect, got ${url}`)
  })

  // 3. API: webhook endpoint returns 400 "Missing signature" (not 401/404)
  await check('POST /api/stripe/webhook reachable (400 = healthy)', async () => {
    const res = await page.request.post(BASE + '/api/stripe/webhook', {
      data: '{}',
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.status() !== 400) throw new Error(`Expected 400, got ${res.status()}`)
    const body = await res.json()
    if (!body.error?.includes('signature')) throw new Error(`Unexpected body: ${JSON.stringify(body)}`)
  })

  // 4. Sign-up page loads
  await check('sign-up page loads', async () => {
    await page.goto(BASE + '/sign-up')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)
    const form = await page.$('form, input')
    if (!form) throw new Error('No sign-up form found')
  })
  await ss('02-sign-up')

  await browser.close()

  console.log(`\n  ${passed} passed, ${failed} failed`)
  console.log(`  Screenshots → ${OUT}\n`)
  process.exit(failed > 0 ? 1 : 0)
})()
