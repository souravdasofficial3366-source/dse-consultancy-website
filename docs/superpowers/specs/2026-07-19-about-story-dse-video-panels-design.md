# About Story DSE Video Panels Design

## Goal

Replace the static three-colour DSE mark in the About Us story section with three distinct video-backed letter panels. Preserve the current tilted square, rounded silhouette, and D/S/E identity while borrowing only the expanding-panel interaction idea from the Website Development industry gallery. Rebalance the large `Built For Businesses...` heading in the right-hand story column so it occupies no more than three lines on desktop.

## Chosen approach

Build a dedicated `AboutStoryVideoMark` client component rather than reusing the Website Development card design. This keeps the About visual original and prevents content, CTA, or gallery styling from leaking between sections.

The component uses existing local media:

- D: `/videos/connected_discovery_navigation.mp4`
- S: `/videos/connected_trust_seminar_audience.mp4`
- E: `/videos/connected_action_meeting.mp4`

Each panel contains a muted, looping, inline video, a dark readability scrim, and one large white letter. Videos play only while the mark is visible and motion is allowed.

## Interaction

- Desktop fine pointer: hovering one panel expands it while the other two compress.
- Keyboard: each panel is focusable; focus produces the same expansion as hover.
- Focus takes priority over hover so keyboard interaction remains predictable.
- Touch and smaller layouts: panels remain equal-width and do not depend on hover.
- Reduced motion: flex and video transitions are removed, equal-width panels remain, and playback stays paused.

The square keeps its existing slight counter-clockwise rotation, rounded outer corners, clipping, and approximate size. The videos may scale subtly inside their panels during active desktop interaction, but the outer mark does not move.

## Story heading

The right-hand text column receives a slightly larger share of the desktop story grid. Its `Built For Businesses That Need A Practical Digital Growth Partner.` heading uses three intentional desktop line spans—`Built For Businesses`, `That Need A Practical`, and `Digital Growth Partner.`—with a reduced responsive maximum size. This requirement does not apply to the page hero or the D/S/E graphic. Tablet and mobile continue to stack naturally and may wrap further when space requires it.

## Accessibility and performance

- The visual mark is decorative at the page level, while each focusable panel receives a concise accessible label.
- Videos are muted, `playsInline`, looped, and loaded with metadata only.
- Intersection Observer starts and stops playback based on visibility.
- `prefers-reduced-motion` pauses videos and removes transitions.
- A component-specific focus-visible outline is provided.
- No new media downloads or third-party assets are introduced.

## Verification

Automated tests will confirm:

- the About page mounts the dedicated component;
- all three approved local videos and letters are present;
- viewport-aware playback and reduced-motion cleanup exist;
- desktop hover and keyboard focus expansion are scoped to the DSE mark;
- mobile and reduced-motion modes retain equal panels;
- the desktop heading width and size constraints enforce a maximum of three lines.

Browser verification will confirm the active panel expansion, video coverage, preserved tilt, heading line count, and mobile fallback on localhost.
