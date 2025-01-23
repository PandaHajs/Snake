import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
    sassOptions: {
      silenceDeprecations: ['legacy-js-api'], // Temporary silence while Next.js team works on a fix
    },
}
 
export default nextConfig
