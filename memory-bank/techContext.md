# Technical Context

## Technology Stack

### Frontend
- **Vue 3**: Core framework
- **TypeScript**: Language
- **Vite**: Build tool
- **Pinia**: State management
- **Vue Router**: Navigation
- **Tailwind CSS**: Styling
- **Telegram WebApp SDK**: Integration

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Type checking
- **Vite**: Development server
- **Git**: Version control

## Dependencies

### Core Dependencies
```json
{
  "vue": "^3.5.13",
  "pinia": "^3.0.1",
  "vue-router": "^4.5.0",
  "@telegram-apps/sdk-vue": "^2.0.17",
  "axios": "^1.8.4",
  "tailwindcss": "^4.1.1"
}
```

### Development Dependencies
```json
{
  "@vitejs/plugin-vue": "^5.2.1",
  "typescript": "~5.7.2",
  "vite": "^6.2.0",
  "vue-tsc": "^2.2.4",
  "eslint": "^9.23.0"
}
```

## Development Setup

### Environment Requirements
- Node.js (LTS version)
- npm or yarn
- Git

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Building
```bash
npm run build
```

### Linting
```bash
npm run lint
npm run lint:fix
```

## Project Structure
```
frontend2/
├── src/
│   ├── assets/
│   ├── components/
│   ├── composables/
│   ├── router/
│   ├── stores/
│   ├── utils/
│   ├── views/
│   ├── App.vue
│   └── main.ts
├── helper/
├── public/
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Configuration Files

### TypeScript Configuration
- `tsconfig.json`: Base TypeScript configuration
- `tsconfig.app.json`: App-specific TypeScript settings
- `tsconfig.node.json`: Node-specific TypeScript settings

### Vite Configuration
- `vite.config.ts`: Build and development settings
- Environment variables in `.env`

### ESLint Configuration
- `eslint.config.mjs`: Code style and linting rules

## API Integration

### Endpoints
- `/api/getstars`: Get user's Stars balance
- `/api/swapstars`: Process Stars to TON swap
- `/api/getuser`: Get user information
- `/api/updateuser`: Update user information
- `/api/adduser`: Add new user

### Authentication
- Telegram WebApp authentication
- Secure API communication
- Token-based authentication

## Build and Deployment

### Production Build
- Optimized for performance
- Minified assets
- Tree-shaking enabled

### Deployment
- Static file hosting
- CDN integration
- SSL configuration
