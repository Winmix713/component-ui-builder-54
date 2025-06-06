
import { designTokens, themeVariations, type ThemeVariation } from '../tokens/design-tokens';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

interface GenerateThemeOptions {
  outputDir?: string;
  generateTailwindConfig?: boolean;
  generateCssVariables?: boolean;
  themeVariation?: ThemeVariation;
}

export class ThemeGenerator {
  private outputDir: string;

  constructor(options: GenerateThemeOptions = {}) {
    this.outputDir = options.outputDir || resolve(__dirname, '../');
  }

  generateCssVariables(themeVariation?: ThemeVariation): string {
    const { colors, spacing, typography, radius, shadows, animation } = designTokens;
    
    // Apply theme variation if specified
    const lightColors = themeVariation 
      ? { ...colors.light, ...themeVariations[themeVariation] }
      : colors.light;
    
    const darkColors = themeVariation 
      ? { ...colors.dark, ...themeVariations[themeVariation] }
      : colors.dark;

    const lightVars = Object.entries(lightColors)
      .map(([key, value]) => `    --${key}: ${value};`)
      .join('\n');

    const darkVars = Object.entries(darkColors)
      .map(([key, value]) => `    --${key}: ${value};`)
      .join('\n');

    const spacingVars = Object.entries(spacing)
      .map(([key, value]) => `    --spacing-${key}: ${value};`)
      .join('\n');

    const typographyVars = Object.entries(typography)
      .map(([key, value]) => `    --font-size-${key}: ${value};`)
      .join('\n');

    const radiusVars = Object.entries(radius)
      .map(([key, value]) => `    --radius-${key}: ${value};`)
      .join('\n');

    const shadowVars = Object.entries(shadows)
      .map(([key, value]) => `    --shadow-${key}: ${value};`)
      .join('\n');

    const animationVars = Object.entries(animation)
      .map(([key, value]) => `    --duration-${key}: ${value};`)
      .join('\n');

    return `@layer base {
  :root {
    /* Light theme colors */
${lightVars}

    /* Spacing tokens */
${spacingVars}

    /* Typography tokens */
${typographyVars}

    /* Radius tokens */
${radiusVars}

    /* Shadow tokens */
${shadowVars}

    /* Animation tokens */
${animationVars}

    --radius: 0.5rem;
  }

  .dark {
    /* Dark theme colors */
${darkVars}
  }
}`;
  }

  generateTailwindConfig(): string {
    const { spacing, typography, radius, shadows, animation } = designTokens;

    const config = {
      theme: {
        extend: {
          colors: {
            border: 'hsl(var(--border))',
            input: 'hsl(var(--input))',
            ring: 'hsl(var(--ring))',
            background: 'hsl(var(--background))',
            foreground: 'hsl(var(--foreground))',
            primary: {
              DEFAULT: 'hsl(var(--primary))',
              foreground: 'hsl(var(--primary-foreground))',
            },
            secondary: {
              DEFAULT: 'hsl(var(--secondary))',
              foreground: 'hsl(var(--secondary-foreground))',
            },
            destructive: {
              DEFAULT: 'hsl(var(--destructive))',
              foreground: 'hsl(var(--destructive-foreground))',
            },
            muted: {
              DEFAULT: 'hsl(var(--muted))',
              foreground: 'hsl(var(--muted-foreground))',
            },
            accent: {
              DEFAULT: 'hsl(var(--accent))',
              foreground: 'hsl(var(--accent-foreground))',
            },
            popover: {
              DEFAULT: 'hsl(var(--popover))',
              foreground: 'hsl(var(--popover-foreground))',
            },
            card: {
              DEFAULT: 'hsl(var(--card))',
              foreground: 'hsl(var(--card-foreground))',
            },
          },
          spacing: spacing,
          fontSize: typography,
          borderRadius: radius,
          boxShadow: shadows,
          transitionDuration: animation,
        },
      },
    };

    return `// This file is auto-generated. Do not edit manually.
import type { Config } from "tailwindcss";

const themeConfig = ${JSON.stringify(config, null, 2)};

export default themeConfig;
`;
  }

  writeCssFile(content: string, filename: string = 'theme-generated.css'): void {
    const filepath = resolve(this.outputDir, filename);
    writeFileSync(filepath, content, 'utf8');
    console.log(`✅ Generated CSS file: ${filepath}`);
  }

  writeTailwindConfig(content: string, filename: string = 'theme-config.generated.ts'): void {
    const filepath = resolve(this.outputDir, filename);
    writeFileSync(filepath, content, 'utf8');
    console.log(`✅ Generated Tailwind config: ${filepath}`);
  }

  generateAll(options: GenerateThemeOptions = {}): void {
    const cssContent = this.generateCssVariables(options.themeVariation);
    const tailwindContent = this.generateTailwindConfig();

    if (options.generateCssVariables !== false) {
      this.writeCssFile(cssContent);
    }

    if (options.generateTailwindConfig !== false) {
      this.writeTailwindConfig(tailwindContent);
    }

    console.log('🎉 Theme generation completed!');
  }

  generateThemeVariations(): void {
    Object.keys(themeVariations).forEach((variation) => {
      const cssContent = this.generateCssVariables(variation as ThemeVariation);
      this.writeCssFile(cssContent, `theme-${variation}.css`);
    });
    console.log('🎨 All theme variations generated!');
  }
}

// CLI execution
if (require.main === module) {
  const generator = new ThemeGenerator();
  
  const args = process.argv.slice(2);
  const shouldGenerateVariations = args.includes('--variations');
  const themeVariation = args.find(arg => arg.startsWith('--theme='))?.split('=')[1] as ThemeVariation;

  if (shouldGenerateVariations) {
    generator.generateThemeVariations();
  } else {
    generator.generateAll({ themeVariation });
  }
}
