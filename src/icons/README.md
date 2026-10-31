# Akitoshi Lab. Icons

/links で使っている独自のラインアイコン。デザインの仕様・判断・作り方は [`DESIGN.md`](./DESIGN.md) を参照（描く・直す・依頼するときは必ずこちらに従う）。

## 使い方

`src/icons/<name>.svg` を置くと UnoCSS で `i-lab-<name>` として使える（`uno.config.ts` の `collections.lab`）。

```html
<i class="i-lab-mail-personal text-[28px] text-gray-700"></i>
```

色は `currentColor`（`text-*`）、サイズは `font-size` で決まる。CSS マスクとして描画されるので、使える色は 1 色だけ。

## 収録アイコン

| 種類 | 名前 |
|---|---|
| 連絡先 | `mail-personal` `mail-university` `radio` |
| SNS | `linkedin` `github` `x` `zenn` `youtube` `instagram` `facebook` |
| UI | `copy` `check` `arrow-outward` `person-add` |

About の Card などほかのページは、これまでどおり `simple-icons` を使っている。

## ページでのアイコンと文字の役割

アイコンだけで伝わるものに、同じ意味のキャプションを重ねない。/links は名刺から開かれ、日本語を読まない人にも渡るので、意味はアイコンと値に持たせる。どうしても必要な文字は、`data-en` / `data-en-label` を付けてブラウザの言語で日英を切り替える。

- **値そのもので伝わる場合**: アイコンと値だけを置く。例: メールアドレス、コールサイン、SNS のハンドル名。
- **世界共通の記号がある操作**: アイコンだけにする。例: 連絡先に追加（人型＋）。
- **操作の結果を見せる場合**: 文字のメッセージより、アイコンの状態の変化で伝える。例: コピー後にチェックへ変わる。
- **アイコンだけにする場合**: 意味は `aria-label` / `title` で補う。
