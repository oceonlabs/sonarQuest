# Cloudflare Bypass Configuration

This document explains how to configure SonarQuest to work with SonarQube instances protected by Cloudflare bot protection.

## Methods to Bypass Cloudflare Protection

### Method 1: Enhanced Headers (Automatic)
The application automatically uses enhanced browser-like headers and retry logic to bypass basic Cloudflare protection. This is enabled by default and should work for most cases.

**Features:**
- Rotating User-Agent strings
- Realistic browser headers
- Random delays between requests
- Automatic retry logic for failed requests
- IP randomization headers

### Method 2: Environment Variables
Configure proxy settings using environment variables:

```env
# Enable proxy bypass
VITE_PROXY_ENABLED=true
VITE_PROXY_TYPE=http

# For HTTP/SOCKS5 proxy
VITE_PROXY_HOST=127.0.0.1
VITE_PROXY_PORT=8080

# For Cloudflare tunnel
VITE_PROXY_TYPE=cloudflare-tunnel
VITE_PROXY_TUNNEL_URL=https://your-tunnel.cloudflareaccess.com
```

### Method 3: Local Proxy Setup
Set up a local proxy to bypass Cloudflare:

#### Option A: mitmproxy
```bash
# Install mitmproxy
pip install mitmproxy

# Run proxy on port 8080
mitmproxy -p 8080 --set confdir=~/.mitmproxy

# Configure environment
VITE_PROXY_ENABLED=true
VITE_PROXY_HOST=127.0.0.1
VITE_PROXY_PORT=8080
```

#### Option B: Charles Proxy
1. Download and install Charles Proxy
2. Configure Charles to listen on port 8080
3. Set environment variables as above

### Method 4: Cloudflare Tunnel
Create a Cloudflare tunnel to your SonarQube instance:

```bash
# Install cloudflared
brew install cloudflared  # macOS
# or download from https://github.com/cloudflare/cloudflared/releases

# Authenticate with Cloudflare
cloudflared tunnel login

# Create a tunnel
cloudflared tunnel create sonarqube-tunnel

# Configure tunnel (edit ~/.cloudflared/config.yml)
tunnel: sonarqube-tunnel
credentials-file: /path/to/credentials.json
ingress:
  - hostname: sonarqube-tunnel.yourdomain.com
    service: https://your-sonarqube-instance.com
  - service: http_status:404

# Run tunnel
cloudflared tunnel run sonarqube-tunnel

# Update environment
VITE_SONARQUBE_URL=https://sonarqube-tunnel.yourdomain.com
```

### Method 5: Browser Extension
Use browser extensions like:
- **Proxy SwitchyOmega** - For automatic proxy switching
- **User-Agent Switcher** - To rotate user agents
- **Header Editor** - To modify request headers

## Troubleshooting

### Common Cloudflare Errors
- **403 Forbidden**: Access denied by Cloudflare
- **429 Too Many Requests**: Rate limited
- **503 Service Unavailable**: Under attack mode or maintenance

### Solutions
1. **Increase delays**: Modify `CloudflareBypass.addRequestDelay()` to use longer delays
2. **Use different User-Agent**: Update the user agent rotation in `CloudflareBypass.getRandomUserAgent()`
3. **Try different IP**: Use VPN or proxy with different IP address
4. **Contact SonarQube admin**: Ask to whitelist your IP address

### Debug Mode
Enable debug logging by adding to your environment:
```env
NODE_ENV=development
```

This will show detailed request/response information in the browser console.

## Security Considerations

- Never commit real tokens to version control
- Use environment variables for sensitive configuration
- Consider using token rotation if accessing frequently
- Monitor for rate limiting and adjust delays accordingly

## Advanced Configuration

For enterprise setups, you may need to:
1. Configure corporate proxy settings
2. Use client certificates for authentication
3. Set up custom DNS resolution
4. Configure network firewall rules

Contact your network administrator for assistance with enterprise proxy configuration.