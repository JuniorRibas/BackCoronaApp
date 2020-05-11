'use strict'
const cheerio = require('cheerio')
const axios = require('axios')



class ScrapingController {

    async global({ response }) {
        const data = await axios.get('https://www.worldometers.info/coronavirus/')

        const $ = cheerio.load(data.data)

        const total = $('div[id=maincounter-wrap]');
        var dados = []
        total.each((index, elemt) => {
            var titulo = $(elemt).find('h1').text()
            var descricao = $(elemt).find('span').text()
            dados.push({ titulo, descricao })
        })
        response.json(dados)
    }

    async tabela ({ response }) {
        const { data } = await axios.get('https://www.worldometers.info/coronavirus/')

        const $ = cheerio.load(data)

        const tabela = $('table > tbody > tr')

        const dados = []
        var key = 0
        tabela.each((index, elemt) => {
                key ++
                var pais = $($(elemt).children('td').toArray()[0]).text()
                var totalCasos = $($(elemt).children('td').toArray()[1]).text()
                var NovoCasos = $($(elemt).children('td').toArray()[2]).text()
                var totalMorte = $($(elemt).children('td').toArray()[3]).text()
                var NovasMortes = $($(elemt).children('td').toArray()[4]).text()
                var recuperados = $($(elemt).children('td').toArray()[5]).text()
                var ativos = $($(elemt).children('td').toArray()[6]).text()

                if(pais == 'World' || pais == 'Total:' || pais == '' || totalCasos == ' ' || NovoCasos == ' ' || totalMorte == ' ' || NovasMortes == ' ' || recuperados == ' ' || pais.length == 0 ){

                }else{
                    var Objeto = {
                        key : key.toString(), pais, dados: { totalCasos, NovoCasos, totalMorte, NovasMortes,recuperados, ativos }
                    }
                    dados.push(Objeto)
                }
                
            
        })
        response.send(dados)

    }

    async clone ({response}){
        const { data } = await axios.get('https://www.worldometers.info/coronavirus/')

        return response.send(data)
    }


}

module.exports = ScrapingController
