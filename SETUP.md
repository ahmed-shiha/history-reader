# إعداد التطبيق — خطوات النشر

## الخطوة 1 — Supabase (قاعدة البيانات)

1. افتح [supabase.com](https://supabase.com) وأنشئ حساباً مجانياً
2. اضغط **New Project** وسمِّه `history-reader`
3. بعد إنشاء المشروع، اذهب إلى **SQL Editor** واضغط **New Query**
4. انسخ محتوى [`supabase/schema.sql`](supabase/schema.sql) والصقه ثم اضغط **Run**
5. (اختياري) لإضافة بيانات تجريبية: كرِّر نفس الخطوة مع [`supabase/seed.sql`](supabase/seed.sql)
6. اذهب إلى **Project Settings → API** وانسخ:
   - **Project URL** → هذا هو `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → هذا هو `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## الخطوة 2 — GitHub

1. افتح [github.com/new](https://github.com/new) وأنشئ مستودعاً جديداً اسمه `history-reader`
2. **لا تُضِف** README أو .gitignore (الكود جاهز)
3. في Terminal داخل هذا المجلد (`history-reader`):

```bash
git remote add origin https://github.com/YOUR_USERNAME/history-reader.git
git branch -M main
git push -u origin main
```

استبدل `YOUR_USERNAME` باسم مستخدمك في GitHub.

---

## الخطوة 3 — Vercel (النشر)

1. افتح [vercel.com](https://vercel.com) وسجِّل الدخول بحساب GitHub
2. اضغط **Add New → Project**
3. اختر مستودع `history-reader`
4. في قسم **Environment Variables** أضف:
   ```
   NEXT_PUBLIC_SUPABASE_URL     = (القيمة من الخطوة 1)
   NEXT_PUBLIC_SUPABASE_ANON_KEY = (القيمة من الخطوة 1)
   ```
5. اضغط **Deploy**

بعد اكتمال النشر ستحصل على رابط مثل `https://history-reader.vercel.app`

---

## الخطوة 4 — التطوير المحلي

```bash
# 1. أنشئ ملف البيئة المحلي
cp .env.local.example .env.local
# ثم افتح .env.local وأضف القيم من Supabase

# 2. شغِّل الخادم المحلي
npm run dev
```

افتح المتصفح على `http://localhost:3000`

---

## سير العمل بعد الإعداد

كلَّما أجريتَ تعديلاً:

```bash
git add .
git commit -m "وصف التعديل"
git push
```

Vercel يكتشف الـ push تلقائياً وينشر النسخة الجديدة خلال ~30 ثانية.

---

## هيكل الملفات المهمَّة

```
history-reader/
├── content/articles/          ← المقالات (MDX)
│   └── pythagoras-monochord.mdx
├── app/
│   ├── articles/[slug]/       ← صفحة قراءة المقالة
│   ├── notes/                 ← صفحة جميع الملاحظات
│   └── api/notes/             ← API لقاعدة البيانات
├── components/
│   ├── NotesSidebar.tsx       ← الشريط الجانبي للملاحظات
│   ├── SelectionPopup.tsx     ← نافذة تحديد النص
│   └── NoteModal.tsx          ← نموذج إضافة الملاحظة
└── supabase/
    ├── schema.sql             ← بنية قاعدة البيانات
    └── seed.sql               ← بيانات تجريبية
```

## إضافة مقالة جديدة

1. أنشئ ملف `content/articles/slug-name.mdx` بنفس صيغة frontmatter الموجود
2. أضف بطاقته في `app/page.tsx` في مصفوفة `articles`
3. Push → Vercel ينشر تلقائياً
