# TechOrMehTube Deployment Guide

This guide covers deployment options for TechOrMehTube on Railway and Digital Ocean platforms.

## Prerequisites

- Node.js 20+
- Git repository with your code
- Docker (for Digital Ocean)

## Railway Deployment

Railway provides the simplest deployment experience with automatic builds and scaling.

### Option 1: Deploy from GitHub (Recommended)

1. **Connect Repository**
   ```bash
   # Push your code to GitHub first
   git add .
   git commit -m "Deploy TechOrMehTube"
   git push origin main
   ```

2. **Railway Setup**
   - Visit [railway.app](https://railway.app)
   - Click "Deploy from GitHub repo"
   - Select your TechOrMehTube repository
   - Railway will auto-detect Node.js and deploy

3. **Environment Configuration**
   - No additional environment variables needed
   - Railway automatically sets `PORT` environment variable
   - App will be available at `https://your-app.railway.app`

### Option 2: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Railway Configuration

Create `railway.toml` for custom configuration:

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
healthcheckPath = "/api/stats"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

## Digital Ocean App Platform Deployment

Digital Ocean App Platform provides managed hosting with automatic scaling.

### Setup Process

1. **Create App**
   - Go to [Digital Ocean Console](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```yaml
   name: techormehtube
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/techormehtube
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     routes:
     - path: /
     health_check:
       http_path: /api/stats
   ```

3. **Build Commands**
   - Build Command: `npm run build`
   - Run Command: `npm start`

## Docker Deployment (Digital Ocean Droplets)

For more control, deploy using Docker on Digital Ocean Droplets.

### 1. Create Droplet

```bash
# Create a Docker-enabled droplet
doctl compute droplet create techormehtube \
  --size s-1vcpu-1gb \
  --image docker-20-04 \
  --region nyc3 \
  --ssh-keys your-ssh-key-id
```

### 2. Deploy with Docker

```bash
# SSH into your droplet
ssh root@your-droplet-ip

# Clone repository
git clone https://github.com/your-username/techormehtube.git
cd techormehtube

# Build Docker image
docker build -t techormehtube .

# Run container
docker run -d \
  --name techormehtube \
  -p 80:5000 \
  --restart unless-stopped \
  techormehtube

# Verify deployment
curl http://your-droplet-ip/api/stats
```

### 3. Set up Nginx (Optional)

```nginx
# /etc/nginx/sites-available/techormehtube
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

The app works without additional environment variables, but you can configure:

```bash
# Optional configurations
NODE_ENV=production
PORT=5000

# For database (if using PostgreSQL in future)
DATABASE_URL=postgresql://...
```

## Performance Considerations

### Railway
- **Pros**: Auto-scaling, zero configuration, fast deployment
- **Cons**: Cold starts, usage-based pricing
- **Best for**: Development, small to medium traffic

### Digital Ocean App Platform
- **Pros**: Predictable pricing, good performance, managed service
- **Cons**: Less auto-scaling flexibility
- **Best for**: Production applications, steady traffic

### Digital Ocean Droplets
- **Pros**: Full control, best price/performance ratio
- **Cons**: Requires server management
- **Best for**: High traffic, custom configurations

## Monitoring and Logs

### Railway
```bash
# View logs
railway logs

# Check status
railway status
```

### Digital Ocean
```bash
# App Platform logs via console or:
doctl apps logs your-app-id

# Droplet logs
docker logs techormehtube -f
```

## SSL/HTTPS

- **Railway**: Automatic HTTPS with custom domains
- **Digital Ocean App Platform**: Automatic HTTPS
- **Digital Ocean Droplets**: Set up Let's Encrypt with Certbot

## Custom Domain Setup

### Railway
1. Add domain in Railway dashboard
2. Update DNS CNAME to point to Railway

### Digital Ocean
1. Add domain in App Platform settings
2. Update DNS A record to point to Digital Ocean

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check Node.js version compatibility
   node --version  # Should be 20+
   
   # Clear npm cache
   npm cache clean --force
   ```

2. **Memory Issues**
   - Upgrade instance size
   - Monitor memory usage with /api/stats endpoint

3. **Download Failures**
   - Check YouTube URL format
   - Verify 10-minute duration limit
   - Monitor server logs for ytdl-core errors

### Health Checks

The app includes a health check endpoint:
```
GET /api/stats
```

This returns download statistics and confirms the app is running.

## Scaling Recommendations

1. **Low Traffic** (< 100 downloads/day)
   - Railway or DO App Platform basic tier

2. **Medium Traffic** (100-1000 downloads/day)
   - DO App Platform with horizontal scaling
   - Multiple Railway instances

3. **High Traffic** (1000+ downloads/day)
   - DO Droplets with load balancer
   - CDN for static assets
   - Consider implementing rate limiting

## Security Notes

- App streams files directly without server storage
- No authentication required (as designed)
- 10-minute video limit prevents abuse
- Consider adding rate limiting for production use

## Support

For deployment issues:
- Railway: Check [Railway Documentation](https://docs.railway.app)
- Digital Ocean: Check [DO App Platform Docs](https://docs.digitalocean.com/products/app-platform/)