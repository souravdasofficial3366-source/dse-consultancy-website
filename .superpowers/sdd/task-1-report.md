# Task 1 report: industry video loops

## Files changed

- `tests/website-development-industry-video-grid.test.mjs`
- `public/videos/industries/pre-schooling.mp4`
- `public/videos/industries/pre-schooling-poster.jpg`
- `public/videos/industries/doctors-clinics.mp4`
- `public/videos/industries/doctors-clinics-poster.jpg`
- `public/videos/industries/education.mp4`
- `public/videos/industries/education-poster.jpg`
- `public/videos/industries/transport-logistics.mp4`
- `public/videos/industries/transport-logistics-poster.jpg`
- `public/videos/industries/real-estate.mp4`
- `public/videos/industries/real-estate-poster.jpg`
- `public/videos/industries/ecommerce.mp4`
- `public/videos/industries/ecommerce-poster.jpg`
- `work/video-sources.md`
- `.superpowers/sdd/task-1-report.md`

## Test-driven workflow

1. Created the required media-budget test.
2. Ran `node --test tests/website-development-industry-video-grid.test.mjs` before creating assets.
   - Result: expected failure with `ENOENT` for `public/videos/industries/pre-schooling.mp4`.
3. Ran the same command after encoding all assets.
   - Result: pass — 1 test passed, 0 failed.

## Source and download record

The six approved Pexels source pages and Pexels License are logged in `work/video-sources.md`. The Pexels HTML endpoint was Cloudflare-protected to command-line retrieval (HTTP 403), so each source page was verified in the browser and the published media URL from that exact page was downloaded to `/tmp/dse-industry-sources/`.

The publisher’s media URLs for Doctors & Clinics, Education, Real Estate, and E-commerce use `uhd` in their file names even though the corresponding exact Pexels pages were selected for this task. Every committed derivative was trimmed, muted, compressed, and kept inside the specified web-media budget.

## Encoding commands

- Installed the temporary `ffmpeg-static@5.2.0` binary with `npm install --no-save --package-lock=false ffmpeg-static@5.2.0`; `package.json` and the lockfile were not changed by this task.
- Encoded the six clips with the required 8-second, muted H.264 settings: 24 fps, width capped at 1280 pixels, CRF 29, and `+faststart`.
- Generated one JPEG poster per local clip at the required 2-second point and width cap.

## Committed media sizes (bytes)

| Asset | MP4 | Poster JPEG |
| --- | ---: | ---: |
| pre-schooling | 461,444 | 48,245 |
| doctors-clinics | 1,146,045 | 67,663 |
| education | 583,683 | 30,321 |
| transport-logistics | 396,736 | 104,693 |
| real-estate | 516,827 | 15,939 |
| ecommerce | 650,932 | 19,681 |

Combined video size: 3,755,667 bytes (under the 18 MiB limit). Every MP4 is under 3 MiB and every poster is under 150 KiB.

## Self-review

- Verified the red state occurred before assets were created and the required test is now green.
- Verified all required six MP4/poster name pairs exist and are local, optimized files.
- Verified output videos are eight seconds, muted, H.264 MP4 files with fast-start metadata.
- Did not stage unrelated existing changes.

## Commit

`18982b5ef407386450523a735723c96756435a7f` before this report-only amendment.
