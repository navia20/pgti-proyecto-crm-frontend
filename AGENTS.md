# AGENTS.md - Estado del Proyecto CRM

## Resumen
Sistema CRM con tickets, clientes, dashboard y módulo de soporte con analíticas.

## Stack
- **Backend**: NestJS + TypeORM + PostgreSQL (remoto en 161.153.203.46:5433)
- **Frontend**: Next.js 16 con App Router
- **Puertos**: Backend 3001, Frontend 3000

## Módulos Activos
- **Dashboard** → Vista de acción: KPIs, SLA alerts, tabla 10 tickets
- **Tickets** → Gestión completa con filtrado, paginación (PAGE_SIZE=15), búsqueda
- **Clientes** → Listado, perfil, crear/editar clientes
- **Duplicados** → (pendiente)
- **Soporte** → Analytics puro: tendencia, prioridad, fuente, actividad mensajes

## Módulos Deshabilitados
- Analytics e Incidentes (commented out)

## Endpoints Clave
- `POST /api/v1/tickets/externo` - Creación externa con x-api-key
- `GET /api/v1/tickets` - Listado con filtros query params
- `GET /api/v1/reportes/metricas/tendencia?dias=7`
- `GET /api/v1/reportes/metricas/prioridad`
- `GET /api/v1/reportes/metricas/interacciones-tipo`

## SLA por Prioridad
- Crítica: 4h, Alta: 8h, Media: 24h, Baja: 48h

## Guías de Integración
- `docs/guia-integracion-pedidos.md` v1.2
- `docs/guia-integracion-suscripciones.md` v1.2
- `docs/guia-integracion-salud.md` v1.1

## Comandos de Verificación
```bash
# Frontend
cd pgti-proyecto-crm-frontend; npx tsc --noEmit

# Backend
cd pgti-proyecto-crm-backend; npx tsc --noEmit
```

## Convenciones
- `synchronize: true` en TypeORM auto-crea/actualiza schema
- Entidades en `src/*/entities/`, DTOs en `src/*/dtos/`
- Componentes frontend en `app/components/`, páginas en `app/pages/`
- Sin comentarios en código a menos que se solicite
