# 🖼️ 图片资源设置指南

本指南帮助您快速为网站添加封面图片。

---

## 🎯 快速开始 (3种方案)

### 方案1: 自动下载 - 占位图片 (最快, 无需注册)

**适合**: 快速测试、预览网站
**耗时**: 5分钟
**质量**: ⭐⭐⭐

```bash
# 1. 运行脚本（无需API密钥）
node download-placeholder-images.js

# 2. 完成！图片会自动保存到 public/images/covers/
```

**优点**:
- ✅ 无需注册或API密钥
- ✅ 完全自动化
- ✅ 图片免费可商用

**缺点**:
- ⚠️ 每次运行图片可能不同（随机）
- ⚠️ 图片可能不够精准匹配内容

---

### 方案2: 自动下载 - Unsplash API (推荐)

**适合**: 生产环境、需要高质量图片
**耗时**: 15分钟
**质量**: ⭐⭐⭐⭐⭐

```bash
# 1. 获取免费API密钥
# 访问: https://unsplash.com/developers
# 点击 "Register as a developer"
# 创建新应用，复制 "Access Key"

# 2. 运行下载脚本
UNSPLASH_ACCESS_KEY=你的密钥 node download-images.js

# 3. 完成！31张高质量图片自动下载
```

**优点**:
- ✅ 高质量专业图片
- ✅ 精准匹配文章内容
- ✅ 完全自动化
- ✅ 免费（每小时50次请求）
- ✅ 保存图片归属信息

**缺点**:
- ⚠️ 需要注册Unsplash账号
- ⚠️ 需要API密钥

**下载后的文件**:
```
public/images/covers/
├── healthy-breakfast-recipes.jpg
├── healthy-breakfast-recipes.json (归属信息)
├── ...
└── _attributions.json (所有图片归属)
```

---

### 方案3: 手动下载

**适合**: 需要特定图片、完全控制
**耗时**: 1-2小时
**质量**: ⭐⭐⭐⭐⭐

1. 打开 `IMAGE-REQUIREMENTS.md`
2. 查看每张图片的详细描述和搜索关键词
3. 访问图库网站：
   - https://unsplash.com
   - https://pexels.com
   - https://pixabay.com
4. 搜索并下载图片
5. 重命名为正确的文件名
6. 保存到 `public/images/covers/`

**优点**:
- ✅ 完全控制图片选择
- ✅ 可以选择最佳质量
- ✅ 可以根据品牌风格选择

**缺点**:
- ⚠️ 耗时较长
- ⚠️ 需要手动操作

---

## 📋 需要的图片清单

总共 **31张** 封面图片：

| 分类 | 数量 | 图片列表 |
|------|------|---------|
| **Healthy Recipes** | 12 | healthy-breakfast-recipes.jpg, healthy-smoothie-recipes.jpg, healthy-tuna-salad.jpg, healthy-chicken-and-rice.jpg, healthy-snack-recipes.jpg, healthy-dinner-recipes.jpg, healthy-pasta-recipes.jpg, healthy-dessert-recipes.jpg, healthy-air-fryer-recipes.jpg, healthy-crockpot-recipes.jpg, healthy-banana-bread.jpg, healthy-chicken-recipes.jpg |
| **Meal Prep** | 7 | high-protein-meal-prep.jpg, meal-prep-for-beginners.jpg, meal-prep-ideas.jpg, meal-prep-grocery-list.jpg, meal-prep-for-weight-loss.jpg, vegan-meal-prep.jpg, meal-prep-containers.jpg |
| **Clean Eating** | 5 | clean-simple-eats-products.jpg, clean-eating-snacks.jpg, clean-eating-meal-plan.jpg, what-is-clean-eating.jpg, clean-eating-food-list.jpg |
| **Healthy Eating** | 6 | healthy-eating-for-skin.jpg, healthy-eating-for-beginners.jpg, healthy-eating-for-pcos.jpg, harvard-healthy-eating-plate.jpg, eating-healthy-on-a-budget.jpg, healthy-eating-grocery-list.jpg |
| **Resources** | 1 | meal-planner.jpg |

---

## 🔧 技术要求

### 图片规格
```
尺寸: 1200x630px (最低) 或 1920x1080px (推荐)
格式: JPG
大小: 100-500KB (优化后)
方向: 横向 (Landscape)
质量: 高清，无水印
```

### 文件位置
```
项目根目录/
└── public/
    └── images/
        └── covers/
            ├── healthy-breakfast-recipes.jpg
            ├── healthy-smoothie-recipes.jpg
            └── ... (所有31张图片)
```

---

## ✅ 验证图片设置

下载完成后，运行以下命令验证：

```bash
# 检查图片数量
ls public/images/covers/*.jpg | wc -l
# 应该输出: 31

# 查看所有图片文件
ls -lh public/images/covers/

# 启动开发服务器测试
npm run dev
```

访问网站，检查：
- ✅ 首页文章卡片显示封面图
- ✅ 文章详情页显示封面图
- ✅ 图片加载速度快
- ✅ 图片清晰，无变形

---

## 🎨 图片优化 (可选)

如果图片文件太大，可以优化：

### 方法1: 使用在线工具
- **TinyPNG**: https://tinypng.com
- **Squoosh**: https://squoosh.app

### 方法2: 使用命令行工具
```bash
# 安装 imagemagick
brew install imagemagick  # macOS
# 或
sudo apt-get install imagemagick  # Linux

# 批量优化图片
cd public/images/covers
for img in *.jpg; do
  convert "$img" -quality 85 -resize 1200x630^ -gravity center -extent 1200x630 "optimized-$img"
done
```

---

## 📊 图片来源归属

### 如果使用Unsplash
查看 `public/images/covers/_attributions.json` 获取所有图片的归属信息。

Unsplash要求（建议但非必须）:
- 在网站某处提供归属链接
- 格式: "Photo by [摄影师] on Unsplash"

### 示例归属页面
可以在网站底部或关于页面添加：
```
本站图片由Unsplash提供，感谢以下摄影师:
- [摄影师名字](链接) - [图片描述]
```

---

## 🆘 常见问题

### Q: 图片不显示？
A: 检查：
1. 文件名是否完全匹配（区分大小写）
2. 图片是否在正确的目录 `public/images/covers/`
3. 浏览器控制台是否有404错误
4. 重启开发服务器

### Q: 图片太大加载慢？
A:
1. 使用图片优化工具压缩
2. 确保尺寸不超过1920x1080px
3. 使用Astro的图片组件自动优化

### Q: API请求超限？
A:
- Unsplash免费版: 50请求/小时
- 等待1小时后再试
- 或先用占位图片方案

### Q: 想更换某张图片？
A:
1. 删除对应的图片文件
2. 重新运行下载脚本，或
3. 手动下载新图片并重命名

---

## 📚 相关文档

- `IMAGE-REQUIREMENTS.md` - 详细的图片需求说明
- `download-images.js` - Unsplash API下载脚本
- `download-placeholder-images.js` - 快速占位图片脚本

---

## 🎉 完成后的下一步

图片设置完成后：

1. ✅ 创建动态路由页面 (让文章可访问)
2. ✅ 设置环境变量 (.env)
3. ✅ 运行生产构建测试
4. ✅ 部署到生产环境

---

**需要帮助？**
查看详细文档或在GitHub提交Issue。

**最后更新**: 2025-10-20
