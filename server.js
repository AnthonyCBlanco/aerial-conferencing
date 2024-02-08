const express = require('express')
const app = express()
const { v4: uuidV4 } = require('uuid')
const exphbs = require('express-handlebars');
const PORT = 3001

const hbs = exphbs.create();

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.use(express.static('public'))


app.get('/', (req, res) => {

  res.render('')

})

app.listen(PORT, () => console.log('Now listening'));