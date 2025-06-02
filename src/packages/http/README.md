# 🌐 HTTP Package

The HTTP package provides a powerful, high-performance HTTP client and server implementation with advanced features like middleware support, WebSocket capabilities, and HTTP/2 support.

## 🌟 Features

- **High-Performance HTTP Client** with connection pooling
- **Middleware-Driven Server** with request/response transformation
- **Rate Limiting** and throttling with multiple algorithms
- **Request Validation** and automatic binding
- **Response Caching** and compression
- **WebSocket Support** with real-time capabilities
- **HTTP/2 and HTTP/3** support for modern performance
- **Request/Response Interceptors**
- **Automatic Retries** with exponential backoff
- **Circuit Breaker** pattern for resilience

## 🚀 Quick Start

### Basic HTTP Server

```go
package main

import (
    "github.com/govel/framework"
    "github.com/govel/framework/http"
)

func main() {
    app := framework.New()
    
    // Basic route
    app.Router().Get("/", func(c *framework.Context) {
        c.JSON(200, map[string]string{
            "message": "Hello, Govel!",
        })
    })
    
    // JSON API endpoint
    app.Router().Post("/users", func(c *framework.Context) {
        var user struct {
            Name  string `json:"name" validate:"required"`
            Email string `json:"email" validate:"required,email"`
        }
        
        if err := c.Bind(&user); err != nil {
            c.JSON(400, map[string]string{"error": "Invalid JSON"})
            return
        }
        
        if err := c.Validate(&user); err != nil {
            c.JSON(422, map[string]interface{}{"errors": err})
            return
        }
        
        // Create user logic here
        c.JSON(201, user)
    })
    
    app.Serve(":8080")
}
```

### HTTP Client

```go
// Create HTTP client
client := app.HTTP().Client()

// Simple GET request
response, err := client.Get("https://api.example.com/users")
if err != nil {
    // Handle error
}

// POST request with JSON
user := map[string]string{
    "name":  "John Doe",
    "email": "john@example.com",
}

response, err = client.Post("https://api.example.com/users").
    JSON(user).
    Send()

// Handle response
if response.IsSuccess() {
    var result map[string]interface{}
    response.JSON(&result)
}
```

## 🔧 Server Configuration

### Basic Server Setup

```go
// Configure HTTP server
app.HTTP().Server().Configure(http.ServerConfig{
    Host:         "0.0.0.0",
    Port:         8080,
    ReadTimeout:  30 * time.Second,
    WriteTimeout: 30 * time.Second,
    IdleTimeout:  120 * time.Second,
    
    // TLS Configuration
    TLS: &http.TLSConfig{
        CertFile: "cert.pem",
        KeyFile:  "key.pem",
        AutoTLS:  true, // Automatic Let's Encrypt certificates
    },
    
    // HTTP/2 Support
    HTTP2: true,
    
    // Graceful Shutdown
    GracefulShutdown: true,
    ShutdownTimeout:  30 * time.Second,
})
```

### Middleware Configuration

```go
// Global middleware
app.HTTP().Use(
    http.Logger(),
    http.Recovery(),
    http.CORS(http.CORSConfig{
        AllowOrigins: []string{"*"},
        AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
        AllowHeaders: []string{"*"},
    }),
    http.RateLimit(http.RateLimitConfig{
        Rate:   100,           // requests per minute
        Burst:  10,            // burst capacity
        Window: time.Minute,   // time window
    }),
)

// Route-specific middleware
app.Router().Group("/api", func(r *framework.Router) {
    r.Use(http.JSONOnly()) // Only accept JSON requests
    r.Use(http.Compress()) // Enable compression
    
    r.Get("/users", userController.List)
})
```

## 📡 HTTP Client

### Basic Client Usage

```go
// Create client with configuration
client := app.HTTP().Client().Configure(http.ClientConfig{
    Timeout:     30 * time.Second,
    MaxRetries:  3,
    RetryDelay:  time.Second,
    UserAgent:   "Govel/1.0",
    
    // Connection pooling
    MaxIdleConns:        100,
    MaxIdleConnsPerHost: 10,
    IdleConnTimeout:     90 * time.Second,
    
    // TLS configuration
    InsecureSkipVerify: false,
    
    // Proxy support
    ProxyURL: "http://proxy.example.com:8080",
})

// Make requests
response, err := client.Get("https://api.example.com/users")
```

### Request Building

```go
// Build complex requests
response, err := client.Request().
    Method("POST").
    URL("https://api.example.com/users").
    Header("Authorization", "Bearer "+token).
    Header("Content-Type", "application/json").
    JSON(map[string]string{
        "name":  "John Doe",
        "email": "john@example.com",
    }).
    Query("include", "profile").
    Query("fields", "id,name,email").
    Send()

// Form data
response, err := client.Post("https://api.example.com/upload").
    Form(map[string]string{
        "title":       "My File",
        "description": "File description",
    }).
    File("file", "/path/to/file.pdf").
    Send()

// Multipart form
response, err := client.Post("https://api.example.com/upload").
    Multipart().
    Field("title", "My File").
    FileFromPath("file", "/path/to/file.pdf").
    Send()
```

### Response Handling

```go
response, err := client.Get("https://api.example.com/users")
if err != nil {
    // Handle network error
}

// Check status
if response.IsSuccess() {
    // 2xx status code
} else if response.IsClientError() {
    // 4xx status code
} else if response.IsServerError() {
    // 5xx status code
}

// Get response data
statusCode := response.StatusCode()
headers := response.Headers()
body := response.Body()

// Parse JSON response
var users []User
if err := response.JSON(&users); err != nil {
    // Handle JSON parsing error
}

// Parse XML response
var result XMLResponse
if err := response.XML(&result); err != nil {
    // Handle XML parsing error
}

// Get raw body
bodyBytes := response.Bytes()
bodyString := response.String()
```

### Request Interceptors

```go
// Add request interceptor
client.OnRequest(func(req *http.Request) error {
    // Add authentication header
    req.Header.Set("Authorization", "Bearer "+getToken())
    
    // Log request
    log.Printf("Making request to %s", req.URL.String())
    
    return nil
})

// Add response interceptor
client.OnResponse(func(resp *http.Response) error {
    // Log response
    log.Printf("Received response: %d", resp.StatusCode)
    
    // Handle specific status codes
    if resp.StatusCode == 401 {
        // Refresh token and retry
        return http.ErrRetryRequest
    }
    
    return nil
})

// Error interceptor
client.OnError(func(err error) error {
    // Log error
    log.Printf("Request failed: %v", err)
    
    // Transform error
    return fmt.Errorf("API request failed: %w", err)
})
```

## 🔄 Middleware

### Built-in Middleware

```go
// Logger middleware
app.HTTP().Use(http.Logger(http.LoggerConfig{
    Format: "${time} ${method} ${path} ${status} ${latency}",
    Output: os.Stdout,
    Skip: func(c *framework.Context) bool {
        return c.Path() == "/health"
    },
}))

// Recovery middleware
app.HTTP().Use(http.Recovery(http.RecoveryConfig{
    EnableStackTrace: true,
    Handler: func(c *framework.Context, err interface{}) {
        c.JSON(500, map[string]string{
            "error": "Internal server error",
        })
    },
}))

// CORS middleware
app.HTTP().Use(http.CORS(http.CORSConfig{
    AllowOrigins:     []string{"https://example.com"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    AllowHeaders:     []string{"Content-Type", "Authorization"},
    ExposeHeaders:    []string{"X-Total-Count"},
    AllowCredentials: true,
    MaxAge:           86400,
}))

// Rate limiting
app.HTTP().Use(http.RateLimit(http.RateLimitConfig{
    Rate:   100,                    // requests per window
    Window: time.Minute,            // time window
    Burst:  10,                     // burst capacity
    KeyFunc: func(c *framework.Context) string {
        return c.ClientIP()         // rate limit by IP
    },
    Handler: func(c *framework.Context) {
        c.JSON(429, map[string]string{
            "error": "Rate limit exceeded",
        })
    },
}))

// Compression
app.HTTP().Use(http.Compress(http.CompressConfig{
    Level:     6,                   // compression level
    MinLength: 1024,                // minimum response size to compress
    Types: []string{
        "text/html",
        "text/css",
        "text/javascript",
        "application/json",
        "application/xml",
    },
}))

// Security headers
app.HTTP().Use(http.Security(http.SecurityConfig{
    XSSProtection:         "1; mode=block",
    ContentTypeNosniff:    "nosniff",
    XFrameOptions:         "DENY",
    HSTSMaxAge:           31536000,
    HSTSIncludeSubdomains: true,
    ContentSecurityPolicy: "default-src 'self'",
    ReferrerPolicy:        "strict-origin-when-cross-origin",
}))
```

### Custom Middleware

```go
// Create custom middleware
func AuthMiddleware() framework.MiddlewareFunc {
    return func(next framework.HandlerFunc) framework.HandlerFunc {
        return func(c *framework.Context) {
            token := c.Header("Authorization")
            if token == "" {
                c.JSON(401, map[string]string{
                    "error": "Authorization header required",
                })
                return
            }
            
            // Validate token
            user, err := validateToken(token)
            if err != nil {
                c.JSON(401, map[string]string{
                    "error": "Invalid token",
                })
                return
            }
            
            // Set user in context
            c.Set("user", user)
            
            // Continue to next handler
            next(c)
        }
    }
}

// Use custom middleware
app.Router().Group("/api", func(r *framework.Router) {
    r.Use(AuthMiddleware())
    
    r.Get("/profile", func(c *framework.Context) {
        user := c.Get("user").(*User)
        c.JSON(200, user)
    })
})
```

## 🔌 WebSocket Support

### WebSocket Server

```go
// WebSocket endpoint
app.Router().GET("/ws", func(c *framework.Context) {
    // Upgrade connection to WebSocket
    conn, err := app.HTTP().WebSocket().Upgrade(c, http.WebSocketConfig{
        CheckOrigin: func(r *http.Request) bool {
            return true // Allow all origins
        },
        Subprotocols: []string{"chat", "echo"},
    })
    if err != nil {
        c.JSON(400, map[string]string{"error": "WebSocket upgrade failed"})
        return
    }
    defer conn.Close()
    
    // Handle WebSocket messages
    for {
        messageType, message, err := conn.ReadMessage()
        if err != nil {
            break
        }
        
        // Echo message back
        if err := conn.WriteMessage(messageType, message); err != nil {
            break
        }
    }
})

// WebSocket with channels
app.Router().GET("/ws/chat", func(c *framework.Context) {
    conn, err := app.HTTP().WebSocket().Upgrade(c, http.WebSocketConfig{})
    if err != nil {
        return
    }
    defer conn.Close()
    
    // Join chat room
    room := c.Query("room")
    chatRoom := app.WebSocket().Room(room)
    chatRoom.Join(conn)
    
    // Handle messages
    conn.OnMessage(func(messageType int, data []byte) {
        // Broadcast to all clients in room
        chatRoom.Broadcast(messageType, data)
    })
    
    conn.OnClose(func() {
        chatRoom.Leave(conn)
    })
    
    // Keep connection alive
    conn.Listen()
})
```

### WebSocket Client

```go
// Connect to WebSocket server
client := app.HTTP().WebSocket().Client()

conn, err := client.Connect("ws://localhost:8080/ws", http.WebSocketClientConfig{
    Headers: map[string]string{
        "Authorization": "Bearer " + token,
    },
    Subprotocols: []string{"chat"},
})
if err != nil {
    // Handle connection error
}
defer conn.Close()

// Send message
err = conn.WriteJSON(map[string]string{
    "type":    "message",
    "content": "Hello, WebSocket!",
})

// Read messages
for {
    var message map[string]interface{}
    if err := conn.ReadJSON(&message); err != nil {
        break
    }
    
    // Handle message
    fmt.Printf("Received: %+v\n", message)
}
```

## 📊 Request/Response Handling

### Request Binding

```go
// JSON binding
func CreateUser(c *framework.Context) {
    var user User
    if err := c.Bind(&user); err != nil {
        c.JSON(400, map[string]string{"error": "Invalid JSON"})
        return
    }
    
    // Validate
    if err := c.Validate(&user); err != nil {
        c.JSON(422, map[string]interface{}{"errors": err})
        return
    }
    
    // Create user
    c.JSON(201, user)
}

// Form binding
func UpdateProfile(c *framework.Context) {
    var profile struct {
        Name  string `form:"name" validate:"required"`
        Email string `form:"email" validate:"required,email"`
        Bio   string `form:"bio"`
    }
    
    if err := c.Bind(&profile); err != nil {
        c.JSON(400, map[string]string{"error": "Invalid form data"})
        return
    }
    
    // Update profile
}

// Query parameter binding
func SearchUsers(c *framework.Context) {
    var query struct {
        Q      string `query:"q"`
        Page   int    `query:"page" default:"1"`
        Limit  int    `query:"limit" default:"10" validate:"min:1,max:100"`
        SortBy string `query:"sort_by" default:"created_at"`
    }
    
    if err := c.Bind(&query); err != nil {
        c.JSON(400, map[string]string{"error": "Invalid query parameters"})
        return
    }
    
    // Search users
}

// Header binding
func APIEndpoint(c *framework.Context) {
    var headers struct {
        Authorization string `header:"Authorization" validate:"required"`
        ContentType   string `header:"Content-Type"`
        UserAgent     string `header:"User-Agent"`
    }
    
    if err := c.Bind(&headers); err != nil {
        c.JSON(400, map[string]string{"error": "Missing required headers"})
        return
    }
    
    // Process request
}
```

### Response Helpers

```go
// JSON response
c.JSON(200, map[string]string{"message": "Success"})

// XML response
c.XML(200, user)

// HTML response
c.HTML(200, "user/profile", map[string]interface{}{
    "user": user,
})

// File response
c.File("/path/to/file.pdf")

// File download
c.Download("/path/to/file.pdf", "document.pdf")

// Redirect
c.Redirect(302, "/login")

// Stream response
c.Stream(200, "text/plain", func(w io.Writer) error {
    for i := 0; i < 1000; i++ {
        fmt.Fprintf(w, "data chunk %d\n", i)
        time.Sleep(10 * time.Millisecond)
    }
    return nil
})

// Server-Sent Events
c.SSE(func(event *http.SSEEvent) error {
    for i := 0; i < 10; i++ {
        event.Send("message", fmt.Sprintf("Event %d", i))
        time.Sleep(time.Second)
    }
    return nil
})
```

## 🔄 Caching

### Response Caching

```go
// Cache responses
app.Router().Group("/api", func(r *framework.Router) {
    r.Use(http.Cache(http.CacheConfig{
        TTL: 5 * time.Minute,
        Key: func(c *framework.Context) string {
            return fmt.Sprintf("api:%s:%s", c.Method(), c.Path())
        },
        Skip: func(c *framework.Context) bool {
            return c.Method() != "GET"
        },
    }))
    
    r.Get("/users", userController.List)
})

// Conditional caching
app.Router().Get("/users/:id", func(c *framework.Context) {
    userID := c.Param("id")
    
    // Check ETag
    etag := generateETag(userID)
    if c.Header("If-None-Match") == etag {
        c.Status(304)
        return
    }
    
    user := getUserByID(userID)
    
    // Set cache headers
    c.Header("ETag", etag)
    c.Header("Cache-Control", "max-age=300")
    
    c.JSON(200, user)
})
```

## 🧪 Testing

### HTTP Testing

```go
func TestUserAPI(t *testing.T) {
    app := framework.NewTestApp()
    
    // Test GET request
    response := app.Test().Get("/api/users")
    assert.Equal(t, 200, response.StatusCode)
    
    var users []User
    response.JSON(&users)
    assert.NotEmpty(t, users)
    
    // Test POST request
    newUser := User{
        Name:  "John Doe",
        Email: "john@example.com",
    }
    
    response = app.Test().Post("/api/users").
        JSON(newUser).
        Send()
    
    assert.Equal(t, 201, response.StatusCode)
    
    var createdUser User
    response.JSON(&createdUser)
    assert.Equal(t, newUser.Name, createdUser.Name)
    
    // Test with authentication
    token := generateTestToken()
    
    response = app.Test().Get("/api/profile").
        Header("Authorization", "Bearer "+token).
        Send()
    
    assert.Equal(t, 200, response.StatusCode)
}

func TestWebSocket(t *testing.T) {
    app := framework.NewTestApp()
    
    // Test WebSocket connection
    conn := app.Test().WebSocket("/ws")
    defer conn.Close()
    
    // Send message
    err := conn.WriteJSON(map[string]string{
        "type":    "ping",
        "message": "hello",
    })
    assert.NoError(t, err)
    
    // Read response
    var response map[string]interface{}
    err = conn.ReadJSON(&response)
    assert.NoError(t, err)
    assert.Equal(t, "pong", response["type"])
}
```

## 📚 API Reference

### HTTP Server

```go
type Server interface {
    Configure(config ServerConfig) Server
    Use(middleware ...MiddlewareFunc) Server
    Start() error
    Stop() error
    Shutdown(ctx context.Context) error
}

type ServerConfig struct {
    Host             string
    Port             int
    ReadTimeout      time.Duration
    WriteTimeout     time.Duration
    IdleTimeout      time.Duration
    MaxHeaderBytes   int
    TLS              *TLSConfig
    HTTP2            bool
    GracefulShutdown bool
    ShutdownTimeout  time.Duration
}
```

### HTTP Client

```go
type Client interface {
    Configure(config ClientConfig) Client
    Get(url string) (*Response, error)
    Post(url string) *RequestBuilder
    Put(url string) *RequestBuilder
    Delete(url string) *RequestBuilder
    Request() *RequestBuilder
    OnRequest(interceptor RequestInterceptor) Client
    OnResponse(interceptor ResponseInterceptor) Client
    OnError(interceptor ErrorInterceptor) Client
}

type RequestBuilder interface {
    Method(method string) *RequestBuilder
    URL(url string) *RequestBuilder
    Header(key, value string) *RequestBuilder
    Headers(headers map[string]string) *RequestBuilder
    Query(key, value string) *RequestBuilder
    JSON(data interface{}) *RequestBuilder
    Form(data map[string]string) *RequestBuilder
    File(fieldName, filePath string) *RequestBuilder
    Send() (*Response, error)
}
```

For complete API documentation, see the [API Reference](../api-reference/http.md).

## 🔗 Related Packages

- [Routing Package](../routing/README.md) - Advanced routing
- [Middleware Package](../middleware/README.md) - Middleware collection
- [Cache Package](../cache/README.md) - Response caching
- [Validation Package](../validation/README.md) - Request validation

## 📖 Learn More

- [HTTP Client Guide](client.md)
- [HTTP Server Guide](server.md)
- [Middleware Development](middleware.md)
- [WebSocket Guide](websocket.md)
- [Performance Optimization](../../guides/performance.md)

