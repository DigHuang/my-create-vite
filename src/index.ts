import minimist from 'minimist';
import {
  DEFAULT_TARGET_DIR,
  FRAMEWORKS,
  HELP_MESSAGE,
  TEMPLATES,
} from './constants.ts';
import { formatTargetDir, write } from './utils.ts';
import prompts from 'prompts';
import chalk from 'chalk';
import { Framework } from './types.ts';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const argv = minimist<{
  template: string;
  help: boolean;
}>(process.argv.slice(2), {
  alias: {
    t: 'template',
    h: 'help',
  },
  string: ['_'], // 表示 _ 对应的值的类型为 string
});

async function init() {
  // 处理 -h 指令
  const help = argv.help;
  if (help) {
    console.log(HELP_MESSAGE);
    return;
  }

  // 目标的输出文档
  const argTargetDir = formatTargetDir(argv._[0]);
  // 选择的模板
  const argTemplate = argv.template;

  let targetDir = argTargetDir ?? DEFAULT_TARGET_DIR;
  let result: prompts.Answers<'projectName' | 'framework' | 'variant'>;

  try {
    result = await prompts(
      [
        {
          type: argTargetDir ? null : 'text',
          name: 'projectName',
          message: chalk.reset('Project name: '),
          initial: DEFAULT_TARGET_DIR,
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || DEFAULT_TARGET_DIR;
          },
        },
        {
          type:
            argTemplate && TEMPLATES.includes(argTemplate) ? null : 'select',
          name: 'framework',
          message: chalk.reset('Select a framework:'),
          initial: 0,
          choices: FRAMEWORKS.map((framework) => {
            const frameworkColor = framework.color;
            return {
              title: frameworkColor(framework.display || framework.name),
              value: framework,
            };
          }),
        },
        {
          type: (framework: Framework) =>
            framework && framework.variants ? 'select' : null,
          name: 'variant',
          message: chalk.reset('Select a variant:'),
          choices: (framework: Framework) =>
            framework.variants.map((variant) => {
              const variantColor = variant.color;
              return {
                title: variantColor(variant.display || variant.name),
                value: variant.name,
              };
            }),
        },
      ],
      {
        onCancel: () => {
          throw new Error(chalk.red('x') + ' Operation cancelled!');
        },
      }
    );

    const { framework, variant } = result;

    const root = path.join(process.cwd(), targetDir);

    let template = variant || argTemplate;

    // import.meta.url 指当前的文件路径 -- file:/// 开头
    // fileURLToPath 转转换成文件路径
    const templateDir = path.resolve(
      fileURLToPath(import.meta.url),
      '../../templates',
      `template-${template}`
    );

    // 如果目标目录不存在，则创建
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root, { recursive: true });
    }

    // 读取模板目录下的文件
    const files = fs.readdirSync(templateDir);
    files.forEach((file) => {
      // 复制目录
      write(root, templateDir, file);
    });

    console.log(chalk.green('🎉  Success! Created project at ' + root));
    console.log(chalk.green('💡  Get started with the following commands:'));
    console.log(chalk.green('cd ' + targetDir));
    console.log(chalk.green('npm install'));
    console.log(chalk.green('npm run dev'));
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }
}

init().catch((e) => {
  console.log('🚀 ~ e:', e);
});
