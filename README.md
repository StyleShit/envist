# Envist

Type-safe runtime environment variables for your micro-frontend applications.

## Why?

When building micro-frontend applications, you may need some environment variables that may or may not be shared across all
the micro-frontends and that are available only at runtime rather than build time due to dependency on the environment where
the application is running.

This package provides a way to define and access these environment variables in a type-safe way.

## Usage

In your applications, define which variables you're expecting to access and what are their types. To do that, you'll need to provide a
"parsing function" for each of them. This structure makes it clear which variables are required by each application, and how they
should look like:

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

Then, you'll need a place in the host application where your runtime environment variables are defined - might be an inline script,
an external one, or basically anything else that has access to the `Envist` package and runs before your applications start:

```typescript
// init-env.ts
import { setEnv } from 'envist';

setEnv({
  API_URL: 'https://api.example.com/v1',
  API_KEY: '123456',
  DEBUG: true,
});
```

> [!IMPORTANT]  
> You must have a single instance of the `Envist` package in your applications, since the module is a singleton.
> It's recommended to use tools like Module Federation or similar solutions to share the same instance across all your micro-frontends.

It's important to note that the actual parsing will happen only when you access the variable:

```typescript
import { setEnv, parseEnv } from 'envist';

const env = parseEnv({
  SOME_NUMBER: (value): number => {
    if (typeof value !== 'number') {
      throw new Error('Expected a number');
    }

    return value;
  },
});

setEnv({
  SOME_STRING: 'test',
  SOME_NUMBER: 'not-a-number',
});

env.SOME_NUMBER; // Will throw an error since the value is not a number
```

## Adapters

`Envist` supports multiple schema validation libraries. You basically use the same API, but with your custom schemas instead of parsing
functions. Everything else should work the same.

### Usage with Zod

If you're using Zod, you can use the Zod adapter to define your environment variables:

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

### Usage with Valibot

If you're using Valibot, you can use the Valibot adapter to define your environment variables:

```typescript
// packages/app-1/env.ts
import * as v from 'valibot';
import { parseEnv } from 'envist/valibot';

const env = parseEnv({
  API_URL: v.string(),
  DEBUG: v.boolean(),
});

env; // { API_URL: string, DEBUG: boolean }
```

### Usage with Yup

If you're using Yup, you can use the Yup adapter to define your environment variables:

```typescript
// packages/app-1/env.ts
import { string, boolean } from 'yup';
import { parseEnv } from 'envist/yup';

const env = parseEnv({
  API_URL: string().required(),
  DEBUG: boolean().required(),
});

env; // { API_URL: string, DEBUG: boolean }
```
