import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server:{
      proxy:{
        "/api":{ 
          target: "http://k8s-default-backing-8476de3e44-889811917.ap-northeast-2.elb.amazonaws.com/api/",
          rewrite: (path)=>path.replace(/^\/api/,""),
        },
        "/mlapp":{ 
          target: "http://k8s-default-mling-8ad2ca83ed-1581733671.ap-northeast-2.elb.amazonaws.com/mlapp/",
          rewrite: (path)=>path.replace(/^\/mlapp/,""),
        },
      }
    }
});
