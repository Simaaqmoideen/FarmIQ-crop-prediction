# FarmIQ — Basic Authentication Implementation

## Overview
We will implement a simple authentication system using standard React Context and simulated login APIs, which is often preferred for SIH completely self-contained hackathon deployments. 

## To-Do List

- [ ] Create `AuthContext.tsx` provider
- [ ] Create `/login` page with nice UI matching our dark agricultural theme
- [ ] Create `/register` page
- [ ] Update Navbar to show user profile / logout button
- [ ] Protect `/upload` page (only logged-in users can upload Kaggle datasets)
- [ ] Protect main dashboard (optional, or just personalized history)

## Architecture

We will simulate a backend authentication flow since no database was requested for users yet, allowing anyone to register immediately and login to test the platform.
