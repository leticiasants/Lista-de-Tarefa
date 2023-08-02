// Permite visualizar as informações do estado do form enquando se desenvolve
import { DevTool } from '@hookform/devtools';
// Permite navegar entre as páginas
import { Link } from 'react-router-dom';
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
import '../Styles/Cadastro.css';

// Validação de dados do form
const schema = yup.object({
    email: yup.string().email('Email inválido').required('Email obrigatório'),
    password: yup.string().min(6,'Senha com no mínimo 6 caracteres').required(),
    confpassword: yup.string().required('Confirme a senha').oneOf([yup.ref('password')], 'As senhas devem coincidir!'),
}).required();

export default function Cadastro() {

    // Usa o useState para gerenciar o estado de msg (utilizado para exibir mensagens de resposta do servidor após a submissão do form)
    const [msg, setMsg] = useState();

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
        try{
            const response = await axios.post('http://localhost:3000/auth/create', data);
            setMsg(response.data);
        } catch (error) {
            setMsg(error.response.data);
        }
    }

    return(
        <div className='Cadastro-Container'>
            <section className='Cadastro-Section-LoginUser'>
                <h1 className='Cadastro-H1'>Cadastro</h1>
                <form className='Cadastro-Form' onSubmit={handleSubmit(submit)} noValidate>
                    <div className='Cadastro-Div-Email'>
                        <label htmlFor="email" className='Cadastro-Label-Email'>&#128231;</label>
                        <input type="email" id='email' placeholder='e-mail' className='Cadastro-Input-Email' {...register('email')}/>
                    </div>
                    <p className='erro'>{errors.email?.message}</p>
                    <div className='Cadastro-Div-Senha'>
                        <label htmlFor="password" className='Cadastro-Label-Senha'>&#128273;</label>
                        <input type="password" id='password' placeholder='senha' className='Cadastro-Input-Senha' {...register('password')}/>
                    </div>
                    <p className='erro'>{errors.password?.message}</p>
                    <div className='Cadastro-Div-ConfSenha'>
                        <label htmlFor="confpassword" className='Cadastro-Label-Senha'>&#128273;</label>
                        <input type="password" id='confpassword' placeholder='confirmar senha' className='Cadastro-Input-Senha' {...register('confpassword')}/>
                    </div>
                    <p className='erro'>{errors.confpassword?.message}</p>

                    <button className='Cadastro-Button-Cadastrar'>Cadastrar</button> 
                </form>
                {/* Permite visualizar as informações do estado do form enquando se desenvolve */}
                <DevTool control={control}/>
                <p className='server-response'>{msg}</p>
                <div className="Cadastro-Div-Login">
                    Já possui conta? 
                    <Link to="/" className='Cadastro-Link-Login'>Login</Link>
                </div>
            </section>
        </div>
    );
}
