#!/usr/bin/env node
"use strict";

// src/index.ts
var { Command } = require("commander");
var chalk = require("chalk");
var execa = require("execa");
var ora = require("ora");
var prompts = require("prompts");
var fs = require("fs/promises");
var path = require("path");
var os = require("os");
var isWindows = os.platform() === "win32";
var is64Bit = os.arch() === "x64";
var rmrf = process.platform === "win32" ? ["cmd", ["/c", "rmdir", "/s", "/q"]] : ["rm", ["-rf"]];
var gitInit = process.platform === "win32" ? ["cmd", ["/c", "git", "init"]] : ["git", ["init"]];
var program = new Command().name("create-titan").description("Create a new Titan project").version("0.1.0").parse();
async function checkSupabaseCLI() {
  try {
    await execa("supabase", ["--version"]);
    return true;
  } catch (error) {
    return false;
  }
}
async function installSupabaseCLI() {
  const spinner = ora("Installing Supabase CLI...").start();
  try {
    if (process.platform === "darwin") {
      await execa("brew", ["install", "supabase/tap/supabase"]);
    } else if (process.platform === "win32") {
      try {
        await execa("scoop", ["--version"]);
      } catch {
        spinner.text = "Installing scoop package manager...";
        await execa("powershell", [
          "-Command",
          "Set-ExecutionPolicy RemoteSigned -Scope CurrentUser; iwr -useb get.scoop.sh | iex"
        ]);
      }
      await execa("scoop", ["bucket", "add", "supabase", "https://github.com/supabase/scoop-bucket.git"]);
      await execa("scoop", ["install", "supabase"]);
    } else if (process.platform === "linux") {
      await execa("curl", ["-s", "https://raw.githubusercontent.com/supabase/cli/main/install.sh", "|", "bash"]);
    }
    spinner.succeed("Supabase CLI installed successfully");
    return true;
  } catch (error) {
    spinner.fail("Failed to install Supabase CLI");
    console.error(chalk.red("Error:"), error);
    console.log(chalk.yellow("Please install Supabase CLI manually:"));
    console.log(chalk.cyan("- Mac: brew install supabase/tap/supabase"));
    console.log(chalk.cyan("- Windows: scoop bucket add supabase https://github.com/supabase/scoop-bucket.git && scoop install supabase"));
    console.log(chalk.cyan("- Linux: curl -s https://raw.githubusercontent.com/supabase/cli/main/install.sh | bash"));
    return false;
  }
}
async function checkGitHubSSH() {
  try {
    await execa("git", ["ls-remote", "git@github.com:ObaidUr-Rahmaan/titan.git", "HEAD"], {
      timeout: 1e4
      // 10 seconds timeout
    });
    return true;
  } catch (error) {
    return false;
  }
}
async function main() {
  let spinner;
  try {
    console.log(chalk.cyan("\n\u{1F680} Welcome to Titan CLI!\n"));
    console.log(chalk.yellow("Pre-requisites check:"));
    console.log(
      chalk.yellow("1. Docker/Orbstack must be running (Only if you decide to run the DB locally)")
    );
    console.log(chalk.yellow("2. The following connection info is ready:"));
    console.log(chalk.yellow("   - Clerk (Publishable Key & Secret Key)"));
    console.log(chalk.yellow("   - Stripe (Public Key, Secret Key & Price ID)"));
    console.log(chalk.yellow("   - Plunk API Key"));
    console.log(chalk.yellow("   - Supabase (if using remote instance):"));
    console.log(chalk.yellow("     * NEXT_PUBLIC_SUPABASE_URL"));
    console.log(chalk.yellow("     * SUPABASE_SERVICE_ROLE_KEY"));
    console.log(chalk.yellow("     * DATABASE_URL (with pgbouncer)"));
    console.log(chalk.yellow("     * DIRECT_URL (without pgbouncer)\n"));
    console.log(chalk.cyan("\u{1F4A1} Important Note:"));
    console.log(
      chalk.cyan(
        "   Only run Supabase locally if you have 16GB RAM or higher and are not experiencing Docker issues."
      )
    );
    console.log(
      chalk.cyan(
        "   Supabase offers 2 free projects in their free tier. Using remote DB credentials is recommended"
      )
    );
    console.log(
      chalk.cyan("   if you encounter any issues with the local setup or have limited system resources.\n")
    );
    if (isWindows) {
      console.log(chalk.red("\n\u26A0\uFE0F Warning for Windows Users:"));
      console.log(
        chalk.yellow("Docker Desktop on Windows can sometimes be unstable with Supabase.")
      );
      console.log(
        chalk.yellow(
          "If you experience issues, consider using a production database URL instead.\n"
        )
      );
      console.log(
        chalk.yellow(
          "Supabase provides 2 free projects in their free tier - using these is highly recommended for Windows users.\n"
        )
      );
    }
    spinner = ora("Checking for Supabase CLI...").start();
    const hasSupabaseCLI = await checkSupabaseCLI();
    if (!hasSupabaseCLI) {
      spinner.info("Supabase CLI not found, attempting to install...");
      const installed = await installSupabaseCLI();
      if (!installed) {
        console.log(chalk.red("\nUnable to proceed without Supabase CLI. Please install it manually and try again."));
        process.exit(1);
      }
    } else {
      spinner.succeed("Supabase CLI is installed");
    }
    spinner.text = "Checking GitHub SSH authentication...";
    const hasGitHubSSH = await checkGitHubSSH();
    if (!hasGitHubSSH) {
      spinner.fail("GitHub SSH authentication failed");
      console.log(chalk.red("\nError: Unable to authenticate with GitHub via SSH."));
      console.log(chalk.yellow("\nPlease set up SSH authentication with GitHub:"));
      console.log(chalk.cyan("1. Generate an SSH key if you don't have one:"));
      console.log(chalk.cyan('   ssh-keygen -t ed25519 -C "your_email@example.com"'));
      console.log(chalk.cyan("2. Add your SSH key to the ssh-agent:"));
      console.log(chalk.cyan('   eval "$(ssh-agent -s)"'));
      console.log(chalk.cyan("   ssh-add ~/.ssh/id_ed25519"));
      console.log(chalk.cyan("3. Add your SSH key to your GitHub account:"));
      console.log(chalk.cyan("   - Copy your public key to clipboard:"));
      console.log(chalk.cyan("     cat ~/.ssh/id_ed25519.pub | pbcopy"));
      console.log(chalk.cyan("   - Go to GitHub > Settings > SSH and GPG keys > New SSH key"));
      console.log(chalk.cyan("   - Paste your key and save"));
      console.log(chalk.cyan("4. Test your connection:"));
      console.log(chalk.cyan("   ssh -T git@github.com"));
      console.log(chalk.cyan("5. Run this CLI again"));
      process.exit(1);
    }
    spinner.succeed("GitHub SSH authentication successful");
    const { proceed } = await prompts({
      type: "confirm",
      name: "proceed",
      message: "Do you have all pre-requisites ready?",
      initial: false
    });
    if (!proceed) {
      console.log(chalk.cyan("\nPlease set up the pre-requisites and try again."));
      console.log(
        chalk.cyan(
          "For detailed setup instructions, visit: https://github.com/ObaidUr-Rahmaan/titan#prerequisites"
        )
      );
      process.exit(0);
    }
    const { projectName, projectDescription, githubRepo } = await prompts(
      [
        {
          type: "text",
          name: "projectName",
          message: "What is your project name?",
          initial: "my-titan-app"
        },
        {
          type: "text",
          name: "projectDescription",
          message: "Describe your project in a few words:"
        },
        {
          type: "text",
          name: "githubRepo",
          message: "Enter your GitHub repository URL (SSH format: git@github.com:username/repo.git):",
          validate: (value) => {
            const sshFormat = /^git@github\.com:.+\/.+\.git$/;
            const httpsFormat = /^https:\/\/github\.com\/.+\/.+\.git$/;
            if (sshFormat.test(value))
              return true;
            if (httpsFormat.test(value)) {
              const sshUrl = value.replace("https://github.com/", "git@github.com:").replace(/\.git$/, ".git");
              return `Please use the SSH URL format instead: ${sshUrl}`;
            }
            return "Please enter a valid GitHub SSH URL (format: git@github.com:username/repo.git)";
          }
        }
      ],
      {
        onCancel: () => {
          console.log("\nSetup cancelled");
          process.exit(1);
        }
      }
    );
    const projectDir = path.join(process.cwd(), projectName);
    try {
      await fs.access(projectDir);
      console.error(
        chalk.red(
          `
Error: Directory ${projectName} already exists. Please choose a different name or delete the existing directory.`
        )
      );
      process.exit(1);
    } catch {
      await fs.mkdir(projectDir);
    }
    spinner = ora("Creating your project...").start();
    const maxRetries = 3;
    let retryCount = 0;
    while (retryCount < maxRetries) {
      try {
        spinner.text = "Cloning template repository...";
        await execa("git", [
          "clone",
          "--depth=1",
          "--single-branch",
          "git@github.com:ObaidUr-Rahmaan/titan.git",
          projectDir
        ]);
        spinner.succeed("Project cloned successfully!");
        break;
      } catch (error) {
        retryCount++;
        if (retryCount === maxRetries) {
          spinner.fail("Failed to clone repository");
          console.error(chalk.red("\nError cloning repository. Please check:"));
          console.log(chalk.cyan("1. Your SSH key is set up correctly:"));
          console.log(chalk.cyan("   Run: ssh -T git@github.com"));
          console.log(
            chalk.cyan(
              "   If it fails, follow: https://docs.github.com/en/authentication/connecting-to-github-with-ssh"
            )
          );
          console.log(chalk.cyan("\n2. The repository exists on GitHub:"));
          console.log(chalk.cyan("   - Go to GitHub"));
          console.log(chalk.cyan('   - Create repository named "your-repo-name"'));
          console.log(chalk.cyan("   - Don't initialize with any files"));
          console.log(chalk.cyan("\n3. Try cloning manually to verify:"));
          console.log(
            chalk.cyan(
              `   git clone --depth=1 git@github.com:ObaidUr-Rahmaan/titan.git ${projectDir}`
            )
          );
          process.exit(1);
        }
        spinner.text = `Retrying clone (${retryCount}/${maxRetries})...`;
        await new Promise((resolve) => setTimeout(resolve, 2e3));
      }
    }
    let envContent = "";
    spinner.stop();
    const authConfig = await prompts(
      [
        {
          type: "password",
          name: "clerkPublishableKey",
          message: "Enter your Clerk Publishable Key:"
        },
        {
          type: "password",
          name: "clerkSecretKey",
          message: "Enter your Clerk Secret Key:"
        }
      ],
      {
        onCancel: () => {
          console.log("\nSetup cancelled");
          process.exit(1);
        }
      }
    );
    if (!authConfig.clerkPublishableKey || !authConfig.clerkSecretKey) {
      console.log(chalk.red("Clerk keys are required"));
      process.exit(1);
    }
    spinner.start("Configuring authentication...");
    envContent += `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${authConfig.clerkPublishableKey}
`;
    envContent += `CLERK_SECRET_KEY=${authConfig.clerkSecretKey}

`;
    envContent += `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
`;
    envContent += `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
`;
    envContent += `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
`;
    envContent += `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

`;
    spinner.succeed("Authentication configured");
    spinner.stop();
    const { dbChoice } = await prompts({
      type: "select",
      name: "dbChoice",
      message: "Choose your database setup:",
      choices: [
        { title: "Local Database (requires Docker & Supabase CLI, 16GB+ RAM recommended)", value: "local" },
        {
          title: "Production Database (recommended for Windows users or if you have <16GB RAM - uses Supabase free tier)",
          value: "production"
        }
      ],
      initial: 0
    });
    if (dbChoice === "local") {
      console.log(chalk.yellow("\nPre-requisites check for local database:"));
      console.log(
        chalk.yellow(
          "1. Docker/Orbstack must be running (Only if you decide to run the DB locally)"
        )
      );
      console.log(chalk.yellow("2. Supabase CLI must be installed\n"));
      console.log(chalk.yellow("3. 16GB+ RAM recommended for smooth experience\n"));
      console.log(
        chalk.cyan(
          "\u{1F4A1} Remember: Supabase offers 2 free projects on their platform. If you encounter any issues"
        )
      );
      console.log(
        chalk.cyan(
          "   with the local setup, you can always switch to using Supabase remote credentials.\n"
        )
      );
      const { proceed: proceed2 } = await prompts({
        type: "confirm",
        name: "proceed",
        message: "Do you have Docker running and Supabase CLI installed?",
        initial: false
      });
      if (!proceed2) {
        console.log(chalk.cyan("\nPlease set up the pre-requisites and try again."));
        console.log(
          chalk.cyan(
            "For detailed setup instructions, visit: https://github.com/ObaidUr-Rahmaan/titan#prerequisites"
          )
        );
        process.exit(0);
      }
      spinner.start("Starting local Supabase instance...");
      try {
        spinner.start("Starting Supabase (this might take a few minutes on first run)...");
        const { stdout } = await execa("supabase", ["start"], { cwd: projectDir });
        spinner.succeed("Supabase started");
        const serviceKeyMatch = stdout.match(/service_role key: (.*)/);
        const anonKeyMatch = stdout.match(/anon key: (.*)/);
        if (!serviceKeyMatch || !anonKeyMatch) {
          throw new Error("Could not find required keys in Supabase output");
        }
        const serviceKey = serviceKeyMatch[1].trim();
        const anonKey = anonKeyMatch[1].trim();
        const dbConfig = {
          supabaseUrl: "http://127.0.0.1:54321",
          supabaseAnonKey: anonKey,
          supabaseServiceKey: serviceKey,
          databaseUrl: "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
          directUrl: "postgresql://postgres:postgres@127.0.0.1:54322/postgres"
        };
        envContent += `NEXT_PUBLIC_SUPABASE_URL=${dbConfig.supabaseUrl}
`;
        envContent += `NEXT_PUBLIC_SUPABASE_ANON_KEY=${dbConfig.supabaseAnonKey}
`;
        envContent += `SUPABASE_SERVICE_ROLE_KEY=${dbConfig.supabaseServiceKey}

`;
        envContent += `DATABASE_URL=${dbConfig.databaseUrl}
`;
        envContent += `DIRECT_URL=${dbConfig.directUrl}

`;
        envContent += `FRONTEND_URL=http://localhost:3000

`;
        await fs.writeFile(path.join(projectDir, ".env"), envContent);
        spinner.start("Setting up database tables and generating types...");
        try {
          await execa("pnpm", ["dlx", "prisma", "generate"], { cwd: projectDir });
          await execa("pnpm", ["dlx", "prisma", "migrate", "deploy"], { cwd: projectDir });
          const { stdout: stdout2 } = await execa(
            "supabase",
            ["gen", "types", "typescript", "--local"],
            {
              cwd: projectDir,
              stdio: "pipe"
            }
          );
          await fs.writeFile(path.join(projectDir, "types", "supabase.ts"), stdout2);
          spinner.succeed("Database tables created and types generated successfully");
        } catch (error) {
          spinner.fail("Failed to setup database");
          console.error(chalk.red("Error:"), error);
          console.log(chalk.yellow("\nMake sure you have Docker running and try again."));
          console.log(chalk.yellow("\nYou can try running these commands manually:"));
          console.log(chalk.cyan("  cd " + projectDir));
          console.log(chalk.cyan("  pnpm prisma generate"));
          console.log(chalk.cyan("  pnpm prisma migrate deploy"));
          console.log(chalk.cyan("  supabase gen types typescript --local > types/supabase.ts"));
          process.exit(1);
        }
        console.log(chalk.green("\nLocal Supabase is running! \u{1F680}"));
        console.log(chalk.cyan("Access Supabase Studio at: http://127.0.0.1:54323"));
      } catch (error) {
        spinner.fail("Failed to setup local Supabase");
        console.error(chalk.red("\nError: Docker is not running or encountered issues."));
        console.log(chalk.yellow("\nPlease:"));
        console.log(chalk.cyan("1. Install Docker/Orbstack if not installed:"));
        console.log(chalk.cyan("   - Mac: https://docs.docker.com/desktop/install/mac-install/"));
        console.log(
          chalk.cyan("   - Windows: https://docs.docker.com/desktop/install/windows-install/")
        );
        console.log(chalk.cyan("2. Start Docker/Orbstack"));
        console.log(chalk.cyan("3. Wait a few seconds for Docker to be ready"));
        console.log(chalk.cyan("4. Run this command again\n"));
        console.log(
          chalk.green(
            "\u{1F4A1} Recommendation: If you continue to face issues with local Supabase, we strongly recommend"
          )
        );
        console.log(
          chalk.green(
            "   using Supabase remote DB credentials instead (you get 2 free projects in the free tier)."
          )
        );
        console.log(
          chalk.green(
            '   Run this CLI again and select "Production Database" when prompted for database setup.\n'
          )
        );
        process.exit(1);
      }
    } else {
      spinner.stop();
      console.log(
        chalk.green(
          "\n\u2705 Good choice! Using Supabase's remote database is reliable and avoids local Docker issues."
        )
      );
      console.log(
        chalk.green(
          "   You can find your database credentials in your Supabase project settings.\n"
        )
      );
      const dbConfig = await prompts(
        [
          {
            type: "text",
            name: "supabaseUrl",
            message: "Enter your Supabase Project URL:",
            validate: (value) => value.startsWith("https://") ? true : "URL must start with https://"
          },
          {
            type: "password",
            name: "supabaseAnonKey",
            message: "Enter your Supabase Anon Key:"
          },
          {
            type: "password",
            name: "supabaseServiceKey",
            message: "Enter your Supabase Service Role Key:"
          },
          {
            type: "text",
            name: "databaseUrl",
            message: "Enter your Database URL (with pgbouncer):",
            validate: (value) => value.includes("?pgbouncer=true") ? true : "URL must include ?pgbouncer=true"
          },
          {
            type: "text",
            name: "directUrl",
            message: "Enter your Direct URL (without pgbouncer):"
          }
        ],
        {
          onCancel: () => {
            console.log("\nSetup cancelled");
            process.exit(1);
          }
        }
      );
      if (!dbConfig.supabaseUrl || !dbConfig.supabaseAnonKey || !dbConfig.supabaseServiceKey || !dbConfig.databaseUrl || !dbConfig.directUrl) {
        console.log(chalk.red("All database configuration values are required"));
        process.exit(1);
      }
      envContent += `NEXT_PUBLIC_SUPABASE_URL=${dbConfig.supabaseUrl}
`;
      envContent += `NEXT_PUBLIC_SUPABASE_ANON_KEY=${dbConfig.supabaseAnonKey}
`;
      envContent += `SUPABASE_SERVICE_ROLE_KEY=${dbConfig.supabaseServiceKey}

`;
      envContent += `DATABASE_URL=${dbConfig.databaseUrl}
`;
      envContent += `DIRECT_URL=${dbConfig.directUrl}

`;
      envContent += `FRONTEND_URL=http://localhost:3000

`;
      await fs.writeFile(path.join(projectDir, ".env"), envContent);
      spinner.start("Setting up database tables and generating types...");
      try {
        await execa("pnpm", ["dlx", "prisma", "generate"], { cwd: projectDir });
        await execa(
          "pnpm",
          ["dlx", "prisma", "migrate", "dev", "--name", "initial_migration", "--create-only"],
          { cwd: projectDir }
        );
        await execa("pnpm", ["dlx", "prisma", "migrate", "deploy"], { cwd: projectDir });
        const { stdout } = await execa(
          "supabase",
          [
            "gen",
            "types",
            "typescript",
            "--project-id",
            dbConfig.supabaseUrl.split(".")[0].split("//")[1]
          ],
          {
            cwd: projectDir,
            stdio: "pipe"
          }
        );
        await fs.writeFile(path.join(projectDir, "types", "supabase.ts"), stdout);
        spinner.succeed("Database tables created and types generated successfully");
      } catch (error) {
        spinner.fail("Failed to setup database");
        console.error(chalk.red("Error:"), error);
        console.log(chalk.yellow("\nPlease verify your database credentials and try again."));
        process.exit(1);
      }
    }
    spinner.stop();
    const paymentConfig = await prompts(
      [
        {
          type: "text",
          name: "stripePublicKey",
          message: "Enter your Stripe Public Key:"
        },
        {
          type: "password",
          name: "stripeSecretKey",
          message: "Enter your Stripe Secret Key:"
        },
        {
          type: "text",
          name: "stripePriceId",
          message: "Enter your Stripe Price ID:"
        }
      ],
      {
        onCancel: () => {
          console.log("\nSetup cancelled");
          process.exit(1);
        }
      }
    );
    if (!paymentConfig.stripeSecretKey || !paymentConfig.stripePublicKey || !paymentConfig.stripePriceId) {
      console.log(chalk.red("All Stripe configuration values are required"));
      process.exit(1);
    }
    spinner.start("Configuring payments...");
    envContent += `STRIPE_SECRET_KEY=${paymentConfig.stripeSecretKey}
`;
    envContent += `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${paymentConfig.stripePublicKey}
`;
    envContent += `NEXT_PUBLIC_STRIPE_PRICE_ID=${paymentConfig.stripePriceId}

`;
    spinner.succeed("Payments configured");
    spinner.stop();
    const emailConfig = await prompts(
      [
        {
          type: "text",
          name: "plunkApiKey",
          message: "Enter your Plunk API Key:"
        }
      ],
      {
        onCancel: () => {
          console.log("\nSetup cancelled");
          process.exit(1);
        }
      }
    );
    if (!emailConfig.plunkApiKey) {
      console.log(chalk.red("Plunk API Key is required"));
      process.exit(1);
    }
    spinner.start("Configuring email...");
    envContent += `PLUNK_API_KEY=${emailConfig.plunkApiKey}
`;
    spinner.succeed("Email configured");
    spinner.start("Writing configuration files...");
    await fs.writeFile(path.join(projectDir, ".env"), envContent);
    await fs.rm(path.join(projectDir, ".env.template"));
    const configPath = path.join(projectDir, "config.ts");
    const configContent = `const config = {
  auth: {
    enabled: true,
  },
  payments: {
    enabled: true,
  },
  email: {
    enabled: true,
  },
};

export default config;
`;
    await fs.writeFile(configPath, configContent);
    spinner.succeed(chalk.green("Project configured successfully! \u{1F680}"));
    spinner.start("Installing dependencies...");
    try {
      process.chdir(path.resolve(projectDir));
      await execa("pnpm", ["install"], { stdio: "inherit" });
      spinner.succeed("Dependencies installed");
    } catch (error) {
      spinner.fail("Failed to install dependencies");
      console.error(chalk.red("Error installing dependencies:"), error);
      process.exit(1);
    }
    spinner.start("Setting up git repository...");
    try {
      await execa("rm", ["-rf", ".git"]);
      await execa("git", ["init"]);
      await execa("git", ["add", "."]);
      await execa("git", ["commit", "-m", "Initial commit from Titan CLI"]);
      await execa("git", ["branch", "-M", "main"]);
      await execa("git", ["remote", "add", "origin", githubRepo]);
      try {
        await execa("git", ["push", "-u", "origin", "main", "--force"]);
      } catch (pushError) {
        await execa("git", ["branch", "-M", "master"]);
        await execa("git", ["push", "-u", "origin", "master", "--force"]);
      }
      spinner.succeed("Git repository setup complete");
    } catch (error) {
      spinner.warn("Git setup had some issues");
      console.log(chalk.yellow("\nTo push your code to GitHub manually:"));
      console.log(chalk.cyan("1. git remote add origin " + githubRepo));
      console.log(chalk.cyan("2. git branch -M main"));
      console.log(chalk.cyan("3. git push -u origin main --force"));
    }
    const readmeContent = `# ${projectName}

${projectDescription}

# ToDos

- Add todos here...
`;
    await fs.writeFile("README.md", readmeContent);
    try {
      await fs.rm(path.join(projectDir, "packages"), { recursive: true, force: true });
    } catch (error) {
    }
    spinner.start("Initializing and pushing to git repository...");
    await execa(...rmrf, [path.join(projectDir, ".git")]);
    await execa(...gitInit, [], { cwd: projectDir });
    spinner.succeed("Git repository initialized");
    await fs.writeFile(path.join(projectDir, ".env"), envContent);
    console.log(chalk.green("\n\u2728 Project created and pushed to GitHub successfully! \u2728"));
    console.log(chalk.cyan("\nNext steps:"));
    console.log(chalk.cyan("1. cd into your project"));
    console.log(chalk.cyan("2. Run pnpm install"));
    console.log(chalk.cyan("3. Run pnpm dev to start the development server"));
    spinner.start("Customizing application layout...");
    const layoutPath = path.join(projectDir, "app", "layout.tsx");
    const formatProjectName = (name) => {
      return name.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    };
    const formattedProjectName = formatProjectName(projectName);
    const layoutContent = `import Provider from '@/app/provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import AuthWrapper from '@/components/wrapper/auth-wrapper';
import { Analytics } from '@vercel/analytics/react';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import './globals.css';
import { validateConfig } from '@/lib/config-validator';

// Validate config on app initialization
validateConfig();

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: '${formattedProjectName}',
    template: \`%s | ${formattedProjectName}\`,
  },
  description: '${projectDescription}',
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'icon', url: '/favicon.png', type: 'image/png' },
    { rel: 'apple-touch-icon', url: '/favicon.png' },
  ],
  openGraph: {
    description: '${projectDescription}',
    images: [''],
    url: '',
  },
  twitter: {
    card: 'summary_large_image',
    title: '${formattedProjectName}',
    description: '${projectDescription}',
    siteId: '',
    creator: '',
    creatorId: '',
    images: [''],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthWrapper>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" type="image/png" href="/favicon.png" />
        </head>
        <body className={GeistSans.className}>
          <Provider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </Provider>
          <Analytics />
        </body>
      </html>
    </AuthWrapper>
  );
}`;
    await fs.writeFile(layoutPath, layoutContent);
    spinner.succeed("Application layout customized");
    spinner.stop();
    const { setupCursorTools } = await prompts({
      type: "confirm",
      name: "setupCursorTools",
      message: "Do you want to set up cursor-tools?",
      initial: true
    });
    if (setupCursorTools) {
      console.log(chalk.cyan("\n\u{1F4DD} cursor-tools Setup:"));
      console.log(chalk.cyan("You will need API keys from Perplexity AI and Gemini:"));
      console.log(chalk.cyan("- Perplexity API Key: https://www.perplexity.ai/settings/api"));
      console.log(chalk.cyan("- Gemini API Key: https://aistudio.google.com/app/apikey"));
      const apiKeys = await prompts([
        {
          type: "password",
          name: "perplexityApiKey",
          message: "Enter your Perplexity API Key:"
        },
        {
          type: "password",
          name: "geminiApiKey",
          message: "Enter your Gemini API Key:"
        }
      ], {
        onCancel: () => {
          console.log("\nCursor-tools setup cancelled");
          return { perplexityApiKey: "", geminiApiKey: "" };
        }
      });
      spinner.start("Setting up cursor-tools...");
      const cursorToolsEnvContent = `PERPLEXITY_API_KEY="${apiKeys.perplexityApiKey || "your-perplexity-api-key"}"
GEMINI_API_KEY="${apiKeys.geminiApiKey || "your-gemini-api-key"}"`;
      await fs.writeFile(path.join(projectDir, ".cursor-tools.env"), cursorToolsEnvContent);
      try {
        await execa("cursor-tools", ["install", "."], { cwd: projectDir });
        spinner.succeed("cursor-tools installed and configured successfully");
      } catch (error) {
        spinner.warn("Failed to run cursor-tools install command");
        console.log(chalk.yellow("You can run it manually later with: cursor-tools install ."));
      }
    } else {
      const cursorToolsEnvContent = `PERPLEXITY_API_KEY="your-perplexity-api-key"
GEMINI_API_KEY="your-gemini-api-key"`;
      await fs.writeFile(path.join(projectDir, ".cursor-tools.env"), cursorToolsEnvContent);
      console.log(chalk.cyan("\nSkipping cursor-tools setup. You can set it up later if needed."));
    }
  } catch (error) {
    if (spinner)
      spinner.fail("Failed to create project");
    console.error(chalk.red("Error:"), error);
    process.exit(1);
  }
}
process.on("SIGINT", () => {
  console.log("\nSetup cancelled");
  process.exit(1);
});
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
