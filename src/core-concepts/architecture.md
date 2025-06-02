# 🏗️ Architecture Overview

Govel is built on a modular, Laravel-inspired architecture that emphasizes developer experience, performance, and maintainability. This guide explains the core architectural concepts and how they work together.

## 🎯 Design Principles

### 1. **Convention over Configuration**
Govel follows sensible defaults and naming conventions to reduce boilerplate code while remaining flexible for customization.

### 2. **Modular Design**
Each package is designed to work independently while integrating seamlessly with others.

### 3. **Performance First**
Built for Go's strengths: concurrency, performance, and efficiency.

### 4. **Developer Experience**
Intuitive APIs, comprehensive documentation, and helpful error messages.

## 🏛️ Core Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Controllers  │  Middleware  │  Providers  │  Commands      │
├─────────────────────────────────────────────────────────────┤
│                    Service Layer                            │
├─────────────────────────────────────────────────────────────┤
│   Auth   │  Cache  │  Queue  │  Mail  │  Events  │  etc.   │
├─────────────────────────────────────────────────────────────┤
│                    Foundation Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Container  │  Router  │  HTTP  │  Database  │  Config      │
├─────────────────────────────────────────────────────────────┤
│                    Infrastructure Layer                     │
├─────────────────────────────────────────────────────────────┤
│  File System  │  Network  │  External APIs  │  Storage     │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Application Lifecycle

### 1. **Bootstrap Phase**
```go
app := framework.New()
```
- Load configuration
- Initialize service container
- Register core services
- Set up error handling

### 2. **Service Registration**
```go
app.Register(providers...)
```
- Register service providers
- Bind services to container
- Configure dependencies

### 3. **Service Booting**
```go
app.Boot()
```
- Boot all registered providers
- Establish database connections
- Initialize caches
- Set up event listeners

### 4. **Request Handling**
```go
app.Serve(":8080")
```
- Start HTTP server
- Handle incoming requests
- Route to appropriate handlers
- Return responses

### 5. **Graceful Shutdown**
- Close database connections
- Finish processing jobs
- Clean up resources

## 📦 Service Container

The service container is the heart of Govel's dependency injection system.

### Binding Services

```go
// Singleton binding
app.Container().Singleton("cache", func() interface{} {
    return cache.New(cache.Config{
        Driver: "redis",
        Host:   "localhost:6379",
    })
})

// Instance binding
app.Container().Bind("logger", func() interface{} {
    return logger.New(logger.Config{
        Level:  "info",
        Format: "json",
    })
})

// Interface binding
app.Container().Bind("UserRepository", func() UserRepository {
    return &DatabaseUserRepository{
        DB: app.Database(),
    }
})
```

### Resolving Services

```go
// Automatic resolution
cache := app.Container().Make("cache").(cache.Cache)

// Type-safe resolution
logger := app.Container().MakeAs("logger", (*logger.Logger)(nil))

// Constructor injection
type UserService struct {
    repo   UserRepository `inject:"UserRepository"`
    cache  cache.Cache    `inject:"cache"`
    logger logger.Logger  `inject:"logger"`
}

userService := app.Container().Make("UserService").(*UserService)
```

## 🛣️ Request Lifecycle

### 1. **HTTP Request Received**
```
Client Request → HTTP Server → Router
```

### 2. **Middleware Pipeline**
```go
Request → Middleware 1 → Middleware 2 → ... → Controller
```

### 3. **Route Resolution**
```go
// Route matching
app.Router().Get("/users/{id}", userController.Show)

// Parameter binding
userID := c.Param("id")
```

### 4. **Controller Execution**
```go
func (uc *UserController) Show(c *framework.Context) {
    userID := c.Param("id")
    user := uc.userService.FindByID(userID)
    c.JSON(200, user)
}
```

### 5. **Response Generation**
```
Controller → Response → Middleware (reverse) → HTTP Response
```

## 🔌 Service Providers

Service providers are the central place for configuring and bootstrapping services.

### Creating a Provider

```go
type UserServiceProvider struct {
    framework.ServiceProvider
}

func (p *UserServiceProvider) Register() {
    // Register services in the container
    p.App().Container().Bind("UserRepository", func() UserRepository {
        return &DatabaseUserRepository{
            DB: p.App().Database(),
        }
    })
    
    p.App().Container().Bind("UserService", func() *UserService {
        return &UserService{
            Repository: p.App().Container().Make("UserRepository").(UserRepository),
            Cache:      p.App().Cache(),
            Events:     p.App().Events(),
        }
    })
}

func (p *UserServiceProvider) Boot() {
    // Boot services after all providers are registered
    userService := p.App().Container().Make("UserService").(*UserService)
    
    // Set up event listeners
    p.App().Events().Listen("user.created", userService.HandleUserCreated)
    p.App().Events().Listen("user.updated", userService.HandleUserUpdated)
}

func (p *UserServiceProvider) Provides() []string {
    return []string{"UserRepository", "UserService"}
}
```

### Registering Providers

```go
func main() {
    app := framework.New()
    
    // Register providers
    app.Register(
        &UserServiceProvider{},
        &NotificationServiceProvider{},
        &PaymentServiceProvider{},
    )
    
    app.Serve(":8080")
}
```

## 🎭 Facades

Facades provide a static interface to services in the container.

### Using Facades

```go
// Instead of
cache := app.Container().Make("cache").(cache.Cache)
cache.Set("key", "value", time.Hour)

// Use facade
Cache.Set("key", "value", time.Hour)

// Other examples
DB.Table("users").Where("active", true).Get()
Mail.Send("welcome", user.Email, data)
Queue.Push("send-email", emailJob)
```

### Creating Custom Facades

```go
type UserFacade struct {
    framework.Facade
}

func (f *UserFacade) ServiceName() string {
    return "UserService"
}

// Global instance
var User = &UserFacade{}

// Usage
user := User.FindByEmail("john@example.com")
```

## 🔄 Event System

Govel includes a powerful event system for decoupled communication.

### Event Flow

```
Action → Event Dispatch → Listeners → Side Effects
```

### Defining Events

```go
type UserRegistered struct {
    User      *models.User
    Timestamp time.Time
}

func (e UserRegistered) Name() string {
    return "user.registered"
}
```

### Event Listeners

```go
// Function listener
app.Events().Listen("user.registered", func(event UserRegistered) {
    // Send welcome email
    app.Mail().Send("welcome", event.User.Email, map[string]interface{}{
        "user": event.User,
    })
})

// Struct listener
type SendWelcomeEmail struct {
    mail mail.Mailer
}

func (l *SendWelcomeEmail) Handle(event UserRegistered) {
    l.mail.Send("welcome", event.User.Email, map[string]interface{}{
        "user": event.User,
    })
}

app.Events().Listen("user.registered", &SendWelcomeEmail{
    mail: app.Mail(),
})
```

### Dispatching Events

```go
// In your service
func (s *UserService) Register(data RegisterData) (*User, error) {
    user, err := s.repository.Create(data)
    if err != nil {
        return nil, err
    }
    
    // Dispatch event
    s.events.Dispatch(UserRegistered{
        User:      user,
        Timestamp: time.Now(),
    })
    
    return user, nil
}
```

## 🗄️ Database Architecture

### Connection Management

```go
// Multiple connections
app.Database().Connection("mysql").Table("users")
app.Database().Connection("postgres").Table("analytics")
app.Database().Connection("mongodb").Collection("logs")
```

### Query Builder

```go
// Fluent query building
users := app.Database().
    Table("users").
    Where("active", true).
    Where("created_at", ">", time.Now().AddDate(0, -1, 0)).
    OrderBy("name").
    Limit(10).
    Get()
```

### Model Relationships

```go
type User struct {
    ID    uint   `json:"id"`
    Name  string `json:"name"`
    Posts []Post `json:"posts" gorm:"foreignKey:UserID"`
}

type Post struct {
    ID     uint   `json:"id"`
    Title  string `json:"title"`
    UserID uint   `json:"user_id"`
    User   User   `json:"user" gorm:"foreignKey:UserID"`
}

// Eager loading
users := app.Database().
    Model(&User{}).
    Preload("Posts").
    Find(&users)
```

## 🔄 Queue Architecture

### Job Processing Flow

```
Job Creation → Queue → Worker → Job Execution → Completion/Failure
```

### Queue Backends

```go
// Redis queue
app.Queue().Connection("redis").Push("send-email", emailJob)

// Database queue
app.Queue().Connection("database").Push("process-payment", paymentJob)

// SQS queue
app.Queue().Connection("sqs").Push("resize-image", imageJob)
```

### Job Definition

```go
type SendEmailJob struct {
    To      string
    Subject string
    Body    string
}

func (j SendEmailJob) Handle() error {
    return app.Mail().Send(j.To, j.Subject, j.Body)
}

func (j SendEmailJob) Failed(err error) {
    // Handle job failure
    log.Printf("Failed to send email to %s: %v", j.To, err)
}
```

## 🧪 Testing Architecture

### Test Structure

```go
func TestUserService(t *testing.T) {
    // Create test application
    app := framework.NewTestApp()
    
    // Mock dependencies
    mockRepo := &MockUserRepository{}
    app.Container().Bind("UserRepository", func() UserRepository {
        return mockRepo
    })
    
    // Test service
    userService := app.Container().Make("UserService").(*UserService)
    
    // Assertions
    user, err := userService.Create(CreateUserData{
        Name:  "John Doe",
        Email: "john@example.com",
    })
    
    assert.NoError(t, err)
    assert.Equal(t, "John Doe", user.Name)
}
```

### HTTP Testing

```go
func TestUserAPI(t *testing.T) {
    app := framework.NewTestApp()
    
    response := app.Test().
        Post("/api/users").
        JSON(map[string]string{
            "name":  "John Doe",
            "email": "john@example.com",
        }).
        Send()
    
    assert.Equal(t, 201, response.StatusCode)
}
```

## 🔧 Configuration Architecture

### Configuration Sources

```
Environment Variables → Config Files → Defaults → Final Config
```

### Configuration Structure

```go
type Config struct {
    App      AppConfig      `yaml:"app"`
    Database DatabaseConfig `yaml:"database"`
    Cache    CacheConfig    `yaml:"cache"`
    Mail     MailConfig     `yaml:"mail"`
}

// Access configuration
appName := app.Config().Get("app.name")
dbHost := app.Config().Get("database.host")
```

## 🚀 Performance Considerations

### Connection Pooling
- Database connections are pooled and reused
- HTTP client connections are pooled
- Redis connections use connection pooling

### Caching Strategy
- Multi-tier caching (L1: in-memory, L2: Redis)
- Query result caching
- Response caching with ETags

### Concurrency
- Goroutine pools for job processing
- Concurrent request handling
- Non-blocking I/O operations

## 🔗 Package Integration

### How Packages Work Together

```go
// Example: User registration flow
func RegisterUser(c *framework.Context) {
    // 1. Validate request (validation package)
    var req RegisterRequest
    if err := c.Bind(&req); err != nil {
        c.JSON(400, map[string]string{"error": "Invalid request"})
        return
    }
    
    // 2. Create user (database package)
    user, err := app.Database().Model(&User{}).Create(req)
    if err != nil {
        c.JSON(500, map[string]string{"error": "Failed to create user"})
        return
    }
    
    // 3. Generate JWT token (auth package)
    token, _ := app.Auth().JWT().Generate(user)
    
    // 4. Send welcome email (mail package + queue package)
    app.Queue().Push("send-welcome-email", SendWelcomeEmailJob{
        UserID: user.ID,
        Email:  user.Email,
    })
    
    // 5. Dispatch event (events package)
    app.Events().Dispatch(UserRegistered{User: user})
    
    // 6. Cache user data (cache package)
    app.Cache().Set(fmt.Sprintf("user:%d", user.ID), user, time.Hour)
    
    // 7. Return response (http package)
    c.JSON(201, map[string]interface{}{
        "user":  user,
        "token": token,
    })
}
```

This architecture ensures that Govel applications are scalable, maintainable, and performant while providing an excellent developer experience.

