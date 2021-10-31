// get imports of packages
const port = process.env.port || 8000 
const express = require('express') 
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')

const app = express()   
const jobs = []
const pages = [
    {
        name: 'kenyancareer',
        url: 'http://www.kenyancareer.com/',
        base: ''
    },
    {
        name: 'kenyamoja',
        url: 'https://www.kenyamoja.com/jobs', 
        base: 'https://www.kenyamoja.com/'
    }
]

app.get('/', (req,res) => {
    res.json("Welcome to my first Web API")
})


pages.forEach(page => {
    axios.get(page.url)
    .then((response) =>{
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("job")', html).each(function () {
            const title = $(this).text()
            const link = $(this).attr('href')
            jobs.push({
                title,
                link: page.base + link,
                source: page.name
            })
        })
        
        
    })
})





app.get('/jobs', (req,res) => {
    res.json(jobs)
})

app.get('/jobs/:pageId', async (req,res) => {
    const pageId = req.params.pageId

    const pageAddress = pages.filter(page => page.name === pageId)[0].url
    const pageBase = pages.filter(page => page.name === pageId)[0].base

    axios.get(pageAddress)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificJobs = []

        $('a:contains("job")', html).each(function () {
            const title = $(this).text()
            const link = $(this).attr('href')
            specificJobs.push({
                title,
                link: pageBase + link,
                source: pageId
            })
        })
        res.json(specificJobs)


    }).catch(err => console.log(err))
})

app.listen(port, () => console.log(`server running on port ${port}`))