# 📦 Filesystem Package

File storage abstraction for local, S3, GCS, and Azure

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
    "github.com/govel/framework/filesystem"
)

func main() {
    app := framework.New()
    
    // Basic usage example
    filesystemService := app.Filesystem()
    
    // Your code here
    
    app.Serve(":8080")
}
```

## 📖 Configuration

```go
// Configure filesystem package
app.Filesystem().Configure(filesystem.Config{
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

For complete API documentation, see the [API Reference](../../api-reference/filesystem.md).

## 🔗 Related Packages

- [Related Package 1](../package1/README.md)
- [Related Package 2](../package2/README.md)

## 📖 Learn More

- [Filesystem Guide](guide.md)
- [Best Practices](best-practices.md)
