import { z } from 'zod';
import { exploreComment, meta, comments } from '../dto/explore-comment.dto';

export type TExploreComment = z.infer<typeof exploreComment>;
export type TMeta = z.infer<typeof meta>;
export type TComments = z.infer<typeof comments>;