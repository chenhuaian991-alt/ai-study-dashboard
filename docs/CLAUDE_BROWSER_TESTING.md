# Claude Browser Testing

This project expects Claude Code to use Playwright MCP for browser checks when a change affects visible UI or localStorage behavior.

## When to Use Browser Testing

Use Playwright MCP after any task that changes:

- Page layout, navigation, forms, buttons, filters, or cards
- localStorage persistence or JSON import/export flows
- User-visible validation, empty states, or error handling
- Any workflow that cannot be verified by `npm run build` alone

For documentation-only or type-only changes, `npm run build` is usually enough.

## Standard Flow

1. Run `npm run build`.
2. Start the local app:
   - Preferred: `npm run dev -- --host 127.0.0.1 --port 5173`
   - If the port is busy, use another port and report it.
3. Open the app with Playwright MCP:
   - `browser_navigate` to `http://127.0.0.1:5173`
   - `browser_snapshot` to inspect the visible structure
   - `browser_console_messages` to check for important console errors
4. Exercise the changed workflow with browser tools:
   - `browser_click`
   - `browser_fill_form`
   - `browser_type`
   - `browser_select_option`
   - `browser_press_key`
   - `browser_wait_for`
5. Report the exact path tested and the result.

## Minimum UI Checklist

- The app opens without crashing.
- The relevant page or section is visible.
- The changed control can be clicked or filled.
- The intended state change is visible in the page.
- If data is saved, refresh and confirm it still appears.
- Console messages do not show new serious errors.

## localStorage and Backup Rules

- Do not inspect browser localStorage directly unless the user explicitly asks and the tool policy allows it.
- Prefer testing persistence by using the page, refreshing, and confirming data remains visible.
- For JSON backup, use the page's own "show/copy/export backup" UI and inspect the displayed JSON.
- Avoid overwriting user data unless the prompt explicitly asks for import/restore testing.

## Reporting Template

Use this summary after browser testing:

```text
Browser verification:
- Dev server:
- Browser tool path:
- Scenarios tested:
- Console errors:
- Result:
- Remaining risks:
```

