import express from 'express'
import passport from 'passport'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'
import v1 from './routes/v1'
import { CONFIG } from './config/config'
import db from './models'

const parseError = require('parse-error')
const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')))

// Passport
app.use(passport.initialize())

// Log Env
console.log('Environment:', CONFIG.app)
// DATABASE
db.sequelize.authenticate()
  .then(() => {
    console.log('Connected to SQL database:', CONFIG.db_name)
  })
  .catch((err: any) => {
    console.error('Unable to connect to SQL database:', CONFIG.db_name, err)
  })
if (CONFIG.app === 'dev') {
  db.sequelize.sync() // creates table if they do not already exist
  // models.sequelize.sync({ force: true })
  // deletes all tables then recreates them useful for testing and development purposes
}
// CORS
app.use(cors())

app.use('/v1', v1)

app.use('/', function (req: any, res: any) {
  res.statusCode = 200 // send the appropriate status code
  res.json({ status: 'success', message: 'Parcel Pending API', data: {} })
})

// catch 404 and forward to error handler
app.use(function (req: any, res: any, next: any) {
  const err: any = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err: any, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export default app;

// This is here to handle all the uncaught promise rejections

process.on('unhandledRejection', error => {
  console.error('Uncaught Error', parseError(error))
})
