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

// Validação de dados do form
const schema = yup.object({
    quant: yup.number().min(1, 'A quantidade deve ser maior que 0').required(),
    nome: yup.string().min(2, 'O nome deve conter pelo menos 2 caracteres').required(),
    preco: yup.number().min(0.01, 'O preço deve ser maior que 0').required(),
}).required();

export default function CadastroItem() {

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
        try {
            // Obtém o token do localStorage (ou de outro local onde você o armazena)
            const token = localStorage.getItem('token');

            // Envia a requisição com o token no cabeçalho da requisição
            const response = await axios.post('http://localhost:3000/auth/cadastro-item', data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMsg(response.data);
        } catch (error) {
            setMsg(error.response.data);
        }
    }

    return(
        <div className='Cadastro-Container'>
            <section className='Cadastro-Section-LoginUser'>
                <h1 className='Cadastro-H1'>Cadastro de itens</h1>
                <form className='Cadastro-Form' onSubmit={handleSubmit(submit)} noValidate>
                    <div className='Cadastro-Div-Email'>
                        <label htmlFor="quant" className='Cadastro-Label-Email'>&#128231;</label>
                        <input type="quant" id='quant' placeholder='quantidade' className='Cadastro-Input-Email' {...register('quant')}/>
                    </div>
                    <p className='erro'>{errors.quant?.message}</p>
                    <div className='Cadastro-Div-Senha'>
                        <label htmlFor="nome" className='Cadastro-Label-Senha'>&#128273;</label>
                        <input type="nome" id='nome' placeholder='nome' className='Cadastro-Input-Senha' {...register('nome')}/>
                    </div>
                    <p className='erro'>{errors.nome?.message}</p>
                    <div className='Cadastro-Div-ConfSenha'>
                        <label htmlFor="preco" className='Cadastro-Label-Senha'>&#128273;</label>
                        <input type="preco" id='preco' placeholder='preço' className='Cadastro-Input-Senha' {...register('preco')}/>
                    </div>
                    <p className='erro'>{errors.preco?.message}</p>

                    <button className='Cadastro-Button-Cadastrar'>Cadastrar item</button> 
                </form>
                <p className='server-response'>{msg}</p>
            </section>
        </div>
    );
}
