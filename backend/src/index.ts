import Server from './server';

// Create and start server
const server = new Server();
server.start().catch((error) => {
  console.error('❌ Failed to start WARISAN server:', error);
  process.exit(1);
});