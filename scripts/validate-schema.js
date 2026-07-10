#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const Ajv2020 = require('ajv/dist/2020');

const EXIT_VALID = 0;
const EXIT_INVALID = 1;
const EXIT_HARNESS_ERROR = 2;

function failHarness(message) {
  console.error(`HARNESS_ERROR: ${message}`);
  process.exit(EXIT_HARNESS_ERROR);
}

const [, , schemaPathArg, dataPathArg] = process.argv;

if (!schemaPathArg || !dataPathArg) {
  failHarness('usage: node scripts/validate-schema.js <schema.json> <data.json>');
}

try {
  const schemaPath = path.resolve(schemaPathArg);
  const dataPath = path.resolve(dataPathArg);
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (valid) {
    console.log('SCHEMA_VALID');
    process.exit(EXIT_VALID);
  }

  console.log('SCHEMA_INVALID');
  console.log(JSON.stringify(validate.errors, null, 2));
  process.exit(EXIT_INVALID);
} catch (error) {
  failHarness(error instanceof Error ? error.message : String(error));
}
