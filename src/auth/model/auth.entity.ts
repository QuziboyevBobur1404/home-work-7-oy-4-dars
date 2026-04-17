import { DataTypes } from "sequelize";
import {  Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Article } from "src/article/model/article.entity";

@Table({tableName: "auth", timestamps: true})
export class Auth extends Model {

@Column({
    type: DataTypes.STRING,
   allowNull: false,
})
username!: string;

@Column({
    type: DataTypes.STRING,
   allowNull: false,
})
email!: string

@Column({
    type: DataTypes.STRING,
   allowNull: false,
})
password!: string

@Column({
    type: DataTypes.STRING,
   allowNull: false,
})
otp!: string

@HasMany(() => Article)
articles?: Article[]


}
