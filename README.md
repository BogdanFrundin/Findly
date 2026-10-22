# FINDLY

AI-пошук одягу в українських магазинах (Kasta, Intertop, Answear, Mango, COS).
Один код — сайт (Next.js) + мобільні застосунки iOS/Android (Capacitor).

- Сайт: https://findly-inky.vercel.app
- Макет (клікабельний прототип): https://findly-inky.vercel.app/mockup

## Запуск локально

```bash
npm install
npm run dev        # http://localhost:3000
```

## Структура

| Шлях | Що це |
|---|---|
| `app/` | сторінки: `/`, `/search`, `/results`, `/product/[id]`, `/looks`, `/assistant`, `/photo`, `/wishlist`, `/w/[slug]`, `/cart`, `/profile`, `/alerts`, `/pro` |
| `app/api/search` | пошук по каталогу (GET `?q=`) |
| `app/api/assistant` | AI-асистентка (POST). Працює з Claude, якщо задано `ANTHROPIC_API_KEY`, інакше — вбудований розбір запиту |
| `components/` | шапка, таб-бар, модалки, картки товарів, стан застосунку |
| `lib/` | каталог, пошук, образи, ілюстрації, імпорт фідів |
| `data/products.json` | **демо-каталог** (35 речей) |
| `public/mockup/` | макет |

## Реальні товари (після домовленостей із брендами)

Магазини зазвичай дають YML/XML-фід (через партнерські мережі Admitad, SalesDoubler тощо).

```bash
node scripts/import-feed.mjs --store Kasta --url https://.../feed.xml
node scripts/import-feed.mjs --store Mango --file ./mango.xml --append
```

Скрипт перезаписує `data/products.json` (з `--append` — додає). У поле `url` кладіть партнерське посилання — так рахується комісія. Коли товарів стане багато, каталог варто перенести в базу (Supabase/Postgres) — формат `Product` у `lib/types.ts` уже готовий.

## Змінні середовища (Vercel → Settings → Environment Variables)

```
ANTHROPIC_API_KEY=      # необовʼязково, вмикає справжню AI-асистентку
ANTHROPIC_MODEL=claude-haiku-5-5
```

## Мобільні застосунки (App Store / Google Play)

Потрібен Mac з Xcode (для iOS) і Android Studio (для Android).

```bash
npm install
npx cap add ios
npx cap add android
npm run cap:ios        # відкриє Xcode
npm run cap:android    # відкриє Android Studio
```

Застосунок завантажує сайт із `FINDLY_URL` (за замовчуванням findly-inky.vercel.app), тож оновлення сайту одразу видно в застосунку.

**Важливо для App Store:** Apple може відхилити застосунок, який є просто «обгорткою сайту» (правило 4.2). Перед подачею варто додати нативне: push-сповіщення про ціну, камеру для пошуку за фото, «Поділитися», вхід через Apple.

## Що поки заглушки

- Вхід, PRO-підписка, Telegram-бот — демо (стан зберігається в браузері).
- Контакти у футері та текст «Наша історія» — замінити на справжні.
- Фото товарів — ілюстрації; з фідів підтягнуться реальні фото.
