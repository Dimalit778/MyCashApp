// jobs:
//   cypress-run:
//     runs-on: ubuntu-24.04
//     env:
//       REACT_APP_TEST_API_URL: "http://localhost:3000"
//       REACT_APP_BASE_URL: "http://localhost:5001"
//     steps:
//       - name: Checkout
//         uses: actions/checkout@v4

//       - name: Install frontend dependencies
//         working-directory: frontend
//         run: npm install --legacy-peer-deps

//       - name: Install backend dependencies
//         working-directory: backend
//         run: npm install

//       - name: Cypress run
//         uses: cypress-io/github-action@v6
//         with:
//           working-directory: frontend
//           install: false # Skip installation as we've already done it
//           # build: npm run build
//           start: npm run test:mode
