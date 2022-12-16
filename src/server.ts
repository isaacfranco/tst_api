import express from 'express'
import * as dotenv from 'dotenv'
dotenv.config()
import router from './routes'

const app = express()
app.use(express.json())

app.use('/', router)

app.get('/', (req, res) => {
	return res.json({msg: 'hi'})
})

app.listen(process.env.PORT, () => {
	console.log(`API up on port ${process.env.PORT}`)
})

