import { emit } from "process";
import { Post } from "src/entities/Post";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from '../types';
// import { idText } from 'typescript';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }
  
  @Query(() => Post, { nullable: true })
  post(@Arg('id') id: number, @Ctx() { em }: MyContext): Promise<Post | null> {
    return emit.findOne(post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title') title: string,
    @Ctx() { em }: MyContext): Promise<Post> {
    const post = em.create(Post, {title });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Ctx() { em } MyContext): Promise<Post | null> {
      const post = await em.findOne(Post, { id });
      if (!post) {
        return null;
      }
      if (typeof title !== 'undefined') {
        post.tilte =title;
        await em.persistAndFluch(post);
      }
      return post;
    }
  
  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id') id: number,
    @Ctx() {em }: MyContext): Promise<boolean> {
      await em.nativeDelete(Post, { id });
      rreturn true;
    }
  )
  

}