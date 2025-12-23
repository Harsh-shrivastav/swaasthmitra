# Security Policy

## Environment Variables

This project uses environment variables to store sensitive configuration. **Never commit secrets directly to the repository.**

### Required Environment Variables

Create a `.env` file in the root directory (this file is gitignored):

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
VITE_APP_NAME=Swaasthmitra
VITE_EMERGENCY_NUMBER=108
```

### GitHub Actions Secrets

For CI/CD pipelines, configure the following secrets in your GitHub repository settings:

1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Add the following repository secrets:
   - `VITE_GEMINI_API_KEY` - Your Google Gemini API key
   - `VITE_APP_NAME` - Application name (optional, defaults to "Swaasthmitra")
   - `VITE_EMERGENCY_NUMBER` - Emergency contact number (optional, defaults to "108")

### Deployment Platform Secrets

If deploying to platforms like Vercel, Netlify, or similar:

1. Configure environment variables in your deployment platform's settings
2. Use the same variable names as listed above
3. Never expose these values in client-side code beyond what Vite exposes via `import.meta.env`

## Security Best Practices

✅ **DO:**
- Use environment variables for all sensitive data
- Keep `.env` files in `.gitignore`
- Rotate API keys regularly
- Use different keys for development and production
- Review dependency vulnerabilities with `npm audit`

❌ **DON'T:**
- Hardcode API keys or secrets in source code
- Commit `.env` files to version control
- Share secrets via unsecured channels
- Use production keys in development

## Reporting Security Issues

If you discover a security vulnerability, please email the maintainers directly rather than opening a public issue.
