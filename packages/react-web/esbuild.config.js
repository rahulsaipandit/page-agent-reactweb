import * as esbuild from 'esbuild';
import { createServer } from 'http';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';

const isDev = process.argv.includes('--dev');
const outdir = './dist';

// Ensure dist directory exists
if (!existsSync(outdir)) {
    mkdirSync(outdir, { recursive: true });
}

const buildOptions = {
    entryPoints: ['src/index.tsx'],
    bundle: true,
    outfile: join(outdir, 'index.js'),
    format: 'iife',
    platform: 'browser',
    target: ['es2020'],
    loader: {
        '.tsx': 'tsx',
        '.ts': 'ts',
        '.js': 'js',
        '.json': 'json',
    },
    mainFields: ['browser', 'module', 'main'],
    define: {
        'process.env.NODE_ENV': isDev ? '"development"' : '"production"',
    },
    minify: !isDev,
    sourcemap: isDev,
    logLevel: 'info',
};

async function build() {
    if (isDev) {
        const ctx = await esbuild.context(buildOptions);
        await ctx.watch();
        console.log('Watching for changes...');

        // Start a simple development server
        const server = createServer((req, res) => {
            let filePath = req.url === '/' ? '/index.html' : req.url;
            filePath = join('.', filePath);

            const ext = extname(filePath);
            const contentTypes = {
                '.html': 'text/html',
                '.js': 'application/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
            };

            try {
                const content = readFileSync(filePath);
                res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
                res.end(content);
            } catch (e) {
                res.writeHead(404);
                res.end('Not found');
            }
        });

        server.listen(3001, () => {
            console.log('Dev server running at http://localhost:3001');
        });
    } else {
        await esbuild.build(buildOptions);
        console.log('Build complete!');
    }
}

build().catch((e) => {
    console.error(e);
    process.exit(1);
});
