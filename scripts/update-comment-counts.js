/**
 * 从 GitHub Discussions 获取实际评论数量，更新 posts-list.json
 * 
 * 用法:
 *   GITHUB_TOKEN=xxx node scripts/update-comment-counts.js
 *   node scripts/update-comment-counts.js --dry-run
 */

import { readFileSync, writeFileSync } from 'fs';

const REPO_OWNER = 'mutouzdl';
const REPO_NAME = 'benmutoublog-comments';
const CATEGORY_ID = 'DIC_kwDORs5u7c4C48nO';
const POSTS_LIST_FILE = 'public/data/posts-list.json';

/**
 * 执行 GraphQL 请求
 */
async function graphql(query, variables, token) {
    const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'User-Agent': 'benmutoublog-comment-counter',
        },
        body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
        throw new Error(`GitHub API 错误: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    if (json.errors) {
        throw new Error(`GraphQL 错误: ${JSON.stringify(json.errors)}`);
    }
    return json.data;
}

/**
 * 第一阶段：获取所有 Discussion 的标题和 number（轻量查询）
 */
async function fetchAllDiscussions(token) {
    const discussions = []; // { title, number }
    let cursor = null;
    let page = 0;

    while (true) {
        page++;
        console.log(`  获取 Discussions 列表第 ${page} 页...`);

        const data = await graphql(
            `query($owner: String!, $name: String!, $categoryId: ID!, $cursor: String) {
                repository(owner: $owner, name: $name) {
                    discussions(first: 100, after: $cursor, categoryId: $categoryId) {
                        pageInfo { hasNextPage, endCursor }
                        nodes { title, number }
                    }
                }
            }`,
            { owner: REPO_OWNER, name: REPO_NAME, categoryId: CATEGORY_ID, cursor },
            token
        );

        const page_data = data.repository.discussions;
        discussions.push(...page_data.nodes);

        if (!page_data.pageInfo.hasNextPage) break;
        cursor = page_data.pageInfo.endCursor;
    }

    return discussions;
}

/**
 * 第二阶段：获取单个 Discussion 的总评论数（含回复）
 */
async function fetchDiscussionCommentCount(number, token) {
    let total = 0;
    let cursor = null;

    while (true) {
        const data = await graphql(
            `query($owner: String!, $name: String!, $number: Int!, $cursor: String) {
                repository(owner: $owner, name: $name) {
                    discussion(number: $number) {
                        comments(first: 100, after: $cursor) {
                            totalCount
                            nodes { replies { totalCount } }
                            pageInfo { hasNextPage, endCursor }
                        }
                    }
                }
            }`,
            { owner: REPO_OWNER, name: REPO_NAME, number, cursor },
            token
        );

        const comments = data.repository.discussion.comments;

        if (cursor === null) {
            // 首次查询，加上顶级评论数
            total += comments.totalCount;
        }

        // 累加每个顶级评论的回复数
        for (const c of comments.nodes) {
            total += c.replies.totalCount;
        }

        if (!comments.pageInfo.hasNextPage) break;
        cursor = comments.pageInfo.endCursor;
    }

    return total;
}

/**
 * 获取所有 Discussions 的实际评论数
 */
async function fetchAllDiscussionCounts(token) {
    // 第一阶段：获取所有 Discussion 基本信息
    const discussions = await fetchAllDiscussions(token);
    console.log(`  共 ${discussions.length} 个 Discussion\n`);

    // 第二阶段：逐个获取评论数
    const countMap = new Map();
    for (let i = 0; i < discussions.length; i++) {
        const disc = discussions[i];
        if ((i + 1) % 20 === 0 || i === discussions.length - 1) {
            console.log(`  处理进度: ${i + 1}/${discussions.length}`);
        }
        const count = await fetchDiscussionCommentCount(disc.number, token);
        countMap.set(disc.title, count);
    }

    return countMap;
}

/**
 * 从 pathname 提取文章 ID
 */
function extractPostId(pathname) {
    const match = pathname.match(/^\/archives\/(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
}

async function main() {
    const dryRun = process.argv.includes('--dry-run');
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
        console.error('错误: 请设置 GITHUB_TOKEN 环境变量');
        process.exit(1);
    }

    console.log('=== 更新文章评论数量 ===\n');

    // 1. 获取 Discussions 评论数
    console.log('从 GitHub Discussions 获取评论数...');
    const countMap = await fetchAllDiscussionCounts(token);
    console.log(`  获取到 ${countMap.size} 个 Discussion\n`);

    // 2. 读取 posts-list.json
    const postsList = JSON.parse(readFileSync(POSTS_LIST_FILE, 'utf-8'));

    // 3. 更新评论数
    let updatedCount = 0;
    for (const post of postsList) {
        const pathname = `/archives/${post.id}`;
        const newCount = countMap.get(pathname);

        if (newCount !== undefined && newCount !== post.commentCount) {
            if (dryRun) {
                console.log(`  [预览] ${post.id}: ${post.commentCount} → ${newCount}`);
            }
            post.commentCount = newCount;
            updatedCount++;
        }
    }

    console.log(`\n共更新 ${updatedCount} 篇文章的评论数`);

    // 4. 写回文件
    if (!dryRun && updatedCount > 0) {
        writeFileSync(POSTS_LIST_FILE, JSON.stringify(postsList, null, 4));
        console.log('已保存 posts-list.json');
    } else if (dryRun) {
        console.log('（预览模式，未修改文件）');
    } else {
        console.log('无需更新');
    }
}

main().catch(err => {
    console.error('执行失败:', err.message);
    process.exit(1);
});
