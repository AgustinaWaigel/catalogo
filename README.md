# Catálogo — tienda online multirubro

Tienda completa (catálogo, bolsita, pago con Mercado Pago o por WhatsApp, envíos, cupones, panel de
administración y mails) hecha a partir del sitio de Alas de Ángel Papelería, lista para cualquier rubro.

Todo lo que cambia de una tienda a otra —nombre, textos, contacto, colores, tipografías, radios, sombras y
secciones— sale de variables de entorno.

## Empezar

```bash
npm install
cp .env.example .env.local   # completá Supabase y elegí el RUBRO
npm run dev                  # o npm run dev:gastronomia, dev:indumentaria, dev:belleza, dev:mascotas, dev:tecnologia
```

- Rubros, variables y cómo armar uno nuevo: [`rubros/LEEME.md`](rubros/LEEME.md)
- Base de datos, pagos, mails y envíos: [`supabase/LEEME.md`](supabase/LEEME.md)
