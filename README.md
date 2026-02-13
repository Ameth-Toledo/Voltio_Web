```markdown
# <img src="https://raw.githubusercontent.com/Ameth-Toledo/Voltio_Web/main/public/assets/voltio.png" width="30" alt="Voltio" /> Voltio

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Scripts Disponibles](#scripts-disponibles)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Flujo de Trabajo con Git](#flujo-de-trabajo-con-git)
- [Nomenclatura de Ramas](#nomenclatura-de-ramas)
- [Pull Requests](#pull-requests)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías](#tecnologías)

---

## 🔧 Requisitos Previos

- **Node.js**: v18 o superior
- **npm**: v9 o superior
- **Angular CLI**: v18.2.21

```bash
# Verifica tus versiones
node --version
npm --version
ng version
```

---

## 🚀 Instalación

1. **Clona el repositorio:**

```bash
git clone https://github.com/tu-usuario/voltio.git
cd voltio
```

2. **Instala las dependencias:**

```bash
npm install --legacy-peer-deps
```

> **Nota:** Usamos `--legacy-peer-deps` debido a conflictos de versiones entre dependencias de ESLint.

3. **Crea tu archivo de configuración local:**

```bash
# El archivo environment.development.ts ya existe como plantilla
# Copia y personaliza environment.ts para tu entorno local
cp src/environments/environment.development.ts src/environments/environment.ts
```

Edita `src/environments/environment.ts` con tus credenciales:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080' // Cambia esto a tu API local
};
```

> ⚠️ **IMPORTANTE:** Nunca subas `environment.ts` con credenciales reales a GitHub.

---

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `ng serve` | Inicia el servidor de desarrollo en `http://localhost:4200/` |
| `npm run build` | Compila el proyecto para producción en `/dist` |
| `npm run watch` | Compila en modo desarrollo con recarga automática |
| `npm run lint` | Ejecuta ESLint para verificar calidad del código |
| `npm test` | Ejecuta las pruebas unitarias con Karma |

**Ejemplos:**

```bash
# Desarrollo
ng serve

# Verificar código antes de hacer commit
npm run lint

# Compilar para producción
npm run build
```

---

## 🏗️ Arquitectura del Proyecto

Este proyecto sigue una **arquitectura modular basada en features** con separación clara de responsabilidades:

### Principios de Arquitectura

- **Separación por features**: Cada módulo de funcionalidad (`auth`, `dashboard`, etc.) es independiente
- **Core Module**: Servicios singleton, guards e interceptors compartidos por toda la aplicación
- **Shared Module**: Componentes, directivas y pipes reutilizables
- **Lazy Loading**: Los módulos se cargan bajo demanda para optimizar el rendimiento
- **Standalone Components**: Uso de componentes standalone de Angular 18

### Capas de la Aplicación

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│      (Components & Templates)           │
├─────────────────────────────────────────┤
│            Business Logic               │
│         (Services & State)              │
├─────────────────────────────────────────┤
│          Data Access Layer              │
│    (HTTP Services & Interceptors)       │
└─────────────────────────────────────────┘
```

### Creación de Nuevas Features

**Cuando se te asigne un issue con label `feature`:**

1. **Crea una nueva carpeta** dentro de `src/app/features/` con el nombre de tu feature:

```bash
# Ejemplo: Issue #15 - Implementar sistema de login
cd src/app/features
mkdir login
cd login
```

2. **Estructura de una feature:**

```
features/login/
├── components/           # Componentes específicos de esta feature
│   ├── login-form/
│   └── password-reset/
├── pages/               # Páginas/containers de la feature
│   └── login-page/
├── services/            # Servicios específicos de la feature
│   └── login.service.ts
└── login.routes.ts      # Rutas de la feature
```

3. **Genera los componentes:**

```bash
# Desde la raíz del proyecto
ng generate component features/login/pages/login-page
ng generate component features/login/components/login-form
ng generate service features/login/services/login
```

4. **Crea el archivo de rutas** `login.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';

export const LOGIN_ROUTES: Routes = [
  {
    path: '',
    component: LoginPageComponent
  }
];
```

5. **Registra las rutas** en `app.routes.ts`:

```typescript
{
  path: 'login',
  loadChildren: () => import('./features/login/login.routes').then(m => m.LOGIN_ROUTES)
}
```

---

## 🌿 Flujo de Trabajo con Git

### Reglas Generales

1. **NUNCA** hagas push directo a `main` o `develop`
2. **SIEMPRE** trabaja en tu propia rama
3. **Todos los PR** deben ir hacia `develop`, no hacia `main`
4. Antes de empezar a trabajar, cámbiate a tu rama asignada según tu issue

---

## 📌 Nomenclatura de Ramas

### Formato General

```
<tipo>/<username>-<descripcion-corta>
```

**Ejemplo:** `feature/amethdev-crear-env`

### Tipos de Ramas

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| `feature/` | Nueva funcionalidad | `feature/amethdev-login-auth` |
| `bugfix/` | Corrección de bug | `bugfix/amethdev-fix-navbar-mobile` |
| `hotfix/` | Corrección urgente en producción | `hotfix/amethdev-security-patch` |
| `refactor/` | Refactorización sin cambiar funcionalidad | `refactor/amethdev-clean-api-layer` |
| `docs/` | Solo documentación | `docs/amethdev-update-readme` |
| `test/` | Agregar o modificar tests | `test/amethdev-add-unit-tests` |
| `chore/` | Tareas de mantenimiento | `chore/amethdev-update-dependencies` |

### Reglas para Nombres de Ramas

✅ **SÍ hacer:**
- Todo en minúsculas
- Palabras separadas por guiones (`-`)
- Máximo 50 caracteres
- Descriptivo y claro
- Incluir tu username

❌ **NO hacer:**
- Usar espacios
- Usar guiones bajos (`_`)
- Usar caracteres especiales
- Usar números de issue al inicio (van en el commit message)

---

## 🔄 Proceso de Trabajo Completo

### 1. Crear tu rama desde `develop`

```bash
# Asegúrate de estar en develop y actualizado
git checkout develop
git pull origin develop

# Crea tu rama siguiendo la nomenclatura
git checkout -b feature/amethdev-user-profile
```

### 2. Hacer tus cambios

```bash
# Trabaja en tu código...

# Agrega los cambios
git add .

# Commit con mensaje descriptivo (ver convención abajo)
git commit -m "feat(profile): add user profile page"
```

### 3. Más cambios y commits

```bash
# Sigue trabajando...
git add .
git commit -m "style(profile): improve mobile layout"

# Verifica que el código pase el linter
npm run lint
```

### 4. Push a tu rama

```bash
git push origin feature/amethdev-user-profile
```

### 5. Crear Pull Request

1. Ve a GitHub
2. Crea un Pull Request desde tu rama → `develop` (NO a `main`)
3. Llena la plantilla de PR que se cargará automáticamente
4. Espera la revisión del equipo

---

## 📝 Pull Requests

### Checklist antes de crear un PR

- [ ] Tu código pasa `npm run lint` sin errores
- [ ] El proyecto compila correctamente (`npm run build`)
- [ ] Has probado tus cambios localmente
- [ ] No hay `console.log()` o `debugger` olvidados
- [ ] Has actualizado la documentación si es necesario
- [ ] Tu rama está actualizada con `develop`

### Convención de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(scope): <descripción>

[cuerpo opcional]

[footer opcional]
```

**Tipos comunes:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato de código (sin cambios funcionales)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

**Ejemplos:**

```bash
git commit -m "feat(auth): implement JWT authentication"
git commit -m "fix(navbar): resolve mobile menu overflow issue"
git commit -m "docs(readme): add installation instructions"
git commit -m "style(components): format code with prettier"
```

---

## 📁 Estructura del Proyecto

```
voltio/
├── src/
│   ├── app/
│   │   ├── core/                    # Servicios singleton, guards, interceptors
│   │   │   ├── guards/             # Route guards (autenticación, permisos)
│   │   │   ├── interceptors/       # HTTP interceptors (tokens, errores)
│   │   │   ├── models/             # Interfaces y tipos compartidos
│   │   │   └── services/           # Servicios globales (auth, API)
│   │   ├── features/                # Módulos de funcionalidades
│   │   │   ├── auth/               # Feature: Autenticación
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   └── auth.routes.ts
│   │   │   ├── dashboard/          # Feature: Dashboard
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   └── dashboard.routes.ts
│   │   │   └── landing/            # Feature: Landing page
│   │   │       ├── components/
│   │   │       ├── pages/
│   │   │       ├── services/
│   │   │       └── landing.routes.ts
│   │   └── shared/                  # Componentes compartidos
│   │       ├── components/         # Componentes reutilizables
│   │       ├── directives/         # Directivas personalizadas
│   │       └── pipes/              # Pipes personalizados
│   ├── environments/                # Configuración de entornos (NO subir con credenciales)
│   │   ├── environment.ts          # Local (no se sube a Git)
│   │   └── environment.development.ts  # Plantilla de ejemplo
│   ├── assets/                      # Recursos estáticos
│   │   └── voltio.svg
│   └── styles.css                   # Estilos globales con Tailwind
├── .github/
│   ├── workflows/
│   │   └── ci.yml                   # Pipeline de CI/CD
│   └── PULL_REQUEST_TEMPLATE.md     # Plantilla de PR
├── .gitignore
├── angular.json                     # Configuración de Angular CLI
├── create-env.js                    # Script para generar environments
├── eslint.config.js                 # Configuración de ESLint
├── package.json
├── tailwind.config.js               # Configuración de Tailwind CSS
└── vercel.json                      # Configuración de Vercel
```

### Convenciones de Organización

- **core/**: Solo servicios singleton que se usan en toda la app
- **features/**: Cada feature es autocontenida y puede tener sus propios servicios
- **shared/**: Solo componentes/directivas/pipes que se reutilizan entre múltiples features
- **Routing**: Cada feature define sus propias rutas en un archivo `.routes.ts`

---

## 🛠️ Tecnologías

- **Framework:** Angular 18.2
- **Estilos:** Tailwind CSS 3.4
- **Linting:** ESLint + Angular ESLint
- **Testing:** Jasmine + Karma
- **CI/CD:** GitHub Actions
- **Hosting:** Vercel
- **Iconos:** Lucide Angular

---

## 🚨 Problemas Comunes

### Error al instalar dependencias

```bash
npm error ERESOLVE unable to resolve dependency tree
```

**Solución:**
```bash
npm install --legacy-peer-deps
```

### El lint falla

```bash
npm run lint
# Si hay errores, corrígelos antes de hacer commit
```

### Conflictos con `develop`

```bash
# Actualiza tu rama con develop
git checkout develop
git pull origin develop
git checkout tu-rama
git merge develop
# Resuelve conflictos si los hay
```

---

**Desarrollado con ⚡ por el equipo de Voltio**