import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    UseInterceptors,
    UploadedFile,
    UseGuards,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
} from "@nestjs/swagger";
import { ArticleResponceDto } from "./dto/article-responce.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import path from "path";
import { CreateArticleFileDto } from "./dto/article-file.dto";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/role.decorator";
import { roleUser } from "src/shared/enums/roles.enum";

@ApiBearerAuth("JWT-auth")
@ApiInternalServerErrorResponse({ description: "Internal server error" })
@Controller("article")
export class ArticleController {
    constructor(private readonly articleService: ArticleService) { }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(roleUser.SUPERADMIN, roleUser.ADMIN)
    @ApiOkResponse()
    @ApiBody({ type: CreateArticleFileDto })
    @HttpCode(201)
    @Post()
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: path.join(process.cwd(), "uploads"),
                filename: (req, file, cb) => {
                    const uniqueSuffix = `${file.originalname}${Date.now()}`;
                    const ext = path.extname(file.originalname);
                    cb(null, `${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    create(
        @Body() createArticleDto: CreateArticleDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.articleService.create(createArticleDto, file);
    }

    @ApiOkResponse({ description: "List of articles", type: ArticleResponceDto })
    @HttpCode(200)
    @Get()
    findAll() {
        return this.articleService.findAll();
    }

    @HttpCode(200)
    @ApiNotFoundResponse({ description: "Article not found" })
    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.articleService.findOne(+id);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(roleUser.ADMIN, roleUser.USER)
    @HttpCode(200)
    @ApiNotFoundResponse({ description: "Article not found" })
    @ApiOkResponse({ description: "updated" })
    @Patch(":id")
    update(@Param("id") id: string, @Body() updateArticleDto: UpdateArticleDto) {
        return this.articleService.update(+id, updateArticleDto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(roleUser.ADMIN, roleUser.SUPERADMIN)
    @HttpCode(200)
    @ApiNotFoundResponse({ description: "Article not found" })
    @ApiOkResponse({ description: "deleted" })
    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.articleService.remove(+id);
    }
}
