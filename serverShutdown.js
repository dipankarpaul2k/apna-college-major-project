export function gracefulServerShutdown(server) {
  ["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, () => {
      console.log("-------------------------------------------------------");
      console.log(`${signal} signal received: closing HTTP server...`);
      console.log("-------------------------------------------------------");
      server.close((error) => {
        if (error) {
          console.error("Error occurred while closing HTTP server:", error);
          process.exit(1);
        }
        console.log("HTTP server closed.");
        process.exit(0);
      });
    });
  });
}
