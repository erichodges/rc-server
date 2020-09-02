import { Query, Resolver } from 'type-graphql';

@Resolver()
export class UserResolver {
  @Query(() => String)
  register() {
    return 'hello People';
  }
}
