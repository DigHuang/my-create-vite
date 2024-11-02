import path from 'path';
import fs from 'fs';

/**
 * 格式化目标目录
 * @param targetDir 目标目录
 * @returns 格式化后的目标目录
 */
export const formatTargetDir = (targetDir: string | undefined) => {
  return targetDir?.trim().replace('//+$/g', '');
};

const renameFiles: Record<string, any> = {
  _gitignore: '.gitignore',
};

/**
 * 复制文件
 * @param src 源文件
 * @param dest 目标文件
 */
const copy = (src: string, dest: string) => {
  const stat = fs.statSync(src);

  stat.isDirectory() ? copyDir(src, dest) : fs.copyFileSync(src, dest);
};

/**
 * 复制目录
 * @param srcDir 源目录
 * @param destDir 目标目录
 */
const copyDir = (srcDir: string, destDir: string) => {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
};

/**
 * 写入文件
 * @param root 根目录
 * @param templateDir 模板目录
 * @param file 文件名
 * @param content 文件内容
 */
export const write = (
  root: string,
  templateDir: string,
  file: string,
  content?: string
) => {
  const targetPath = path.join(root, renameFiles[file] ?? file);

  content
    ? fs.writeFileSync(targetPath, content)
    : copy(path.join(templateDir, file), targetPath);
};
