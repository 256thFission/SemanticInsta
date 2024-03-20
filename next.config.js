


/** @type {import('next').NextConfig} */
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

await import("./src/env.js");

const nextConfig = {

    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin',
                    },
                    {
                        key: 'Cross-Origin-Embedder-Policy',
                        value: 'require-corp',
                    },
                ],
            },
        ];
    },

    reactStrictMode: true,
    webpack: (config) => {
        config.resolve.extensions.push(".ts", ".tsx");
        config.resolve.fallback = { fs: false };

        config.plugins.push(
            new NodePolyfillPlugin(),
            new CopyPlugin({
                patterns: [
                    {
                        from: './node_modules/onnxruntime-web/dist/ort-wasm.wasm',
                        to: 'static/chunks/app/test',
                    },
                    {
                        from: './node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm',
                        to: 'static/chunks/app/test',
                    },
                    {
                        from: './node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm',
                        to: 'static/chunks/app/test',
                    },
                    {
                        from: './model',
                        to: 'app/test',
                    },
                ],
            }),
        );

        return config;
    },
};

export default nextConfig;