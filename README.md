# Envist

Type-safe runtime environment variables for your micro-frontend applications.

# Why?

When building micro-frontend applications, you may need some environment variables that are shared across all the micro-frontends and
that are available only at runtime rather than build time.

This package provides a way to define and access these environment variables in a type-safe way.

# Usage

To use this package, you'll need a place where your runtime environment variables are defined - might be an inline script, an external one,
or basically anything else that has access to the `Envist` package and runs before your applications start.

> [!IMPORTANT]  
> You must have a single instance of the `Envist` package in your application, since the module is a singleton.
> It's recommended to use tools like Module Federation or similar solutions to share the same instance across all your micro-frontends.

To use this package, start by putting the environment data inside `Envist`:

```typescript
// init-env.ts
import { setEnv } from 'envist';

setEnv({
  API_URL: 'https://api.example.com/v1',
  API_KEY: '123456',
  DEBUG: true,
});
```

Then, in your applications, define which variable you want to access and what are their types. To do that, you'll need to provide
a "parsing function" for each of them:

```typescript
// packages/app-1/env.ts
import { parseEnv } from 'envist';

export const env = parseEnv({
  API_URL: (value) => {
    if (typeof value !== 'string') {
      throw new Error('Expected a string');
    }

    return value;
  },

  DEBUG: (value) => {
    if (typeof value !== 'boolean') {
      throw new Error('Expected a boolean');
    }

    return value;
  },
});

env; // { API_URL: string, DEBUG: boolean }
```

This structure makes it clear which variables are required by each application, and how they should look like.

Note that the actual parsing will happen only when you access the variable:

```typescript
import { setEnv, parseEnv } from 'envist';

setEnv({
  SOME_STRING: 'test',
  SOME_NUMBER: 'not-a-number',
});

const env = parseEnv({
  // Should fail in runtime since the variable is a string.
  SOME_NUMBER: (value): number => {
    if (typeof value !== 'number') {
      throw new Error('Expected a number');
    }

    return value;
  },
});

env.SOME_NUMBER; // Will throw an error
```

## Usage with Zod

If you're using Zod, you can use the zod adapter to define your environment variables:

```typescript
// packages/app-1/env.ts
import { z } from 'zod';
import { parseEnv } from 'envist/zod';

const env = parseEnv({
  API_URL: z.string(),
  DEBUG: z.boolean(),
});

env; // { API_URL: string, DEBUG: boolean }
```

You basically use the same API, but with zod schemas instead of parsing functions. Everything else should work the same.
