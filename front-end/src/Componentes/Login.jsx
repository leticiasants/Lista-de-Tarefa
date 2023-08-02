// Permite visualizar as informações do estado do form enquando se desenvolve
import { DevTool } from '@hookform/devtools';
// Permite navegar entre as páginas
import { Link, Navigate } from 'react-router-dom';
// Usado para criar o objeto de formulário e gerenciar o estado do form
import {useForm} from 'react-hook-form';
// Permite usar esquemas yup para validar os dados do form
import { yupResolver } from "@hookform/resolvers/yup";
// Recursos de validação
import * as yup from "yup";
// Chamadas HTTP assíncronas
import axios, * as others from 'axios';
// Permiti que o componente reaja a mudanças e renderize novamente quando o estado é atualizado
import { useState } from 'react';
import '../Styles/Login.css'

// Validação de dados do form
const schema = yup.object({
    email: yup.string().email('Email inválido').required('Email obrigatório'),
    password: yup.string().min(6,'Senha com no mínimo 6 caracteres').required(),
}).required();

export default function Login() {

    // Usa o useState para gerenciar o estado de msg (utilizado para exibir mensagens de resposta do servidor após a submissão do form)
    const [msg, setMsg] = useState(' ');

    // useForm usado para criar o objeto form e passa o yupResolver para realizar a validação do campo do form
    const form = useForm({
        resolver: yupResolver(schema)
    });

    // register: para que o react-hook-form possa rastrear suas alterações e validar os dados
    // handleSubmit: chamado quando o form é submetido, e chama a função submit
    const { register, control, handleSubmit, formState } = form;

    // mensagens de erro de validação são exibidas abaixo de cada campo do form
    const {errors} = formState;

    // Função assíncrona que envia os dados do form para o servidor usando o axios
    const submit = async (data) => {
        // Se a requisição for bem sucedida try, senão catch
        try {
            const response = await axios.post('http://localhost:3000/auth/login', data);
            sessionStorage.setItem('token', response.data);
            setMsg('Usuário Autenticado');
        } catch (error) {
            setMsg(error.response.data);
        }   
        
    }

    // Se msg conter 'Usuário Autenticado' vai para a página /cadastro
    if(msg.includes('Usuário Autenticado')){
        return <Navigate to='/home' />
    }

    return(
        <div className='Login-Container'>
            <section className='Login-Section-LoginUser'>
                <h1 className='Login-H1'>Login</h1>
                <form className='Login-Form' onSubmit={handleSubmit(submit)} noValidate>
                    <div className='Login-Div-Email'>
                        <label htmlFor="email" className='Login-Label-Email'>&#128231;</label>
                        <input type="email" placeholder='e-mail' className='Login-Input-Email'{...register('email')}/>
                    </div>
                    <p className='erro'>{errors.email?.message}</p>
                    <div className='Login-Div-Senha'>
                        <label htmlFor="password" className='Login-Label-Senha'>&#128273;</label>
                        <input type="password" placeholder='senha' className='Login-Input-Senha'{...register('password')}/>
                    </div>
                    <p className='erro'>{errors.password?.message}</p>

                    <button className='Login-Button-Entrar'>Entrar</button> 
                </form>
                {/* Permite visualizar as informações do estado do form enquando se desenvolve */}
                <DevTool control={control}/>
                <p className="server-response">{msg}</p>
                <div className="Login-Div-Cadastro">
                    Não possui conta? 
                    <Link to="/cadastro" className='Login-Link-Cadastro'>Cadastro</Link>
                </div>
            </section>
        </div>
    );
}