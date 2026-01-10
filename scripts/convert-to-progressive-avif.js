/**
 * 画像を解像度ベースProgressive AVIFに変換するスクリプト
 * 使用: node scripts/convert-to-progressive-avif.js
 *
 * 参考: https://jakearchibald.com/2025/present-and-future-of-progressive-image-rendering/
 */

import { execSync } from 'child_process';
import { readdirSync, statSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join, extname, basename } from 'path';
import sharp from 'sharp';

// 設定
const CONFIG = {
  // 変換対象のディレクトリ
  inputDirs: [
    'src/assets/img/gallery',
    'src/assets/img',
  ],
  // 出力先（元の場所に上書きする場合は null）
  outputDir: null,
  // 対象の拡張子
  extensions: ['.jpg', '.jpeg', '.png', '.webp'],
  // 解像度ベース Progressive AVIF設定 (最大4レイヤー)
  progressive: {
    // Layer 0: 超低解像度（アイコンと同程度で素早く読み込み）
    layer0: { scale: '1/8', quality: 20 },
    // Layer 1: 中解像度プレビュー
    layer1: { scale: '1/2', quality: 50 },
    // Layer 2: フル解像度
    layer2: { scale: '1', quality: 70 },
  },
  // エンコーダー速度 (0=最遅/高品質, 10=最速/低品質)
  speed: 6,
  // スキップするファイル名パターン
  skipPatterns: [/\.avif$/i],
};

/**
 * ディレクトリ内の画像ファイルを再帰的に取得
 */
function getImageFiles(dir, files = []) {
  if (!existsSync(dir)) {
    console.log(`ディレクトリが存在しません: ${dir}`);
    return files;
  }

  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      getImageFiles(fullPath, files);
    } else if (stat.isFile()) {
      const ext = extname(entry).toLowerCase();
      if (CONFIG.extensions.includes(ext)) {
        const shouldSkip = CONFIG.skipPatterns.some(pattern => pattern.test(entry));
        if (!shouldSkip) {
          files.push(fullPath);
        }
      }
    }
  }

  return files;
}

/**
 * 画像を解像度ベースProgressive AVIFに変換
 */
async function convertToProgressiveAvif(inputPath) {
  const dir = CONFIG.outputDir || inputPath.replace(/[^/\\]+$/, '');
  const name = basename(inputPath, extname(inputPath));
  const outputPath = join(dir, `${name}.avif`);
  const ext = extname(inputPath).toLowerCase();

  if (CONFIG.outputDir && !existsSync(CONFIG.outputDir)) {
    mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  let tempFile = null;

  try {
    console.log(`変換中: ${inputPath}`);

    // 入力をPNGに変換（avifencの互換性のため）
    tempFile = join(dir, `${name}_temp.png`);
    await sharp(inputPath).png().toFile(tempFile);

    const { layer0, layer1, layer2 } = CONFIG.progressive;

    // 解像度ベースProgressive AVIFを作成（3レイヤー）
    // 同じ入力ファイルを3回指定し、--scaling-modeでレイヤーごとのスケールを設定
    const cmd = [
      'avifenc',
      '--codec', 'aom',
      '--layered',
      '-s', String(CONFIG.speed),
      // Layer 0: 1/16解像度
      '--scaling-mode', layer0.scale,
      '-q', String(layer0.quality),
      `"${tempFile}"`,
      // Layer 1: 1/4解像度
      '--scaling-mode:u', layer1.scale,
      '-q:u', String(layer1.quality),
      `"${tempFile}"`,
      // Layer 2: フル解像度
      '--scaling-mode:u', layer2.scale,
      '-q:u', String(layer2.quality),
      `"${tempFile}"`,
      `"${outputPath}"`,
    ].join(' ');

    execSync(cmd, { stdio: 'pipe', shell: true });
    console.log(`  → ${outputPath}`);

    // 一時ファイルを削除
    if (tempFile && existsSync(tempFile)) {
      unlinkSync(tempFile);
    }

    return outputPath;
  } catch (error) {
    console.error(`エラー: ${inputPath}`);
    console.error(error.message);

    if (tempFile && existsSync(tempFile)) {
      unlinkSync(tempFile);
    }

    return null;
  }
}

/**
 * メイン処理
 */
async function main() {
  console.log('=== 解像度ベース Progressive AVIF 変換スクリプト ===');
  console.log('参考: Jake Archibald - Progressive Image Rendering\n');

  const allFiles = [];
  for (const dir of CONFIG.inputDirs) {
    getImageFiles(dir, allFiles);
  }

  const uniqueFiles = [...new Set(allFiles)];

  console.log(`変換対象: ${uniqueFiles.length} ファイル\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const file of uniqueFiles) {
    const result = await convertToProgressiveAvif(file);
    if (result) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  console.log(`\n=== 完了 ===`);
  console.log(`成功: ${successCount}`);
  console.log(`失敗: ${errorCount}`);
}

main();
