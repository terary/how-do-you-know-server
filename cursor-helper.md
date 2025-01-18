Server Management Directives:

1. Server Process Management:

   - Before starting a new server, always kill existing processes
   - Clean up commands:
     ```
     pkill -f "node.*3001"  # Kill Node.js processes on port 3001
     ```
   - Verify port is free using `lsof -i :3001`

2. Starting Server with Visible Output:

   - Use `run_terminal_cmd` with `is_background: true`
   - Command: `NODE_ENV=development DEBUG=* npm run start:dev`
   - This allows server output to be visible in Cursor while maintaining interaction
   - Keep track of the process ID for future management

3. Monitoring:

   - Watch for successful startup message: "Nest application successfully started"
   - Check for any error messages, especially port conflicts
   - Ensure database connections are established

4. Clean Shutdown:
   - When switching tasks or restarting, always clean up processes
   - Verify the port is freed before starting a new instance
