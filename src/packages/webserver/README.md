# 📦 Webserver Package

High-performance web server with HTTP/2 and HTTP/3 support

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
    "github.com/govel/framework/webserver"
)

func main() {
    app := framework.New()
    
    // Basic usage example
    webserverService := app.Webserver()
    
    // Your code here
    
    app.Serve(":8080")
}
```

## 📖 Configuration

```go
// Configure webserver package
app.Webserver().Configure(webserver.Config{
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

For complete API documentation, see the [API Reference](../../api-reference/webserver.md).

## 🔗 Related Packages

- [Related Package 1](../package1/README.md)
- [Related Package 2](../package2/README.md)

## 📖 Learn More

- [Webserver Guide](guide.md)
- [Best Practices](best-practices.md)
