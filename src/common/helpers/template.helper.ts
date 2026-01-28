import { readFileSync } from 'fs';
import { join } from 'path';

export class TemplateHelper {
  static loadTemplate(templateName: string): string {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const basePath = isDevelopment
      ? join(process.cwd(), 'src')
      : join(process.cwd(), 'dist');

    const templatePath = join(
      basePath,
      'infrastructure',
      'templates',
      `${templateName}.html`,
    );
    return readFileSync(templatePath, 'utf-8');
  }

  static render(template: string, variables: Record<string, string>): string {
    let html = template;
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      html = html.replace(new RegExp(placeholder, 'g'), value);
    });
    return html;
  }
}
