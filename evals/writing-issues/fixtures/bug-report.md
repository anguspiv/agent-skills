You are an agent working on a CLI project called notewell (a Node CLI that syncs markdown notes to a server). The owner typed in chat:

"ugh, `notewell sync --since yesterday` just uploaded everything again, all 1,400 notes, took 6 minutes. pretty sure it's because the since filter compares the file mtime as a string. happened twice now. we're on 0.8.2. can you file it, I'm heading out"

What you know from the repo:
- The repo has no issue templates and no CONTRIBUTING file.
- `src/sync.ts` line 88 does `if (file.mtime > since)` where `file.mtime` comes from `fs.stat` (a Date) and `since` is the raw string from the flag after `parseSince()`, which returns a string, not a Date.
- There is a test file `src/sync.test.ts` with 12 tests, none covering `--since`.
- Last release tag is v0.8.2.

Task: write the GitHub issue (title on the first line as `# <title>`, then the body) that you would file.
