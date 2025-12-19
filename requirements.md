

Jekyll 古文译注 💬 按钮弹窗实现文档

1. 功能命名

你这个功能常见叫法：
	•	译注 / 注释（annotation / gloss）
	•	点击弹出气泡（popover）
	•	提示气泡（tooltip）（hover 才更像 tooltip；你这是 click，偏 popover）

⸻

2. 推荐实现方式

在 Jekyll 中最合适的落地方案：
	•	在 Markdown 里嵌入少量 HTML（按钮 + 隐藏译文）
	•	全站引入一份 CSS + JS
	•	用 data-anno / id 关联按钮和译文

⸻

3. 文件结构

在站点根目录创建：

assets/
  css/
    annotations.css
  js/
    annotations.js


⸻

4. 在 layout 中引入 CSS/JS

打开你正在使用的 layout（常见 _layouts/default.html）：

4.1 加 CSS（</head> 前）

<link rel="stylesheet" href="{{ '/assets/css/annotations.css' | relative_url }}">

4.2 加 JS（</body> 前）

<script src="{{ '/assets/js/annotations.js' | relative_url }}" defer></script>


⸻

5. 在 Markdown 正文里怎么写（💬用法）

把 💬 放在句末即可：

我待汝是豪杰，原来只是凡夫。
<button class="anno-trigger" type="button" data-anno="a1" aria-label="查看白话译文">💬</button>
<span class="anno-pop" id="a1" role="tooltip">
  我一直把你当作英雄豪杰，原来你只是个普通人。
</span>

规则
	•	data-anno="a1" 必须对应 id="a1"
	•	同一页多个译注时，a1/a2/a3... 不能重复

⸻

6. CSS：assets/css/annotations.css

保存为 assets/css/annotations.css：

/* 💬 触发按钮 */
.anno-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.25em;
  padding: 0 0.25em;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.95em;
  line-height: 1;
  opacity: 0.75;
}

.anno-trigger:hover,
.anno-trigger:focus-visible {
  opacity: 1;
  outline: none;
  text-decoration: underline;
}

/* 弹出的译文气泡（默认隐藏） */
.anno-pop {
  position: absolute;
  z-index: 9999;
  max-width: min(360px, 80vw);
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.15);
  background: #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  font-size: 0.95em;
  line-height: 1.45;

  display: none;
}

/* 显示状态 */
.anno-pop.is-open {
  display: block;
}

/* 可选：气泡顶部标签（更像“译注”组件） */
.anno-pop::before {
  content: "译注";
  display: block;
  font-size: 0.78em;
  opacity: 0.65;
  margin-bottom: 6px;
}

如果你是暗色主题：把 background: #fff; 换成深色，并把边框/阴影调暗即可。

⸻

7. JS：assets/js/annotations.js

保存为 assets/js/annotations.js：

(function () {
  function closeAll() {
    document.querySelectorAll(".anno-pop.is-open").forEach(el => {
      el.classList.remove("is-open");
    });
    document.querySelectorAll(".anno-trigger[aria-expanded='true']").forEach(btn => {
      btn.setAttribute("aria-expanded", "false");
    });
  }

  function positionPopover(btn, pop) {
    const btnRect = btn.getBoundingClientRect();

    // 先打开以测量尺寸
    pop.classList.add("is-open");
    const popRect = pop.getBoundingClientRect();

    // 默认位置：按钮下方
    let top = btnRect.bottom + window.scrollY + 8;
    let left = btnRect.left + window.scrollX;

    // 防止超出右边界
    const maxLeft = window.scrollX + document.documentElement.clientWidth - popRect.width - 8;
    left = Math.min(left, maxLeft);
    left = Math.max(left, window.scrollX + 8);

    // 底部放不下则放到按钮上方
    const maxTop = window.scrollY + document.documentElement.clientHeight - popRect.height - 8;
    if (top > maxTop) {
      top = btnRect.top + window.scrollY - popRect.height - 8;
    }
    top = Math.max(top, window.scrollY + 8);

    pop.style.top = `${top}px`;
    pop.style.left = `${left}px`;
  }

  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".anno-trigger");
    const popClicked = e.target.closest(".anno-pop");

    // 点到气泡内部：不关闭
    if (!btn && popClicked) return;

    if (btn) {
      const id = btn.getAttribute("data-anno");
      const pop = document.getElementById(id);
      if (!pop) return;

      const isOpen = pop.classList.contains("is-open");

      // 先关掉其它气泡
      closeAll();

      // 原本没开则打开
      if (!isOpen) {
        btn.setAttribute("aria-expanded", "true");
        positionPopover(btn, pop);
      }
      return;
    }

    // 点空白处：关闭
    closeAll();
  });

  // ESC 关闭
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAll();
  });

  // 滚动/缩放时关闭（避免位置漂移）
  window.addEventListener("scroll", closeAll, { passive: true });
  window.addEventListener("resize", closeAll);
})();


⸻

8. 可选：做成 Jekyll include（更省事）

如果你不想每次手写按钮+span，推荐做一个组件。

8.1 创建 _includes/anno.html

<button class="anno-trigger" type="button"
  data-anno="{{ include.id }}"
  aria-label="{{ include.label | default: '查看白话译文' }}"
>
  {{ include.icon | default: "💬" }}
</button>
<span class="anno-pop" id="{{ include.id }}" role="tooltip">
  {{ include.text }}
</span>

8.2 在文章里用（默认就是 💬）

我待汝是豪杰，原来只是凡夫。
{% include anno.html id="a1" text="我一直把你当作英雄豪杰，原来你只是个普通人。" %}

如果你某些地方想更明确，也可以：

{% include anno.html id="a2" text="……" icon="💬注" %}


⸻

9. 实用建议（避免踩坑）
	•	你用的 Jekyll 主题如果会把 Markdown 渲染出来的 HTML “包一层容器”，也没关系，这套是绝大多数主题都兼容的。
	•	如果你的 Markdown 引擎/平台过滤 <button>（少见，主要是某些托管平台），可以退回 <a href="javascript:void(0)">💬</a> 方案，我也能给你备选。

⸻

如果你把你的网站仓库结构（尤其是用哪个 layout、有没有 assets/main.scss）贴一段，我可以帮你把 CSS/JS 放到最符合你当前主题的位置（避免样式被覆盖）。