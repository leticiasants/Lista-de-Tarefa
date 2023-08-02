import { Outlet } from 'react-router-dom';
import { Link, Navigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Clima from './Clima'

import '../Styles/Header.css'

export default function Header(){
    const [userAuthenticated, setUserAuthenticated] = useState(false);

    useEffect(() => {
        // Verificar se o usuário está autenticado
        const token = localStorage.getItem('token');
        if (token) {
            // Enviar o token no cabeçalho da requisição para validar no back-end
            axios.get('http://localhost:3000/auth', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                setUserAuthenticated(true);
            })
            .catch(error => {
                setUserAuthenticated(false);
            });
        } else {
            setUserAuthenticated(false);
        }
    }, []);

    if (!userAuthenticated) {
        // Se o usuário não estiver autenticado, redirecionar para a página de login
        return <Navigate to="/" />;
    }

    const [dataAtual, setDataAtual] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
          setDataAtual(new Date());
        }, 86400000);
        return () => clearInterval(timer);
    }, []);

    const formatarData = (data) => {
        const dia = data.getDate();
        const mes = data.getMonth() + 1; // Os meses são indexados a partir de zero
        const ano = data.getFullYear();
    
        return `${dia}/${mes}/${ano}`;
    };


    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const date = new Date();
            const formattedHour = date.getHours();
            const formattedMinute = date.getMinutes();
            setHour(formattedHour);
            setMinute(formattedMinute);
        };

        updateTime(); // Atualiza a hora imediatamente

        // Atualiza a hora a cada minuto
        const intervalId = setInterval(updateTime, 60000);

        // Limpa o intervalo quando o componente é desmontado
        return () => clearInterval(intervalId);
    }, []);

    return(
        <>
            <header className='Header'>
                <Link to='/home' className='Header-Link'>Lista de Compras</Link>
                <Clima className='Header-Clima'/>
                <div className='Header-horario'>
                    <p>{hour}</p> 
                    <p>{minute.toString().padStart(2, '0')}</p>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
        </>
    )
}