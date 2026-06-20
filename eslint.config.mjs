import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'node_modules/**',
    'playwright-report/**',
    'test-results/**',
    'next-env.d.ts',
  ]),
  {
    // Generated shadcn/ui primitives are kept as emitted by the CLI.
    files: ['src/components/ui/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
])

export default eslintConfig
