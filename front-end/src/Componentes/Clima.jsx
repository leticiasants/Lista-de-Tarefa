import axios from 'axios'
import { useEffect,useState } from 'react';
import '../Styles/Clima.css'

const Clima = () =>{

    //Uso do useState onde se cria teremos dataClima (lugar para guardar os dados) e a funcão setDataClima
    //(que serve para atualizar os dados). Vai ser inicializado com null, pois inicialmente não se tem data de
    //nenhum tipo
    const [dataClima, setDataClima] = useState(null)
    const [dataClimaForecast, setDataClimaForecast] = useState(null)

    //Se utiliza o hook (gancho) useEffect para conseguir executar as funcões que vão estar dentro dele depois de que
    //o componente seja sido colocado no DOM. Se não fosse utilizado seria necessario encontrar outra forma de executar
    //as funcões, mas como neste caso o ideal é que as funcões sejam executadas quando o componente é colocado este hook 
    //faz o trabalho desejado. Ele esta composto de uma funcão e de um parametro opcional chamado de dependencias
    useEffect(()=>{
      const getLocalizacao = () =>{
        if(navigator.geolocation){
          navigator.geolocation.getCurrentPosition(getClimaData,erroLocalizacao)
        }
        else{
          console.log("O navegador consegue dar soporte para obter localizacão")
        }
      }

      const getClimaData = async (position) =>{
        const {latitude, longitude} = position.coords
        try {
          const resposta = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}5&appid=29914f06306cdc0e49b752cc7d3eeca1&lang=pt_br`)          
          const respostaForecast = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=29914f06306cdc0e49b752cc7d3eeca1&lang=pt_br`)
          setDataClima(resposta.data)
          setDataClimaForecast(respostaForecast.data)
        } catch (error) {
          console.log("Erro no momento de obter os dados climáticos")
        }
      }

      const erroLocalizacao = (erro) =>{
        console.error("Erro ao obter a localizacão: ",erro)
      }

      getLocalizacao()
    },[])

    return(
      <div className='Clima-Container'>
        {dataClima ? (
          <div className='Clima'>
            <div className='Clima-atual'>
              <figure>
                <img src={`https://openweathermap.org/img/w/${dataClima.weather[0].icon}.png`} alt="" />
                {Math.round(dataClima.main.temp - 273)}°C
              </figure>
              <div className='Info'>
                <p>Temperatura Atual</p>
                <p> {dataClima.weather[0].description} </p>
              </div>
            </div>
            
            <div className='Clima-em3horas'>
              <p>Em 3 horas:</p>
              <figure>
                <img src={`https://openweathermap.org/img/w/${dataClimaForecast.list[0].weather[0].icon}.png`} alt="" />
                {Math.round(dataClimaForecast.list[0].main.temp_min - 273)}°C
              </figure>
              <p>{dataClimaForecast.list[0].weather[0].description}</p>
              
            </div>
          </div>
        ):(
          <p className='Clima-buscando'>Obtendo dados do clima...</p>
        )}
      </div>
    )
}

  export default Clima
