Color palette:
Vivid Amber: #FFD700
Deep Charcoal: #212121
Soft Lemon: #FFF9C4
Bright White: #FFFFFF
Golden Yellow: #FFC107

Fonts: 
Typeface: Modern Geometric Sans-Serif.

Headline Weight: Bold/Extra Bold.

Body Weight: Regular/Medium.

Color: Deep Charcoal/Black.

Alignment: Mixed (Centered for headings, Left-aligned for forms).

Button styles: 
Shape: Pill-shaped (fully rounded corners) for primary actions.
Primary Color: Vibrant yellow/gold fill.
Typography: Bold, black sans-serif text centered within the button.
Secondary Style: Ghost buttons or outlined versions with thin black borders used for secondary choices.
Shadows: Soft, subtle drop shadows are used in some instances to create a slight lift from the background.

Card styles:
Background: Solid White or Pale Cream.
Corners: Rounded.
Border: Thin Black/Charcoal stroke.
Shadow: Flat with minimal depth.
Content: Vertical stack (Illustration/Title/Body).
Spacing: Generous internal padding.

Border radius:
Buttons: Fully rounded or "pill-shaped" (Maximum radius).
Cards and Containers: Medium rounded, approximately 12px to 16px.
Input Fields: Medium rounded to match the card style.
Selection Chips: Small to medium rounded for a soft, modern appearance.

Spacing:
External Margins: Generous consistent padding (approx. 20px–24px) from screen edges.
Internal Card Padding: Large whitespace (approx. 16px–20px) between card borders and content.
Vertical Rhythm: Moderate spacing between headlines, subtext, and buttons to maintain a clean, airy feel.
Element Grouping: Tight spacing used to visually group related icons and text labels.

Mobile width target:
Primary Device: Typical Android flagship (e.g., Pixel 8 or Samsung Galaxy S24).
Viewport Width: 360px to 412px logical width.
Layout: Single-column vertical stack with bottom navigation.

Animations:
Onboarding Screens
Hero Animations: Implement subtle "floating" or "breathing" movements for the main illustrations (e.g., the character or magnifying glass) to add a sense of liveliness.

Parallax Effect: Apply a slight movement to the background yellow gradients relative to the foreground elements during screen transitions.

Assessment & Questionnaire
Auto-Advance: Upon selecting an option, trigger a 1-second delay before automatically transitioning to the next question.

Transition: Use a smooth horizontal slide or fade to maintain flow without jarring the user.

Mapping Strengths (Loading State)
Active Loader: The loading element (three dots or progress bar) must remain active and animated until the career analysis is complete.

Conditional Trigger: Transition to the results only once the career cards have been fully generated in the backend.

"Paths That Fit You" (Card Deck)
Interaction Style: Implement a "Tinder-style" swiping mechanic for the cards.

Behavior: Swiping is for browsing only (no "accept/deny" logic); the user must click the Proceed button to finalize a selection.

Visual Stack: Arrange cards like a physical deck, where the next card is partially visible behind the top one.

Roadmap & Milestones
Interaction: Milestones (e.g., "Fundamentals") must be clickable.

Feedback: Clicking a milestone triggers a pop-up or an expanded view showing the specific tasks associated with that stage.

Important UX notes:

1. Visual Identity & Layout
Color Palette: Use a primary #FFD700 (Vivid Amber) gradient to #FFFFFF (White). Use #212121 (Deep Charcoal) for all text and line-art borders.

Typography: Modern Geometric Sans-Serif (e.g., Inter/Roboto). Use Bold/Extra Bold for headers and Regular/Medium for body text.

Card Style: Solid white/cream backgrounds with medium rounded corners (12px–16px) and thin 1px black borders.

Spacing: Generous internal padding (16px–20px) and consistent screen margins (20px–24px).

Target Viewport: 390px (iOS) to 412px (Android) logical width, single-column vertical stack.

2. Interaction & Animation Logic
Liveliness: Apply subtle "breathing" or floating animations to hero illustrations and background gradients.

Questionnaire Pacing: Trigger a 1-second delay after an option is selected before auto-advancing to the next question.

Career Mapping: Use a persistent loading dot or shimmer animation while analysis is in progress; only transition when career cards are fully generated.

Card Deck: Implement "Tinder-style" swiping for the "Paths That Fit You" section for browsing, but require a "Proceed" button click for final selection.

3. Dynamic Progress & Profile
Roadmap Sync: Milestones must be interactive; tapping them (e.g., "Fundamentals") scales the element (1.05x) and opens a task pop-up.

Real-Time Updates: The Progress and Profile sections must update automatically as tasks are completed. Connecting lines in the roadmap should transition from dashed to solid.

Profile Adaptation: Use the same card-based UI to display "Strength Tags," career match history, and a circular progress ring for the current path.

4. Accessibility & Feedback
Contrast: Ensure #212121 text maintains WCAG AA compliance against the bright yellow background.

Haptics: Provide light haptic feedback for selections, milestone unlocks, and button taps.

Safe Areas: Position all primary actions (buttons) above system navigation bars for both iOS and Android.