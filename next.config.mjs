/** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


const nextConfig = {
    env: {
      JWT_SECRET: process.env.JWT_SECRET,
    },
  };
  
  export default nextConfig;

  