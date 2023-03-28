#!/usr/bin/env node

// CommonJS (.cjs)
const { Command } = require("commander");
const program = new Command();
const download = require("download-git-repo");
const handlebars = require("handlebars");
const inquirer = require("inquirer");
const fs = require("fs");
const ora = require("ora");
const chalk = require("chalk");
const logSymbols = require("log-symbols");

const templates = {
  vue3: {
    url: "https://github.com/he-mengyao/pc-vue3-ts-vite-elment",
    downloadUrl: "https://github.com:he-mengyao/pc-vue3-ts-vite-elment#main",
    description: "vue3",
  },
  vue2: {
    url: "https://github.com/he-mengyao/pc-vue2-element",
    downloadUrl: "https://github.com:he-mengyao/pc-vue2-element#main",
    description: "vue2",
  },
};

program.version("1.0.0");

program
  .command("create <templateName> <projectName>")
  .description("初始化项目模板")
  .action((templateName, projectName) => {
    const spinner = ora("正在下载模板...").start();
    const { downloadUrl } = templates[templateName];
    download(downloadUrl, projectName, { clone: true }, function (err) {
      if (err) {
        spinner.fail();
        console.log(logSymbols.error, chalk.red("下载模板失败"));
        return;
      }
      spinner.succeed();
      inquirer
        .prompt([
          {
            type: "input",
            name: "name",
            message: "请输入项目名称",
          },
          {
            type: "input",
            name: "description",
            message: "请输入项目简介",
          },
          {
            type: "input",
            name: "author",
            message: "请输入作者名称",
          },
        ])
        .then((answers) => {
          const packagePath = `${projectName}/package.json`;
          const packageContent = fs.readFileSync(packagePath, "utf8");
          const packageResult = handlebars.compile(packageContent)(answers);
          fs.writeFileSync(packagePath, packageResult);
          console.log(logSymbols.success, chalk.yellow("下载模板成功"));
        });
    });
  });

program
  .command("list")
  .description("查看可用模板")
  .action(() => {
    for (let key in templates) {
      console.log(`${key}`);
    }
  });

program.parse(process.argv);
