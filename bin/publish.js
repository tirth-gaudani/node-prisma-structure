#!/usr/bin/env node

const path = require("path");
const fs = require("fs-extra");
const { exec } = require('child_process');

console.log("\033[34m Running install project setup script...");

async function installingDependency() {
  try {
    const dependencyArray = ['@prisma/client', 'node-api-document', 'localizify', 'node-cache', 'json-bigint', 'dotenv', 'express', 'body-parser', 'cors', 'ejs', 'is-check-disposable-email', 'jsonwebtoken', 'connect-flash', 'nodemailer', 'path', 'moment','compression','express-rate-limit','express-session','@sentry/node','@sentry/profiling-node','bcryptjs','joi','express-fileupload'];
    const dependencies = dependencyArray?.length > 0 ? dependencyArray?.join(' ') : '';
    if (dependencies) {
      console.log("\x1b[33m Installing dependencies \033[36m", dependencies," \033[37m...");

      exec(`npm install ${dependencies}`, (err, stdout, stderr) => {
        if (err) {
          console.error("\033[31m Failed to install \033[36m", dependencies,"\033[31m:", stderr);
        } else {
          console.log("\033[32m Dependencies installed successfully!");
        }
      });
    }
  } catch (error) {
    console.error("\033[31m Error in Installing dependencies --->   ", error);
  }
}

async function updatePackageJsonScripts() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);

    packageJson.scripts = {
      ...packageJson.scripts,
      "build:schema": "node buildschema.js",
      "generate": "npm run build:schema"
    };

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    console.log("\033[32m package.json scripts updated successfully.");
  } catch (error) {
    console.error("\033[31m Failed to update package.json scripts:", error);
  }
}


async function copyFiles() {
  try {
    const userSrcPath = path.resolve(process.cwd(), "./");

    const templatePath = path.join(__dirname, "../template");
    await fs.ensureDir(userSrcPath);

    async function copyOrMergeFiles(templateDir, userDir) {
      const templateFiles = await fs.readdir(templateDir);

      for (const file of templateFiles) {
        const templateFilePath = path.join(templateDir, file);
        const userFilePath = path.join(userDir, file);

        const stats = await fs.stat(templateFilePath);

        if (stats.isDirectory()) {
          // If the directory doesn't exist, create it
          if (!await fs.pathExists(userFilePath)) {
            console.log("\033[32m Creating folder: ", userFilePath);
            await fs.ensureDir(userFilePath);
          }
          // Recurse into the directory
          await copyOrMergeFiles(templateFilePath, userFilePath);
        } else if (stats.isFile()) {
          if (await fs.pathExists(userFilePath)) {
            console.log("\033[33m File exists: ", userFilePath, " skipping file copy...");
          } else {
            console.log("\033[32m Copying new file: ", userFilePath);
            // Copy the template file to the user path
            await fs.copy(templateFilePath, userFilePath);
          }
        }
      }
    }

    await copyOrMergeFiles(templatePath, userSrcPath);

    console.log("\033[32m Files successfully copied to / path");

    await updatePackageJsonScripts();
    
    await installingDependency();
  } catch (error) {
    console.error("\033[31m Error copying files:", error);
  }
}

copyFiles();