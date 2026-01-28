import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Template Helper
 * Utility class for loading and rendering HTML templates with variable substitution.
 *
 * Features:
 * - Loads templates from infrastructure/templates directory
 * - Supports both development and production environments
 * - Performs simple mustache-style variable replacement
 * - Handles paths correctly in both source and compiled code
 */
export class TemplateHelper {
  /**
   * Load HTML template file from disk
   *
   * Path resolution:
   * - Development: src/infrastructure/templates/
   * - Production: dist/infrastructure/templates/
   *
   * @param templateName Template file name without extension (e.g., 'note', 'en.template')
   * @returns Template content as string
   * @throws Error if template file not found or cannot be read
   *
   * @example
   * const template = TemplateHelper.loadTemplate('note');
   */
  static loadTemplate(templateName: string): string {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const basePath = isDevelopment
      ? join(__dirname, '../../..', 'src')
      : join(__dirname, '../..');

    const templatePath = join(
      basePath,
      'infrastructure',
      'templates',
      `${templateName}.html`,
    );
    return readFileSync(templatePath, 'utf-8');
  }

  /**
   * Render template by replacing placeholders with values
   *
   * Substitution format: {{PLACEHOLDER_NAME}}
   * Example: {{NOTE}}, {{DATE}}, {{HEADER_TITLE}}
   *
   * @param template Template string containing placeholders
   * @param variables Object mapping placeholder names to their values
   * @returns Rendered HTML string with all placeholders replaced
   *
   * @example
   * const html = TemplateHelper.render(template, {
   *   NOTE: "Life is like a box of chocolates",
   *   DATE: "Monday, January 26, 2026",
   *   HEADER_TITLE: "Daily Note",
   * });
   */
  static render(template: string, variables: Record<string, string>): string {
    let html = template;
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      html = html.replace(new RegExp(placeholder, 'g'), value);
    });
    return html;
  }
}
