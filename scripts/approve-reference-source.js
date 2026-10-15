#!/usr/bin/env node
// Prints the SQL that approves an imported source. It does NOT run anything.
//
//   node scripts/approve-reference-source.js --bundle data/reference/bundles/<id>.bundle.json --reviewer "Your Name"
//
// Run the printed SQL in the Supabase SQL editor ONLY after you have compared the
// extracted passages with the PDF (see data/reference/reports/<id>.passages.md and
// <id>.verification.json). Approval is what makes a source visible to users.
import { readFile } from 'node:fs/promises'
import { parseArgs } from 'node:util'
import { approveSql } from './lib/bundleSql.js'
const { values } = parseArgs({ options: { bundle: { type: 'string' }, reviewer: { type: 'string' } } })
if (!values.bundle || !values.reviewer?.trim()) { console.error('Usage: node scripts/approve-reference-source.js --bundle <bundle.json> --reviewer "Your Name"'); process.exit(2) }
console.log(approveSql(JSON.parse(await readFile(values.bundle, 'utf8')), values.reviewer.trim()))
