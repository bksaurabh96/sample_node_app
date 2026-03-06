# intv_test_app

Node.js sample app to test discrete Azure services from a simple web API.

This repo currently contains:

- A minimal **Node.js/Express** web API (`server.js`)
- Integration with **Azure Database for PostgreSQL** using the `pg` driver
- A **GitHub Actions** workflow to build and deploy the app to an **Azure App Service**

---

## Prerequisites

- Node.js 18 or later
- An Azure subscription
- An **Azure App Service** for Node
- An **Azure Database for PostgreSQL** server and database
- A GitHub repository connected to this code

---

## Local development

1. **Install dependencies**

```bash
npm install
```

2. **Create a `.env` file** (do not commit this file) with either:

```bash
POSTGRES_CONNECTION_STRING=postgresql://username:password@yourserver.postgres.database.azure.com:5432/yourdb?sslmode=require
```

or separate fields:

```bash
POSTGRES_HOST=yourserver.postgres.database.azure.com
POSTGRES_PORT=5432
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_DB=yourdb
```

3. **Run the app**

```bash
npm run dev
```

The server listens on `http://localhost:3000` by default.

Useful endpoints:

- `/` – simple text response to verify the app is running
- `/health` – basic health check
- `/db-time` – queries `SELECT NOW()` from PostgreSQL to verify DB connectivity

---

## Azure configuration

### 1. App Service settings

In the Azure Portal, for your App Service:

- Go to **Configuration → Application settings**
- Add either:
  - `POSTGRES_CONNECTION_STRING` with your full PostgreSQL connection string (include `sslmode=require`)
  - or the separate variables: `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- Save and restart the App Service

### 2. PostgreSQL

Ensure that:

- The database exists and the user has permission to connect and run queries
- Network/firewall rules allow the App Service to reach the database
- SSL is enabled (Azure Database for PostgreSQL typically requires it)

---

## GitHub Actions deployment (CI/CD)

This repo includes a GitHub Actions workflow at:

- `.github/workflows/deploy-node-azure-webapp.yml`

The workflow:

- Triggers on pushes to the `main` branch
- Checks out the code
- Sets up Node.js
- Installs dependencies
- Deploys the app to an Azure App Service

### Required GitHub secret

Create a secret in your GitHub repository:

- `AZURE_WEBAPP_PUBLISH_PROFILE` – the contents of the publish profile XML you download from the Azure Portal for your App Service.

### Key workflow environment variables

Inside `.github/workflows/deploy-node-azure-webapp.yml`, update:

- `AZURE_WEBAPP_NAME` – the name of your App Service
- `NODE_VERSION` – Node version used to build the app (should match or be compatible with your App Service runtime)

Once configured, pushing to `main` will automatically build and deploy the Node.js app to your Azure App Service.

---

## Folder structure (simplified)

```text
intv_test_app/
  server.js                    # Express app + Postgres integration
  package.json                 # Node.js project configuration
  package-lock.json
  .gitignore
  .github/
    workflows/
      deploy-node-azure-webapp.yml  # GitHub Actions workflow for Azure App Service
  README.md
```

You can extend this sample by adding more routes in `server.js` or splitting code into additional modules as the app grows.