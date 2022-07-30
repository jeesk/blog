---
id: docusaurus-core
title: Docusaurus Client API
sidebar_label: Client API
---

Docusaurus provides some APIs on the clients that can be helpful to you when building your site.

## Components {#components}

### `<ErrorBoundary />` {#errorboundary}

This component creates a [React error boundary](https://reactjs.org/docs/error-boundaries.html).

Use it to wrap components that might throw, and display a fallback when that happens instead of crashing the whole app.

```jsx
import React from 'react';
import ErrorBoundary from '@docusaurus/ErrorBoundary';

const SafeComponent = () => (
  <ErrorBoundary
    fallback={({error, tryAgain}) => (
      <div>
        <p>This component crashed because of error: {error.message}.</p>
        <button onClick={tryAgain}>Try Again!</button>
      </div>
    )}>
    <SomeDangerousComponentThatMayThrow />
  </ErrorBoundary>
);
```
1242141243