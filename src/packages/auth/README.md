# 🔐 Auth Package

The Auth package provides a comprehensive authentication system for your Govel applications, supporting multiple authentication methods, session management, and authorization features.

## 🌟 Features

- **JWT Authentication** with automatic refresh and blacklisting
- **OAuth2 Integration** with popular providers (Google, GitHub, Facebook)
- **Multi-Factor Authentication** (TOTP, SMS, Email)
- **Role-Based Access Control** (RBAC) with permissions
- **Session Management** with multiple storage backends
- **Password Policies** and secure password reset flows
- **API Token Authentication** for stateless APIs
- **Social Login** integration

## 🚀 Quick Start

### Basic JWT Authentication

```go
package main

import (
    "github.com/govel/framework"
    "github.com/govel/framework/auth"
)

func main() {
    app := framework.New()
    
    // Configure JWT authentication
    app.Auth().JWT().Configure(auth.JWTConfig{
        Secret:     "your-secret-key",
        Expiration: time.Hour * 24,
        Issuer:     "your-app",
    })
    
    // Protected route
    app.Router().Group("/api", func(r *framework.Router) {
        r.Use(auth.JWTMiddleware())
        
        r.Get("/profile", func(c *framework.Context) {
            user := auth.User(c)
            c.JSON(200, user)
        })
    })
    
    // Login endpoint
    app.Router().Post("/login", func(c *framework.Context) {
        credentials := struct {
            Email    string `json:"email"`
            Password string `json:"password"`
        }{}
        
        c.Bind(&credentials)
        
        token, err := app.Auth().Attempt(credentials.Email, credentials.Password)
        if err != nil {
            c.JSON(401, map[string]string{"error": "Invalid credentials"})
            return
        }
        
        c.JSON(200, map[string]string{"token": token})
    })
    
    app.Serve(":8080")
}
```

## 📖 Configuration

### JWT Configuration

```go
// config/auth.go
type JWTConfig struct {
    Secret           string        `yaml:"secret"`
    Expiration       time.Duration `yaml:"expiration"`
    RefreshExpiration time.Duration `yaml:"refresh_expiration"`
    Issuer           string        `yaml:"issuer"`
    Algorithm        string        `yaml:"algorithm"` // HS256, HS384, HS512, RS256, etc.
    BlacklistEnabled bool          `yaml:"blacklist_enabled"`
}

// Configure in your application
app.Auth().JWT().Configure(auth.JWTConfig{
    Secret:            os.Getenv("JWT_SECRET"),
    Expiration:        time.Hour * 24,
    RefreshExpiration: time.Hour * 24 * 7,
    Issuer:            "govel-app",
    Algorithm:         "HS256",
    BlacklistEnabled:  true,
})
```

### OAuth2 Configuration

```go
// Configure OAuth2 providers
app.Auth().OAuth().Configure(auth.OAuthConfig{
    Providers: map[string]auth.OAuthProvider{
        "google": {
            ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
            ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
            RedirectURL:  "http://localhost:8080/auth/google/callback",
            Scopes:       []string{"openid", "profile", "email"},
        },
        "github": {
            ClientID:     os.Getenv("GITHUB_CLIENT_ID"),
            ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
            RedirectURL:  "http://localhost:8080/auth/github/callback",
            Scopes:       []string{"user:email"},
        },
    },
})
```

## 🔑 Authentication Methods

### 1. JWT Authentication

Perfect for stateless APIs and SPAs:

```go
// Generate JWT token
token, err := app.Auth().JWT().Generate(user)
if err != nil {
    // Handle error
}

// Validate JWT token
claims, err := app.Auth().JWT().Validate(token)
if err != nil {
    // Handle invalid token
}

// Refresh JWT token
newToken, err := app.Auth().JWT().Refresh(token)
if err != nil {
    // Handle refresh error
}

// Blacklist JWT token (logout)
err = app.Auth().JWT().Blacklist(token)
```

### 2. Session Authentication

Traditional session-based authentication:

```go
// Login user with session
err := app.Auth().Session().Login(user)
if err != nil {
    // Handle error
}

// Check if user is authenticated
if app.Auth().Session().Check(c) {
    user := app.Auth().Session().User(c)
    // User is authenticated
}

// Logout user
app.Auth().Session().Logout(c)
```

### 3. API Token Authentication

For API access with personal access tokens:

```go
// Generate API token
token, err := app.Auth().Token().Generate(user, "token-name", []string{"read", "write"})
if err != nil {
    // Handle error
}

// Validate API token
user, err := app.Auth().Token().Validate(token)
if err != nil {
    // Handle invalid token
}

// Revoke API token
err = app.Auth().Token().Revoke(token)
```

## 🛡️ Authorization & RBAC

### Role-Based Access Control

```go
// Define roles and permissions
app.Auth().RBAC().DefineRole("admin", []string{
    "users.create", "users.read", "users.update", "users.delete",
    "posts.create", "posts.read", "posts.update", "posts.delete",
})

app.Auth().RBAC().DefineRole("editor", []string{
    "posts.create", "posts.read", "posts.update",
})

app.Auth().RBAC().DefineRole("viewer", []string{
    "posts.read",
})

// Assign role to user
err := app.Auth().RBAC().AssignRole(user, "editor")

// Check permissions
if app.Auth().RBAC().Can(user, "posts.create") {
    // User can create posts
}

// Middleware for permission checking
app.Router().Group("/admin", func(r *framework.Router) {
    r.Use(auth.RequirePermission("admin.access"))
    
    r.Get("/users", adminController.ListUsers)
})
```

### Policy-Based Authorization

```go
// Define policies
app.Auth().Policy().Define("update-post", func(user *auth.User, post *Post) bool {
    return user.ID == post.AuthorID || user.HasRole("admin")
})

// Use in controllers
func (pc *PostController) Update(c *framework.Context) {
    post := // ... get post
    
    if !app.Auth().Policy().Authorize(c, "update-post", post) {
        c.JSON(403, map[string]string{"error": "Forbidden"})
        return
    }
    
    // Update post
}

// Middleware for policy checking
r.Put("/posts/:id", auth.RequirePolicy("update-post"), postController.Update)
```

## 🔐 Multi-Factor Authentication

### TOTP (Time-based One-Time Password)

```go
// Enable TOTP for user
secret, qrCode, err := app.Auth().MFA().TOTP().Enable(user)
if err != nil {
    // Handle error
}

// User scans QR code and enters verification code
verified := app.Auth().MFA().TOTP().Verify(user, verificationCode)
if verified {
    // TOTP is now enabled for user
    app.Auth().MFA().TOTP().Confirm(user)
}

// Verify TOTP during login
if user.HasMFAEnabled() {
    if !app.Auth().MFA().TOTP().Verify(user, totpCode) {
        c.JSON(401, map[string]string{"error": "Invalid TOTP code"})
        return
    }
}
```

### SMS Authentication

```go
// Send SMS verification code
err := app.Auth().MFA().SMS().Send(user.PhoneNumber)
if err != nil {
    // Handle error
}

// Verify SMS code
verified := app.Auth().MFA().SMS().Verify(user.PhoneNumber, smsCode)
if !verified {
    c.JSON(401, map[string]string{"error": "Invalid SMS code"})
    return
}
```

### Email Authentication

```go
// Send email verification code
err := app.Auth().MFA().Email().Send(user.Email)
if err != nil {
    // Handle error
}

// Verify email code
verified := app.Auth().MFA().Email().Verify(user.Email, emailCode)
```

## 🌐 OAuth2 & Social Login

### Google OAuth2

```go
// Redirect to Google OAuth
app.Router().Get("/auth/google", func(c *framework.Context) {
    url := app.Auth().OAuth().Provider("google").RedirectURL()
    c.Redirect(302, url)
})

// Handle OAuth callback
app.Router().Get("/auth/google/callback", func(c *framework.Context) {
    code := c.Query("code")
    
    user, err := app.Auth().OAuth().Provider("google").HandleCallback(code)
    if err != nil {
        c.JSON(400, map[string]string{"error": "OAuth failed"})
        return
    }
    
    // Create or update user in database
    localUser := findOrCreateUser(user)
    
    // Generate JWT token
    token, _ := app.Auth().JWT().Generate(localUser)
    
    c.JSON(200, map[string]string{"token": token})
})
```

### GitHub OAuth2

```go
// Similar pattern for GitHub
app.Router().Get("/auth/github", func(c *framework.Context) {
    url := app.Auth().OAuth().Provider("github").RedirectURL()
    c.Redirect(302, url)
})

app.Router().Get("/auth/github/callback", func(c *framework.Context) {
    code := c.Query("code")
    user, err := app.Auth().OAuth().Provider("github").HandleCallback(code)
    // ... handle user
})
```

## 🔒 Password Management

### Password Hashing

```go
// Hash password
hashedPassword, err := app.Auth().Password().Hash("user-password")
if err != nil {
    // Handle error
}

// Verify password
valid := app.Auth().Password().Verify("user-password", hashedPassword)
if !valid {
    // Invalid password
}
```

### Password Reset

```go
// Generate password reset token
token, err := app.Auth().Password().CreateResetToken(user.Email)
if err != nil {
    // Handle error
}

// Send reset email
app.Mail().Send("password-reset", user.Email, map[string]interface{}{
    "user":  user,
    "token": token,
    "url":   fmt.Sprintf("https://yourapp.com/reset-password?token=%s", token),
})

// Verify reset token and update password
valid := app.Auth().Password().VerifyResetToken(token)
if valid {
    err := app.Auth().Password().Reset(token, newPassword)
    if err != nil {
        // Handle error
    }
}
```

## 🛠️ Middleware

### Authentication Middleware

```go
// JWT middleware
app.Router().Use(auth.JWTMiddleware())

// Session middleware
app.Router().Use(auth.SessionMiddleware())

// API token middleware
app.Router().Use(auth.TokenMiddleware())

// Optional authentication (doesn't fail if not authenticated)
app.Router().Use(auth.OptionalAuth())
```

### Authorization Middleware

```go
// Require specific role
app.Router().Use(auth.RequireRole("admin"))

// Require specific permission
app.Router().Use(auth.RequirePermission("posts.create"))

// Require any of multiple roles
app.Router().Use(auth.RequireAnyRole("admin", "moderator"))

// Require all permissions
app.Router().Use(auth.RequireAllPermissions("posts.create", "posts.publish"))

// Custom authorization
app.Router().Use(auth.RequireAuth(func(user *auth.User) bool {
    return user.IsActive && user.EmailVerified
}))
```

## 📊 User Management

### User Model

```go
type User struct {
    ID            uint      `json:"id" gorm:"primaryKey"`
    Email         string    `json:"email" gorm:"unique;not null"`
    Password      string    `json:"-" gorm:"not null"`
    Name          string    `json:"name"`
    Avatar        string    `json:"avatar"`
    EmailVerified bool      `json:"email_verified" gorm:"default:false"`
    PhoneNumber   string    `json:"phone_number"`
    PhoneVerified bool      `json:"phone_verified" gorm:"default:false"`
    MFAEnabled    bool      `json:"mfa_enabled" gorm:"default:false"`
    MFASecret     string    `json:"-"`
    IsActive      bool      `json:"is_active" gorm:"default:true"`
    LastLoginAt   time.Time `json:"last_login_at"`
    CreatedAt     time.Time `json:"created_at"`
    UpdatedAt     time.Time `json:"updated_at"`
    
    // Relationships
    Roles       []Role       `json:"roles" gorm:"many2many:user_roles;"`
    Permissions []Permission `json:"permissions" gorm:"many2many:user_permissions;"`
    Tokens      []APIToken   `json:"-" gorm:"foreignKey:UserID"`
}

// User methods
func (u *User) HasRole(role string) bool {
    for _, r := range u.Roles {
        if r.Name == role {
            return true
        }
    }
    return false
}

func (u *User) HasPermission(permission string) bool {
    // Check direct permissions
    for _, p := range u.Permissions {
        if p.Name == permission {
            return true
        }
    }
    
    // Check role permissions
    for _, role := range u.Roles {
        for _, p := range role.Permissions {
            if p.Name == permission {
                return true
            }
        }
    }
    
    return false
}
```

### User Registration

```go
func RegisterUser(c *framework.Context) {
    var req struct {
        Name     string `json:"name" validate:"required"`
        Email    string `json:"email" validate:"required,email"`
        Password string `json:"password" validate:"required,min:8"`
    }
    
    if err := c.Bind(&req); err != nil {
        c.JSON(400, map[string]string{"error": "Invalid request"})
        return
    }
    
    // Validate request
    if err := app.Validator().Validate(req); err != nil {
        c.JSON(400, map[string]interface{}{"errors": err})
        return
    }
    
    // Check if user exists
    if app.Auth().UserExists(req.Email) {
        c.JSON(409, map[string]string{"error": "User already exists"})
        return
    }
    
    // Create user
    user, err := app.Auth().CreateUser(auth.CreateUserRequest{
        Name:     req.Name,
        Email:    req.Email,
        Password: req.Password,
    })
    if err != nil {
        c.JSON(500, map[string]string{"error": "Failed to create user"})
        return
    }
    
    // Send verification email
    app.Auth().SendVerificationEmail(user)
    
    // Generate token
    token, _ := app.Auth().JWT().Generate(user)
    
    c.JSON(201, map[string]interface{}{
        "user":  user,
        "token": token,
    })
}
```

## 🔧 Advanced Features

### Custom Guards

```go
// Define custom guard
app.Auth().Guard("api").Configure(auth.GuardConfig{
    Driver: "jwt",
    Provider: "users",
    Options: map[string]interface{}{
        "secret": "api-secret",
        "ttl":    3600,
    },
})

// Use custom guard
user := app.Auth().Guard("api").User(c)
```

### Custom User Providers

```go
// Implement custom user provider
type CustomUserProvider struct {
    // Your implementation
}

func (p *CustomUserProvider) RetrieveByID(id interface{}) (*auth.User, error) {
    // Retrieve user by ID
}

func (p *CustomUserProvider) RetrieveByCredentials(credentials map[string]interface{}) (*auth.User, error) {
    // Retrieve user by credentials
}

func (p *CustomUserProvider) ValidateCredentials(user *auth.User, credentials map[string]interface{}) bool {
    // Validate credentials
}

// Register custom provider
app.Auth().Provider("custom", &CustomUserProvider{})
```

### Event Hooks

```go
// Listen to authentication events
app.Auth().Listen("user.login", func(user *auth.User) {
    // Log user login
    app.Logger().Info("User logged in", map[string]interface{}{
        "user_id": user.ID,
        "email":   user.Email,
        "ip":      // get IP from context
    })
})

app.Auth().Listen("user.logout", func(user *auth.User) {
    // Handle user logout
})

app.Auth().Listen("user.registered", func(user *auth.User) {
    // Send welcome email
    app.Mail().Send("welcome", user.Email, map[string]interface{}{
        "user": user,
    })
})
```

## 🧪 Testing

### Testing Authentication

```go
func TestUserLogin(t *testing.T) {
    app := framework.NewTestApp()
    
    // Create test user
    user := app.Auth().CreateTestUser(auth.TestUser{
        Email:    "test@example.com",
        Password: "password123",
        Name:     "Test User",
    })
    
    // Test login
    response := app.Test().Post("/login", map[string]string{
        "email":    "test@example.com",
        "password": "password123",
    })
    
    assert.Equal(t, 200, response.StatusCode)
    
    var result map[string]interface{}
    json.Unmarshal(response.Body, &result)
    
    assert.NotEmpty(t, result["token"])
}

func TestProtectedRoute(t *testing.T) {
    app := framework.NewTestApp()
    
    // Create authenticated request
    user := app.Auth().CreateTestUser(auth.TestUser{
        Email: "test@example.com",
    })
    
    token := app.Auth().JWT().GenerateTestToken(user)
    
    response := app.Test().Get("/api/profile").
        Header("Authorization", "Bearer "+token).
        Send()
    
    assert.Equal(t, 200, response.StatusCode)
}
```

## 📚 API Reference

### Auth Manager

```go
type AuthManager interface {
    // Authentication
    Attempt(email, password string) (string, error)
    Login(user *User) error
    Logout(c *Context) error
    User(c *Context) *User
    Check(c *Context) bool
    
    // User management
    CreateUser(req CreateUserRequest) (*User, error)
    UpdateUser(user *User, updates map[string]interface{}) error
    DeleteUser(user *User) error
    UserExists(email string) bool
    
    // Guards
    Guard(name string) Guard
    
    // Providers
    Provider(name string) UserProvider
    
    // JWT
    JWT() JWTManager
    
    // OAuth
    OAuth() OAuthManager
    
    // MFA
    MFA() MFAManager
    
    // RBAC
    RBAC() RBACManager
    
    // Password
    Password() PasswordManager
}
```

For complete API documentation, see the [API Reference](../api-reference/auth.md).

## 🔗 Related Packages

- [Session Package](../session/README.md) - Session management
- [Cookie Package](../cookie/README.md) - Secure cookie handling
- [Encryption Package](../encryption/README.md) - Data encryption
- [Hashing Package](../hashing/README.md) - Password hashing
- [Mail Package](../mail/README.md) - Email notifications

## 📖 Learn More

- [JWT Authentication Guide](jwt.md)
- [OAuth Integration Guide](oauth.md)
- [Multi-Factor Authentication](mfa.md)
- [Role-Based Access Control](rbac.md)
- [Security Best Practices](../../guides/security.md)

