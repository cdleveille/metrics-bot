# metrics-bot

## Prerequisites

-   [Node.js](https://nodejs.org/en/download/)
-   [Visual Studio Code](https://code.visualstudio.com/download)
-   [Visual Studio Code Docker Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
-   [Docker Desktop](https://www.docker.com/)

## Setup

-   Install package dependencies: `npm install`
-   Create a `.env` file in project root and populate with the `BOT_TOKEN` from Discord Developer Portal.
-   Optionally, provide a `MONGO_URI` to connect to a MongoDB instance. If not provided, a local Docker container will be used instead.
-   Launch Docker Desktop. In VS Code, right-click `.metrics-bot-dev-container\docker-compose.yml` and select `Compose Up` to initialize database container.
-   Press `F5` or run `npm run dev` to run in dev mode (restarts on file save).
