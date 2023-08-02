import React, { useEffect, useState } from "react";
import axios, * as others from 'axios';
import { Link } from "react-router-dom";

export default function Home(){

    const [itens, setItens] = useState([]);

    useEffect(() => {
        // Função assíncrona para fazer a requisição dos itens
        const fetchItens = async () => {
            try {
                const response = await axios.get('http://localhost:3000/auth/itens');
                setItens(response.data);
            } catch (error) {
                console.log('Erro ao buscar os itens:', error);
            }
        };

        // Chama a função para buscar os itens ao montar o componente
        fetchItens();
    }, []);


    return(
        <>
            <div>
                <h2>Itens para comprar</h2>
                <h3>Produto - Preço</h3>
                <ul>
                    {itens.map((item) => (
                        <li key={item.id}>{item.quant} - {item.nome} - {item.preco}</li>
                    ))}
                </ul>
                <Link to='/home/cadastro-item'>
                    <button>Adicionar item</button>
                </Link>
            </div>
            <div>
                <h2>Despesas</h2>
            </div>
        </>
    )
}