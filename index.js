const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const axios = require("axios")
const fs = require("fs").promises
const fss = require("fs");
const { Configuration, OpenAIApi } = require("openai");

const app = express()
const port = process.env.PORT || 3000
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())

app.get('/', (req, res) => {
    res.status(404).send({'error': 'Not found'})
})

app.post('/create-open-ai-model', async(req, res) => {
    const data = req.body
    const dataKeys = Array.from(Object.keys(data))
    
    var cond = false;
    cond = dataKeys.includes("csvUrl") && data['csvUrl'] != '' ? dataKeys.includes("apiKey") && data['apiKey'] != '' ? dataKeys.includes("model") && data['model'] != '' ? true : res.status(500).send({'error': "Model not provided"}) : res.status(500).send({'error': "API key not provided"}) : res.status(500).send({'error': "CSV URL not provided"})

    if (cond) {

        if (!data['csvUrl'].includes('.csv')) {
            res.status(500).send({'error': "Invalid file format"})
        } else {

            const response = await axios.get(data['csvUrl'])
            const csv_data = await response.data

            var csv_data_splitted = csv_data.replaceAll('\r', '').split('\n')
            if (csv_data_splitted[0].includes('prompt,completion')){

                var arr = [];
                for (let index = 1; index < csv_data_splitted.length; index++) {
                    
                    var json_data = {
                        "prompt": csv_data_splitted[index].split(',')[0].trim() + "\n\n###\n\n",
                        "completion": csv_data_splitted[index].split(',')[1].trim() + "###"
                    }
                    arr.push(json_data)
                }
                await fs.writeFile("file.jsonl", JSON.stringify(arr).replace('[', '').replace(']', '').replaceAll('},{', '}\n{'))

                const configuration = new Configuration({
                    apiKey: data['apiKey'],
                });
                const openai = new OpenAIApi(configuration);
                const responses = await openai.createFile(
                fss.createReadStream("file.jsonl"),
                "fine-tune"
                );

                if (responses.status != 200){
                    res.status(responses.status).send({'error': responses.error, 'message': "error from Open AI request"})
                } else {
                    const response2 = await openai.createFineTune({
                        training_file: responses.data.id,
                        model: data['model'],
                        n_epochs: data['n_epochs'] ? data['n_epochs'] : 2
                    });

                    if (response2.status == 200){
                        res.status(200).send({"message": "Success", "id": response2.data.id})
                    } else {
                        res.status(response2.status).send({'error': response2.error, 'message': "error from Open AI request"})
                    }
                }
                
            } else {
                res.status(500).send({'error': "Invalid column headers"})
            }
        }
    }
})

app.listen(port, ()=> {
    console.log(`listening on PORT: ${port}`)
})