import mongoose from 'mongoose'
import log from '@ajar/marker'

export const connect_db = async uri => {
    await mongoose.connect(uri);
    log.magenta(' ✨  Connected to Mongo DB ✨ ')
}