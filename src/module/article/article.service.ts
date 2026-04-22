import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
    articleModel: any;
    constructor(@InjectRepository(Article) private articleRepo: Repository<Article>) { }
    async create(createArticleDto: CreateArticleDto) {
        const article = this.articleRepo.create(createArticleDto)
        return await this.articleRepo.save(article)
    }

    async findAll(): Promise<Article[]> {
        return await this.articleRepo.find()
    }

    async findOne(id: number): Promise<Article> {
        const foundedArticle = await this.articleRepo.findOne({ where: { id } })
        if (!foundedArticle) throw new NotFoundException("Article not found")
        return foundedArticle
    }

    async update(id: number, updateArticleDto: UpdateArticleDto): Promise<{ message: string }> {
        const foundedArticle = await this.articleRepo.findOne({ where: { id } })
        if (!foundedArticle) throw new NotFoundException("Article not found")
        await this.articleRepo.update(foundedArticle.id, updateArticleDto)
        return { message: "updated" }
    }


    async remove(id: number): Promise<{ message: string }> {
        const foundedArticle = await this.articleRepo.findOne({ where: { id } })
        if (!foundedArticle) throw new NotFoundException("Article not found")
        await this.articleRepo.delete({ id })
        return { message: "deleted" };
    }
}
function InjectModel(article: typeof Article): (target: typeof ArticleService, propertyKey: undefined, parameterIndex: 0) => void {
    throw new Error('Function not implemented.');
}

