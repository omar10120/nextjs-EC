
## Getting Started

Step One :  run 'npm install' 
Step Two : 
To construct a database, be sure to run XAMPP; it will be produced automatically when the server is ran. Database name = [nextjsItems]
By making changes to `app/page.js`, you may begin editing the page. As you alter the file, the page automatically updates.
Step Three : 
create .env.local file in this path (..\nextjs\.env.local)  if not exsit fill with database_url should look like this :


DATABASE_URL=mysql://root:@localhost:3306/nextjs
JWT_SECRET=secret-key


Step Four:  run the development server :

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## description 

This project was constructed using Nextjs and included a genuine API for users and products using MySql databases. It also had roles for "admin" and "users" and user authentication via JWT. 
## sceions
products browse
Dashboard for administrators to register and log in 
Dashboard for Users 
Add the Peyment simulation to the card progress

## How should it operate

unsigned user : can browse products and register /Log-in 

Signed users can explore products, view product details, register, add to their card, and view their payment progress. Unsigned users can browse products and register or log in. 

admin : can do all 


## Your feedback will make me happy! Regredit  
