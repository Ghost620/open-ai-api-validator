import express from "express";
import cors from "cors"
import bodyParser from "body-parser";
import axios from "axios";
import csv from "csvtojson"

const app = express()
const port = process.env.PORT || 3000
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('hello')

})

app.post('/create-open-ai-model', async(req, res) => {
    const data = req.body
    const dataKeys = Array.from(Object.keys(data))
    
    var cond = false;
    cond = dataKeys.includes("csvUrl") && data['csvUrl'] != '' ? dataKeys.includes("apiKey") && data['apiKey'] != '' ? dataKeys.includes("model") && data['model'] != '' ? true : res.send("Model not provided") : res.send("API key not provided") : res.send("CSV URL not provided")

    if (cond) {

        if (!data['csvUrl'].includes('.csv')) {
            res.send("Invalid file format")
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
                res.send(arr)

                var config = {
                    method: 'post',
                    url: 'https://api.openai.com/v1/files',
                    headers: { 
                      'Authorization': `Bearer ${data['apiKey']}`
                    }, 
                    data: JSON.stringify({
                        "file": json_data,
                        "purpose": "fine-tune"
                      })
                  };
                  
                  const response = await axios(config)
                  console.log(response)
                  res.send("kuch bhi")
                  


            } else {
                res.send("Invalid column headers")
            }
        }

    }

    // res.send("HUH")

})

app.listen(port, ()=> {
    console.log('listening')
})