(base) Jonny@MacBook-Pro CS4800_convo_ai % git checkout -b feature/test-
auth-endpoints
Switched to a new branch 'feature/test-auth-endpoints'
(base) Jonny@MacBook-Pro CS4800_convo_ai % curl -X POST http://localhost:5050/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@test.com","password":"123456"}'
{"message":"User registered successfully","userId":"d6ee5f74-072b-4733-9b4a-d4369588ca3f"}%                                                     
(base) Jonny@MacBook-Pro CS4800_convo_ai % curl -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@test.com","password":"123456"}'
{"message":"Login successful","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNmVlNWY3NC0wNzJiLTQ3MzMtOWI0YS1kNDM2OTU4OGNhM2YiLCJpYXQiOjE3NzI5NTE2MzMsImV4cCI6MTc3Mjk1NTIzM30.bt0ElQc2hcWGuVDhxj8i4jN1sJp7IlgO2q--yLRRl-E"}%                                                      
(base) Jonny@MacBook-Pro CS4800_convo_ai % curl -X POST http://localhost:5050/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@test.com","password":"123456"}'
{"message":"User already exists"}%                                      
(base) Jonny@MacBook-Pro CS4800_convo_ai % curl -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@test.com","password":"wrong"}'
{"message":"Invalid credentials"}%                                      
(base) Jonny@MacBook-Pro CS4800_convo_ai % curl http://localhost:5050/api/chat
{"message":"No token provided"}%                                        
(base) Jonny@MacBook-Pro CS4800_convo_ai % curl http://localhost:5050/api/chat \
  -H "Authorization: Bearer YOUR_TOKEN"
{"message":"Unauthorized"}%                                             
(base) Jonny@MacBook-Pro CS4800_convo_ai % 