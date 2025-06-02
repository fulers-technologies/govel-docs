# 📦 Redis Package

Redis client with connection pooling and cluster support

## 🌟 Features

- Feature 1
- Feature 2
- Feature 3
- Feature 4

## 🚀 Quick Start

```go
package main

import (
    "github.com/govel/framework"
    "github.com/govel/framework/redis"
)

func main() {
    app := framework.New()
    
    // Basic usage example
    redisService := app.Redis()
    
    // Your code here
    
    app.Serve(":8080")
}
```

## 📖 Configuration

```go
// Configure redis package
app.Redis().Configure(redis.Config{
    // Configuration options
})
```

## 🔧 Usage Examples

### Basic Usage

```go
// Example usage
```

### Advanced Usage

```go
// Advanced example
```

## 📚 API Reference

For complete API documentation, see the [API Reference](../../api-reference/redis.md).

## 🔗 Related Packages

- [Related Package 1](../package1/README.md)
- [Related Package 2](../package2/README.md)

## 📖 Learn More

- [Redis Guide](guide.md)
- [Best Practices](best-practices.md)
