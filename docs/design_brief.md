# STAR-LAB Design Brief

## Project Overview
**STAR-LAB** is a comprehensive Laboratory Information Management System (LIMS). The goal is to re-skin the entire application to match a specific **"TradeHub" Dark Mode Aesthetic**.

## The Visual Direction (TradeHub Style)
The user has provided a reference image ("TradeHub") which dictates the new look and feel.

### Core Aesthetic
*   **Theme**: **Deep Dark Mode**. The application should be dark by default.
    *   Backgrounds: Deep blues/blacks (e.g., Slate-900 / `#0B1120` or similar).
    *   Cards/Panels: Slightly lighter dark shades (e.g., Slate-800) with subtle borders.
*   **Accent Colors**:
    *   **Primary Action**: Vibrant Blue (e.g., `#3B82F6`) - used for "Deposit" / Primary buttons.
    *   **Success/Status**: Neon Green (e.g., `#10B981`) - used for "Live" badges, "Hub" toggle.
    *   **Text**: White for headings, Light Gray (Slate-400) for secondary text.
*   **Layout Structure**:
    *   **Sidebar Navigation**: Fixed left sidebar. Dark background. Simple line icons + text.
    *   **Top Header**: Minimalist. Contains global actions (Settings, Notifications, Profile).
    *   **Main Content Area**: Spacious. Uses "Cards" to group information.
*   **Typography**: Clean, modern sans-serif (Inter or JetBrains Mono for data).

## Target Audience & User Personas
(Unchanged - Customers, Lab Techs, Doctors, Admins)

## Key UI Components to Redesign

### 1. The Dashboard Layout
*   **Sidebar**: Needs to match the reference. Logo at top left. Navigation links (Dashboard, Journal, Accounts, etc.) with consistent spacing.
*   **Header**: Needs to align with the content area.
*   **Welcome Section**: Large "Hello, [User]!" greeting.
*   **AI Insight / Status Bar**: A text ticker or highlight section below the greeting (as seen in the image).

### 2. Data Presentation
*   **Tables**: The reference shows a very clean table style.
    *   Dark headers.
    *   Row hover effects.
    *   Clear separation of columns.
    *   "Action" buttons within rows (three dots `...`).
*   **Cards**: "Trading Platforms" style cards. Dark background, rounded corners, distinct CTA buttons.

### 3. Action Buttons
*   **Primary**: Solid Blue background, White text, rounded corners.
*   **Secondary**: Outlined or dark gray background.

## Technical Implementation Plan
*   **Tailwind Config**: Update `tailwind.config.ts` to define the new color palette (Backgrounds, Accents).
*   **Global CSS**: Set default background color to the dark theme base.
*   **Shadcn UI**: Customize the `globals.css` CSS variables to map Shadcn components (Cards, Popovers, Inputs) to this new dark theme.
*   **Layout Component**: Refactor `LayoutShell`, `SideNav`, and `TopNav` to match the structural layout of the reference image.

## Deliverables
1.  **Theme Update**: Apply the dark theme globally.
2.  **Layout Overhaul**: Match the Sidebar/Header structure.
3.  **Dashboard Redesign**: Rebuild the Customer Dashboard to look like the "TradeHub" dashboard.
