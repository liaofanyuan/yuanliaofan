# 快速开始指南

## 本地运行

```bash
# 安装依赖
bundle install

# 启动开发服务器
bundle exec jekyll serve

# 访问 http://localhost:4000
```

## 部署到 GitHub Pages

详细步骤请查看 [DEPLOY.md](./DEPLOY.md)

### 快速部署（3 步）

1. **创建 GitHub 仓库并推送代码**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的用户名/yuanliaofan.git
   git branch -M main
   git push -u origin main
   ```

2. **配置 GitHub Pages**
   - 进入仓库的 Settings > Pages
   - Source 选择 "GitHub Actions"

3. **等待部署完成**
   - 在 Actions 标签页查看进度
   - 完成后访问 `https://你的用户名.github.io/yuanliaofan/`

### 重要配置说明

#### 如果部署到 `username.github.io/yuanliaofan/`

在 `_config.yml` 中设置：
```yaml
url: "https://username.github.io"
baseurl: "/yuanliaofan"
```

#### 如果使用自定义域名 `yuanliaofan.com`

在 `_config.yml` 中设置：
```yaml
url: "https://yuanliaofan.com"
baseurl: ""
```

并确保根目录有 `CNAME` 文件，内容为：
```
yuanliaofan.com
```

## 网站结构

```
yuanliaofan/
├── _config.yml          # Jekyll 配置
├── README.md            # 首页（显示四章目录）
├── _posts/              # 文章文件夹
│   ├── 2024-01-01-lesson1.md  # 第一章
│   ├── 2024-01-02-lesson2.md  # 第二章
│   ├── 2024-01-03-lesson3.md  # 第三章
│   └── 2024-01-04-lesson4.md  # 第四章
├── Gemfile              # Ruby 依赖
└── .github/workflows/   # GitHub Actions 配置
```

## 访问链接

- 首页：`/`
- 第一章：`/lesson1.html`
- 第二章：`/lesson2.html`
- 第三章：`/lesson3.html`
- 第四章：`/lesson4.html`

## 修改内容

修改文章内容：
- 编辑 `_posts/2024-01-0X-lessonX.md`
- 提交并推送到 GitHub
- 等待自动部署

修改首页：
- 编辑 `README.md`

修改网站配置：
- 编辑 `_config.yml`

## 主题

本网站使用 [jekyll-gitbook](https://github.com/sighingnow/jekyll-gitbook) 主题。

特性：
- ✅ 类似 GitBook 的阅读体验
- ✅ 侧边栏导航
- ✅ 全文搜索
- ✅ 目录（TOC）自动生成
- ✅ 响应式设计
- ✅ 代码高亮

## 常见问题

### 本地修改后如何更新到网站？

```bash
git add .
git commit -m "更新说明"
git push
```

GitHub Actions 会自动重新构建和部署。

### 如何修改网站标题？

编辑 `_config.yml`：
```yaml
title: 你的标题
longtitle: 你的长标题
```

### 如何添加新文章？

1. 在 `_posts/` 文件夹创建新文件，格式：`YYYY-MM-DD-文章名.md`
2. 添加 front matter：
   ```yaml
   ---
   title: 文章标题
   layout: post
   date: YYYY-MM-DD
   category: 分类
   permalink: /article.html
   ---
   ```
3. 在 `README.md` 中添加链接

### 如何查看构建日志？

访问 GitHub 仓库的 `Actions` 标签页，点击最新的 workflow 运行记录。
