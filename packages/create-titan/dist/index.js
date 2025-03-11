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
  const spinner = ora();
  try {
    console.log(chalk.cyan("\n\u{1F680} Welcome to Titan CLI!\n"));
    console.log(chalk.yellow("Pre-requisites check:"));
    console.log(chalk.yellow("1. The following connection info is ready:"));
    console.log(chalk.yellow("   - Clerk (Publishable Key & Secret Key)"));
    console.log(chalk.yellow("   - Stripe (Public Key, Secret Key & Price ID)"));
    console.log(chalk.yellow("   - Plunk API Key"));
    console.log(chalk.yellow("   - Supabase:"));
    console.log(chalk.yellow("     * NEXT_PUBLIC_SUPABASE_URL"));
    console.log(chalk.yellow("     * SUPABASE_SERVICE_ROLE_KEY"));
    console.log(chalk.yellow("     * DATABASE_URL (with pgbouncer)"));
    console.log(chalk.yellow("     * DIRECT_URL (without pgbouncer)\n"));
    console.log(chalk.cyan("\u{1F4A1} Important Note:"));
    console.log(
      chalk.cyan(
        '   We recommend creating a dedicated project in Supabase called "[Project Name] Dev DB"'
      )
    );
    console.log(
      chalk.cyan(
        "   for development purposes. Supabase offers 2 free projects in their free tier, so you can"
      )
    );
    console.log(
      chalk.cyan("   use one for development and one for production later on.\n")
    );
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
    spinner.start("Creating your project...");
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
    const promptWithConfirmation = async (message, type = "text") => {
      let confirmed = false;
      let value = "";
      while (!confirmed) {
        const result = await prompts({
          type,
          name: "value",
          message
        }, {
          onCancel: () => {
            console.log("\nSetup cancelled");
            process.exit(1);
          }
        });
        value = result.value;
        if (!value) {
          console.log(chalk.red("This value is required"));
          continue;
        }
        const confirmation = await prompts({
          type: "text",
          name: "confirmed",
          message: `Are you sure you've inputted that env var correctly? (Type "yes" to proceed)`
        }, {
          onCancel: () => {
            console.log("\nSetup cancelled");
            process.exit(1);
          }
        });
        confirmed = confirmation.confirmed?.toLowerCase() === "yes";
        if (!confirmed) {
          console.log(chalk.yellow("Let's try again..."));
        }
      }
      return value;
    };
    const clerkPublishableKey = await promptWithConfirmation("Enter your Clerk Public Key:", "password");
    const clerkSecretKey = await promptWithConfirmation("Enter your Clerk Secret Key:", "password");
    const authConfig = {
      clerkPublishableKey,
      clerkSecretKey
    };
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
    const { dbSetup } = await prompts({
      type: "select",
      name: "dbSetup",
      message: "Choose your database setup:",
      choices: [
        {
          title: 'Development Database (create a dedicated project in Supabase called "[Project Name] Dev DB")',
          value: "dev"
        },
        {
          title: "Production Database (NOT RECOMMENDED FOR NEW PROJECTS)",
          value: "prod"
        }
      ]
    });
    if (dbSetup === "dev") {
      spinner.stop();
      console.log(
        chalk.green(
          "\n\u2705 Good choice! Using a dedicated Supabase Dev DB is reliable and consistent."
        )
      );
      console.log(
        chalk.green(
          `   If you haven't already, create a project called "[Project Name] Dev DB" in Supabase.`
        )
      );
      console.log(
        chalk.green(
          "   You can find your database credentials in the project settings.\n"
        )
      );
      const supabaseUrl = await promptWithConfirmation("Enter your Supabase Project URL:");
      if (!supabaseUrl.startsWith("https://")) {
        console.log(chalk.red("URL must start with https://"));
        process.exit(1);
      }
      const supabaseAnonKey = await promptWithConfirmation("Enter your Supabase Anon Key:", "password");
      const supabaseServiceKey = await promptWithConfirmation("Enter your Supabase Service Role Key:", "password");
      const databaseUrl = await promptWithConfirmation("Enter your Database URL (with pgbouncer):");
      if (!databaseUrl.includes("?pgbouncer=true")) {
        console.log(chalk.red("URL must include ?pgbouncer=true"));
        process.exit(1);
      }
      const directUrl = await promptWithConfirmation("Enter your Direct URL (without pgbouncer):");
      const dbConfig = {
        supabaseUrl,
        supabaseAnonKey,
        supabaseServiceKey,
        databaseUrl,
        directUrl
      };
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
      console.log(chalk.yellow("\nSupabase env variables are set. We're skipping database setup during project creation."));
      console.log(chalk.cyan("After installation, you can set up the database with:"));
      console.log(chalk.cyan("  bun run db:init"));
    } else {
      spinner.stop();
      console.log(
        chalk.green(
          "\n\u2705 Good choice! Using a dedicated Supabase Dev DB is reliable and consistent."
        )
      );
      console.log(
        chalk.green(
          `   If you haven't already, create a project called "[Project Name] Dev DB" in Supabase.`
        )
      );
      console.log(
        chalk.green(
          "   You can find your database credentials in the project settings.\n"
        )
      );
      const supabaseUrl = await promptWithConfirmation("Enter your Supabase Project URL:");
      if (!supabaseUrl.startsWith("https://")) {
        console.log(chalk.red("URL must start with https://"));
        process.exit(1);
      }
      const supabaseAnonKey = await promptWithConfirmation("Enter your Supabase Anon Key:", "password");
      const supabaseServiceKey = await promptWithConfirmation("Enter your Supabase Service Role Key:", "password");
      const databaseUrl = await promptWithConfirmation("Enter your Database URL (with pgbouncer):");
      if (!databaseUrl.includes("?pgbouncer=true")) {
        console.log(chalk.red("URL must include ?pgbouncer=true"));
        process.exit(1);
      }
      const directUrl = await promptWithConfirmation("Enter your Direct URL (without pgbouncer):");
      const dbConfig = {
        supabaseUrl,
        supabaseAnonKey,
        supabaseServiceKey,
        databaseUrl,
        directUrl
      };
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
      console.log(chalk.yellow("\nDatabase setup is skipped during project creation."));
      console.log(chalk.cyan("After installation, once you are happy with your database schema, you can update db/schema/ and then run:"));
      console.log(chalk.cyan("  bun run db:push"));
    }
    spinner.stop();
    const stripePublicKey = await promptWithConfirmation("Enter your Stripe Publishable Key:");
    const stripeSecretKey = await promptWithConfirmation("Enter your Stripe Secret Key:", "password");
    const stripePriceId = await promptWithConfirmation("Enter your Stripe Price ID:");
    const paymentConfig = {
      stripePublicKey,
      stripeSecretKey,
      stripePriceId
    };
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
    const plunkApiKey = await promptWithConfirmation("Enter your Plunk Secret API Key:");
    const emailConfig = {
      plunkApiKey
    };
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
      await execa("bun", ["install"], { stdio: "inherit", cwd: projectDir });
      spinner.succeed("Dependencies installed");
    } catch (error) {
      spinner.fail("Failed to install dependencies");
      console.error(chalk.red("Error installing dependencies:"), error);
      throw error;
    }
    spinner.start("Setting up git repository...");
    try {
      await execa("rm", ["-rf", path.join(projectDir, ".git")], { cwd: projectDir });
      await execa("git", ["init"], { cwd: projectDir });
      await execa("git", ["add", "."], { cwd: projectDir });
      await execa("git", ["commit", "-m", "Initial commit from Titan CLI"], { cwd: projectDir });
      await execa("git", ["branch", "-M", "main"], { cwd: projectDir });
      try {
        await execa("git", ["remote", "remove", "origin"], { cwd: projectDir });
      } catch (error) {
      }
      await execa("git", ["remote", "add", "origin", githubRepo], { cwd: projectDir });
      try {
        await execa("git", ["push", "-u", "origin", "main", "--force"], { cwd: projectDir });
      } catch (pushError) {
        await execa("git", ["branch", "-M", "master"], { cwd: projectDir });
        await execa("git", ["push", "-u", "origin", "master", "--force"], { cwd: projectDir });
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
    await fs.writeFile(path.join(projectDir, "README.md"), readmeContent);
    try {
      await fs.rm(path.join(projectDir, "packages"), { recursive: true, force: true });
    } catch (error) {
    }
    spinner.start("Writing final configurations...");
    await fs.writeFile(path.join(projectDir, ".env"), envContent);
    spinner.succeed("Final configurations written");
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
    console.log(chalk.green("\n\u2728 Project created and pushed to GitHub successfully! \u2728"));
    console.log(chalk.cyan("\nNext steps:"));
    console.log(chalk.cyan("1. cd into your project"));
    console.log(chalk.cyan("2. Run bun i"));
    console.log(chalk.cyan("4. Run bun dev to start the development server"));
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
