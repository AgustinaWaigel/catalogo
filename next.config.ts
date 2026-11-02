import type { NextConfig } from "next";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

// Las fotos subidas desde el panel se sirven desde Supabase Storage.
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL) : null;

/* ── Multirubro ──
   RUBRO elige el archivo rubros/<rubro>.env. Si no existe (un rubro que no está en la carpeta), se usa
   rubros/generico.env y la tienda se arma con las variables que pongas en .env.local o en Vercel.
   Cada variable se puede pisar una por una desde ahí. El resultado va en `env`: así llega tanto al
   servidor como al navegador, sin el prefijo NEXT_PUBLIC_. */
const RUBRO = (process.env.RUBRO || "papeleria").trim().toLowerCase();
const CARPETA = path.join(process.cwd(), "rubros");

function leerRubro(nombre: string): Record<string, string> | null {
  let texto: string;
  try {
    texto = readFileSync(path.join(CARPETA, `${nombre}.env`), "utf8");
  } catch {
    return null;
  }
  const valores: Record<string, string> = {};
  for (const linea of texto.split(/\r?\n/)) {
    const m = linea.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let valor = m[2];
    const comillas = valor.match(/^(["'])(.*?)\1\s*(#.*)?$/);
    valor = comillas ? comillas[2] : valor.replace(/\s+#.*$/, "");
    valores[m[1]] = valor;
  }
  return valores;
}

const delRubro = leerRubro(RUBRO) ?? leerRubro("generico") ?? {};
// Todas las variables que existen en algún rubro (también las comentadas): así se pueden definir desde
// Vercel aunque el archivo del rubro no las traiga.
const claves = new Set<string>(Object.keys(delRubro));
for (const archivo of readdirSync(CARPETA).filter((a) => a.endsWith(".env")))
  for (const m of readFileSync(path.join(CARPETA, archivo), "utf8").matchAll(/^\s*#?\s*([A-Z][A-Z0-9_]*)=/gm)) claves.add(m[1]);

const marca: Record<string, string> = { RUBRO };
for (const clave of claves) {
  const valor = process.env[clave] ?? delRubro[clave];
  if (valor !== undefined) marca[clave] = valor;
}

// La página de productos físicos vive en app/(tienda)/papeleria; con otro CATALOGO_RUTA se la sirve en esa dirección.
const rutaCatalogo = (marca.CATALOGO_RUTA || "papeleria").replace(/^\/+|\/+$/g, "");

const nextConfig: NextConfig = {
  env: marca,
  async rewrites() {
    return rutaCatalogo === "papeleria" ? [] : [{ source: `/${rutaCatalogo}`, destination: "/papeleria" }];
  },
  async redirects() {
    return rutaCatalogo === "papeleria" ? [] : [{ source: "/papeleria", destination: `/${rutaCatalogo}`, permanent: false }];
  },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: supabase
      ? [{ protocol: "https", hostname: supabase.hostname, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  async headers() {
    return [
      {
        // En todo el sitio: nadie puede meterlo adentro de otra página (para engañar clics), el navegador
        // no adivina tipos de archivo, y a otros sitios solo les llega el dominio, nunca la dirección
        // completa (así el link privado de un pedido no viaja a WhatsApp o Instagram al tocar un enlace).
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // El panel, los pedidos y los avisos de pago no van a Google (además de robots.txt).
        source: "/:seccion(admin|pedido|api)/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      { source: "/admin", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
  experimental: {
    // Las fotos llegan al panel por una acción de servidor: el límite por defecto (1 MB) queda corto.
    // 10 MB es también lo que proxy.ts deja pasar (proxyClientMaxBodySize).
    serverActions: { bodySizeLimit: "10mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
