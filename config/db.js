const mongoose = require('mongoose')

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.NODE_ENV === 'development'
        ? process.env.MONGO_URI_LOCAL
        : process.env.MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }
    )

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

/* eslint-disable */
module.exports = connectMongoDB
/* eslint-enable */
