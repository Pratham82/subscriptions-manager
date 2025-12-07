# Troubleshooting Google OAuth "Failed to get OAuth URL"

## Common Causes

### 1. Google Provider Not Enabled in Supabase ⚠️ (Most Common)

**Check:**

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Google** in the list
3. Make sure the toggle is **ON** (enabled)
4. If it's off, click to enable it

**Fix:**

- Enable the Google provider toggle
- You'll need to add Google OAuth credentials (see step 2)

---

### 2. Missing Google OAuth Credentials

**Check:**

1. In Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. Verify that **Client ID** and **Client Secret** fields are filled in

**Fix:**
If fields are empty, you need to:

1. **Get Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project (or create one)
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Choose **Web application**
   - Add **Authorized redirect URI**:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
   - Replace `YOUR_PROJECT_REF` with your actual Supabase project reference
   - Copy the **Client ID** and **Client Secret**

2. **Add to Supabase:**
   - Paste Client ID and Client Secret into Supabase Dashboard
   - Click **Save**

---

### 3. Redirect URL Not Configured

**Check:**

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, verify you have:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```

**Fix:**

- Add the redirect URL if it's missing
- Make sure it matches exactly (including `https://` and `/auth/v1/callback`)

---

### 4. Supabase Project Paused

**Check:**

- In Supabase Dashboard, check if your project status shows as "Paused"

**Fix:**

- If paused, you need to resume/activate your project
- Free tier projects can pause after inactivity

---

### 5. Environment Variables Missing

**Check:**

- Verify your `.env.local` file has:
  ```
  EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
  EXPO_PUBLIC_SUPABASE_KEY=your_anon_key_here
  ```

**Fix:**

- Make sure both variables are set
- Restart your Expo dev server after changing `.env.local`
- Run: `npx expo start --clear`

---

## Quick Diagnostic Steps

1. **Check Console Logs:**
   - Look for "OAuth response - data:" in your console
   - This will show what Supabase is returning

2. **Verify Supabase Dashboard:**
   - Authentication → Providers → Google → **Enabled** ✅
   - Authentication → Providers → Google → **Client ID** filled ✅
   - Authentication → Providers → Google → **Client Secret** filled ✅
   - Authentication → URL Configuration → Redirect URL added ✅

3. **Test in Supabase Dashboard:**
   - Try using the Supabase Auth test page
   - If it works there but not in your app, it's likely an app configuration issue

---

## Most Likely Issue

**90% of the time**, this error means:

- ❌ Google provider is **NOT enabled** in Supabase Dashboard
- OR
- ❌ Google OAuth credentials are **missing or incorrect**

**Quick Fix:**

1. Go to Supabase Dashboard
2. Authentication → Providers → Google
3. Enable the toggle
4. Add your Google Client ID and Secret
5. Save
6. Try again

---

## Still Not Working?

Check the console logs for:

- "OAuth response - data:" - This shows what Supabase returned
- "OAuth response - error:" - This shows any error from Supabase

Share these logs if you need further help!
