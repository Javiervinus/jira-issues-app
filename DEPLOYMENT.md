# 🚀 Guía de Despliegue - Dashboard JIRA

## Variables de Entorno en Producción

Para que las imágenes Open Graph funcionen correctamente en producción, necesitas configurar las siguientes variables de entorno en Vercel:

### Requeridas (ya configuradas)
- `JIRA_USER` - Tu email de JIRA
- `JIRA_TOKEN` - Tu token de API de JIRA

### Opcional pero Recomendada
- `NEXT_PUBLIC_BASE_URL` - URL base de tu aplicación en producción

## Configuración en Vercel

### Opción 1: Automática (Recomendada)
Si no configuras `NEXT_PUBLIC_BASE_URL`, la aplicación usará automáticamente la variable `VERCEL_URL` que Vercel proporciona por defecto.

### Opción 2: Manual
Si quieres mayor control, puedes configurar manualmente:

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Navega a **Settings** → **Environment Variables**
3. Agrega:
   ```
   NEXT_PUBLIC_BASE_URL = https://tu-dominio.vercel.app
   ```

## Funcionalidades por Entorno

### Desarrollo (`NODE_ENV=development`)
- ✅ Botón "Ver Preview OG" visible en la esquina inferior derecha
- ✅ Logs de debug en consola
- ✅ API OG funcional en `http://localhost:5200/api/og`

### Producción (`NODE_ENV=production`)
- ❌ Botón "Ver Preview OG" oculto automáticamente
- ❌ Logs de debug deshabilitados
- ✅ API OG funcional con URL de producción
- ✅ Metadatos SEO y Open Graph dinámicos

## Verificación del Despliegue

### 1. Comprobar que la imagen OG se genera
Visita directamente: `https://tu-dominio.vercel.app/api/og?sprint=Test`

### 2. Verificar metadatos en redes sociales
Usa herramientas como:
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### 3. Verificar que el botón preview no aparece
El botón "Ver Preview OG" no debería aparecer en la versión de producción.

## Solución de Problemas

### La imagen OG no se muestra al compartir
1. Verifica que `NEXT_PUBLIC_BASE_URL` esté configurada o que `VERCEL_URL` esté disponible
2. Prueba la URL de la imagen directamente: `https://tu-dominio.vercel.app/api/og?sprint=Test`
3. Usa los validadores de redes sociales para hacer flush de la caché

### El botón "Ver Preview OG" aparece en producción
1. Verifica que `NODE_ENV=production` en los logs de Vercel
2. Asegúrate de que el build se haya desplegado correctamente

## URLs de Ejemplo

### Desarrollo
- Dashboard: `http://localhost:5200`
- API OG: `http://localhost:5200/api/og?sprint=117&dates=test&updated=now&status=active`

### Producción
- Dashboard: `https://tu-dominio.vercel.app`
- API OG: `https://tu-dominio.vercel.app/api/og?sprint=117&dates=test&updated=now&status=active`
