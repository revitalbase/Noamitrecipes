# 🍳 מתכונים שבא לנו

## 🚀 הפעלה בדקות — קבלת URL חי

### שלב 1 — מפתח API של Anthropic
1. כנסי ל-[console.anthropic.com](https://console.anthropic.com)
2. לחצי **API Keys** → **Create Key**
3. העתיקי את המפתח (מתחיל ב-`sk-ant-...`)

---

### שלב 2 — העלי ל-GitHub
1. כנסי ל-[github.com](https://github.com) וצרי חשבון (חינם)
2. לחצי **New Repository** → שם: `recipe-app` → **Public** → **Create**
3. גרירת כל הקבצים מהתיקייה לתוך GitHub (או השתמשי ב-Upload files)

---

### שלב 3 — Deploy ב-Vercel (חינם, אוטומטי)
1. כנסי ל-[vercel.com](https://vercel.com) → **Sign up with GitHub**
2. לחצי **New Project** → בחרי את `recipe-app`
3. לפני לחיצת Deploy — לחצי **Environment Variables**:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** המפתח שהעתקת (sk-ant-...)
4. לחצי **Deploy**

✅ תקבלי URL כמו: `https://recipe-app-xxx.vercel.app`

---

### שלב 4 — שיתוף
שלחי את הURL לנעם, עמית, רוי וחברים — עובד מכל מכשיר!

---

## 💾 שמירת מתכונים
המתכונים נשמרים ב-`localStorage` של כל דפדפן בנפרד.
לשיתוף מתכונים בין מכשירים — השתמשי בכפתורי **💾 גיבוי** / **📂 שחזור** שבאתר.

---

## 📁 מבנה הפרויקט
```
recipe-app/
├── api/
│   └── claude.js      ← proxy לאנתרופיק (מסתיר את מפתח ה-API)
├── public/
│   └── index.html     ← האפליקציה המלאה
└── vercel.json        ← הגדרות deploy
```
