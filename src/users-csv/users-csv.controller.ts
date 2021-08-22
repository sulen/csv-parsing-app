import { Controller, Post, Req, Res } from '@nestjs/common';
import { UsersCsvService } from './users-csv.service';
import * as csvParser from 'csv-parser';
import * as Busboy from 'busboy';
import { Request } from 'express';

@Controller('users-csv')
export class UsersCsvController {
  constructor(private readonly usersCsvService: UsersCsvService) {}

  @Post()
  create(@Req() req: Request, @Res() res) {
    const busboy = new Busboy({ headers: req.headers });
    busboy.on('file', async (fieldName, file) => {
      await this.usersCsvService.create(
        file.pipe(
          csvParser({
            mapValues: ({ value }) => value.trim(),
          }),
        ),
      );
    });
    busboy.on('finish', function () {
      res.end();
    });
    req.pipe(busboy);
  }
}
