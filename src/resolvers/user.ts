import { Arg, Mutation, Resolver } from 'type-graphql';

@Resolver()
export class UserResolver {
  @Mutation(() => String)
  register(
    @Arg()
  ) {
    return 'hello People';
  }
}
