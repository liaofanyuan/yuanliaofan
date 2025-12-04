# 部署到 GitHub Pages 指南

本文档将指导你如何将了凡四训网站部署到 GitHub Pages。

## 前提条件

- GitHub 账号
- 已安装 Git
- 项目已经可以在本地正常运行（`bundle exec jekyll serve`）

## 部署步骤

### 1. 创建 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角的 `+` 号，选择 `New repository`
3. 填写仓库信息：
   - **Repository name**: `yuanliaofan`（或你想要的名字）
   - **Description**: 了凡四训网站
   - **Public/Private**: 选择 `Public`
   - 不要勾选 "Initialize this repository with a README"
4. 点击 `Create repository`

### 2. 初始化本地 Git 仓库（如果还没有）

在项目根目录执行：

```bash
# 如果还没有 git 仓库，执行以下命令
git init
git add .
git commit -m "Initial commit: 了凡四训网站"
```

### 3. 关联远程仓库并推送

将 GitHub 上创建的仓库关联到本地：

```bash
# 替换为你的 GitHub 用户名和仓库名
git remote add origin https://github.com/你的用户名/yuanliaofan.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 4. 配置 GitHub Pages

#### 方法一：使用 GitHub Actions（推荐）

1. 在项目根目录创建 `.github/workflows/` 文件夹
2. 创建文件 `.github/workflows/jekyll.yml`，内容如下：

```yaml
name: Deploy Jekyll site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1'
          bundler-cache: true
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Build with Jekyll
        run: bundle exec jekyll build --baseurl "${{ steps.pages.outputs.base_path }}"
        env:
          JEKYLL_ENV: production
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. 提交并推送这个文件：

```bash
git add .github/workflows/jekyll.yml
git commit -m "Add GitHub Actions workflow for deployment"
git push
```

4. 在 GitHub 仓库页面：
   - 点击 `Settings`
   - 左侧菜单点击 `Pages`
   - 在 `Source` 下拉菜单中选择 `GitHub Actions`

#### 方法二：直接从分支部署

1. 在 GitHub 仓库页面，点击 `Settings`
2. 左侧菜单点击 `Pages`
3. 在 `Source` 下拉菜单中选择 `Deploy from a branch`
4. 选择 `main` 分支和 `/ (root)` 文件夹
5. 点击 `Save`

### 5. 更新配置文件（如果使用自定义域名）

如果你想使用自定义域名（如 yuanliaofan.com）：

1. 更新 `_config.yml`：

```yaml
url: "https://你的用户名.github.io"
baseurl: "/yuanliaofan"  # 如果仓库名不是用户名.github.io，需要设置
```

2. 如果使用自定义域名：

```yaml
url: "https://yuanliaofan.com"
baseurl: ""
```

3. 在 GitHub 仓库的 Settings > Pages 中配置自定义域名
4. 在你的域名提供商处添加 DNS 记录

### 6. 等待部署完成

- 如果使用 GitHub Actions，可以在 `Actions` 标签页查看部署进度
- 部署通常需要 1-2 分钟
- 完成后，你的网站将在以下地址可访问：
  - `https://你的用户名.github.io/yuanliaofan/`（如果是普通仓库）
  - `https://你的用户名.github.io/`（如果仓库名是 `你的用户名.github.io`）
  - `https://yuanliaofan.com`（如果配置了自定义域名）

## 日常更新流程

当你修改了内容后，只需执行：

```bash
git add .
git commit -m "更新内容描述"
git push
```

GitHub Actions 会自动重新构建和部署网站。

## 常见问题

### 1. 样式丢失或链接不工作

检查 `_config.yml` 中的 `baseurl` 设置是否正确：

- 如果仓库名是 `yuanliaofan`，应设置 `baseurl: "/yuanliaofan"`
- 如果使用自定义域名或仓库名是 `用户名.github.io`，应设置 `baseurl: ""`

### 2. 404 错误

- 确保 `CNAME` 文件（如果有）内容正确
- 检查 GitHub Pages 设置中的 Source 配置
- 等待几分钟让 DNS 生效

### 3. 构建失败

查看 GitHub Actions 的错误日志，通常是 Gemfile 依赖问题。确保本地可以正常运行。

## 本地测试

在推送到 GitHub 之前，建议先在本地测试：

```bash
# 以生产模式构建
JEKYLL_ENV=production bundle exec jekyll build

# 或者直接运行服务器
bundle exec jekyll serve
```

访问 `http://localhost:4000` 确认一切正常。

## 注意事项

1. **不要提交敏感信息**：检查 `.gitignore` 文件，确保不会提交 `_site/`、`.sass-cache/` 等文件夹
2. **Gemfile.lock**：应该提交这个文件，确保 GitHub 使用相同的依赖版本
3. **主题更新**：jekyll-gitbook 主题会自动从远程获取最新版本

## 自定义域名配置（可选）

如果你已经有域名 `yuanliaofan.com`：

1. 在仓库根目录确保有 `CNAME` 文件，内容为：
   ```
   yuanliaofan.com
   ```

2. 在域名提供商处添加 DNS 记录：
   ```
   类型: A
   名称: @
   值: 185.199.108.153
   值: 185.199.109.153
   值: 185.199.110.153
   值: 185.199.111.153
   ```

   或使用 CNAME 记录：
   ```
   类型: CNAME
   名称: www
   值: 你的用户名.github.io
   ```

3. 在 GitHub 仓库的 Settings > Pages 中设置 Custom domain 为 `yuanliaofan.com`
4. 勾选 `Enforce HTTPS`

## 完成

现在你的了凡四训网站已经成功部署到 GitHub Pages！

访问链接：
- 首页：`https://你的用户名.github.io/yuanliaofan/`
- 第一章：`https://你的用户名.github.io/yuanliaofan/lesson1.html`
- 第二章：`https://你的用户名.github.io/yuanliaofan/lesson2.html`
- 第三章：`https://你的用户名.github.io/yuanliaofan/lesson3.html`
- 第四章：`https://你的用户名.github.io/yuanliaofan/lesson4.html`
