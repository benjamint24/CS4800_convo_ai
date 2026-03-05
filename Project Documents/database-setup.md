Local PostgreSQL Setup
Overview

This project uses a local PostgreSQL database for development.
Each developer runs their own local database instance.

Production will use Railway or Render.

1️⃣ Install PostgreSQL (macOS – Homebrew)
brew install postgresql
brew services start postgresql


Verify installation:

psql --version

2️⃣ Create the ConvoAI Database

Open PostgreSQL shell:

psql postgres


Create the database:

CREATE DATABASE convoai;


Verify database exists:

\l


Exit:

\q

3️⃣ Configure Backend Environment

Inside backend/.env:

change DATABASE_URL to the url
DATABASE_URL="put the link"



⚠️ .env is ignored by Git and should never be committed.

4️⃣ Test Database Connection

Verify that PostgreSQL can connect:

psql -d convoai


If successful, PostgreSQL is configured correctly.

Exit with:

\q