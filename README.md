# My Website

A starter static website scaffold created in your new workspace.

## Getting Started

1. Open this folder in VS Code.
2. Run `npm install` if you want to use the local development server.
3. Start the site with:

```bash
npm start
```

This will open a local browser window using `http-server`.

## What’s Included

- `index.html` — landing page structure
- `styles.css` — responsive design and visuals
- `script.js` — basic interaction
- `package.json` — start script for quick local preview

## Customize

- Replace the text in `index.html`
- Update colors and layout in `styles.css`
- Add new sections or pages as needed

## Daily Screener Updates

The project includes a daily update workflow for the Finviz screener feed.

- Run manually:

```bash
npm run daily-update
```

- Or use Windows Task Scheduler with `run_update_charts.bat`.

`run_update_charts.bat` already points to the workspace and logs output to `update-charts.log`.

### Scheduling with Task Scheduler

1. Open Task Scheduler.
2. Create a new task.
3. Set the trigger to run daily at the time you want.
4. Set the action to:
   - Program/script: `cmd.exe`
   - Add arguments: `/c "c:\Users\Dell\New folder\run_update_charts.bat"`
5. Save and enable the task.

This will update the screener feed and refresh existing tickers each day.
