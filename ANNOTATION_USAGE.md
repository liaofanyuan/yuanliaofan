# 💬 译注功能使用指南

## 功能说明

古文译注功能已集成到网站，可以在文章中为古文语句添加白话译文，点击 💬 按钮弹出译注气泡。

## 使用方法

### 方法 1：使用 Jekyll Include 组件（推荐）

在 Markdown 文章中，在需要译注的句子后面添加：

```markdown
我待汝是豪杰，原来只是凡夫。{% include anno.html id="a1" text="我一直把你当作英雄豪杰，原来你只是个普通人。" %}
```

**参数说明：**
- `id`：译注的唯一标识符（同一页面内不能重复，如 a1, a2, a3...）
- `text`：白话译文内容
- `icon`：（可选）按钮图标，默认为 💬
- `label`：（可选）按钮 aria-label，默认为"查看白话译文"

**自定义图标示例：**

```markdown
{% include anno.html id="a2" text="译文内容" icon="📝" %}
```

### 方法 2：直接使用 HTML

如果你需要更多控制，也可以直接写 HTML：

```html
我待汝是豪杰,原来只是凡夫。
<button class="anno-trigger" type="button" data-anno="a1" aria-label="查看白话译文">💬</button>
<span class="anno-pop" id="a1" role="tooltip">
  我一直把你当作英雄豪杰，原来你只是个普通人。
</span>
```

**注意事项：**
- `data-anno` 的值必须与 `id` 的值完全一致
- 同一页面内的 `id` 不能重复（使用 a1, a2, a3... 递增）

## 使用示例

在 `_posts/2024-01-01-lesson1.md` 中添加译注：

```markdown
---
title: 第一章 立命之学
layout: post
date: 2024-01-01
category: 了凡四训
permalink: /lesson1.html
---

余童年丧父，老母命弃举业学医，谓可以养生，可以济人，且习一艺以成名，尔父夙心也。{% include anno.html id="a1" text="我童年时父亲去世，母亲让我放弃科举考试去学医，说这样可以养生，可以帮助别人，而且学一门技艺可以成名，这是你父亲生前的心愿。" %}

后余在慈云寺，遇一老者，修髯伟貌，飘飘若仙，余敬礼之。{% include anno.html id="a2" text="后来我在慈云寺，遇到一位老者，长须伟岸，飘逸如仙，我恭敬地向他行礼。" %}
```

## 功能特性

- ✅ 点击 💬 按钮弹出译注气泡
- ✅ 点击其他地方或按 ESC 键关闭气泡
- ✅ 滚动或缩放窗口时自动关闭
- ✅ 智能定位（自动避免超出屏幕边界）
- ✅ 移动端底部弹窗（更适合触摸屏操作）
- ✅ 网页端气泡式显示（优先上方，自动适配空间）
- ✅ 支持深色模式
- ✅ 符合无障碍标准（ARIA 属性）
- ✅ 响应式设计（自动适配不同屏幕尺寸）

## 技术实现

已创建的文件：
- `assets/css/annotations.css` - 样式文件
- `assets/js/annotations.js` - 交互逻辑
- `_includes/anno.html` - Jekyll 组件
- `_layouts/post.html` - 覆盖主题布局并引入资源

所有 `layout: post` 的文章都会自动加载译注功能。
