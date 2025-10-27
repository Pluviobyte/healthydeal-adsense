---
title: "SEO文章内容原则：健康饮食博客内容生成标准"
slug: "seo-content-guidelines"
description: "完整的内容创作标准，包括文章结构、SEO优化、内链策略、Topic Cluster架构，确保内容符合Google E-E-A-T标准并可直接部署到Astro/Vercel环境。"
date: 2025-10-20
updated: 2025-10-20
author: "Content & SEO Strategy Team – CodeEX"
section: "resources"
tags: ["SEO", "内容策略", "规范", "内链策略"]
keywords: ["SEO 内容", "Topic Cluster", "Frontmatter 规范", "内链策略", "文章优化"]
coverImage: "/images/covers/meal-planner.jpg"
readingTime: 18
toc: true
featured: false
ads:
  top: false
  mid: false
  bottom: false
schemaType: "Article"
faq:
  - q: "Frontmatter 字段是否必须全部填写？"
    a: "站内文章建议完整填写以利于 SEO；当前内容模型允许可选字段，但标题/描述/日期/section 必填。"
  - q: "模板文件放在哪里？"
    a: "建议在项目根目录的 templates/ 下放置 article-template.md，并按 cp 命令复制到 src/content/[section]/[slug].md。"
  - q: "联盟链接需要加 rel=\"sponsored\" 吗？"
    a: "是，所有联盟链接必须添加 {: rel=\"sponsored\" } 并附上免责声明。"
  - q: "每篇文章都需要链接到主页吗？"
    a: "是的，所有内页都应该添加1-2个指向主页的内链，这有助于权重分配和用户体验。"
  - q: "文章最低字数要求是多少？"
    a: "所有文章必须达到1500词以上，Pillar Page建议2000+词，确保内容深度和SEO竞争力。"
---

# 📘 内容生成准则：SEO 内容站文章生成策略

适用范围：本指南用于创建符合 SEO 语义聚合策略的 Markdown 文章。

目标：统一站点内文档结构、SEO 配置与长尾词聚合逻辑，使每篇内容可直接发布至 Astro/Vercel 环境中。

---

## 🧭 一、文章定位与类型划分（Topic Cluster）

网站所有文章分为三类结构层次，用于形成主题聚合（Topic Cluster）：

- Pillar Page（支柱页）：解释核心主题，聚合子页面链接。例如：`what-is-clean-eating.md`。
- Cluster Page（集群页）：深入讲解特定长尾关键词。例如：`clean-eating-food-list.md`、`eating-healthy-on-a-budget.md`。
- Commercial/Product Page（商业页）：联盟推广、产品测评。例如：`clean-simple-eats-products.md`。

要求：
- 每篇文章可独立获得搜索流量；
- 通过内链与支柱页形成语义网络，强关联同主题内容；
- 每个主题目录具备完整的 Pillar/Cluster/Commercial 架构（见第九、十节）。

---

## 🧩 二、文件结构与 Frontmatter 标准

每篇 Markdown 文件的头部（YAML frontmatter）必须完整包含以下字段：

```yaml
---
title: "文章标题（含核心关键词）"
slug: "url-slug"
description: "简洁的SEO描述（含长尾词）"
date: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
author: "Editorial Team"
section: "所属主题目录，如 clean-eating / healthy-eating"
tags: ["关键词1", "关键词2"]
keywords: ["核心词", "长尾词1", "长尾词2"]
coverImage: "/images/covers/xxxx.jpg"
readingTime: 5
toc: true
featured: false
canonical: "https://example.com/.../"
ads:
  top: true
  mid: true
  bottom: true
schemaType: "Article" # 或 HowTo / Product
faq:
  - q: "常见问题"
    a: "回答"
---
```

要求：
- 所有字段必须存在，不得省略（与本站内容模型兼容的同时，建议尽量完整）。
- `keywords` 至少 3 个：主关键词 + ≥2 个长尾关键词。
- `schemaType` 根据文章类型（信息/HowTo/产品）自动选择（见下节）。

---

## ⚙️ 三、SchemaType 使用规范

- "Article"：普通信息型内容，例如 “What Is Clean Eating?”
- "HowTo"：步骤/计划型内容，例如 “7-Day Clean Eating Meal Plan”
- "Product"：评测、推荐或联盟内容，例如 “Clean Simple Eats Products Review”

说明：所有 FAQ 将转为结构化 FAQ schema，用于获取 Google 富摘要。

---

## 📐 四、文章通用结构模板

每篇文章应遵循统一的 Markdown 架构，保证内容结构一致：

<!-- Ad: top -->

## Section 1 — Introduction / Definition
说明核心概念或问题背景。主关键词应自然出现 2–3 次。

## Section 2 — Subtopic / Process
阐述核心逻辑、原理或流程。适当使用 H3 标题分层。

<!-- Ad: mid -->

## Section 3 — Practical / Actionable Tips
提供可执行的策略、方法、清单或对比。

## Section 4 — Related Topics / Case Studies
可链接至相关内页，强化主题聚合。

## FAQs
- **Question 1**  
  Answer 1  
- **Question 2**  
  Answer 2

<!-- Ad: bottom -->

广告位规范：
- `<!-- Ad: top -->`：文章开头引导广告（1 个）
- `<!-- Ad: mid -->`：正文中部信息型广告（1 个）
- `<!-- Ad: bottom -->`：结尾 CTA 或联盟广告（1 个）

---

## 🔍 五、关键词策略与内容匹配规则

1) 主关键词（Primary Keyword）
- 每篇文章仅有 1 个主关键词，需出现在：`title`、`slug`、`description`、第一段正文、至少一个 H2 小标题。

2) 长尾关键词（Long-Tail Keywords）
- 每篇文章覆盖 2–5 个长尾词；分布在小标题与正文中；自然融入，不堆砌；与主词语义相关；至少 1 个长尾词在 FAQ 中出现。

示例：
- 主词：`eating healthy on a budget`  
- 长尾：`cheap healthy meals`, `budget meal prep tips`, `affordable meal ideas`

3) 语义聚合原则（Semantic Clustering）
- 每个主题目录（如 `/clean-eating/`、`/healthy-eating/`）需包含：
  - 1 个 Pillar Page（主支柱页）
  - 3–6 个 Cluster Pages（围绕长尾词）
  - 1 个 Commercial Page（评测/变现页）
- 内部互链规则示例：
  - See our [Clean Eating Food List](/clean-eating/clean-eating-food-list/)
    or try this [7-Day Clean Eating Meal Plan](/clean-eating/clean-eating-meal-plan/).

---

## 🔗 六、内链策略与网站架构

### 主页链接策略（Home Link Strategy）

**为什么每篇文章都需要链接主页：**

1. **SEO权重分配 (Link Equity Distribution)**
   - 主页通常拥有最高的域名权重
   - 内页指向主页可以反向传递权重
   - 形成健康的链接循环，提升整体网站权重

2. **用户体验优化 (User Experience)**
   - 用户随时可以回到首页重新导航
   - 减少迷失感，降低跳出率
   - 符合网站导航���觉，提升用户满意度

3. **Google爬虫友好性 (Crawler Accessibility)**
   - 帮助爬虫理解网站层级结构
   - 强化首页作为中心枢纽的地位
   - 改善整体网站架构评分

**主页链接实施标准：**

- **数量要求**: 每篇文章1-2个指向主页的内链
- **位置选择**:
  - 文章开头段落（前100词内）- 自然引入
  - 文章结尾总结 - 行动号召
  - FAQ附近 - 上下文自然过渡
- **锚文本多样化**:
  - 品牌名: `[Healthy Meal Hub](/)`
  - 功能性: `[our homepage](/)`, `[main page](/)`
  - 内容导向: `[nutrition guides](/)`, `[healthy recipes](/)`

**主页链接示例：**
```markdown
# 文章开头示例
Welcome to our comprehensive guide on [topic]. At [Healthy Meal Hub](/), we believe...

# 文章结尾示例
Ready to start your health journey? Explore more resources on our [homepage](/) or discover related articles.

# 自然过渡示例
For more healthy eating strategies and complete meal plans, visit [Healthy Meal Hub](/) where we share weekly recipes and nutrition tips.
```

### Topic Cluster内链架构

**内链层级原则：**
1. **Pillar Page** ← Cluster Pages (主要链接流向)
2. **Cluster Pages** → Pillar Page (辅助链接，1-2个)
3. **Cluster Pages** ↔ Cluster Pages (交叉推荐，相关主题)
4. **All Pages** → Homepage (必须包含)

**内链密度控制：**
- 每篇文章总内链数: 3-8个
- 主页链接: 1-2个
- Pillar Page链接: 1个（Cluster页面）
- 相关Cluster链接: 1-2个
- 避免过度链接影响用户体验

---

## 🧠 七、内容写作要点

- 信息型文章：清晰解释概念、避免营销语（示例：What Is Clean Eating?）。
- 行动型文章：明确步骤、使用 How-To 结构（示例：7-Day Clean Eating Meal Plan）。
- 清单类文章：使用 bullet list 展示、分类清晰（示例：Clean Eating Food List）。
- 产品页：公正、真实评测；联盟链接需标记 `rel="sponsored"`（示例：Clean Simple Eats Review）。
- 预算类内容：强调"实用性 + 节省技巧"（示例：Eating Healthy on a Budget）。

---

## 📏 七、内容深度与字数要求

### 最低字数标准

**Google E-E-A-T时代的内容深度要求：**

1. **文章类型与字数要求**:
   - **Pillar Page（支柱页）**: 2000+ 词（核心主题全面覆盖）
   - **Cluster Page（集群页）**: 1500+ 词（长尾关键词深度解析）
   - **Commercial Page（商业页）**: 1200+ 词（产品详细评测）
   - **Short Form（短内容）**: 800+ 词（仅限特定特殊情况）

2. **为什么需要1500+词**:
   - **内容深度**: 充分覆盖主题各个方面
   - **SEO竞争力**: 对抗竞争对手的长篇内容
   - **用户价值**: 提供真正有用的信息
   - **Google偏好**: 长篇内容通常获得更高排名

3. **字数分配建议**:
   - 引言部分: 150-200词
   - 主体内容: 1000-1200词（3-5个主要章节）
   - 结论总结: 100-150词
   - FAQ部分: 200-300词（4-6个问答）

**质量检测标准：**
- 内容原创性 > 95%
- 信息密度高，避免空洞内容
- 实用性强，提供可执行建议
- 结构化数据完整，支持富摘要

---

## 💰 八、联盟与广告内容要求

联盟链接规则：
- 不是必须使用联盟链接
- 必须使用真实目标网址，不得使用 `example.com`，假如使用，需要进行询问：是需要注册真实链接还是采用品牌官网链接替代。
- 所有联盟链接添加：`{: rel="sponsored" }`
- 必须附免责声明：

> Disclaimer: This post contains affiliate links. We may earn a commission if you purchase through these links, at no extra cost to you.

广告位（Ads）
- 通过 Frontmatter `ads:` 控制广告插入位置。
- 工程师需确保组件根据 `ads.top/mid/bottom` 自动渲染。

---

## 🧱 八、图片与资源规范

- 分类与路径：
  - 封面图：`/images/covers/xxx.jpg`（必须存在，尺寸 ≥ 1200×600）
  - 产品图：`/images/products/...`（必须可访问）
  - 占位图：`https://via.placeholder.com/600x600?text=Product`（仅限临时使用）
- Alt 属性：必须包含主要关键词或产品名（示例：`alt="Clean Eating Snack Ideas"`）。

---

## ⚠️ 九、质量检测与发布前检查

发布前必查清单：
- 内部链接：不得出现 404。
- 图片：不得缺失；封面图有效。
- 联盟链接：不得指向无效域名；含 `rel="sponsored"` 与免责声明。
- Meta 信息：`title/description` 不可为空；包含主词与长尾词。
- SchemaType：与内容类型一致（Article/HowTo/Product）。
- FAQ：至少 3 条且语义完整；有长尾词分布。

---

## 🧩 十、Cluster 架构示例（Healthy Eating）

- What Is Healthy Eating?（what is healthy eating）— Pillar
- Eating Healthy on a Budget（eating healthy on a budget, cheap healthy meals）— Cluster
- Healthy Eating Grocery List（healthy eating grocery list, healthy staples）— Cluster
- Healthy Breakfast Ideas（healthy breakfast ideas）— Cluster
- Best Budget Meal Prep Containers（meal prep containers cheap, food storage ideas）— Commercial

---

## ✅ 十一、写作风格与语言规范

- 使用自然口语化英文，适合美式读者；
- 每段 3–5 句，避免长段；
- 标题以动词开头；
- 避免空洞描述，始终提供“可执行建议”；
- 尽量使用积极语态与具体数字（如 “Save 30–50%”）。

---

## 🧩 十二、审核与版本控制

流程：
- 内容工程师 撰写初稿；
- 编辑团队 校对语法、逻辑；
- SEO 审查 关键词、Schema、链接；
- 通过后提交 Git 变更 → `src/content/.../`；
- Vercel 自动构建与部署。

---

---

## 🧭 十三、结语

本准则确保每一篇生成的文章具备：

- 语义聚合良好；
- 覆盖核心与长尾关键词；
- 内链完整；
- 广告布局标准；
- 可直接部署上线。

一句话总结：
每篇文章 = 一个独立流量入口 + 一个主题聚合节点 + 一个变现机会点。

---

Version: 1.0  

