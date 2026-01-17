import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Ignore test files
    'tests/**',
    '**/*.test.ts',
    '**/*.test.tsx',
    'jest.config.ts',
    'jest.setup.ts',
    'coverage/**',
  ]),
  {
    rules: {
      // Disable display-name rule for functional components
      'react/display-name': 'off',
      // Downgrade unused vars to warning (with exceptions for underscored vars)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      // Downgrade explicit any to warning
      '@typescript-eslint/no-explicit-any': 'warn',
      // Disable exhaustive-deps for hooks (can cause false positives)
      'react-hooks/exhaustive-deps': 'warn',
      // Allow setState in useEffect (common pattern for animations/simulations)
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]);

export default eslintConfig;
