<!-- src\components\PostDetail.vue -->
<script setup lang="ts">
import * as cheerio from "cheerio";
import hljs from "highlight.js";
import "highlight.js/styles/hybrid.css";
import useMathJax from "~/plugins/mathjax";
import { config } from "../settings/site-settings";

type Props = {
  slug: string;
  draftKey?: string;
};

const { slug, draftKey } = defineProps<Props>();

const params = {
  slug: slug,
  draftKey: draftKey,
  fields: config.postDetailField,
};

const { data: article } = await useFetch("/api/post-detail", {
  params: params,
});

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: "Page Not Found" });
}

let body = '';

if (typeof article.value.content2 === 'string') {
  const $ = cheerio.load(article.value.content2);

  $("pre code").each((_, elm) => {
    const result = hljs.highlightAuto($(elm).text());
    $(elm).html(result.value);
    $(elm).addClass("hljs");
  });

  $("p").each((_, elm) => {
    const text = $(elm).html();
    const newText = text.replace(/\$\$?(.*?)\$\$?/gs, (match, p1) => {
      if (match.startsWith("$$") && match.endsWith("$$")) {
        return `<div>\\[${p1}\\]</div>`;
      } else {
        return `<span>\\(${p1}\\)</span>`;
      }
    });
    $(elm).html(newText);
  });

  body = $.html();
} else {
  console.error("Expected a string for cheerio.load(), received:", article.value.content2);
  // ここで適切なエラーハンドリングを行う
}

// MathJaxの読み込みをトリガーする
useMathJax();

useDetailHead(article.value);
</script>

<template>
  <div>
    <div class="main">
      <h1 class="title">{{ article.title }}</h1>
      <nuxt-img class="thumbnail" alt="thumbnail" v-if="article.thumbnail" :src="article.thumbnail.url +
        '?w=720&h=480&fit=crop&fm=webp&lossless=true&auto=format'
        " />
      <div class="published">
        <font-awesome-icon :icon="['far', 'clock']" style="height: 2rem" class="icon-clock" />
        <span class="published-info">{{
          $formatDate(article.publishedAt)
        }}</span>
      </div>
      <div class="tags">
        <font-awesome-icon :icon="['fas', 'tags']" style="height: 2rem" class="icon-tags" />
        <div class="tags-info">
          <NuxtLink v-for="tag in article.tag" :key="tag.id" :to="`/tags/${tag.id}/page/1`" class="tag">{{ tag.name }}
          </NuxtLink>
        </div>
      </div>
      <div class="md" v-html="body" />
      <div class="buymeacoffee">
        <a :href="config.social.buyMeACoffee" target="_blank" rel="noopener noreferrer">
          <img height="60" alt="Buy Me A Coffee" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            class="img-buymeacoffee" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  width: 720px;
  margin: 0 auto 0;
  padding: 40px 0;
  color: #0d1a3c;
  line-height: 1.6;
}

.title {
  margin-top: 10px;
  margin-bottom: 30px;
  font-size: 2.4rem;
  color: #0d1a3c;
  line-height: 1.6;
}

.published {
  display: flex;
  align-items: center;
  margin-top: 10px;
  color: #888;
  font-size: 1.4rem;
}

.published-info {
  margin-left: 10px;
  color: #000;
}

.tags {
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 20px;
  color: #0d1a3c;
}

.icon-tags {
  color: #0d1a3c;
  height: 2rem;
  width: 2rem;
  margin-right: 10px;
}

.tags-info {
  display: flex;
  align-items: center;
}

.tag {
  font-size: 1.2rem;
  color: #331cbf;
  opacity: 0.7;
  letter-spacing: 1px;
  margin-right: 10px;
  padding: 3px 6px;
  border: 2px solid #331cbf;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.tag:hover {
  background-color: #331cbf;
  color: #fff;
}

.thumbnail {
  width: 100%;
  height: 20vw;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 10px;
}

.buymeacoffee {
  margin-top: 5rem;
}

.img-buymeacoffee {
  max-width: 200px;
  max-height: 60px;
}

.md:deep(*) {
  font-size: 1.6rem;
  font-weight: 500;
}

.md:deep(strong) {
  background-color: yellow;
}

.md:deep(img) {
  display: block;
  max-width: 100%;
  margin-top: 20px;
  margin-bottom: 0px;
  height: auto;
  border: solid 1px #ccc;
}

.md:deep(pre) {
  line-height: 1.2;
  background-color: #1d1f21;
  padding: 2% 4%;
  overflow-x: scroll;
}

.md:deep(pre) * {
  margin-bottom: 0;
  line-height: 1.4;
  font-weight: lighter;
}

.md:deep(blockquote) {
  padding: 15px;
  border-left: 5px solid #ccc;
  border-radius: 2px;
}

.md:deep(h1) {
  font-size: 24px;
  border-bottom: 1px solid #ccc;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 10px;
}

.md:deep(h2),
.md:deep(h3) {
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 10px;
  font-weight: bold;
}

.md:deep(p) {
  font-size: 1.6rem;
  font-weight: 500;
}

.md:deep(.cp_embed_wrapper) {
  margin-top: 20px;
  margin-bottom: 20px;
}

.md:deep(a) {
  color: #1266f1;
}

.md:deep(a:hover) {
  opacity: 0.5;
}

.md:deep(ul),
.md:deep(ol) {
  padding-left: 1.5em;
  margin: 1rem 0;
  line-height: 1.7;
}

.md:deep(ul) {
  list-style-type: disc;
}

.md:deep(ol) {
  list-style-type: decimal;
}

.md:deep(ul) li,
.md:deep(ol) li {
  margin-bottom: 1rem;
}

@media (max-width: 1024px) {
  .md:deep(img) {
    max-width: 100%;
  }
}

.md:deep(p) code {
  background-color: #eee;
  color: #333;
  padding: 0.2em 0.6em;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
    monospace;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.md:deep(pre) {
  line-height: 1.2;
  background-color: #1d1f21;
  padding: 2% 4%;
  overflow-x: scroll;
}

.md:deep(pre) * {
  margin-bottom: 0;
  line-height: 1.4;
  font-weight: lighter;
}

.md:deep(blockquote) {
  padding: 15px;
  border-left: 5px solid #ccc;
  border-radius: 2px;
}

.md:deep(h1) {
  font-size: 24px;
  border-bottom: 1px solid #ccc;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 10px;
}

.md:deep(h2),
.md:deep(h3) {
  font-size: 20px;
  margin-top: 30px;
  margin-bottom: 10px;
  font-weight: bold;
}

.md:deep(h2) {
  border-bottom: 1px solid #ccc;
}

.md:deep(p) {
  font-size: 1.6rem;
  font-weight: 500;
}

.md:deep(.cp_embed_wrapper) {
  margin-top: 20px;
  margin-bottom: 20px;
}

.md:deep(a) {
  color: #1266f1;
}

.md:deep(a:hover) {
  opacity: 0.5;
}

.md:deep(ul),
.md:deep(ol) {
  padding-left: 1.5em;
  margin: 1rem 0;
  line-height: 1.7;
}

.md:deep(ul) {
  list-style-type: disc;
}

.md:deep(ol) {
  list-style-type: decimal;
}

.md:deep(ul) li,
.md:deep(ol) li {
  margin-bottom: 1rem;
}

@media (max-width: 600px) {
  .main {
    width: 90%;
    padding: 40px 0;
  }

  .title {
    margin-top: 10px;
    margin-bottom: 20px;
    font-size: 1.8rem;
  }

  .published {
    font-size: 1.2rem;
  }

  .tags-info {
    display: flex;
    align-items: center;
    margin-left: 0.5rem;
  }

  .tag {
    font-size: 1.2rem;
    padding: 3px 6px;
    border-radius: 4px;
    margin-right: 8px;
  }

  .thumbnail {
    height: 40vw;
  }

  .md:deep(*) {
    font-size: 1.4rem;
    font-weight: 500;
  }

  .md:deep(h1) {
    font-size: 20px;
    border-bottom: 1px solid #ccc;
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .md:deep(h2),
  .md:deep(h3) {
    font-size: 18px;
    margin-top: 30px;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .md:deep(p) {
    font-size: 1.4rem;
    font-weight: 500;
  }

  .md:deep(ul),
  .md:deep(ol) {
    padding-left: 1em;
    margin: 0.5rem 0;
    line-height: 1.5;
  }

  .md:deep(ul) li,
  .md:deep(ol) li {
    margin-bottom: 0.5rem;
  }
}
</style>