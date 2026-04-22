import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiBody, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { ArticleResponceDto } from './dto/article-responce.dto';

@ApiInternalServerErrorResponse({ description: "Internal server error" })
@Controller('article')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) { }

    @ApiOkResponse()
    @ApiBody({ type: CreateArticleDto })
    @HttpCode(201)
    @Post()
    create(@Body() createArticleDto: CreateArticleDto) {
        return this.articleService.create(createArticleDto);
    }

    @ApiOkResponse({ description: "List of articles", type: ArticleResponceDto })
    @HttpCode(200)

    @Get()
    findAll() {
        return this.articleService.findAll();
    }

    @HttpCode(200)
    @ApiNotFoundResponse({ description: "Article not found" })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.articleService.findOne(+id);
    }

    @HttpCode(200)
    @ApiNotFoundResponse({ description: "Article not found" })
    @ApiOkResponse({ description: "updated" })

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
        return this.articleService.update(+id, updateArticleDto);
    }

    @HttpCode(200)
    @ApiNotFoundResponse({ description: "Article not found" })
    @ApiOkResponse({ description: "deleted" })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.articleService.remove(+id);
    }
}
