using MediatR;
using Microsoft.AspNetCore.Mvc;
using PostsQueryService.Queries;
using PostsQueryService.Queries.GetPosts;

namespace PostsQueryService.Controllers;

[ApiController]
[Route("api/v1/posts")]
public class PostsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PostsController(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetPosts()
    {
        var query = new GetPostsQuery();
        var posts = await _mediator.Send(query);

        return Ok(posts);
    }
}