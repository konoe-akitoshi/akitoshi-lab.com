# Progressive AVIF 実装ガイド

このドキュメントは、akitoshi-lab.com における解像度ベース Progressive AVIF の実装についてまとめたものです。

## 概要

Progressive AVIF は、画像を段階的に表示する技術です。低解像度のプレビューを先に表示し、徐々に高解像度に切り替えることで、ユーザーに素早く視覚的フィードバックを提供します。

### メリット

- **体感速度の向上**: 完全な画像を待たずに、すぐにコンテンツが見える
- **LCP (Largest Contentful Paint) の改善**: 初期レイヤーが早く表示される
- **1ファイルで完結**: LQIP のように別途プレースホルダー画像を用意する必要がない

### 制限事項

- **Chromium 系ブラウザのみ対応** (Chrome 94+, Edge)
- Safari/Firefox では最終フレームのみ表示される
- 最小スケールは 1/8 まで

## 技術的背景

### `--progressive` vs `--layered`

avifenc には2つのアプローチがあります：

| オプション | 説明 | 結果 |
|-----------|------|------|
| `--progressive` | 自動設定のプリセット | **品質ベース**（同解像度、異なる品質）になることが多い |
| `--layered` + `--scaling-mode` | 手動でレイヤー設定 | **解像度ベース**（異なる解像度）を明示的に指定可能 |

**重要**: `--progressive` は「解像度ベース」を保証しません。解像度ベースの段階表示を確実に実現するには `--layered` + `--scaling-mode` を使用する必要があります。

### 正しい実装方法

Jake Archibald の記事（[The present and potential future of progressive image rendering](https://jakearchibald.com/2025/present-and-future-of-progressive-image-rendering/)）に基づく方法：

```bash
avifenc --codec aom --layered -s 6 \
  --scaling-mode 1/8 -q 20 input.png \
  --scaling-mode:u 1/2 -q:u 50 input.png \
  --scaling-mode:u 1 -q:u 70 input.png \
  output.avif
```

**ポイント**:
- `--codec aom` を明示（layered は aom のみ対応）
- **同じ入力ファイルを複数回指定**（異なる解像度のファイルを渡すとエラー）
- `--scaling-mode:u` の `:u` は「以降の入力に適用」を意味

### サポートされるスケール

| スケール | 状態 |
|----------|------|
| 1/2 | OK |
| 1/4 | OK |
| 1/8 | OK（最小） |
| 1/16 | 未サポート |
| 1/32 | 未サポート |

## 実装

### ディレクトリ構成

```
akitoshi-lab.com/
├── scripts/
│   └── convert-to-progressive-avif.js  # 変換スクリプト
├── src/assets/img/
│   └── gallery/
│       ├── *.webp, *.jpg, *.jpeg  # 元画像
│       └── *.avif                  # 変換後（src/assets は Astro が再処理する）
├── public/img/
│   └── gallery/
│       └── *.avif                  # 変換後（public/ は再処理されない）
└── docs/
    └── progressive-avif.md         # このドキュメント
```

### 変換スクリプト

`scripts/convert-to-progressive-avif.js`:

```javascript
// 設定
const CONFIG = {
  inputDirs: ['src/assets/img/gallery', 'src/assets/img'],
  extensions: ['.jpg', '.jpeg', '.png', '.webp'],
  progressive: {
    // Layer 0: 超低解像度（素早く表示）
    layer0: { scale: '1/8', quality: 20 },
    // Layer 1: 中解像度プレビュー
    layer1: { scale: '1/2', quality: 50 },
    // Layer 2: フル解像度
    layer2: { scale: '1', quality: 70 },
  },
  speed: 6,
};
```

**実行方法**:
```bash
pnpm run convert:avif
# または
node scripts/convert-to-progressive-avif.js
```

### Astro での使用

**重要**: Astro の `import.meta.glob` で画像をインポートすると、Sharp による再処理で Progressive レイヤーが失われます。

**NG（再処理される）**:
```javascript
// src/assets からインポートすると再エンコードされる
const images = import.meta.glob('../assets/img/gallery/*.avif', { eager: true });
```

**OK（再処理されない）**:
```javascript
// public/ から静的パスで参照
const images = [
  '/img/gallery/img1.avif',
  '/img/gallery/img2.avif',
  // ...
];
```

### index.astro の実装例

```astro
---
// Progressive AVIF画像をpublic/から直接取得（Astroの再エンコードをバイパス）
const galleryImagePaths = [
  '/img/gallery/img1.avif',
  '/img/gallery/img2.avif',
  // ...
];

// シャッフル
let slideImages = [...galleryImagePaths];
for (let i = slideImages.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [slideImages[i], slideImages[j]] = [slideImages[j], slideImages[i]];
}
---

<!-- preload は使わない（Progressive 効果を妨げる） -->
<BackgroundSlideshow images={slideImages} client:load />
```

## 検証方法

### Progressive レイヤーの確認

```bash
avifdec --progressive --info image.avif
```

出力例:
```
 * Progressive    : Active
 * 1 timescales per second, 1.00 seconds (1 timescales), 3 frames
 * Progressive Image Frames: (3 expected frames)
   * Decoded frame [0] ...
   * Decoded frame [1] ...
   * Decoded frame [2] ...
```

### 各レイヤーの抽出

```bash
# Layer 0（低解像度）を抽出
avifdec --progressive --index 0 image.avif layer0.png

# Layer 1（中解像度）を抽出
avifdec --progressive --index 1 image.avif layer1.png

# Layer 2（フル解像度）を抽出
avifdec --progressive --index 2 image.avif layer2.png
```

### ブラウザでのテスト

1. Chrome DevTools を開く（F12）
2. Network タブ → **Slow 3G** を選択
3. **Disable cache** をチェック
4. ページをリロード（Ctrl+Shift+R）

低解像度 → 中解像度 → 高解像度 と段階的に表示されるのが確認できます。

## 依存関係

### 必須ツール

- **libavif** (avifenc, avifdec): Progressive AVIF のエンコード/デコード
  ```bash
  # Windows (scoop)
  scoop install libavif

  # macOS (homebrew)
  brew install libavif
  ```

- **sharp**: 画像の前処理（PNG 変換）
  ```bash
  pnpm add sharp
  ```

### バージョン情報（動作確認済み）

```
libavif: 1.3.0
aom (encoder): 3.12.1
dav1d (decoder): 1.5.1
```

## 参考資料

- [Jake Archibald - The present and potential future of progressive image rendering](https://jakearchibald.com/2025/present-and-future-of-progressive-image-rendering/)
- [libavif Releases - GitHub](https://github.com/AOMediaCodec/libavif/releases)
- [avifenc manpage - Debian](https://manpages.debian.org/testing/libavif-bin/avifenc.1.en.html)

## トラブルシューティング

### "Not implemented" エラー

`--scaling-mode 1/16` など、サポートされていないスケールを指定した場合に発生します。1/8 が最小です。

### "Image layer dimensions mismatch" エラー

異なるサイズの画像を `--layered` で渡した場合に発生します。同じ入力ファイルを複数回指定してください。

### Progressive 効果が見えない

1. **Astro が再処理していないか確認**: `public/` フォルダから配信しているか
2. **preload を使っていないか確認**: preload は全データを先に取得するため効果を打ち消す
3. **ブラウザ確認**: Chromium 系（Chrome, Edge）でのみ動作
4. **ネットワーク速度**: 高速回線では一瞬で読み込まれるため、DevTools で Slow 3G にスロットリング
