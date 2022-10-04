const express = require('express');

const server = express(); // A variável server recebe express(),
                          // os parenteses indicam que o express exporta uma função,
                          // Ou seja, estamos chamando a função do express. 

server.use(express.json()); // o server é a instância do express, o use é um plugin já importado 
                            // que estamos adicionando para ele (express) e passamos para ele o
                            // express.json()

// CRUD - Create, Read, Update, Delete                            
const users = ["001", "Maria", "maria@gmail.com"];


//Middleware global 
server.use((req, res, next) => {
  console.time('request');
  console.log(`A requisição foi chamada`);
  console.log(`Metodo: ${req.method}, URL ${req.url}`);

  next();
  //return next(); // O next permite a execução da requisição solicitada
                   // Sem o next(), a aplicação é interrompida neste ponto
                   // Também é possível executar outros comandos após o next 
  console.timeEnd('request');
});

//Middleware local (verificar se existe name na requisição)
function checkUserNameExists(req, res, next) {
  if (!req.body.id) { // Vai no corpo da requisição verificar se existe a informação name (nome do usuário)
                        // caso não encontre, será retornado ao usuário um erro 400 com uma mensagem
    return res.status(400).json({ error: 'User id is required' });
  }
  return next(); // Chama o middleware da rota normalmente
}

//Middleware local (verificar se existe usuario)
function checkuserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }

  req.user = user; // Estamos adicionando uma nova variável dentro do req com o valor de user

  return next();
}

/**
 * ROTAS get, post, put e delete a seguir 
 */

//Listagem de um único usuario
server.get('/users/:index', checkuserInArray, (req, res) => {
  //const { index } = req.params;

  //return res.json({ message: `Buscando o índice ${index} usuário ` + users[index] });
  // Lista o usuário índice 1, ou seja, o usuário Matheus 

  return res.json(req.user); // Aqui exibiremos o id capturado na rota
})

//Listagem de todos os usuarios
server.get('/users', (req, res) => {
  return res.json(users);
})

//Cadastrar usuario
//request body
//server.post("/users", (req, res) => {
server.post("/users", checkUserNameExists, (req, res) => {
  const { id,name, email } = req.body;

  users.push({
    id: id,
    name: name, 
    email: email
});
 
  return res.json(users);
});

//Editar Um usuario
server.put(
//  "/users/:index", (req, res) => {
  "/users/:index", checkuserInArray, checkUserNameExists, (req, res) => {
    const { index } = req.params;
    const { id,name, email } = req.body;

    users[index] = id, name, email; // Substitui no vetor o nome que está na posição do 
                         // index passado pelo nome passado no corpo da requisição

    return res.json(users);
  }
);

//Excluir um usuario
server.delete("/users/:index", (req, res) => {
  const { index } = req.params;

  users.splice(index, 1); // O método splice percorre o vetor até o index e 
                          // e exclui a partir daquela posição o número de 
                          // posições passada no segundo parâmetro.

  return res.json(users);
});

server

// Porta utilizada pelo servidor
server.listen(3000)
