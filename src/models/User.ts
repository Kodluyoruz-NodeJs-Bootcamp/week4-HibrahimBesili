import { Schema,Document, model, connect } from 'mongoose';
import bcrypt from 'bcrypt-nodejs'

export type TUserModel = Document & {
  username: string,
  password: string
}

export const schema= new Schema<TUserModel>({
  username: String,
  password: String,
})

const UserModel = model<TUserModel>('User', schema);

export default UserModel;