using MediatR;
using PostsQueryService.Entities;

namespace PostsQueryService.Queries.GetPosts;

public sealed class GetPostsQuery : IRequest<List<Post>>
{
}