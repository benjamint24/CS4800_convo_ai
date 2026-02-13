Local Development Environment Setup

ConvoAI – CS4800

Overview

This document describes the required local development environment for all team members working on the ConvoAI project. Each developer must configure Node.js and PostgreSQL locally before beginning backend development.

Node.js Setup

Required Version: Node.js 20 (LTS)

To verify installation:

node -v


If using Node Version Manager (nvm):

nvm install 20
nvm use 20


The project includes a .nvmrc file to ensure consistent Node versions across the team.

PostgreSQL Setup

Each developer must install PostgreSQL locally.

To verify installation:

psql --version


To start PostgreSQL service (Mac):

brew services start postgresql

Local Development Database

Each team member must create a local database instance.

Enter PostgreSQL:

psql postgres


Create database:

CREATE DATABASE convoai_dev;


Create development user:

CREATE USER convoai_user WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE convoai_dev TO convoai_user;


Exit PostgreSQL:

\q


Each developer runs their own local database. Databases are not shared during development.

Production Database

A shared PostgreSQL instance will be configured during deployment using Railway or Render. Local development databases are separate from production.

Notes

Each team member must configure their own local database.

.env files containing database credentials must not be committed to GitHub.

An .env.example file will be provided for configuration reference.i