# PokerApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## Overview
This program is designed to allow users to input community cards and hole cards for each player, then output a ranked list of players based on the strength of their hands. The primary focus is on creating an intuitive UI to showcase the skills in designing and implementing a responsive and visually appealing application.

## Setup/Usage Guide
1. Prerequisites
    1. Install Node.js and npm. https://nodejs.org/en
    2. Install Angular CLI: `npm install -g @angular/cli` (run in cmd)
2. Clone the repository
    1. `git clone [URL]`
3. Install Dependencies
    1. `npm i`
4. Run the application
    1. Run `ng serve`/`npm start` for a dev server. Navigate to `http://localhost:4200/`

## Usage
- Main Page
The main page shows the community table, player zone and 3 buttons.
- Exit: Clears the input data
- Add/Modify Input: Opens a modal which allows user to manipulate the community cards, players and their hands.
- Calculate: Based on the current input, generates the ranking of players based on their hands.

- The Add/Modify Input Modal is launched on clicking the Add/Modify Input button on the main page.
- This modal allows the user to add new players, modify their hands and the cards in the community table.
- The Ranking Modal is launched on clicking the Calculate Button on the main page.
- This modal shows the rankings of players based on their hands and community table cards.

## Code Structure(overview)
- The applicatio launches on the dashboard component, which incorportaes community-table and player-zone components.
- Dashboard also uses dynamic-modal to display the modify-input-modal-content and rank-modal components.
- These components use data, hand-check and poker services, placed under the shared/services folder, 
  for data sharing and performing various functions.

## License
Unlicensed

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
