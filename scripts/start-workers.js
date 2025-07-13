#!/usr/bin/env node

// Load environment variables
require('dotenv').config();

// Import and start the worker
const { initializeWorkers } = require('../src/lib/jobs/worker');

// Initialize workers
initializeWorkers();

console.log('Background job workers started successfully');
console.log('Workers are now processing jobs from Redis queues');
console.log('Press Ctrl+C to stop workers gracefully');

// Keep the process running
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...');
  process.exit(0);
});