# 🚀 Quick Start Guide

Get up and running with Govel in just a few minutes! This guide will walk you through installing Govel, creating your first application, and exploring the key features.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Go 1.21 or later** installed on your system
- **Git** for version control
- A code editor (VS Code, GoLand, or your preferred editor)

## 📦 Installation

### 1. Create a New Project

```bash
# Create a new directory for your project
mkdir my-govel-app
cd my-govel-app

# Initialize Go module
go mod init my-govel-app
```

### 2. Install Govel Framework

```bash
# Install the core framework
go get github.com/govel/framework

# Install additional packages as needed
go get github.com/govel/framework/auth
go get github.com/govel/framework/database
go get github.com/govel/framework/cache
```

### 3. Create Your First Application

Create a `main.go` file:

```go
package main

import (
    "github.com/govel/framework"
    "github.com/govel/framework/http"
)

func main() {
    // Create new Govel application
    app := framework.New()
    
    // Configure basic middleware
    app.HTTP().Use(
        http.Logger(),
        http.Recovery(),
        http.CORS(),
    )
    
    // Define routes
    app.Router().Get("/", func(c *framework.Context) {
        c.JSON(200, map[string]interface{}{
            "message": "Welcome to Govel!",
            "version": "1.0.0",
            "docs":    "https://fulers.gitbook.io/govel",
        })
    })
    
    app.Router().Get("/health", func(c *framework.Context) {
        c.JSON(200, map[string]string{
            "status": "healthy",
        })
    })
    
    // Start the server
    app.Serve(":8080")
}
```

### 4. Run Your Application

```bash
# Run the application
go run main.go

# Or build and run
go build -o app
./app
```

Your application is now running at `http://localhost:8080`!

## 🧪 Test Your Application

Open your browser or use curl to test the endpoints:

```bash
# Test the main endpoint
curl http://localhost:8080/

# Test the health endpoint
curl http://localhost:8080/health
```

You should see JSON responses confirming your application is working.

## 🏗️ Project Structure

For larger applications, organize your code with this recommended structure:

```
my-govel-app/
├── main.go                 # Application entry point
├── go.mod                  # Go module file
├── go.sum                  # Go dependencies
├── config/                 # Configuration files
│   ├── app.yaml
│   ├── database.yaml
│   └── cache.yaml
├── app/                    # Application code
│   ├── controllers/        # HTTP controllers
│   ├── models/            # Data models
│   ├── services/          # Business logic
│   ├── middleware/        # Custom middleware
│   └── providers/         # Service providers
├── database/              # Database related files
│   ├── migrations/        # Database migrations
│   └── seeders/          # Database seeders
├── resources/             # Resources
│   ├── views/            # HTML templates
│   └── assets/           # Static assets
├── storage/               # Storage directory
│   ├── logs/             # Log files
│   └── uploads/          # Uploaded files
└── tests/                 # Test files
    ├── unit/
    └── integration/
```

## 🔧 Configuration

### Environment Configuration

Create a `.env` file for environment-specific settings:

```env
# Application
APP_NAME=MyGovelApp
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost:8080

# Database
DB_CONNECTION=postgres
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=govel_app
DB_USERNAME=postgres
DB_PASSWORD=password

# Cache
CACHE_DRIVER=redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Mail
MAIL_DRIVER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=24h
```

### Configuration Files

Create `config/app.yaml`:

```yaml
name: "MyGovelApp"
env: "development"
debug: true
url: "http://localhost:8080"
timezone: "UTC"

server:
  host: "0.0.0.0"
  port: 8080
  read_timeout: "30s"
  write_timeout: "30s"
  idle_timeout: "120s"

logging:
  level: "info"
  format: "json"
  output: "stdout"
```

## 🗄️ Database Setup

### 1. Configure Database Connection

Create `config/database.yaml`:

```yaml
default: "postgres"

connections:
  postgres:
    driver: "postgres"
    host: "localhost"
    port: 5432
    database: "govel_app"
    username: "postgres"
    password: "password"
    sslmode: "disable"
    
  mysql:
    driver: "mysql"
    host: "localhost"
    port: 3306
    database: "govel_app"
    username: "root"
    password: "password"
    
  sqlite:
    driver: "sqlite"
    database: "storage/database.sqlite"
```

### 2. Create Your First Model

Create `app/models/user.go`:

```go
package models

import (
    "time"
    "github.com/govel/framework/database"
)

type User struct {
    ID        uint      `json:"id" gorm:"primaryKey"`
    Name      string    `json:"name" gorm:"not null"`
    Email     string    `json:"email" gorm:"unique;not null"`
    Password  string    `json:"-" gorm:"not null"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

// TableName returns the table name for the User model
func (User) TableName() string {
    return "users"
}
```

### 3. Create Migration

```go
// database/migrations/001_create_users_table.go
package migrations

import (
    "github.com/govel/framework/database"
    "my-govel-app/app/models"
)

func init() {
    database.Migration("001_create_users_table", func(db *database.DB) error {
        return db.AutoMigrate(&models.User{})
    })
}
```

## 🔐 Add Authentication

### 1. Configure Authentication

Update your `main.go`:

```go
package main

import (
    "github.com/govel/framework"
    "github.com/govel/framework/auth"
    "github.com/govel/framework/http"
    "my-govel-app/app/controllers"
)

func main() {
    app := framework.New()
    
    // Configure authentication
    app.Auth().JWT().Configure(auth.JWTConfig{
        Secret:     "your-secret-key",
        Expiration: time.Hour * 24,
    })
    
    // Middleware
    app.HTTP().Use(
        http.Logger(),
        http.Recovery(),
        http.CORS(),
    )
    
    // Public routes
    app.Router().Post("/register", controllers.Register)
    app.Router().Post("/login", controllers.Login)
    
    // Protected routes
    app.Router().Group("/api", func(r *framework.Router) {
        r.Use(auth.JWTMiddleware())
        
        r.Get("/profile", controllers.Profile)
        r.Put("/profile", controllers.UpdateProfile)
    })
    
    app.Serve(":8080")
}
```

### 2. Create Authentication Controller

Create `app/controllers/auth.go`:

```go
package controllers

import (
    "github.com/govel/framework"
    "my-govel-app/app/models"
)

func Register(c *framework.Context) {
    var req struct {
        Name     string `json:"name" validate:"required"`
        Email    string `json:"email" validate:"required,email"`
        Password string `json:"password" validate:"required,min:8"`
    }
    
    if err := c.Bind(&req); err != nil {
        c.JSON(400, map[string]string{"error": "Invalid request"})
        return
    }
    
    if err := c.Validate(&req); err != nil {
        c.JSON(422, map[string]interface{}{"errors": err})
        return
    }
    
    // Create user
    user, err := c.App().Auth().CreateUser(auth.CreateUserRequest{
        Name:     req.Name,
        Email:    req.Email,
        Password: req.Password,
    })
    if err != nil {
        c.JSON(500, map[string]string{"error": "Failed to create user"})
        return
    }
    
    // Generate token
    token, _ := c.App().Auth().JWT().Generate(user)
    
    c.JSON(201, map[string]interface{}{
        "user":  user,
        "token": token,
    })
}

func Login(c *framework.Context) {
    var req struct {
        Email    string `json:"email" validate:"required,email"`
        Password string `json:"password" validate:"required"`
    }
    
    if err := c.Bind(&req); err != nil {
        c.JSON(400, map[string]string{"error": "Invalid request"})
        return
    }
    
    // Attempt authentication
    token, err := c.App().Auth().Attempt(req.Email, req.Password)
    if err != nil {
        c.JSON(401, map[string]string{"error": "Invalid credentials"})
        return
    }
    
    c.JSON(200, map[string]string{"token": token})
}

func Profile(c *framework.Context) {
    user := c.App().Auth().User(c)
    c.JSON(200, user)
}
```

## 🚀 Next Steps

Congratulations! You now have a working Govel application with authentication. Here's what you can explore next:

### 📚 Learn Core Concepts
- [Architecture Overview](../core-concepts/architecture.md)
- [Dependency Injection](../core-concepts/dependency-injection.md)
- [Service Providers](../core-concepts/service-providers.md)

### 🔍 Explore Packages
- [Database Package](../packages/database/README.md) - Advanced database operations
- [Cache Package](../packages/cache/README.md) - Caching strategies
- [Queue Package](../packages/queue/README.md) - Background job processing
- [Mail Package](../packages/mail/README.md) - Email functionality

### 🏗️ Build Something
- [Build a REST API](../tutorials/rest-api.md)
- [Create a Real-time Chat App](../tutorials/chat-app.md)
- [Develop an E-commerce Platform](../tutorials/ecommerce.md)

### 🛠️ Development Tools
- [Testing Guide](../guides/testing.md)
- [Debugging Tools](../packages/debug/README.md)
- [Performance Optimization](../guides/performance.md)

## 🆘 Getting Help

If you run into any issues:

1. **Check the Documentation** - Most questions are answered in our comprehensive docs
2. **Search GitHub Issues** - Someone might have already solved your problem
3. **Join our Discord** - Get help from the community
4. **Stack Overflow** - Tag your questions with `govel`

## 🎉 Welcome to Govel!

You're now ready to build amazing applications with Govel. The framework provides everything you need to create scalable, maintainable, and secure applications.

Happy coding! 🚀

