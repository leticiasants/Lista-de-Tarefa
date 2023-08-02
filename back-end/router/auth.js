//rotas
const express = require('express');
const router = express.Router();

//arquivos
const fs = require('fs');
const path = require('path');


//autenticacao e cryp
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Item = require('../models/Item');

//dotenv
require('dotenv').config();

//Requisicao com POST publica para autenticar usuário
router.post('/login', async (req,res) => {

    //extraindo os dados do formulário para criacao do usuario
    const {email, password} = req.body; 
    
    //Abre o bd (aqui estamos simulando com arquivo)
    const jsonPath = path.join(__dirname, '..', 'db', 'users.json');
    const usuariosCadastrados = JSON.parse(fs.readFileSync(jsonPath, { encoding: 'utf8', flag: 'r' }));

    //verifica se existe usuario com email    
    for (let user of usuariosCadastrados){
        if(user.email === email){
            //usuario existe.  Agora é verificar a senha
            const passwordValidado = await bcrypt.compare(password, user.password);
            if(passwordValidado===true){
                //Usuario foi autenticado.
                //Agora vamos retornar um token de acesso
                //para isso usamos jwt
                //O primeiro parametro é o que queremos serializar (o proprio user)
                //O segundo parametro é a chave secreta do token. Está no arquivo .env
                //La coloquei as instruções de como gerar
                const tokenAcesso = jwt.sign(user,process.env.TOKEN);
                return res.status(200).json(tokenAcesso);
            }
                
            else
                return res.status(422).send(`Usuario ou senhas incorretas.`);
        }   
    }
    //Nesse ponto não existe usuario com email informado.
    return res.status(409).send(`Usuario com email ${email} não existe. Criar uma conta!`);

})

//Requisicao com POST publica para criar usuário
router.post('/create', async (req,res) => {
    //extraindo os dados do formulário para criacao do usuario
    const {email, password} = req.body; 
    //Para facilitar já estamos considerando as validações feitas no front
    //agora vamos verificar se já existe usuário com esse e-mail
    
    //Abre o bd (aqui estamos simulando com arquivo)
    const jsonPath = path.join(__dirname, '..', 'db', 'users.json');
    const usuariosCadastrados = JSON.parse(fs.readFileSync(jsonPath, { encoding: 'utf8', flag: 'r' }));

    //verifica se já existe usuario com o email informado
    
    for (let users of usuariosCadastrados){
        if(users.email === email){
            //usuario já existe. Impossivel criar outro
            //Retornando o erro 409 para indicar conflito
            return res.status(409).send(`Usuario com email ${email} já existe.`);
        }   
    }
    //Deu certo. Vamos colocar o usuário no "banco"
    //Gerar um id incremental baseado na qt de users
    const id = usuariosCadastrados.length + 1;
    
    //gerar uma senha cryptografada
    const salt = await bcrypt.genSalt(10);
    const passwordCrypt = await bcrypt.hash(password,salt);

    //Criacao do user
    const user = new User(id, email, passwordCrypt);

    //Salva user no "banco"
    usuariosCadastrados.push(user);
    fs.writeFileSync(jsonPath,JSON.stringify(usuariosCadastrados,null,2));
    res.send(`Usuario cadastrado com sucesso.`);
});


// Nova rota para fornecer o JSON com os itens
router.get('/itens', async (req, res) => {
    const jsonPath = path.join(__dirname, '..', 'db', 'itens.json');
    const itensCadastrados = JSON.parse(fs.readFileSync(jsonPath, { encoding: 'utf8', flag: 'r' }));

    return res.json(itensCadastrados);
});


router.post('/cadastro-item', async (req, res) => {
    //extraindo os dados do formulário para criacao do usuario
    const {quant, nome, preco} = req.body; 
    //Para facilitar já estamos considerando as validações feitas no front
    //agora vamos verificar se já existe usuário com esse e-mail
    
    //Abre o bd (aqui estamos simulando com arquivo)
    const jsonPath = path.join(__dirname, '..', 'db', 'itens.json');
    const itensCadastrados = JSON.parse(fs.readFileSync(jsonPath, { encoding: 'utf8', flag: 'r' }));

    //verifica se já existe usuario com o email informado
    
    for (let itens of itensCadastrados){
        if(itens.nome === nome){
            //usuario já existe. Impossivel criar outro
            //Retornando o erro 409 para indicar conflito
            return res.status(409).send(`Item ${nome} já cadastrado.`);
        }   
    }
    //Deu certo. Vamos colocar o usuário no "banco"
    //Gerar um id incremental baseado na qt de users
    const id = itensCadastrados.length + 1;
    
    
    //Criacao do user
    const item = new Item(id, quant, nome, preco);

    //Salva user no "banco"
    itensCadastrados.push(item);
    fs.writeFileSync(jsonPath,JSON.stringify(itensCadastrados,null,2));
    res.send(`Item cadastrado com sucesso.`);
  });



module.exports = router;