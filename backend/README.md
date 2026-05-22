# Backend - Item Manager Lab Test

## Setup
1. Open a terminal inside the backend folder.
2. Run:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env`
4. Update `MONGO_URI` if needed.
5. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `GET /api/items`
- `GET /api/items/:id`
- `POST /api/items`
- `PUT /api/items/:id`
- `DELETE /api/items/:id`

---

## 🚀 Deploying to Railway

Railway is a premium cloud platform that makes it extremely easy to host your Node.js backend. 

### Step 1: Push Code to GitHub
Make sure all your changes (including the root-level `railway.json`) are committed and pushed to your GitHub repository.

### Step 2: Create a Railway Project
1. Log in to [Railway.app](https://railway.app).
2. Click **New Project** in the upper-right corner.
3. Select **Deploy from GitHub repo**.
4. Choose your repository: `WMT_LabTest_Project`.
5. Click **Deploy Now**.
6. **Set Root Directory**:
   - Once the project is created, click on the **backend** service card.
   - Go to the **Settings** tab.
   - Scroll down to the **Build** section, find **Root Directory**, and set it to `/backend`.
   - Click **Save**. Railway will automatically trigger a new, successful build!

### Step 3: Add MongoDB Environment Variable
1. Click on the **backend** service card on your Railway dashboard.
2. Go to the **Variables** tab.
3. Click **New Variable** and add:
   - **Key**: `MONGO_URI`
   - **Value**: `mongodb+srv://Sadinsa:dilSadi2004%40@cluster0.hbla3w9.mongodb.net/item_manager?retryWrites=true&w=majority`
4. Click **Add** to save. Railway will automatically redeploy the backend with the new database configuration.

### Step 4: Get Your Backend Live Link
1. Click on the **backend** service card on your Railway dashboard.
2. Go to the **Settings** tab.
3. Scroll down to the **Networking** section.
4. Click the **Generate Domain** button.
5. Railway will immediately generate a public, secure URL for your API (e.g., `https://backend-production-xxxx.up.railway.app`).
6. **Your final API URL** is this domain plus `/api` (e.g., `https://backend-production-xxxx.up.railway.app/api`).

### Step 5: Link Frontend in Netlify
1. Go to your frontend project settings in [Netlify](https://www.netlify.com).
2. Under **Site configuration** -> **Environment variables**, set or update:
   - **Key**: `VITE_API_URL`
   - **Value**: *Your new Railway API URL* (e.g., `https://backend-production-xxxx.up.railway.app/api`)
3. Trigger a new deploy in Netlify (**Deploys** -> **Trigger deploy** -> **Clear cache and deploy site**) to apply the update.

