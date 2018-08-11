#!/usr/bin/env node
import analyze from './src/index';

const rootPath = process.argv[2];

analyze(rootPath);
