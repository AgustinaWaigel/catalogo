# Tienda multirubro

La tienda de Alas de Ángel, preparada para cualquier rubro. El sistema completo (catálogo, bolsita, pagos con
Mercado Pago, envíos, cupones, panel, mails) es el mismo; lo que cambia de una tienda a otra sale de
**variables de entorno**.

## Cómo elegir el rubro

Cada archivo de esta carpeta es un rubro completo: nombre, textos, contacto, colores, tipografías y estilo.

| Archivo | Ejemplo |
| --- | --- |
| `papeleria.env` | Alas de Ángel, tal cual el diseño original |
| `gastronomia.env` | Viandas y cocina casera |
| `indumentaria.env` | Ropa, minimalista, sin redondeos ni sombras |
| `belleza.env` | Cosmética natural, serif elegante |
| `mascotas.env` | Pet shop, colores alegres y bordes gruesos |
| `tecnologia.env` | Accesorios, oscuro con acento lima |
| `generico.env` | La base neutra para cualquier otro rubro |

En `.env.local` (o en las variables de Vercel) poné:

```
RUBRO=gastronomia
```

Cualquier variable del archivo del rubro se puede pisar ahí mismo, una por una:

```
RUBRO=gastronomia
MARCA_NOMBRE="Rotisería Don Pepe"
COLOR_PRINCIPAL="#1F5FA0"
FUENTE_TITULOS="Bricolage Grotesque"
```

Para probar rubros en tu compu sin tocar `.env.local`:

```
npm run dev:gastronomia
npm run rubro -- tecnologia build
```

## Un rubro que no está en la lista

No hace falta tocar el código. Hay dos caminos:

- **Solo con variables** (lo más rápido, ideal desde Vercel): poné `RUBRO=ferreteria` (o el que sea). Como no
  existe `rubros/ferreteria.env`, la tienda arranca con `generico.env` y vos completás lo que quieras cambiar:
  `MARCA_NOMBRE`, `COLOR_PRINCIPAL`, `ESTILO_DISENO`, etc.
- **Con su propio archivo**: copiá `generico.env` como `rubros/ferreteria.env`, editalo y poné
  `RUBRO=ferreteria`.

**Categorías, secciones y productos no van en las variables:** cada tienda los carga desde su panel
(`/admin` → Categorías, Secciones y Productos). Así una ferretería crea "Herramientas", "Bulonería",
"Pinturas"… y una rotisería "Viandas", "Tartas", "Postres", sin tocar nada más. Los productos sin foto
muestran la inicial de su nombre sobre su color (`PRODUCTO_SIN_FOTO`).

## Estilos de diseño

`ESTILO_DISENO` cambia la personalidad completa del sitio, más allá de los colores:

| Estilo | Cómo se ve |
| --- | --- |
| `artesanal` | El de Alas de Ángel: bordes marcados, sombra de sello, cintas de washi tape en las fichas, papelitos torcidos, notas escritas a mano, patrón dibujado en la portada. |
| `moderno` | Limpio y suave: sin trazos de dibujo ni giros, bordes casi invisibles, sombras difusas, esquinas redondeadas, notas como etiquetas chicas. |
| `minimalista` | Casi sin decoración: portada clara, fichas sin caja (foto y texto), líneas finas, sin sombras, todo en un mismo tono. |
| `audaz` | Bloques de color planos, bordes gruesos, sombra dura y recta, etiquetas tipo cartel. |

Cada estilo trae sus radios, grosor de línea, sombra y mayúsculas; si querés ajustar uno (por ejemplo un
`moderno` con esquinas rectas) completá `ESTILO_RADIO`, `ESTILO_SOMBRA`, `TITULOS_MAYUSCULAS`, etc. Los
estilos están en `app/estilos.css`.

## Qué controla cada grupo de variables

- **MARCA_*** — nombre, rubro (el subtítulo del logo), lema, descripción para Google, la nota a mano, el
  resumen de tarjeta de Mercado Pago, el logo (`alas`, `inicial` o una imagen de `/public`), el dibujo de la
  portada (`alas`, `logo`, `ninguno` o una imagen) y la cabecera de los mails.
- **PORTADA_*** — el título grande de Inicio, la palabra resaltada, el texto y el bloque de destacados.
- **CATALOGO_*** — la dirección de la página de productos (`/papeleria`, `/menu`, `/tienda`…; la vieja redirige
  sola), su nombre, su encabezado y el texto del botón.
- **SECCIONES_ABIERTAS** — qué secciones existen: `descargables`, `personalizados`, `packs`, `ideas`, `listas`,
  `por-mayor`. Las que no estén no aparecen en ningún lado.
- **CONTACTO_*** — WhatsApp, mail, Instagram y TikTok (vacío = no se muestra).
- **COLOR_*** — 14 colores. Los más importantes: `COLOR_FONDO` (fondo de página), `COLOR_TEXTO` (texto, bordes y
  pie), `COLOR_PRINCIPAL` (portada y logo), `COLOR_PRINCIPAL_FUERTE` (links y botones) y `COLOR_ACENTO` (los
  resaltes y el botón de la portada, con texto en principal fuerte encima).
- **FUENTE_*** — cualquier familia de Google Fonts, escrita igual que en fonts.google.com. `FUENTE_MANO` vacía
  usa la de etiquetas en cursiva. `TITULOS_MAYUSCULAS` y `TEXTO_ESCALA` ajustan los títulos y el tamaño general.
- **ESTILO_DISENO** — el estilo de diseño (ver arriba).
- **ESTILO_*** — ajustes finos del estilo: radios de esquinas, grosor de línea, tipo de sombra (`sello`, `suave`, `ninguna`), el patrón
  dibujado de la portada y el ancho máximo.

Cómo funciona por dentro: `next.config.ts` lee el rubro y lo pasa como `env`; `lib/marca.ts` lo ordena;
`lib/tema.ts` lo convierte en las variables CSS de `marca/tokens.css` y en los links de Google Fonts
(lo inserta `app/layout.tsx`). El CSS de `app/sitio.css` no tiene ningún valor de marca fijo.

## Lo que conviene revisar a mano en cada rubro

- **Textos largos**: Sobre nosotras, Preguntas frecuentes y Términos todavía hablan de papelería (con el nombre
  de la tienda ya cambiado). Reescribilos para el rubro nuevo.
- **"Bolsita"**: el carrito se llama así en todo el sitio.
- **Supabase, Mercado Pago, Gmail y Correo**: cada tienda necesita su propio proyecto y credenciales
  (ver `.env.example` y `supabase/LEEME.md`).
