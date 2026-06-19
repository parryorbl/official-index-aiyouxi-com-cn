// assets/content-map.js

const contentMap = {
  site: {
    name: "Official Index Aiyouxi",
    url: "https://official-index-aiyouxi.com.cn",
    description: "A site dedicated to game indexing and discovery."
  },
  categories: [
    {
      id: "action",
      label: "动作游戏",
      tags: ["爱游戏", "act", "战斗", "冒险"],
      items: [
        { title: "极速冲刺", url: "/game/speed-rush", keywords: ["快节奏", "跑酷"] },
        { title: "忍者传说", url: "/game/ninja-legend", keywords: ["忍者", "爱游戏", "潜入"] }
      ]
    },
    {
      id: "puzzle",
      label: "益智解谜",
      tags: ["爱游戏", "puzzle", "逻辑", "脑力"],
      items: [
        { title: "数字迷宫", url: "/game/number-maze", keywords: ["数字", "迷宫", "爱游戏"] },
        { title: "拼图大师", url: "/game/puzzle-master", keywords: ["拼图", "挑战"] }
      ]
    },
    {
      id: "strategy",
      label: "策略游戏",
      tags: ["爱游戏", "strategy", "规划", "塔防"],
      items: [
        { title: "城堡守卫", url: "/game/castle-defense", keywords: ["塔防", "防御"] },
        { title: "星际争霸", url: "/game/star-wars", keywords: ["科幻", "爱游戏", "战争"] }
      ]
    }
  ],
  globalTags: ["爱游戏", "index", "game", "official"], // 站点通用标签
  meta: {
    version: "1.2.0",
    lastUpdated: "2025-03-21"
  }
};

/**
 * 搜索过滤函数：根据关键词匹配内容分区内的条目
 * @param {string} query - 用户输入的搜索词
 * @param {Array} [categories=contentMap.categories] - 可选，指定搜索范围
 * @returns {Array} 匹配的条目数组，每个元素包含分类、标题、url 和匹配关键词
 */
function searchContent(query, categories = contentMap.categories) {
  if (!query || typeof query !== "string") return [];
  const lowerQuery = query.toLowerCase().trim();

  const results = [];

  for (const category of categories) {
    const catLabel = category.label || category.id || "unknown";
    for (const item of category.items || []) {
      const allKeywords = [
        item.title,
        ...(item.keywords || []),
        ...(category.tags || []),
        ...contentMap.globalTags
      ];
      // 将标签和关键词统一检查
      const matchFound = allKeywords.some(kw =>
        kw && kw.toLowerCase().includes(lowerQuery)
      );
      if (matchFound) {
        results.push({
          category: catLabel,
          title: item.title,
          url: item.url,
          matchedQuery: query
        });
      }
    }
  }

  return results;
}

/**
 * 根据分类 id 获取对应分区
 * @param {string} categoryId
 * @returns {object|null}
 */
function getCategoryById(categoryId) {
  const found = contentMap.categories.find(cat => cat.id === categoryId);
  return found || null;
}

/**
 * 合并多个分类的条目，可选按关键词过滤
 * @param {string} [keywordFilter] - 可选过滤词
 * @returns {Array}
 */
function getAllItems(keywordFilter) {
  let items = [];
  for (const cat of contentMap.categories) {
    for (const it of cat.items) {
      items.push({ ...it, category: cat.label, categoryId: cat.id });
    }
  }
  if (keywordFilter) {
    const lower = keywordFilter.toLowerCase();
    items = items.filter(it => {
      const textFields = [it.title, ...(it.keywords || [])].join(" ").toLowerCase();
      return textFields.includes(lower);
    });
  }
  return items;
}

// 简单的自测（非模块环境下不会自动执行，这里保留函数不调用）
// 如果需要测试，可以取消下面注释：
// console.log(JSON.stringify(searchContent("爱游戏"), null, 2));
// console.log(getAllItems("冒险"));

// 导出以便在 Node.js 或浏览器模块中使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = { contentMap, searchContent, getCategoryById, getAllItems };
}