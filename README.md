# CS4800_convo_ai

ConvoAI is an AI-powered language learning web application designed to help Spanish learners practice real-world conversations in a judgment-free environment.

## Git Branching Strategy

- `main`: stable, production-ready code  
- `develop`: active development branch  
- `feature/*`: task-specific branches  

## Workflow

1. Create feature branches from `develop`
2. Open pull requests into `develop`
3. Merge `develop` into `main` only at milestones
4. Direct pushes to `main` are discouraged

## Workflow Example

### 1. Starting a New Task

```bash
git checkout develop
git pull origin develop
git checkout -b feature/<task-name>
```

Example:

```bash
git checkout -b feature/login-backend
```

### 2. Working on the Feature

```bash
git add .
git commit -m "Add login endpoint"
git push -u origin feature/login-backend
```

### 3. Feature → Develop (Pull Request)

- Open a pull request  
  - From: `feature/login-backend`  
  - Into: `develop`  
- Teammate reviews  
- Merge when approved  

### 4. Develop → Main (Release Pull Request)

This happens less often:
- End of a sprint
- Before deployment
- Before a demo
