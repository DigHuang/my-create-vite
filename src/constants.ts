import chalk from 'chalk';
import { Framework } from './types.ts';

/**
 * -h 的提示文档
 */
export const HELP_MESSAGE = `\
Usage: create-vite [OPTION]... [DIRECTORY]

Create a new Vite project in JavaScript or TypeScript.
With no arguments, start the CLI in interactive mode.

Options:
  -t, --template NAME        use a specific template

Available templates:
${chalk.yellow('vanilla-ts     vanilla')}
${chalk.green('vue-ts         vue')}
${chalk.cyan('react-ts       react')}
${chalk.cyan('react-swc-ts   react-swc')}
${chalk.magenta('preact-ts      preact')}
${chalk.redBright('lit-ts         lit')}
${chalk.red('svelte-ts      svelte')}
${chalk.blue('solid-ts       solid')}
${chalk.blueBright('qwik-ts        qwik')}`;

export const DEFAULT_TARGET_DIR = 'vite-project';

export const FRAMEWORKS: Framework[] = [
  {
    name: 'vue',
    display: 'Vue',
    color: chalk.green,
    variants: [
      {
        name: 'vue-ts',
        display: 'TypeScript',
        color: chalk.blue,
      },
      {
        name: 'vue',
        display: 'JavaScript',
        color: chalk.yellow,
      },
    ],
  },
  {
    name: 'react',
    display: 'React',
    color: chalk.cyan,
    variants: [
      {
        name: 'react-ts',
        display: 'TypeScript',
        color: chalk.blue,
      },
      {
        name: 'react-swc-ts',
        display: 'TypeScript + SWC',
        color: chalk.blue,
      },
      {
        name: 'react',
        display: 'JavaScript',
        color: chalk.yellow,
      },
      {
        name: 'react-swc',
        display: 'JavaScript + SWC',
        color: chalk.yellow,
      },
    ],
  },
];

/**
 * 将 FRAMEWORKS 中的具体模板的 name 拼接到一个数组中
 */
export const TEMPLATES = FRAMEWORKS.map((f) => {
  return f.variants.map((v) => v.name);
}).reduce((a, b) => a.concat(b), []);
