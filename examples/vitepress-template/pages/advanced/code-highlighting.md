# Code Highlighting

VitePress provides powerful syntax highlighting capabilities powered by Shiki, with support for hundreds of programming languages and themes.

## Basic Syntax Highlighting

### JavaScript

```js
function greet(name) {
  return `Hello, ${name}!`
}

const message = greet('World')
console.log(message)
```

### TypeScript

```ts
interface User {
  id: number
  name: string
  email: string
}

function createUser(userData: Partial<User>): User {
  return {
    id: Date.now(),
    name: userData.name || 'Anonymous',
    email: userData.email || ''
  }
}
```

### Vue

```vue
<!-- Vue component example -->
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const msg = ref('Hello VitePress!')
const count = ref(0)

const increment = () => {
  count.value++
}
</script>

<style scoped>
.hello {
  text-align: center;
  padding: 20px;
}
</style>
```

### CSS

```css
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
}

.button {
  background: #42b883;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.button:hover {
  background: #369870;
}
```

## Line Highlighting

### Single Line

```js{2}
function processData(data) {
  const result = data.map(item => item * 2)  // Highlight this line
  return result.filter(item => item > 10)
}
```

### Multiple Lines

```js{1,3-4}
const config = {  // Highlight line 1
  name: 'My App',
  version: '1.0.0',  // Highlight lines 3-4
  author: 'John Doe'
}
```

### Line Ranges

```js{2-5}
export default {
  data() {
    return {
      message: 'Hello',
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
```

## Line Numbers

Enable line numbers for better code readability:

```js{1,3}
function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}
```

## Language-Specific Features

### Python

```python
def fibonacci(n):
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# List comprehension example
squares = [x**2 for x in range(10) if x % 2 == 0]

# Class definition
class Calculator:
    def __init__(self):
        self.result = 0
    
    def add(self, x):
        self.result += x
        return self
```

### Rust

```rust
fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

struct Point {
    x: f64,
    y: f64,
}

impl Point {
    fn new(x: f64, y: f64) -> Self {
        Point { x, y }
    }
    
    fn distance(&self, other: &Point) -> f64 {
        ((self.x - other.x).powi(2) + (self.y - other.y).powi(2)).sqrt()
    }
}
```

### Go

```go
package main

import (
    "fmt"
    "math"
)

type Point struct {
    X, Y float64
}

func (p Point) Distance(other Point) float64 {
    dx := p.X - other.X
    dy := p.Y - other.Y
    return math.Sqrt(dx*dx + dy*dy)
}

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    p1 := Point{1, 2}
    p2 := Point{4, 6}
    fmt.Printf("Distance: %.2f\n", p1.Distance(p2))
}
```

## Custom Themes

### Dark Theme Example

```js
// Dark theme configuration
export default {
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
}
```

### Custom Color Scheme

```css
/* Custom syntax highlighting colors */
:root {
  --shiki-color-text: #d4d4d4;
  --shiki-color-background: #1e1e1e;
  --shiki-token-constant: #9cdcfe;
  --shiki-token-string: #ce9178;
  --shiki-token-comment: #6a9955;
  --shiki-token-keyword: #569cd6;
  --shiki-token-parameter: #9cdcfe;
  --shiki-token-function: #dcdcaa;
  --shiki-token-string-expression: #ce9178;
  --shiki-token-punctuation: #d4d4d4;
  --shiki-token-link: #4ec9b0;
}
```

## Advanced Features

### Diff Highlighting

```diff
function processData(data) {
-  const result = data.map(item => item * 2)
+  const result = data
+    .filter(item => item > 0)
+    .map(item => item * 2)
   return result
}
```

### Inline Code

Use `inline code` with syntax highlighting: `const message = 'Hello'`{lang=js}

### Code Groups

Compare different implementations:

::: code-group

```js [JavaScript]
function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}
```

```ts [TypeScript]
function fibonacci(n: number): number {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}
```

```python [Python]
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

:::

## Performance Tips

### Optimize Large Code Blocks

For large code files, consider using imports:

```js
// Import large code files
import largeFile from '@/examples/large-file.js'
```

### Lazy Loading

Load code examples on demand:

```js
// Lazy load components
const LazyComponent = () => import('./LazyComponent.vue')
```

## Best Practices

### Language Specification

Always specify the language for better highlighting:

```js
// Good - language specified
const message = 'Hello'
```

```
// Avoid - no language specified
const message = 'Hello'
```

### Line Highlighting

Use line highlighting sparingly to draw attention to important parts:

```js{3}
function processUser(user) {
  // Validate user data
  if (!user.name || !user.email) {  // Highlight validation
    throw new Error('Invalid user data')
  }
  return user
}
```

### Code Comments

Use meaningful comments in code examples:

```js
// Calculate the sum of an array
function sum(arr) {
  return arr.reduce((acc, val) => acc + val, 0)
}

// Example usage
const numbers = [1, 2, 3, 4, 5]
const total = sum(numbers) // Returns 15
```

## Supported Languages

VitePress supports hundreds of programming languages including:

- JavaScript/TypeScript
- Python
- Java
- C/C++
- Rust
- Go
- PHP
- Ruby
- Swift
- Kotlin
- And many more...

For a complete list, visit the [Shiki documentation](https://github.com/shikijs/shiki). 