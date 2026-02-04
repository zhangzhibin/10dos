# Mock tasks for testing

## Load by input: `#mock N`

In the popup, type **#mock 0** to load real saved data, or **#mock 1**–**#mock 4** to load the Nth group of mock tasks (replaces current list).

| Input | Description |
|-------|-------------|
| **#mock 0** | Load actual data from storage |
| **#mock 1** | Urgency mix: 4 green, 3 yellow, 3 red (plugin dev steps) |
| **#mock 2** | All recent: 10 tasks &lt; 24h (all green) |
| **#mock 3** | 5 active + 5 completed (test Completed tab and Created/Done times) |
| **#mock 4** | All old: 10 tasks &gt; 1 week (all red) |

Invalid or out-of-range (e.g. `#mock 5`) shows an error. Use **#mock 0** for real data, **#mock 1–4** for mock groups.

---

## Urgency rules

- **Green**: &lt; 24h  
- **Yellow**: 24h – 72h  
- **Red**: &gt; 72h  
