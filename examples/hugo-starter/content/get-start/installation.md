+++
title = 'Installation'
date = '2025-06-23T11:06:56+08:00'
draft = false
weight = 1
[menu.main]
  parent = "get-start"
+++

# Hugo Installation Guide

Hugo is a fast and modern static site generator written in Go. This guide will help you install Hugo on your system.

## System Requirements

- Supported Operating Systems: Windows, macOS, Linux
- Disk Space: Approximately 50MB
- Go Version: 1.18 or higher (if building from source)

## Installation Methods

### macOS Installation

The easiest way to install Hugo on macOS is using Homebrew:

```bash
brew install hugo
```

After installation, verify it:

```bash
hugo version
```

### Windows Installation

1. Using Chocolatey:
```bash
choco install hugo
```

2. Or download precompiled binary from [Hugo Releases](https://github.com/gohugoio/hugo/releases)

### Linux Installation

Ubuntu/Debian:
```bash
sudo apt update
sudo apt install hugo
```

## Verify Installation

After installation, run the following command to verify if the installation was successful:

```bash
hugo version
```

## Create a New Site

Once Hugo is installed, you can create a new Hugo site:

```bash
hugo new site my-site
cd my-site
```

## Add a Theme

Most Hugo sites use themes. Here's how to add a theme:

```bash
git init
git submodule add https://github.com/theNewDynamic/gohugo-theme-ananke.git themes/ananke
echo "theme = 'ananke'" >> hugo.toml
```

## Create Content

Create your first post:

```bash
hugo new content posts/my-first-post.md
```

## Start Local Server

Run the following command to start a local development server:

```bash
hugo server -D
```

You can now view your site at http://localhost:1313 in your browser.

## Common Issues

1. **Installation Fails?**
   - Ensure you have administrator privileges
   - Check system requirements
   - Review error messages

2. **Hugo Command Not Found?**
   - Ensure Hugo is added to your system's PATH
   - Restart your terminal or command prompt

3. **Theme Not Loading?**
   - Check theme configuration in hugo.toml
   - Verify theme directory exists

## Next Steps

- Learn Hugo's basic concepts
- Explore available themes
- Understand content organization
- Study the templating system

## Additional Resources

- [Hugo Official Documentation](https://gohugo.io/documentation/)
- [Hugo Themes Gallery](https://themes.gohugo.io/)
- [Hugo Forum](https://discourse.gohugo.io/)

## Advanced Tips

1. **Extended Version Features**
   - SASS/SCSS processing
   - Asset fingerprinting
   - Custom output formats

2. **Development Best Practices**
   - Use version control
   - Organize content effectively
   - Implement CI/CD pipelines

3. **Performance Optimization**
   - Optimize images
   - Minify resources
   - Enable caching

## Troubleshooting

### Common Error Messages

1. **"Unable to locate package hugo"**
   - Update package repositories
   - Check package name
   - Try alternative installation method

2. **"Git submodule error"**
   - Initialize git repository first
   - Check internet connection
   - Verify repository URL

3. **"Port already in use"**
   - Stop other local servers
   - Use different port: `hugo server -p 1314`

### Best Practices

1. **Project Structure**
   - Keep content organized
   - Use meaningful names
   - Follow Hugo conventions

2. **Version Control**
   - Commit regularly
   - Use .gitignore
   - Document changes

3. **Backup Strategy**
   - Regular backups
   - Use remote repositories
   - Document configuration
