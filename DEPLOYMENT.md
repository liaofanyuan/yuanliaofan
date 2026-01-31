# 了凡四训网站 - 本地部署教程

本文档介绍如何在本地环境中部署和测试 `yuanliaofan.com` 网站。

---

## 📋 前置要求

### 1. 安装 Ruby

**macOS:**
```bash
# 检查是否已安装
ruby -v

# 推荐使用 Homebrew 安装最新版 Ruby
brew install ruby

# 添加到 PATH（添加到 ~/.zshrc）
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Windows:**
- 下载安装 [RubyInstaller](https://rubyinstaller.org/)
- 安装时勾选 "Add to PATH"

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install ruby-full
```

### 2. 安装 Bundler

```bash
gem install bundler
```

---

## 🚀 快速启动（推荐）

### 方法 1：使用项目内脚本

项目根目录已包含所有依赖配置，直接执行：

```bash
# 1. 进入项目目录
cd /Users/mac/code/web/liaofan/yuanliaofan

# 2. 安装依赖
bundle install

# 3. 启动本地服务器
bundle exec jekyll serve

# 4. 浏览器访问 http://localhost:4000
```

### 方法 2：使用 Docker（无需安装 Ruby）

```bash
# 1. 确保已安装 Docker

# 2. 在项目目录运行
docker run --rm \
  --volume="$PWD:/srv/jekyll" \
  --publish 4000:4000 \
  jekyll/jekyll:4.2.0 \
  jekyll serve --watch --drafts

# 3. 浏览器访问 http://localhost:4000
```

---

## 🔧 详细步骤说明

### 步骤 1：克隆项目

```bash
git clone https://github.com/liaofanyuan/yuanliaofan.git
cd yuanliaofan
```

### 步骤 2：安装依赖

```bash
bundle install
```

> **注意**：如果遇到权限问题，使用 `bundle install --path vendor/bundle`

### 步骤 3：启动开发服务器

```bash
bundle exec jekyll serve
```

常用参数：
```bash
# 实时重新加载（文件修改后自动刷新）
bundle exec jekyll serve --livereload

# 监听所有网络接口（允许局域网其他设备访问）
bundle exec jekyll serve --host 0.0.0.0

# 指定端口
bundle exec jekyll serve --port 4001

# 包含草稿（_drafts 目录）
bundle exec jekyll serve --drafts

# 生产环境构建（不包含草稿）
bundle exec jekyll serve --env production
```

### 步骤 4：访问网站

- **首页**: http://localhost:4000/
- **原文 - 立命之学**: http://localhost:4000/lesson1.html
- **学习模式 - 立命之学**: http://localhost:4000/learn/lesson1.html
- **其他章节**: 在首页导航中查看

---

## 📝 项目结构说明

```
yuanliaofan/
├── _config.yml          # Jekyll 配置文件
├── _data/               # 数据文件（JSON/YAML）
│   └── lessons/
│       └── lesson1.json # 学习模式模块配置
├── _includes/           # 可复用的 HTML 片段
├── _layouts/            # 页面布局模板
│   ├── home.html        # 首页布局（jekyll-gitbook 主题自带）
│   ├── post.html        # 文章页布局
│   └── learn.html       # 学习模式布局（新增）
├── _posts/              # 文章内容
│   ├── 2024-01-01-lesson1.md  # 立命之学（原文）
│   ├── 2024-01-02-lesson2.md  # 改过之法
│   ├── 2024-01-03-lesson3.md  # 积善之方
│   └── 2024-01-04-lesson4.md  # 谦德之效
├── _site/               # 生成的静态网站（自动创建，勿编辑）
├── assets/              # 静态资源
│   ├── css/
│   │   ├── annotations.css  # 注释系统样式
│   │   └── learn-mode.css   # 学习模式样式（新增）
│   └── js/
│       ├── annotations.js   # 注释系统脚本
│       └── learn-mode.js    # 学习模式脚本（新增）
├── learn/               # 学习模式页面
│   └── lesson1.html     # 立命之学学习模式入口
├── Gemfile              # Ruby 依赖定义
├── Gemfile.lock         # 依赖版本锁定
└── README.md            # 首页内容
```

---

## 🧪 测试学习模式

部署完成后，可以按以下流程测试新功能：

1. **访问首页**: http://localhost:4000/
2. **点击"体验自主学习模式"** 链接
3. **测试模块功能**:
   - 阅读 M1 模块内容
   - 点击"查看本模块大纲"
   - 点击"我已理解，进入下一模块"
4. **完成所有 6 个模块** 后进入测试
5. **完成测试** 查看结果页面
6. **点击"查看完整原文"** 返回传统阅读模式

---

## 🛠️ 常见问题

### Q1: `bundle install` 很慢或失败

```bash
# 使用国内镜像加速
bundle config mirror.https://rubygems.org https://gems.ruby-china.com
bundle install
```

### Q2: 端口被占用

```bash
# 查看占用端口的进程
lsof -i :4000

# 使用其他端口启动
bundle exec jekyll serve --port 4001
```

### Q3: 修改后页面没有更新

```bash
# 清除缓存并重启
bundle exec jekyll clean
bundle exec jekyll serve
```

### Q4: Webrick 报错（Ruby 3.0+）

```bash
# Ruby 3.0 后 Webrick 不再是默认 gem
bundle add webrick
bundle exec jekyll serve
```

### Q5: 学习模式数据不加载

检查浏览器控制台是否有错误，确保：
1. `_data/lessons/lesson1.json` 文件存在且 JSON 格式正确
2. `learn/lesson1.html` 中 `lessonId: lesson1` 配置正确

---

## 📝 开发工作流程

### 添加新的学习模式章节

以《改过之法》为例：

1. **创建数据配置**
   ```bash
   cp _data/lessons/lesson1.json _data/lessons/lesson2.json
   # 编辑 lesson2.json，修改内容和模块划分
   ```

2. **创建学习模式页面**
   ```bash
   cp learn/lesson1.html learn/lesson2.html
   # 编辑 lesson2.html:
   # - title: 改过之法 · 自主学习模式
   # - lessonId: lesson2
   # - permalink: /learn/lesson2.html
   # - 替换内容为《改过之法》原文
   ```

3. **更新导航**
   在 `README.md` 中添加链接

4. **重启服务器** 或等待自动刷新

---

## 📦 部署到生产环境

### GitHub Pages（推荐）

本项目已配置为 GitHub Pages 部署，推送代码后自动部署：

```bash
git add .
git commit -m "feat: 添加学习模式功能"
git push origin main
```

访问 `https://liaofanyuan.github.io/yuanliaofan` 查看部署结果。

### 手动构建

```bash
# 生成静态文件到 _site 目录
bundle exec jekyll build

# 将 _site 目录内容部署到任意静态服务器
rsync -avz _site/ user@server:/var/www/html/
```

---

## 📚 相关资源

- [Jekyll 官方文档](https://jekyllrb.com/docs/)
- [GitHub Pages + Jekyll 指南](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll)
- [jekyll-gitbook 主题](https://github.com/sighingnow/jekyll-gitbook)

---

**如有问题，请在 GitHub Issues 中反馈。**
