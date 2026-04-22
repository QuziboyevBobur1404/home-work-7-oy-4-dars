import { BaseEntity } from "src/database/entity/base.entity";
import { Column, Entity } from "typeorm";
import { UpdateArticleDto } from "../dto/update-article.dto";

@Entity({ name: "article" })
export class Article extends BaseEntity {

    @Column()
    title!: string;

    @Column()
    content!: string


}

