export function wrapHtml(content, title = 'Markdown') {
  return `
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>${title}</title>
                <style>
                    body { 
                        font-family: system-ui, sans-serif; 
                        max-width: 800px; 
                        margin: 0 auto; 
                        padding: 20px; 
                        line-height: 1.6; 
                    }
                    pre { 
                        background: #f5f5f5; 
                        padding: 10px; 
                        overflow: auto; 
                    }
                </style>
            </head>
            <body>
                <main>${content}</main>
            </body>
        </html>`;
}
