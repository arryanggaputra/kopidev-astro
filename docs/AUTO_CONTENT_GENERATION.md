# 🤖 Automatic Content Generation with Cloudflare AI

This system automatically generates Tailwind CSS components using Cloudflare AI during the build process and deploys them to your site.

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   GitHub Push   │───▶│  Cloudflare AI   │───▶│ Content Created │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                                                │
         ▼                                                ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ GitHub Actions  │───▶│ Screenshot Gen   │───▶│  Site Deployed  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔧 Setup Instructions

### 1. Environment Variables

Set these secrets in your GitHub repository (`Settings > Secrets > Actions`):

```bash
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token-with-ai-permissions
GITHUB_TOKEN=github_pat_xxx (with repo write access)
```

### 2. Cloudflare AI Token

Create an API token with these permissions:

- **Account**: `Cloudflare AI:Edit`
- **Zone Resources**: Include `All zones` (if needed)

### 3. GitHub Token

Create a Personal Access Token with:

- `repo` (Full control of private repositories)
- `workflow` (Update GitHub Action workflows)

## 🚀 How It Works

### Automatic Triggers

1. **Push to main**: Generates 2 components per push
2. **Scheduled**: Runs twice daily (6 AM & 6 PM UTC)
3. **Manual**: Via GitHub Actions with custom settings

### Content Generation Process

1. **🔍 Check**: Prevents infinite loops by checking last commit
2. **🤖 Generate**: Uses Cloudflare AI to create components
3. **💾 Save**: Commits new components to repository
4. **📸 Screenshot**: Generates preview images
5. **🚀 Deploy**: Builds and deploys to Cloudflare Pages

### Smart Features

- **Loop Prevention**: Skips generation if last commit was auto-generated
- **Rate Limiting**: 2-second delays between AI requests
- **Error Handling**: Continues build even if some components fail
- **Cleanup**: Removes components older than 30 days
- **Categories**: Auto-assigns appropriate categories

## 📝 Component Structure

Generated components are saved to:

```
src/content/tailwind-components/auto-generated/{slug}/
├── index.mdx          # Component metadata
├── code/
│   └── index.html     # Component HTML
└── images/
    └── tailwind-component-{slug}.png
```

## 🎛️ Configuration

### Environment Variables

| Variable                   | Default | Description                            |
| -------------------------- | ------- | -------------------------------------- |
| `ENABLE_AUTO_GENERATION`   | `true`  | Enable/disable auto-generation         |
| `MAX_COMPONENTS_PER_BUILD` | `2`     | Max components per build               |
| `SKIP_IF_RECENT_COMMIT`    | `true`  | Skip if last commit was auto-generated |
| `COMMIT_MESSAGE_PATTERN`   | `🤖`    | Pattern to identify auto-commits       |

### Prompts

Edit `componentPrompts` in `scripts/content-generator.ts` to customize:

```typescript
export const componentPrompts = [
  "Create a modern dashboard card...",
  "Design a pricing component...",
  // Add your custom prompts here
];
```

## 🧪 Testing

Test the system locally:

```bash
# Test AI generation (requires env vars)
npm run test:content

# Test with mock data
CLOUDFLARE_ACCOUNT_ID=test npm run test:content

# Generate content manually
npm run generate:content

# Generate screenshots only
npm run generate:screenshots
```

## 🔒 Security Considerations

- API tokens are stored as GitHub secrets
- Generated content is reviewed before deployment
- Rate limiting prevents API abuse
- Loop detection prevents infinite builds
- Cleanup removes old content automatically

## 📊 Monitoring

Check the workflow runs in GitHub Actions:

- `Actions` tab in your repository
- Look for `🤖 Auto Content Generation & Deploy`
- Review logs for any issues

## ⚙️ Customization

### Custom AI Prompts

Modify the prompts to generate specific types of components:

```typescript
const customPrompts = [
  "Create a React-style component with TypeScript",
  "Design a dark mode toggle component",
  "Build a responsive navigation menu",
];
```

### Custom Categories

Update the AI system prompt to use your categories:

```typescript
// In content-generator.ts
content: `Use these categories: ${yourCategories.join(", ")}`;
```

### Build Frequency

Modify the cron schedule in `.github/workflows/auto-content-deploy.yml`:

```yaml
schedule:
  # Run every 6 hours
  - cron: "0 */6 * * *"
```

## 🐛 Troubleshooting

### Common Issues

1. **No components generated**: Check API credentials and rate limits
2. **Build loops**: Verify `SKIP_IF_RECENT_COMMIT` is enabled
3. **Screenshot failures**: Check Puppeteer dependencies
4. **Deployment failures**: Verify Cloudflare Pages configuration

### Debug Commands

```bash
# Check last commit message
git log -1 --pretty=%B

# Test AI API directly
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/ai/run/@cf/mistralai/mistral-small-3.1-24b-instruct" \
  -H "Authorization: Bearer $API_TOKEN" \
  -d '{"messages":[{"role":"user","content":"test"}]}'

# Check generated files
find src/content/tailwind-components/auto-generated -name "*.mdx" -mtime -1
```

## 📈 Scaling

For high-volume generation:

1. **Increase limits**: Adjust `MAX_COMPONENTS_PER_BUILD`
2. **Multiple prompts**: Add more diverse prompts
3. **Custom categories**: Create topic-specific generations
4. **Quality filters**: Add validation for generated content
5. **A/B testing**: Generate variants and measure performance

## 🎯 Best Practices

1. **Monitor API usage**: Track Cloudflare AI consumption
2. **Review content**: Regularly check generated components
3. **Update prompts**: Keep prompts fresh and relevant
4. **Version control**: Tag releases for rollback capability
5. **Performance**: Monitor build times and optimize

---

🎉 **Your site now automatically generates fresh Tailwind components using AI!**
