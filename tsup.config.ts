import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts', 'src/valibot.ts', 'src/zod.ts'],
	format: ['cjs', 'esm'],
	dts: true,
	splitting: true,
	clean: true,
	outDir: 'dist',
});
